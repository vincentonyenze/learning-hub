import { useEffect, useMemo, useReducer } from "react";
import { useAuth } from "../auth/authContext.js";
import { cleanProgress, NO_PROGRESS, progressReducer } from "./progress.js";
import { ProgressContext } from "./progressContext.js";

// Each student's progress is saved under their own key, so two people
// using the same browser don't share it
function storageKey(email) {
  return `learning-hub.progress.v1:${email}`;
}

function load(email) {
  if (!email) return NO_PROGRESS; // signed out: nobody's progress
  try {
    const raw = localStorage.getItem(storageKey(email));
    return raw === null ? NO_PROGRESS : cleanProgress(JSON.parse(raw));
  } catch {
    return NO_PROGRESS; // blocked storage or unusable data: start fresh
  }
}

// The store remembers WHOSE progress it holds, as well as the progress
function storeReducer(store, action) {
  if (action.type === "student_changed") return { email: action.email, progress: load(action.email) };
  if (!store.email) return store; // signed out: nothing to change
  return { ...store, progress: progressReducer(store.progress, action) };
}

// Gives every page the signed-in student's progress (Context + useReducer).
//
// The SAME elements are rendered whoever is signed in. An earlier version
// wrapped the app in a different component per student (with a key):
// neat for resetting state, but because it wrapped EVERYTHING, signing in
// or out rebuilt the whole app, losing every page's state and the
// keyboard focus. So instead the store notices a new student and loads
// their progress.
function ProgressProvider({ children }) {
  const { user } = useAuth();
  const email = user?.email ?? null;

  const [store, dispatch] = useReducer(storeReducer, email, (initial) => ({ email: initial, progress: load(initial) }));

  // A different student (or signed out): load theirs. Updating state while
  // rendering is allowed when it's guarded like this (P15's TaskFooter):
  // React re-renders straight away, before anything reaches the screen,
  // so one student's progress is never shown under another's name.
  if (store.email !== email) {
    dispatch({ type: "student_changed", email });
  }

  // Save after every change
  useEffect(() => {
    if (!store.email) return;
    try {
      localStorage.setItem(storageKey(store.email), JSON.stringify(store.progress));
    } catch {
      // Full or blocked: keep going without saving
    }
  }, [store]);

  // Another tab (same student) changed it: take theirs
  useEffect(() => {
    if (!email) return;
    function handleStorage(event) {
      if (event.storageArea === localStorage && event.key === storageKey(email)) {
        dispatch({ type: "replaced", state: load(email) });
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [email]);

  // Named actions, created ONCE (useMemo with []): pages call them from
  // effects, so they must not change between renders (see Step 16).
  // Date.now() is read here, outside the pure reducer.
  const actions = useMemo(
    () => ({
      enrol: (courseId) => dispatch({ type: "enrolled", courseId, at: Date.now() }),
      visitLesson: (courseId, lessonId) => dispatch({ type: "lesson_visited", courseId, lessonId, at: Date.now() }),
      completeLesson: (courseId, lessonId) =>
        dispatch({ type: "lesson_completed", courseId, lessonId, at: Date.now() }),
      uncompleteLesson: (courseId, lessonId) => dispatch({ type: "lesson_uncompleted", courseId, lessonId }),
      leaveCourse: (courseId) => dispatch({ type: "left_course", courseId }),
    }),
    []
  );

  // While a switch is pending (the render above), show nobody's progress
  const progress = store.email === email ? store.progress : NO_PROGRESS;
  const value = useMemo(() => ({ progress, ...actions }), [progress, actions]);

  return <ProgressContext value={value}>{children}</ProgressContext>;
}

export default ProgressProvider;
