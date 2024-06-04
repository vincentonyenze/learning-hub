import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// The shared styles FIRST. CSS files load in import order, and when two
// rules are equally specific the later one wins: components' own CSS
// (imported by the router's pages) must come after, so it can override
// shared classes like .button.
import "./index.css";
// React Router 8: RouterProvider comes from "react-router/dom" (it uses the
// browser's DOM); everything else comes from "react-router"
import { RouterProvider } from "react-router/dom";
import AuthProvider from "./auth/AuthProvider.jsx";
import ProgressProvider from "./progress/ProgressProvider.jsx";
import { router } from "./router.jsx";

// The router decides which page to show from the address bar, so it's the
// top of the app: there's no <App /> any more
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Around everything, so every page can ask who's signed in
        (useAuth) and how far they've got (useProgress). Progress sits
        INSIDE auth, because it needs to know whose progress to load. */}
    <AuthProvider>
      <ProgressProvider>
        <RouterProvider router={router} />
      </ProgressProvider>
    </AuthProvider>
  </StrictMode>
);
