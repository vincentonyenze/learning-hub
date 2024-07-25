import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import AuthProvider from "../auth/AuthProvider.jsx";
import ProgressProvider from "../progress/ProgressProvider.jsx";
import { routes } from "../router.jsx";

export const TEST_USER = { name: "Test Student", email: "test.student@example.com" };

// The WHOLE app (the real routes, providers and pages) starting at any
// address, like opening that address in a browser.
//
//   const { user, router } = renderApp("/courses?category=Design", { signedIn: true });
//
// A MEMORY router keeps its address in memory instead of the browser's
// address bar: each test gets a fresh one, and router.state.location
// says where the app is.
export function renderApp(path = "/", { signedIn = false, progress } = {}) {
  if (signedIn) localStorage.setItem("learning-hub.user.v1", JSON.stringify(TEST_USER));
  if (progress) localStorage.setItem(`learning-hub.progress.v1:${TEST_USER.email}`, JSON.stringify(progress));

  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const user = userEvent.setup();
  render(
    <AuthProvider>
      <ProgressProvider>
        <RouterProvider router={router} />
      </ProgressProvider>
    </AuthProvider>
  );
  return { user, router };
}

// Where the app is now: "/courses/react-from-scratch"
export function currentPath(router) {
  return router.state.location.pathname;
}
