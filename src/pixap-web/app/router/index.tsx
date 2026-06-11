import { Route, Routes } from "react-router-dom";
import FoundationPreview from "@/pixap-web/pages/FoundationPreview";

/**
 * Pixap web router. Mounted under `/pixap/*` from the root App.
 * Phase 0 only exposes the foundation preview. Subsequent phases will
 * add routes for /auth, /onboarding, /place/:id, etc.
 */
export function PixapRoutes() {
  return (
    <Routes>
      <Route index element={<FoundationPreview />} />
      <Route path="*" element={<FoundationPreview />} />
    </Routes>
  );
}
