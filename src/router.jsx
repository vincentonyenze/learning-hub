import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout.jsx";
import CourseDetailsPage from "./pages/CourseDetailsPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Every page of the site, as a tree of routes.
//
// The root route ("/") renders RootLayout. Its CHILDREN are the pages that
// appear inside the layout's <Outlet />:
//   - index: true   -> the page for "/" itself
//   - "courses"     -> "/courses" (child paths are relative: no leading /)
//   - "courses/:courseId" -> any one course. ":courseId" is a PARAMETER:
//                      it matches any value, and the page reads it with
//                      useParams(). One route, every course.
//   - "*"           -> anything else: the 404 page
//
// More routes join this tree in the steps to come: lessons nested inside
// a course, sign-in, and the dashboard.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "courses/:courseId", element: <CourseDetailsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
