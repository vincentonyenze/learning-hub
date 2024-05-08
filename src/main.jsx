import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// React Router 8: RouterProvider comes from "react-router/dom" (it uses the
// browser's DOM); everything else comes from "react-router"
import { RouterProvider } from "react-router/dom";
import { router } from "./router.jsx";
import "./index.css";

// The router decides which page to show from the address bar, so it's the
// top of the app: there's no <App /> any more
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
