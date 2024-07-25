# Learning Hub

A course platform built with **React** and **React Router 8**: browse a catalogue, open a course, learn lesson by lesson, track your progress on a student dashboard, and finish with a printable certificate. It has 6 courses and 38 lessons, real photos, a pretend sign-in, and **78 automated tests**.

This is **Project 18** in my beginner-to-expert web development roadmap (Level 3, React). Its focus is **nested routes**, **"protected-looking" pages**, **form validation** and **component composition**, plus React Router and the Context API.

<!-- Add a screenshot: save one as screenshot.png in this folder and uncomment the line below -->
<!-- ![Learning Hub screenshot](screenshot.png) -->

> **This is a practice project with no server.** Signing in is pretend: you give a name and email, and they're kept in your browser. There's no password, nothing is sent anywhere, and anyone could fake being signed in. The "protected" pages only *look* protected. Real accounts and real protection need a backend, which is the next level of the roadmap.

## Features

- **Catalogue** with search (every word, any order), subject and level filters, and four sort orders. **Every choice is in the address**, so filtered views can be bookmarked, shared, refreshed and reached with Back.
- **Course pages** with "what you'll learn", a curriculum you can open and close, the instructor, and related courses.
- **Lessons** in a learning layout with a lesson list, Previous / Next, and exercises shown as tasks.
- **Sign in** and **sign out**, returning you to the page you were trying to reach.
- **Enrolment and progress**, saved separately for each student: mark lessons complete, "Complete and continue", ticks, progress bars, and "Continue where you left off".
- **A certificate** when you finish a course, which prints as a clean black-on-white page.
- **Student dashboard:** an overview, your courses, and **profile settings** with validation and a warning before leaving unsaved changes.
- **Friendly error pages** if something breaks, and **lazy-loaded** pages, so visitors only download what they use.
- **Light and dark** themes, and it works on phones.

## Accessibility built in

- **Focus follows navigation:** after every page change, focus moves to the new page's heading, so screen readers announce it and the keyboard continues from there. Filtering the catalogue doesn't steal focus.
- **Every page has its own title**, for example "useState · React from Scratch · Learning Hub".
- **A skip link** to the main content, and named landmarks (header, navigation, breadcrumbs, lesson list).
- **Current pages are marked** with `aria-current` in the header, dashboard tabs, breadcrumbs and lesson list, and the CSS styles that same attribute.
- **Forms:** real labels, hints and errors connected with `aria-describedby`, `aria-invalid`, and an error summary that receives focus and links into each field.
- **Toggles keep focus:** "Mark as complete" is one `aria-pressed` button, never swapped for another.
- **Nothing relies on colour alone:** progress bars have words, ticks are read as "completed", and errors have icons and text.
- **Dialogs** (unsaved changes) are native `<dialog>` elements: Escape works, and the safe choice is focused first.
- **Contrast** checked against WCAG for both themes, and **reduced motion** respected.

## What I learned

- **React Router 8:** `createBrowserRouter` and `RouterProvider` (from `react-router/dom`; `react-router-dom` no longer exists in v8)
- **Nested routes and layouts:** `<Outlet>`, index routes, pathless layout routes, routes with no element, and `useOutletContext`
- **Dynamic routes:** `:courseId` / `:lessonId` with `useParams`, and "not found" at every level
- **The URL as state:** `useSearchParams`, `replace` vs push, and `flushSync` for controlled fields (navigations are transitions)
- **Redirects** with `<Navigate replace>`, navigation `state`, and avoiding **open redirects**
- **Context API:** `AuthContext` and `ProgressContext` instead of passing props through every component
- **Context + `useReducer`** for shared state, with stable actions (`useMemo`) and per-user storage
- **Where `key` belongs:** precise resets for small components, and the cost of putting one around the whole app
- **Form validation** that helps: errors after the first submit, then live; an error summary; boundary rules
- **`useBlocker` and `beforeunload`** for unsaved changes
- **Focus management, page titles** (React 19 `<title>`), and `ScrollRestoration` with a custom key
- **Error boundaries** and **code splitting** with lazy routes
- **Component composition:** slots (`footer`, `actions`, `after`) and small single-purpose components
- **Testing:** unit tests for pure logic, and whole-app tests with a **memory router**; proving tests can fail; fixing a flaky test; and knowing what tests *can't* catch

