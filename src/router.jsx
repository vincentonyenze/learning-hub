import { createBrowserRouter } from "react-router";
import RequireAuth from "./auth/RequireAuth.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import LearnLayout from "./layouts/LearnLayout.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import CourseCompletePage from "./pages/CourseCompletePage.jsx";
import CourseDetailsPage from "./pages/CourseDetailsPage.jsx";
import MyCoursesPage from "./pages/dashboard/MyCoursesPage.jsx";
import OverviewPage from "./pages/dashboard/OverviewPage.jsx";
import SettingsPage from "./pages/dashboard/SettingsPage.jsx";
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
//         - "lessons"    -> (signed in only) LearnLayout, whose children
//             - index       -> /lessons alone: redirect to the first lesson
//             - ":lessonId" -> one lesson, in LearnLayout's <Outlet>
//         - "complete"   -> (signed in only) the certificate page
//   - "*"           -> anything else: the 404 page
//
// Nesting routes nests layouts: RootLayout > LearnLayout > LessonPage.
//   - "sign-in"     -> the (pretend) sign-in page
//   - "dashboard"   -> (signed in only) DashboardLayout, with children
//         - index        -> Overview
//         - "courses"    -> My courses
//         - "settings"   -> Settings
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
            // A "layout route" with no path: it adds a check, not a
            // piece of the address. Everything inside needs sign-in.
            element: <RequireAuth />,
            children: [
              {
                path: "lessons",
                element: <LearnLayout />,
                children: [
                  { index: true, element: <FirstLessonRedirect /> },
                  { path: ":lessonId", element: <LessonPage /> },
                ],
              },
              // The certificate page: also signed-in only
              { path: "complete", element: <CourseCompletePage /> },
            ],
          },
        ],
      },
      { path: "sign-in", element: <SignInPage /> },
      {
        // The same RequireAuth as the lessons: one line protects a whole
        // branch of the tree
        element: <RequireAuth />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <OverviewPage /> },
              { path: "courses", element: <MyCoursesPage /> },
              { path: "settings", element: <SettingsPage /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
