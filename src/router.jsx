import { createBrowserRouter } from "react-router";
import LearnLayout from "./layouts/LearnLayout.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import CourseDetailsPage from "./pages/CourseDetailsPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LessonPage, { FirstLessonRedirect } from "./pages/LessonPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";

// Every page of the site, as a tree of routes.
//
// The root route ("/") renders RootLayout. Its CHILDREN are the pages that
// appear inside the layout's <Outlet />:
//   - index: true   -> the page for "/" itself
//   - "courses"     -> "/courses" (child paths are relative: no leading /)
//   - "courses/:courseId" -> one course. ":courseId" is a PARAMETER: it
//                      matches any value, read with useParams(). Its own
//                      children (NESTED routes):
//         - index        -> the course page
//         - "lessons"    -> LearnLayout (the lesson list), whose children
//             - index       -> /lessons alone: redirect to the first lesson
//             - ":lessonId" -> one lesson, in LearnLayout's <Outlet>
//   - "*"           -> anything else: the 404 page
//
// Nesting routes nests layouts: RootLayout > LearnLayout > LessonPage.
//   - "sign-in"     -> the (pretend) sign-in page
// The dashboard joins this tree later.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "courses", element: <CoursesPage /> },
      {
        // No element of its own: it just groups everything under one course
        path: "courses/:courseId",
        children: [
          { index: true, element: <CourseDetailsPage /> },
          {
            path: "lessons",
            element: <LearnLayout />,
            children: [
              { index: true, element: <FirstLessonRedirect /> },
              { path: ":lessonId", element: <LessonPage /> },
            ],
          },
        ],
      },
      { path: "sign-in", element: <SignInPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
