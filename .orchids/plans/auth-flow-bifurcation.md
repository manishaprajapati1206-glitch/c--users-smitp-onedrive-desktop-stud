# Authentication Flow Bifurcation: Sign In vs Sign Up

## Requirements

Separate the authentication flow so that:
1. **Sign In**: Existing users with email/password go directly to the main home page (skip onboarding steps)
2. **Sign Up**: New users follow the traditional multi-step onboarding flow (name, DOB, subjects, etc.)

### Current Behavior (Problem)
- Both sign-in and sign-up users are forced through the same onboarding steps (WalkthroughForm, StudentInfoForm, DashboardPreview, InfoBoard)
- Existing users who already have profiles must re-enter their information every time they sign in

### Desired Behavior
- **Sign In**: Email + Password → Validate credentials → Redirect to `/home` immediately
- **Sign Up**: Email + Password → Create account → WalkthroughForm → StudentInfoForm → DashboardPreview → InfoBoard → `/home`

## Current State Analysis

### Files Involved
- `src/app/onboarding/page.tsx` - Main onboarding orchestrator with 5 steps
- `src/components/onboarding/AuthForm.tsx` - Email/password form with toggle between Sign In/Sign Up
- `src/services/user.service.ts` - Auth methods (`signIn`, `signUp`, `getProfile`)
- `src/lib/supabase/middleware.ts` - Redirects unauthenticated users to `/onboarding`
- `src/app/page.tsx` - Root page that redirects to `/onboarding`

### Current Flow (Both Sign In & Sign Up)
```
/onboarding
    Step 0: AuthForm (email/password)
    Step 1: WalkthroughForm (first name, last name, DOB)
    Step 2: StudentInfoForm (standard, subjects, goals)
    Step 3: DashboardPreview
    Step 4: InfoBoard → /home
```

### Database
- `profiles` table has `onboarding_completed` boolean field
- Field is set to `true` when user completes Step 4 (InfoBoard)

## Technical Approach

### Strategy
1. Check `onboardingCompleted` status after sign-in
2. If `onboardingCompleted === true`: Skip to `/home`
3. If `onboardingCompleted === false` or missing: Continue onboarding flow
4. New sign-ups always start with `onboardingCompleted = false`

### Key Change
Modify `handleAuthComplete` in `onboarding/page.tsx` to:
- For **Sign In**: Check profile's `onboardingCompleted` status → if true, redirect to `/home`
- For **Sign Up**: Always proceed to Step 1 (WalkthroughForm)

## Implementation Phases

### Phase 1: Update onboarding page to check onboarding completion status
- Modify `handleAuthComplete` function in `src/app/onboarding/page.tsx`
- After successful sign-in, fetch user profile
- Check `onboardingCompleted` field
- If `true`, redirect to `/home` immediately
- If `false` or undefined, proceed with onboarding steps

### Phase 2: Update userService.signIn to return profile with onboardingCompleted
- Ensure `signIn` method in `src/services/user.service.ts` returns the full profile
- The profile already includes `onboardingCompleted` via `mapProfile` function
- Verify the field is being returned correctly

### Phase 3: Update middleware to redirect completed users to home
- Modify `src/lib/supabase/middleware.ts`
- If user is authenticated AND on `/onboarding` AND has `onboarding_completed = true`:
  - Redirect to `/home`
- This prevents users from accidentally going back to onboarding

### Phase 4: Update root page to check auth status
- Modify `src/app/page.tsx` to:
  - Check if user is authenticated
  - If authenticated AND onboarding completed: redirect to `/home`
  - If authenticated AND onboarding NOT completed: redirect to `/onboarding`
  - If not authenticated: redirect to `/onboarding`

## Detailed Code Changes

### File 1: `src/app/onboarding/page.tsx`

**Current `handleAuthComplete`:**
```typescript
const handleAuthComplete = async (data: { email: string; password: string; isSignUp: boolean }) => {
    setAuthLoading(true);
    setAuthError(undefined);

    const result = data.isSignUp
        ? await userService.signUp(data.email, data.password)
        : await userService.signIn(data.email, data.password);

    setAuthLoading(false);

    if (!result.success) {
        setAuthError(result.error || "Authentication failed. Please try again.");
        return;
    }

    setOnboardingData((prev) => ({ ...prev, ...data }));
    setCurrentStep(1);  // Always goes to step 1
};
```

