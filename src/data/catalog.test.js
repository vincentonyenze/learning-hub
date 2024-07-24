import { describe, expect, it } from "vitest";
import {
  courseMinutes,
  DEFAULT_FILTERS,
  filterCourses,
  findLesson,
  formatDuration,
  getCourse,
  getCourses,
  getInstructor,
  getLessons,
  getRelatedCourses,
  readFilters,
} from "./catalog.js";
import { CATEGORIES, LEVELS } from "./courses.js";
import { courseCover, instructorPhoto } from "./media.js";

const titles = (list) => list.map((course) => course.title);
const filtered = (changes) => titles(filterCourses(getCourses(), { ...DEFAULT_FILTERS, ...changes }));

// Checks on the DATA itself. Mistakes here (a duplicate id, a missing
// photo) would break pages, so the tests catch them before anyone sees.
describe("the course data", () => {
  const slug = /^[a-z0-9]+(-[a-z0-9]+)*$/;

  it("has unique, address-friendly course ids", () => {
    const ids = getCourses().map((course) => course.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(slug);
  });

  it.each(getCourses().map((course) => [course.id, course]))("%s is complete and consistent", (_id, course) => {
    expect(getInstructor(course.instructorId)).toBeDefined();
    expect(CATEGORIES).toContain(course.category);
    expect(LEVELS).toContain(course.level);
    expect(courseCover(course.id)).toBeTruthy();
    expect(instructorPhoto(course.instructorId)).toBeTruthy();

    const lessonIds = getLessons(course).map((lesson) => lesson.id);
    expect(new Set(lessonIds).size).toBe(lessonIds.length); // unique within the course
    for (const lesson of getLessons(course)) {
      expect(lesson.id).toMatch(slug);
      expect(["reading", "exercise"]).toContain(lesson.type);
      expect(lesson.minutes).toBeGreaterThan(0);
      expect(lesson.body.length).toBeGreaterThan(0);
      expect(lesson.takeaways.length).toBeGreaterThan(0);
    }
  });
});

describe("looking things up", () => {
  const react = getCourse("react-from-scratch");

  it("returns undefined for unknown ids instead of crashing", () => {
    expect(getCourse("knitting")).toBeUndefined();
    expect(findLesson(react, "nope")).toBeUndefined();
  });

  it("lists lessons in order across modules, with their module", () => {
    const lessons = getLessons(react);
    expect(lessons).toHaveLength(6);
    expect(lessons[2]).toMatchObject({ id: "use-state", moduleTitle: "State and events" });
  });

  it("finds a lesson with its neighbours", () => {
    const found = findLesson(react, "use-state");
    expect(found.index).toBe(2);
    expect(found.previous.id).toBe("props");
    expect(found.next.id).toBe("build-a-counter-and-a-todo-list");
    expect(findLesson(react, "jsx-and-components").previous).toBeUndefined();
    expect(findLesson(react, "custom-hooks").next).toBeUndefined();
  });

  it("adds up a course's length and formats it", () => {
    expect(courseMinutes(getCourse("data-analysis-basics"))).toBe(71);
    expect(formatDuration(71)).toBe("1h 11m");
    expect(formatDuration(45)).toBe("45m");
    expect(formatDuration(120)).toBe("2h");
  });

  it("suggests other courses in the same subject", () => {
    expect(titles(getRelatedCourses(react))).toEqual(["HTML & CSS Foundations", "Modern JavaScript"]);
    expect(getRelatedCourses(getCourse("data-analysis-basics"))).toEqual([]);
  });
});

describe("readFilters (the address is untrusted)", () => {
  it("reads valid filters", () => {
    expect(readFilters(new URLSearchParams("category=Design&level=Beginner&sort=rating&q=ui"))).toEqual({
      q: "ui",
      category: "Design",
      level: "Beginner",
      sort: "rating",
    });
  });

  it("falls back to the defaults for anything unknown", () => {
    expect(readFilters(new URLSearchParams("category=Cooking&level=expert&sort=random"))).toEqual(DEFAULT_FILTERS);
    expect(readFilters(new URLSearchParams())).toEqual(DEFAULT_FILTERS);
  });
});

describe("filterCourses", () => {
  it("filters by subject and level", () => {
    expect(filtered({ category: "Design" })).toEqual(["UI Design Basics", "Accessibility for the Web"]);
    expect(filtered({ category: "Web Development", level: "Beginner" })).toEqual(["HTML & CSS Foundations"]);
  });

  it("searches every word, in any order, ignoring case and extra spaces", () => {
    expect(filtered({ q: "daniel REACT" })).toEqual(["React from Scratch"]);
    expect(filtered({ q: "  mei  " })).toEqual(["UI Design Basics", "Accessibility for the Web"]);
    expect(filtered({ q: "quantum" })).toEqual([]);
  });

  it.each([
    ["popular", "React from Scratch"],
    ["rating", "React from Scratch"],
    ["newest", "React from Scratch"],
    ["shortest", "Data Analysis Basics"],
  ])("sorts by %s", (sort, first) => {
    expect(filtered({ sort })[0]).toBe(first);
  });

  it("returns a new array and leaves the catalogue's order alone", () => {
    const before = titles(getCourses());
    filterCourses(getCourses(), { ...DEFAULT_FILTERS, sort: "shortest" });
    expect(titles(getCourses())).toEqual(before);
  });
});
