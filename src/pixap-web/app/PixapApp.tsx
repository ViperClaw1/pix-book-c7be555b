import "./styles/globals.css";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { PixapRoutes } from "./router";

/**
 * Root of the Pixap web app. Mount under any route subtree.
 * Everything inside lives under a `[data-pixap]` node so tokens, fonts and
 * background do not leak into the existing marketing landing page.
 */
export default function PixapApp() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <PixapRoutes />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
