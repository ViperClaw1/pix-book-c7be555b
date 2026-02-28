

## Admin Users: Fix RLS Policies and Add "Add User" Feature

### Overview

Two changes: (1) fix missing RLS policies so admins can actually update and delete profiles, and (2) add an "Add User" button with a dialog that creates a new user via an edge function.

### 1. Database: Add Missing RLS Policies for `profiles`

Currently, the `profiles` table is missing admin policies for UPDATE, DELETE, and INSERT (for admin-created users). The `useUpdateProfile` and `useDeleteUser` mutations silently fail because of this.

Add these policies via migration:

```sql
-- Admins can update any profile
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert profiles (for admin-created users)
CREATE POLICY "Admins can insert profiles"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

### 2. Edge Function: `admin-create-user`

Creating a user requires the Auth Admin API (service role key), which cannot run client-side. A new edge function will:

- Accept `{ email, password, first_name, last_name, role }` in the request body
- Verify the caller is an admin (check their JWT against `user_roles`)
- Call `supabase.auth.admin.createUser()` with the provided email/password and metadata
- The existing database triggers will auto-create the profile and assign the default "buyer" role
- If a non-buyer role is specified, update the `user_roles` entry
- Return the created user ID

### 3. Update `AdminUsers.tsx`

- Add an "Add User" button next to the search/filter bar
- Add an "Add User" dialog with fields: First Name, Last Name, Email, Password, Role
- On submit, call the `admin-create-user` edge function
- Invalidate the `admin-profiles` query on success

### 4. Update `useAdminData.ts`

- Add a `useCreateUser` mutation hook that calls the edge function via `supabase.functions.invoke('admin-create-user', { body: ... })`

### Files Changed

| File | Action |
|------|--------|
| Migration SQL | Create -- add 3 admin RLS policies on `profiles` |
| `supabase/functions/admin-create-user/index.ts` | Create -- edge function for user creation |
| `src/hooks/useAdminData.ts` | Update -- add `useCreateUser` hook |
| `src/components/admin/AdminUsers.tsx` | Update -- add "Add" button and dialog |

