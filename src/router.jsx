import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Every page of the site, as a tree of routes.
//
// The root route ("/") renders RootLayout. Its CHILDREN are the pages that
// appear inside the layout's <Outlet />:
//   - index: true   -> the page for "/" itself
//   - "courses"     -> "/courses" (child paths are relative: no leading /)
//   - "*"           -> anything else: the 404 page
//
// More routes join this tree in the steps to come: course pages, lessons
// nested inside them, sign-in, and the dashboard.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
