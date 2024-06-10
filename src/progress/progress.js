// A student's progress: which courses they're enrolled in, which lessons
// they've finished, and where they were. Plain JavaScript, no React.
//
// The shape:
//   {
//     "react-from-scratch": {
//       enrolledAt: 1761000000000,       // when they enrolled (ms)
//       completed: ["jsx-and-components"],
//       lastLessonId: "props",           // where to "Continue"
//       lastVisitedAt: 1761000500000,
//     },
//     ...
//   }

import { getCourse, getLessons } from "../data/catalog.js";

export const NO_PROGRESS = {};

// ===== The reducer: every way progress can change =====
// (state, action) -> new state. Pure: times come IN the action, so the
// same state + action always gives the same result (and can be tested).
export function progressReducer(state, action) {
  switch (action.type) {
    case "enrolled": {
      if (state[action.courseId]) return state; // already: nothing changes
      return {
        ...state,
        [action.courseId]: { enrolledAt: action.at, completed: [], lastLessonId: null, lastVisitedAt: action.at },
      };
    }

    case "lesson_visited": {
      // Opening a lesson enrols you if you weren't yet, so "Start the
      // course" just works
      const current = state[action.courseId] ?? { enrolledAt: action.at, completed: [] };
      return {
        ...state,
        [action.courseId]: { ...current, lastLessonId: action.lessonId, lastVisitedAt: action.at },
      };
    }

    case "lesson_completed": {
      const current = state[action.courseId];
      if (!current || current.completed.includes(action.lessonId)) return state;
      return {
        ...state,
        [action.courseId]: { ...current, completed: [...current.completed, action.lessonId], lastVisitedAt: action.at },
      };
    }

    case "lesson_uncompleted": {
      const current = state[action.courseId];
      if (!current) return state;
      return {
        ...state,
        [action.courseId]: { ...current, completed: current.completed.filter((id) => id !== action.lessonId) },
      };
    }

    case "left_course": {
      // Copy everything except this course
      const { [action.courseId]: _removed, ...rest } = state;
      return rest;
    }

    case "replaced":
      // A whole new state: another tab changed it
      return action.state;

    default:
      throw new Error(`Unknown progress action: ${action.type}`);
  }
}

// ===== Reading progress back from storage (untrusted) =====
// Keeps only courses and lessons that still exist, so an old save can't
// point at a removed lesson or count the same one twice.
export function cleanProgress(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("Not progress");
  const clean = {};
  for (const [courseId, entry] of Object.entries(value)) {
    const course = getCourse(courseId);
    if (!course || typeof entry !== "object" || entry === null) continue;
    const lessonIds = new Set(getLessons(course).map((lesson) => lesson.id));
    const completed = Array.isArray(entry.completed) ? entry.completed.filter((id) => lessonIds.has(id)) : [];
    clean[courseId] = {
      enrolledAt: Number.isFinite(entry.enrolledAt) ? entry.enrolledAt : 0,
      completed: [...new Set(completed)],
      lastLessonId: lessonIds.has(entry.lastLessonId) ? entry.lastLessonId : null,
      lastVisitedAt: Number.isFinite(entry.lastVisitedAt) ? entry.lastVisitedAt : 0,
    };
  }
  return clean;
}

// ===== Questions pages ask =====
// Everything about one course's progress, worked out from the state
export function courseProgress(progress, course) {
  const entry = progress[course.id];
  const lessons = getLessons(course);
  const completed = new Set(entry?.completed ?? []);
  const completedCount = lessons.filter((lesson) => completed.has(lesson.id)).length;
  return {
    enrolled: Boolean(entry),
    completed, // a Set of lesson ids
    completedCount,
    total: lessons.length,
    percent: Math.round((completedCount / lessons.length) * 100),
    isFinished: completedCount === lessons.length,
    // Opened a lesson or finished one: "Continue" rather than "Start"
    hasStarted: completedCount > 0 || Boolean(entry?.lastLessonId),
    // Where "Continue" goes: the last lesson you opened, else the first
    lastLesson: lessons.find((lesson) => lesson.id === entry?.lastLessonId) ?? lessons[0],
    // The first lesson you haven't finished, if any
    nextUnfinished: lessons.find((lesson) => !completed.has(lesson.id)),
  };
}
