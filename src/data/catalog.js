// Ways to ask questions of the course data. Pages call these instead of
// digging through the nested arrays themselves, the way they'd call an API
// in a real app. Plain JavaScript, no React.

import { CATEGORIES, courses, LEVELS } from "./courses.js";
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

// ===== Searching, filtering and sorting the catalogue =====

export const SORT_OPTIONS = [
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Recently updated" },
  { value: "shortest", label: "Shortest first" },
];

// What the catalogue shows when the address has no filters
export const DEFAULT_FILTERS = { q: "", category: "", level: "", sort: "popular" };

// The address -> filters we can trust. Anything unknown (an old link, a
// typo, someone editing the URL) falls back to the default instead of
// breaking the page.
export function readFilters(searchParams) {
  const pick = (name, allowed) => {
    const value = searchParams.get(name) ?? "";
    return allowed.includes(value) ? value : DEFAULT_FILTERS[name];
  };
  return {
    q: (searchParams.get("q") ?? "").slice(0, 100),
    category: pick("category", CATEGORIES),
    level: pick("level", LEVELS),
    sort: pick("sort", SORT_OPTIONS.map((option) => option.value)),
  };
}

// Does the course match the search words? Every word must appear somewhere
// in the title, subtitle, category or instructor's name, in any order:
// "react daniel" finds React from Scratch.
function matchesSearch(course, q) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const text = [course.title, course.subtitle, course.category, getInstructor(course.instructorId)?.name]
    .join(" ")
    .toLowerCase();
  return words.every((word) => text.includes(word));
}

const COMPARE = {
  popular: (a, b) => b.students - a.students,
  rating: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
  newest: (a, b) => b.updated.localeCompare(a.updated), // "2026-10" sorts like a date
  shortest: (a, b) => courseMinutes(a) - courseMinutes(b),
};

// The courses to show for some filters: a new, filtered, sorted array
export function filterCourses(allCourses, { q, category, level, sort }) {
  return allCourses
    .filter((course) => !category || course.category === category)
    .filter((course) => !level || course.level === level)
    .filter((course) => matchesSearch(course, q))
    .toSorted(COMPARE[sort] ?? COMPARE.popular);
}
