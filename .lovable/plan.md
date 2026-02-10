

## Fix: Login/Signup Form Animation Scrollbar Flash

### Problem
The Framer Motion entrance animation on the auth page starts with `translateY(20px)`, which momentarily extends the page content beyond the viewport. This triggers a scrollbar to appear briefly, causing visible shakiness.

### Solution
Add `overflow: hidden` to the outermost container of the AuthPage during the animation. This clips the animated content so it never triggers a scrollbar.

### Changes

**`src/pages/AuthPage.tsx`**
- Add `overflow-hidden` to the root `div` (the one with `min-h-screen`):
  - Change: `className="min-h-screen bg-background flex flex-col"`
  - To: `className="min-h-screen bg-background flex flex-col overflow-hidden"`

This is a single-line, one-class change that fully resolves the issue.

