# Assignment Upload & Download Feature

## Requirements
Build a complete assignment upload system that allows students to upload assignment files to Supabase Storage, stores metadata in a database table, displays uploaded assignments in a card grid, and provides download functionality.

## Current State Analysis

### Existing Infrastructure
- **Supabase Client**: `src/lib/supabase/client.ts` (browser) and `src/lib/supabase/server.ts` (server)
- **Service Pattern**: `src/services/` contains `user.service.ts`, `courses.service.ts`, `quiz.service.ts`
- **API Routes**: `src/app/api/` for server-side endpoints with admin client access
- **Course Page**: `src/app/courses/[courseId]/page.tsx` has an "Assignments" tab with placeholder upload UI (lines 292-337)

### Current Upload UI (Hardcoded)
The current assignments tab shows:
- A dashed border upload zone with file input
- Accepts `.pdf,.doc,.docx,.jpg,.png` files
- A static "AI Review in Progress" placeholder
- No actual file handling or storage

## Architecture Design

### Database Schema
Create new `assignments` table in Supabase:
```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'graded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own assignments
CREATE POLICY "Users can view own assignments" ON assignments
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own assignments
CREATE POLICY "Users can insert own assignments" ON assignments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own assignments
CREATE POLICY "Users can delete own assignments" ON assignments
  FOR DELETE USING (auth.uid() = user_id);
```

### Supabase Storage Setup
Create storage bucket `assignments` with policies:
```sql
-- Create bucket (via Supabase Dashboard or CLI)
INSERT INTO storage.buckets (id, name, public) VALUES ('assignments', 'assignments', false);

-- Policy: Authenticated users can upload to their folder
CREATE POLICY "Users can upload to own folder" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'assignments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can read their own files
CREATE POLICY "Users can read own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'assignments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'assignments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### File Structure
```
src/
├── services/
│   └── assignment.service.ts       # NEW: Assignment CRUD operations
├── app/
│   └── api/
│       └── assignments/
│           └── route.ts            # NEW: API route for uploads
├── components/
│   └── assignments/
│       ├── AssignmentUpload.tsx    # NEW: Upload component with drag-drop
│       └── AssignmentCard.tsx      # NEW: Card to display uploaded files
```

## Implementation Phases

### Phase 1: Database & Storage Setup
- Create `assignments` table in Supabase with RLS policies
- Create `assignments` storage bucket with access policies
- File path convention: `{user_id}/{course_id}/{timestamp}_{filename}`

### Phase 2: Create Assignment Service
- Create `src/services/assignment.service.ts`
- Implement `uploadAssignment(courseId, file)` - uploads to storage + creates DB record
- Implement `getAssignments(courseId)` - fetches user's assignments for a course
- Implement `getDownloadUrl(filePath)` - generates signed download URL
- Implement `deleteAssignment(assignmentId)` - removes file and DB record

### Phase 3: Create API Route for Upload
- Create `src/app/api/assignments/route.ts`
- POST handler: receives FormData, uploads to Supabase Storage, inserts DB record
- GET handler: fetches assignments for a course (with courseId query param)
- DELETE handler: removes assignment and file

### Phase 4: Build Upload Component
- Create `src/components/assignments/AssignmentUpload.tsx`
- Drag-and-drop zone with visual feedback
- File type and size validation (max 10MB)
- Upload progress indicator
- Success/error toast notifications

### Phase 5: Build Assignment Card Component
- Create `src/components/assignments/AssignmentCard.tsx`
- Display file name, type icon, upload date, file size
- Download button with signed URL
- Delete button with confirmation
- Status badge (pending/reviewed/graded)

### Phase 6: Integrate into Course Page
- Update `src/app/courses/[courseId]/page.tsx` assignments tab
- Replace placeholder with `AssignmentUpload` component
- Add grid of `AssignmentCard` components below upload zone
- Fetch assignments on tab load, refresh after upload/delete

## Technical Details

### Assignment Service Interface
```typescript
interface Assignment {
  id: string;
  userId: string;
  courseId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  status: 'pending' | 'reviewed' | 'graded';
  createdAt: string;
  updatedAt: string;
}

interface AssignmentService {
  uploadAssignment(courseId: string, file: File): Promise<Assignment>;
  getAssignments(courseId: string): Promise<Assignment[]>;
  getDownloadUrl(filePath: string): Promise<string>;
  deleteAssignment(assignmentId: string): Promise<boolean>;
}
```

### Upload Flow
1. User selects file via click or drag-drop
2. Client validates file type and size
3. Client calls `assignmentService.uploadAssignment(courseId, file)`
4. Service uploads file to Supabase Storage: `assignments/{userId}/{courseId}/{timestamp}_{filename}`
5. Service inserts record into `assignments` table
6. UI refreshes to show new assignment card

### Download Flow
1. User clicks download button on assignment card
2. Client calls `assignmentService.getDownloadUrl(filePath)`
3. Service generates signed URL (valid for 60 seconds)
4. Browser initiates download from signed URL

## Dependencies
- Existing Supabase client configuration
- Existing UI components (Card, Button, Badge)
- framer-motion for animations (already installed)
- lucide-react for icons (already installed)

## Edge Cases & Error Handling
- File too large (>10MB): Show validation error before upload
- Invalid file type: Show validation error
- Upload failure: Show error toast, allow retry
- Network timeout: Show error with retry option
- Duplicate file name: Prefix with timestamp to ensure uniqueness
- User not authenticated: Redirect to login