## How to run

You need [Node.js](https://nodejs.org/) **22.22 or newer** (24 LTS recommended). React Router 8 and the test tools require it.

```bash
git clone https://github.com/vincentonyenze/learning-hub.git
cd learning-hub
npm install
npm run dev
```

Open the address it prints (usually **http://localhost:5173**).

| Command | Does |
|---|---|
| `npm run dev` | runs the app while you work on it |
| `npm test` | runs the tests, and re-runs them as you save (press `q` to quit) |
| `npm run test:run` | runs the tests once |
| `npm run lint` | checks the code with oxlint (any warning fails) |
| `npm run build` | makes the finished, optimised app in `dist/` |
| `npm run preview` | serves the `dist/` build locally |

**Publishing it:** every page is drawn by JavaScript from `index.html`, so the host must answer **every** address with `index.html` (an "SPA fallback"). Without it, refreshing any page except the home page shows the host's 404. `npm run dev` and `npm run preview` already do this.

## Project structure

```
src/
├── main.jsx                # Providers (auth, progress) around the router
├── router.jsx              # The route tree (exported for tests too)
├── index.css               # Design tokens (light + dark), shared styles, print styles
├── layouts/                # RootLayout, LearnLayout (lesson list), DashboardLayout
├── pages/                  # One file per page (dashboard pages in pages/dashboard/)
├── components/             # Reusable pieces: CourseCard, Curriculum, TextField, ...
├── auth/                   # AuthContext, RequireAuth, where to go after sign-in
├── progress/               # The progress reducer, its context and provider
├── data/                   # Courses, instructors, photos, and catalog.js to query them
├── hooks/                  # useLocalStorage, useFocusOnNavigation
├── utils/validation.js     # Form rules
├── assets/                 # Course covers and instructor photos
├── test/                   # Test setup, and renderApp() for whole-app tests
└── *.test.js(x)            # Tests, next to what they test
```

## Testing

78 tests in two kinds:

- **Unit tests (65):** the progress reducer, the course data and filters, form validation and the sign-in redirect rules. These are plain functions, tested without a browser.
- **Whole-app tests (13):** the real routes and pages in a memory router, used like a person would: browsing and filtering, signing in and being brought back, enrolling and completing lessons, finishing a course and getting the certificate, the dashboard, unsaved-changes warnings, and the error page.

Some things can only be checked in a real browser: Step 9's typing bug (a timing issue that the test environment always waits out), print layout, real focus rings and scrolling. Those were checked by hand in Chrome.

## Known limitations

- **No server:** sign-in is pretend, and courses and progress live in your browser (they don't follow you to another device).
- Your email can't be changed, because progress is saved under it.
- Lessons are text only: no videos or quizzes.
- Certificates are practice certificates, not qualifications.

## Credits

Course photos from [Unsplash](https://unsplash.com/) (via [Picsum](https://picsum.photos/)):

- Home page, HTML & CSS Foundations, and Modern JavaScript: [Alejandro Escamilla](https://unsplash.com/photos/yC-Yzbqy7PY)
- React from Scratch: [Galymzhan Abdugalimov](https://unsplash.com/photos/ICW6QYOcdlg)
- UI Design Basics: [Florian Klauer](https://unsplash.com/photos/-K6JMRMj4x4)
- Accessibility for the Web: [Rayi Christian Wicaksono](https://unsplash.com/photos/6PF6DaiWz48)
- Data Analysis Basics: [Aleksi Tappura](https://unsplash.com/photos/PjH_BkzjxTA)

Instructor photos are placeholder portraits from [randomuser.me](https://randomuser.me/). The instructors and courses are made up for this project.
