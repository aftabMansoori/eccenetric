# SignIn & SignUp Pages

Add authentication using **Supabase Auth** on both backend and frontend.

## Proposed Changes

### Backend — Auth Service & Routes

#### [NEW] [AuthService.ts](file:///d:/Projects/Eccentric%20Assignment/backend/src/services/AuthService.ts)
- `signUp(email, password)` — calls `supabase.auth.signUp()`
- `signIn(email, password)` — calls `supabase.auth.signInWithPassword()`
- `getUser(token)` — calls `supabase.auth.getUser(token)` for token verification

#### [NEW] [AuthController.ts](file:///d:/Projects/Eccentric%20Assignment/backend/src/controllers/AuthController.ts)
- `POST /signup` → validate body, call `authService.signUp`, return session/user
- `POST /signin` → validate body, call `authService.signIn`, return session/user

#### [NEW] [auth.schema.ts](file:///d:/Projects/Eccentric%20Assignment/backend/src/schemas/auth.schema.ts)
- Zod schemas for signin/signup request bodies (`email`, `password`)

#### [NEW] [auth.routes.ts](file:///d:/Projects/Eccentric%20Assignment/backend/src/routes/auth.routes.ts)
- `POST /signup` and `POST /signin`

#### [MODIFY] [app.ts](file:///d:/Projects/Eccentric%20Assignment/backend/src/app.ts)
- Mount auth routes at `/api/v1/auth`

---

### Frontend — Auth Pages & State

#### [NEW] [authApi.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/api/authApi.ts)
- RTK Query: `signIn` mutation, `signUp` mutation

#### [NEW] [authSlice.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/slices/authSlice.ts)
- State: `{ user, token, isAuthenticated }`
- Reducers: `setCredentials`, `clearCredentials`
- Persist token in `localStorage`

#### [MODIFY] [store.ts](file:///d:/Projects/Eccentric%20Assignment/frontend/src/store/store.ts)
- Add `authApi` and `authSlice` reducers

#### [NEW] [SignInPage.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/pages/SignInPage.tsx)
- Form with email + password inputs using existing Shadcn `Card`, `Input`, `Label`, `Button`
- Link to `/signup`
- On success: store token, navigate to `/dam`

#### [NEW] [SignUpPage.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/pages/SignUpPage.tsx)
- Form with email + password + confirm password
- Link to `/signin`
- On success: navigate to `/signin` with success message

#### [MODIFY] [App.tsx](file:///d:/Projects/Eccentric%20Assignment/frontend/src/App.tsx)
- Add routes: `/signin` → `SignInPage`, `/signup` → `SignUpPage`
- Default `/` redirects to `/signin` (unauthenticated) or `/dam` (authenticated)

---

### Unchanged Files
- All existing components, pages, store slices, and backend services remain untouched

## Verification Plan

### Build
- `npm run build` in both frontend and backend — zero errors

### Manual
1. Navigate to `/signup` → fill form → submit → should see success/redirect to signin
2. Navigate to `/signin` → fill form → submit → should redirect to `/dam`
3. Navigate to `/dam` directly while unauthenticated → should redirect to `/signin`
