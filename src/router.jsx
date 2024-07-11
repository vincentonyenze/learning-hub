import { createBrowserRouter } from "react-router";
import RequireAuth from "./auth/RequireAuth.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import { AppError, PageError } from "./components/RouteError.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import CourseDetailsPage from "./pages/CourseDetailsPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// LAZY LOADING (code splitting). The pages above are imported normally:
// they're in the first download, because nearly everyone sees them. The
// ones below are only downloaded the first time someone goes there: most
// visitors never sign in or open the dashboard, so why make them wait for
// that code?
//
// import() (as a function) tells the build tool "put this in its own
// file", and loads that file when called. React Router calls `lazy` before
// showing the route, and waits for it.
//   lazy(() => import("./x.jsx"))            -> the file's default export
//   lazy(() => import("./x.jsx"), "Named")   -> a named export
function lazy(load, exportName = "default") {
  return async () => ({ Component: (await load())[exportName] });
}

// Every page of the site, as a tree of routes.
//
//   /                          RootLayout (header, footer)
//   ├─ (index)                 Home
//   ├─ courses                 The catalogue
//   ├─ courses/:courseId       (groups one course; no page of its own)
//   │  ├─ (index)              The course page
//   │  └─ RequireAuth          (signed in only)
//   │     ├─ lessons           LearnLayout (lesson list)       lazy
//   │     │  ├─ (index)        -> redirect to the first lesson lazy
//   │     │  └─ :lessonId      One lesson                       lazy
//   │     └─ complete          The certificate                  lazy
//   ├─ sign-in                 Sign in                          lazy
//   ├─ RequireAuth             (signed in only)
//   │  └─ dashboard            DashboardLayout                  lazy
//   │     ├─ (index)           Overview                         lazy
//   │     ├─ courses           My courses                       lazy
//   │     └─ settings          Settings                         lazy
//   └─ *                       Page not found
//
// ":courseId" and ":lessonId" are PARAMETERS, read with useParams().
// Nesting routes nests layouts: RootLayout > LearnLayout > LessonPage.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // If even the layout crashes: a minimal error page of its own
    ErrorBoundary: AppError,
    // A first visit straight to a lazy page (a bookmark to /dashboard)
    // shows this while its code downloads
    HydrateFallback: LoadingScreen,
    children: [
      {
        // A pathless route that only adds an error boundary. A crash in any
        // page below shows PageError INSIDE RootLayout's <Outlet>, so the
        // header and its links keep working.
        ErrorBoundary: PageError,
        children: [
          { index: true, element: <HomePage /> },
          { path: "courses", element: <CoursesPage /> },
          {
            path: "courses/:courseId",
            children: [
              { index: true, element: <CourseDetailsPage /> },
              {
                element: <RequireAuth />,
                children: [
                  {
                    path: "lessons",
                    lazy: lazy(() => import("./layouts/LearnLayout.jsx")),
                    children: [
                      { index: true, lazy: lazy(() => import("./pages/LessonPage.jsx"), "FirstLessonRedirect") },
                      { path: ":lessonId", lazy: lazy(() => import("./pages/LessonPage.jsx")) },
                    ],
                  },
                  { path: "complete", lazy: lazy(() => import("./pages/CourseCompletePage.jsx")) },
                ],
              },
            ],
          },
          { path: "sign-in", lazy: lazy(() => import("./pages/SignInPage.jsx")) },
          {
            element: <RequireAuth />,
            children: [
              {
                path: "dashboard",
                lazy: lazy(() => import("./layouts/DashboardLayout.jsx")),
                children: [
                  { index: true, lazy: lazy(() => import("./pages/dashboard/OverviewPage.jsx")) },
                  { path: "courses", lazy: lazy(() => import("./pages/dashboard/MyCoursesPage.jsx")) },
                  { path: "settings", lazy: lazy(() => import("./pages/dashboard/SettingsPage.jsx")) },
                ],
              },
            ],
          },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
