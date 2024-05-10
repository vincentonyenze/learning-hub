// Ways to ask questions of the course data. Pages call these instead of
// digging through the nested arrays themselves, the way they'd call an API
// in a real app. Plain JavaScript, no React.

import { courses } from "./courses.js";
import { instructors } from "./instructors.js";

export function getCourses() {
  return courses;
}

// undefined when there's no such course (a mistyped or old link)
export function getCourse(courseId) {
  return courses.find((course) => course.id === courseId);
}

export function getInstructor(instructorId) {
  return instructors.find((instructor) => instructor.id === instructorId);
}

// All of a course's lessons in order, as one flat list. Modules are for
// showing the curriculum; "next lesson" and progress need the flat list.
export function getLessons(course) {
  return course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ ...lesson, moduleId: module.id, moduleTitle: module.title }))
  );
}

// { lesson, index, previous, next } for one lesson, or undefined
export function findLesson(course, lessonId) {
  const lessons = getLessons(course);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1) return undefined;
  return { lesson: lessons[index], index, previous: lessons[index - 1], next: lessons[index + 1] };
}

// Total length of a course, in minutes
export function courseMinutes(course) {
  return getLessons(course).reduce((total, lesson) => total + lesson.minutes, 0);
}

// 75 -> "1h 15m", 45 -> "45m"
export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest}m`;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

// The best-rated courses, for the home page
export function getFeaturedCourses(count = 3) {
  return courses.toSorted((a, b) => b.rating - a.rating).slice(0, count);
}

// 18320 -> "18,320"
export function formatNumber(value) {
  return value.toLocaleString("en-US");
}
