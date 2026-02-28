
## Add User Roles System

### 1. Database Migration

Create the `app_role` enum and `user_roles` table following security best practices (roles in a separate table, never on profiles):

```sql
-- Enum with three roles
CREATE TYPE public.app_role AS ENUM ('buyer', 'partner', 'admin');

-- Separate roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security-definer helper to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: users can read their own roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Auto-assign 'buyer' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'buyer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
```

### 2. New Hook: `useUserRole`

Create `src/hooks/useUserRole.ts` that queries `user_roles` for the current user and exposes:
- `role` (the user's role string)
- `isAdmin` (boolean shortcut)

### 3. Update Profile Page

In `src/pages/ProfilePage.tsx`, conditionally render an **"Admin Dashboard"** button (using a shield/layout-dashboard icon) above the logout button, visible only when `isAdmin` is true. The button navigates to `/admin` (page not yet created).

### Technical Details

- The `has_role` function uses `SECURITY DEFINER` to safely check roles without RLS recursion.
- Every new user automatically gets the `buyer` role via a trigger on `auth.users`.
- Admin/partner roles must be assigned manually in the database (no self-promotion).
- The admin button is hidden client-side, but the future admin page should also be server-protected.
