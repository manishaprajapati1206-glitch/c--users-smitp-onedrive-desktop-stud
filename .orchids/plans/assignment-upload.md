# Assignment Upload with Supabase Storage

## Requirements

Implement a complete assignment upload feature that:
1. Allows users to upload assignment files (PDF, DOC, DOCX, JPG, PNG - max 10MB)
2. Stores actual files in Supabase Storage (not just metadata)
3. Shows uploaded assignments in a new card with download option
4. Associates uploads with the current user and course

## Current State Analysis

- **Upload UI exists**: `src/app/courses/[courseId]/page.tsx` (lines 293-336) has a basic file upload UI but no functionality
- **Supabase clients available**: `src/lib/supabase/client.ts` (browser) and `src/lib/supabase/server.ts` (server)
- **API pattern**: Uses Next.js API routes (e.g., `/api/profile/route.ts`)
- **Service pattern**: Services in `src/services/` abstract API calls

## Technical Approach

### Supabase Storage Setup (Manual Step Required)
1. Create a storage bucket called `assignments` in Supabase Dashboard
2. Set bucket policies to allow authenticated users to upload/download their own files

### Architecture
```
User uploads file → Client component → API Route → Supabase Storage
                                                          ↓
User sees uploaded files ← Client fetches ← API Route ← Storage + DB metadata
```

## Implementation Phases

### Phase 1: Create Supabase Storage bucket and RLS policies
- In Supabase Dashboard, create `assignments` bucket
- Add RLS policy: authenticated users can upload to their own folder
- Add RLS policy: users can read their own files
- Create `assignments` table in database to track uploads:
  ```sql
  CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

### Phase 2: Create API route for file upload
- Create `src/app/api/assignments/upload/route.ts`
- Accept multipart form data with file
- Upload to Supabase Storage: `assignments/{userId}/{courseId}/{timestamp}-{filename}`
- Save metadata to `assignments` table
- Return file URL and metadata

### Phase 3: Create API route to list/download assignments
- Create `src/app/api/assignments/route.ts` (GET)
- Fetch user's assignments for a course from database
- Generate signed URLs for download
- Create `src/app/api/assignments/[id]/route.ts` for single file operations

### Phase 4: Create assignment service
- Create `src/services/assignments.service.ts`
- Methods: `uploadAssignment()`, `getAssignments()`, `downloadAssignment()`, `deleteAssignment()`

### Phase 5: Build AssignmentUpload component
- Create `src/components/courses/AssignmentUpload.tsx`
- Features:
  - Drag & drop file upload with visual feedback
  - File type and size validation (client-side)
  - Upload progress indicator
  - Error handling with toast/alert

### Phase 6: Build AssignmentList component
- Create `src/components/courses/AssignmentList.tsx`
- Display uploaded assignments as cards
- Show: file name, upload date, file size, file type icon
- Download button with signed URL
- Delete option (optional)

### Phase 7: Integrate into course page
- Update `src/app/courses/[courseId]/page.tsx`
- Replace current static upload UI with `AssignmentUpload` component
- Add `AssignmentList` component below upload area
- Fetch assignments on page load

## File Structure

```
src/
├── app/api/assignments/
│   ├── route.ts              # GET: list assignments
│   └── upload/
│       └── route.ts          # POST: upload file
├── components/courses/
│   ├── AssignmentUpload.tsx  # Upload component
│   └── AssignmentList.tsx    # List/download component
└── services/
    └── assignments.service.ts # Client service
```

## API Endpoints

### POST /api/assignments/upload
- **Input**: FormData with `file`, `courseId`
- **Output**: `{ id, fileName, fileUrl, uploadedAt }`

### GET /api/assignments?courseId={id}
- **Output**: `{ assignments: [{ id, fileName, fileSize, mimeType, downloadUrl, uploadedAt }] }`

## Security Considerations

1. Validate file types server-side (not just client)
2. Enforce 10MB file size limit on server
3. Use Supabase RLS to ensure users only access their files
4. Generate short-lived signed URLs for downloads
5. Store files in user-specific folders: `assignments/{userId}/...`

## Dependencies

- No new npm packages needed
- Uses existing `@supabase/ssr` package for storage operations

## Estimated Effort

- Phase 1 (DB/Storage setup): Manual setup in Supabase Dashboard
- Phase 2-3 (API routes): ~30 min
- Phase 4 (Service): ~15 min
- Phase 5-6 (Components): ~45 min
- Phase 7 (Integration): ~15 min

**Total: ~2 hours**
