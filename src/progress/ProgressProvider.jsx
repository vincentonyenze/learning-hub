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
  try {
    const raw = localStorage.getItem(storageKey(email));
    return raw === null ? NO_PROGRESS : cleanProgress(JSON.parse(raw));
  } catch {
    return NO_PROGRESS; // blocked storage or unusable data: start fresh
  }
}

// Gives every page the signed-in student's progress (Context + useReducer).
function ProgressProvider({ children }) {
  const { user } = useAuth();

  // key: a DIFFERENT student means a different StudentProgress component,
  // with brand-new state loaded for them. Sign out and someone else signs
  // in: nothing of the first person's progress can leak across.
  return user ? (
    <StudentProgress key={user.email} email={user.email}>
      {children}
    </StudentProgress>
  ) : (
    <ProgressContext value={NOBODY}>{children}</ProgressContext>
  );
}

// Signed out: no progress, and the actions do nothing
const ignore = () => {};
const NOBODY = {
  progress: NO_PROGRESS,
  enrol: ignore,
  visitLesson: ignore,
  completeLesson: ignore,
  uncompleteLesson: ignore,
  leaveCourse: ignore,
};

function StudentProgress({ email, children }) {
  // useReducer's third argument: a lazy initialiser, run once, that loads
  // this student's saved progress (like useState(() => ...) in P15)
  const [progress, dispatch] = useReducer(progressReducer, email, load);

  // Save after every change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(email), JSON.stringify(progress));
    } catch {
      // Full or blocked: keep going without saving
    }
  }, [email, progress]);

  // Another tab (same student) changed it: take theirs
  useEffect(() => {
    function handleStorage(event) {
      if (event.storageArea === localStorage && event.key === storageKey(email)) {
        dispatch({ type: "replaced", state: load(email) });
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [email]);

  // Named actions, so pages say WHAT happened, never build actions
  // themselves. Date.now() is read here, outside the pure reducer.
  //
  // useMemo with [] : created ONCE, the same functions on every render.
  // That matters: pages call these from effects (a lesson records that
  // you visited it), so they sit in effect dependency lists. New
  // functions every render would re-run those effects, which change the
  // progress, which re-renders, which makes new functions... forever.
  // dispatch never changes, so nothing here ever needs re-creating.
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

  // A new value object only when progress actually changes
  const value = useMemo(() => ({ progress, ...actions }), [progress, actions]);

  return <ProgressContext value={value}>{children}</ProgressContext>;
}

export default ProgressProvider;