**Updated `handleAuthComplete`:**
```typescript
const handleAuthComplete = async (data: { email: string; password: string; isSignUp: boolean }) => {
    setAuthLoading(true);
    setAuthError(undefined);

    const result = data.isSignUp
        ? await userService.signUp(data.email, data.password)
        : await userService.signIn(data.email, data.password);

    setAuthLoading(false);

    if (!result.success) {
        setAuthError(result.error || "Authentication failed. Please try again.");
        return;
    }

    // For Sign In: Check if user has completed onboarding
    if (!data.isSignUp) {
        const profile = await userService.getProfile();
        if (profile?.onboardingCompleted) {
            // Existing user with completed profile - go directly to home
            router.push("/home");
            return;
        }
    }

    // New user (sign up) OR existing user with incomplete onboarding
    setOnboardingData((prev) => ({ ...prev, ...data }));
    setCurrentStep(1);
};
```

### File 2: `src/lib/supabase/middleware.ts`

**Add redirect for completed users trying to access onboarding:**
```typescript
// After getting user...
if (user && request.nextUrl.pathname.startsWith("/onboarding")) {
    // Check if user has completed onboarding
    const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();
    
    if (profile?.onboarding_completed) {
        const url = request.nextUrl.clone();
        url.pathname = "/home";
        return NextResponse.redirect(url);
    }
}
```

### File 3: `src/app/page.tsx`

**Update to handle auth-aware redirects:**
```typescript
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/onboarding");
    }

    // Check onboarding status
    const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

    if (profile?.onboarding_completed) {
        redirect("/home");
    } else {
        redirect("/onboarding");
    }
}
```

## Flow Diagrams

### Sign In Flow (After Changes)
```
User clicks "Sign In" tab
    ↓
Enter email + password
    ↓
Submit form
    ↓
signIn() API call
    ↓
Success? ─── No ──→ Show error
    ↓ Yes
getProfile() call
    ↓
onboardingCompleted? ─── Yes ──→ Redirect to /home
    ↓ No
Continue to Step 1 (WalkthroughForm)
```

### Sign Up Flow (Unchanged)
```
User clicks "Sign Up" tab
    ↓
Enter email + password + confirm
    ↓
Submit form
    ↓
signUp() API call
    ↓
Success? ─── No ──→ Show error
    ↓ Yes
Continue to Step 1 (WalkthroughForm)
    ↓
Step 2: StudentInfoForm
    ↓
Step 3: DashboardPreview
    ↓
Step 4: InfoBoard
    ↓
Set onboardingCompleted = true
    ↓
Redirect to /home
```

## Edge Cases Handled

1. **User signed up but abandoned onboarding mid-way**: Will be prompted to complete onboarding on next sign-in
2. **User clears cookies**: Will need to sign in again, but will skip to home if onboarding was completed
3. **Direct URL access to /home without auth**: Middleware redirects to /onboarding
4. **Direct URL access to /onboarding with completed auth**: Middleware redirects to /home

## Security Considerations

1. Onboarding status is stored in database, not client-side (cannot be faked)
2. Middleware enforces redirects server-side
3. Profile data is only accessible to authenticated users via RLS

## Testing Checklist

- [ ] New user sign up → Goes through all 5 steps → Ends at /home
- [ ] Existing user sign in (completed onboarding) → Goes directly to /home
- [ ] Existing user sign in (incomplete onboarding) → Continues from step 1
- [ ] Direct /home access without auth → Redirects to /onboarding
- [ ] Direct /onboarding access with completed auth → Redirects to /home
- [ ] Sign out → Can sign in again and go to /home

## Files to Modify

1. `src/app/onboarding/page.tsx` - Add onboarding completion check for sign-in
2. `src/lib/supabase/middleware.ts` - Add redirect for completed users on /onboarding
3. `src/app/page.tsx` - Make auth-aware with server-side checks

## Estimated Effort

- Phase 1 (Onboarding page update): ~15 min
- Phase 2 (Verify service): ~5 min
- Phase 3 (Middleware update): ~10 min
- Phase 4 (Root page update): ~5 min
- Testing: ~10 min

**Total: ~45 minutes**
