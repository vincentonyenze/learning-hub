import { createContext, useContext } from "react";

// The signed-in student's progress, shared like AuthContext (Step 14).
// Value: { progress, enrol, visitLesson, completeLesson, uncompleteLesson,
//          leaveCourse }, or { progress: {} } with no-op actions when
// nobody is signed in.
export const ProgressContext = createContext(null);

export function useProgress() {
  const value = useContext(ProgressContext);
  if (value === null) throw new Error("useProgress() needs a <ProgressProvider> above it");
  return value;
}
