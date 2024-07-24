import { describe, expect, it } from "vitest";
import { getCourse, getLessons } from "../data/catalog.js";
import { cleanProgress, courseProgress, NO_PROGRESS, progressReducer } from "./progress.js";

// The smallest course: 5 lessons
const course = getCourse("data-analysis-basics");
const lessonIds = getLessons(course).map((lesson) => lesson.id);

// Run several actions in a row, like a student using the site
function run(actions, start = NO_PROGRESS) {
  return actions.reduce(progressReducer, start);
}

const enrol = { type: "enrolled", courseId: course.id, at: 1 };
const complete = (lessonId, at = 10) => ({ type: "lesson_completed", courseId: course.id, lessonId, at });

describe("progressReducer", () => {
  it("enrols a student once", () => {
    const state = run([enrol]);
    expect(state[course.id]).toEqual({ enrolledAt: 1, completed: [], lastLessonId: null, lastVisitedAt: 1 });
    // Enrolling again changes nothing: the very same object comes back
    expect(progressReducer(state, { ...enrol, at: 99 })).toBe(state);
  });

  it("remembers the last lesson visited, and enrols you by visiting", () => {
    const state = run([{ type: "lesson_visited", courseId: course.id, lessonId: lessonIds[2], at: 5 }]);
    expect(state[course.id]).toMatchObject({ lastLessonId: lessonIds[2], lastVisitedAt: 5, completed: [] });
  });

  it("completes a lesson once, and only for enrolled courses", () => {
    const state = run([enrol, complete(lessonIds[0]), complete(lessonIds[0])]);
    expect(state[course.id].completed).toEqual([lessonIds[0]]);
    // Not enrolled: nothing happens
    expect(run([complete(lessonIds[0])])).toBe(NO_PROGRESS);
  });

  it("sets completedAt when the LAST lesson is done, and clears it when one is undone", () => {
    const almost = run([enrol, ...lessonIds.slice(0, -1).map((id) => complete(id))]);
    expect(almost[course.id].completedAt).toBeNull();

    const finished = progressReducer(almost, complete(lessonIds.at(-1), 500));
    expect(finished[course.id].completedAt).toBe(500);

    const undone = progressReducer(finished, { type: "lesson_uncompleted", courseId: course.id, lessonId: lessonIds[0] });
    expect(undone[course.id].completedAt).toBeNull();
    expect(undone[course.id].completed).toHaveLength(lessonIds.length - 1);
  });

  it("forgets a course you leave, and keeps the others", () => {
    const state = run([enrol, { type: "enrolled", courseId: "ui-design-basics", at: 2 }]);
    const left = progressReducer(state, { type: "left_course", courseId: course.id });
    expect(Object.keys(left)).toEqual(["ui-design-basics"]);
  });

  it("never changes the state it was given", () => {
    // Frozen: any change in place would throw
    const state = Object.freeze(run([enrol]));
    Object.freeze(state[course.id]);
    Object.freeze(state[course.id].completed);
    expect(() => progressReducer(state, complete(lessonIds[0]))).not.toThrow();
    expect(state[course.id].completed).toEqual([]);
  });

  it("throws on an unknown action, so typos fail loudly", () => {
    expect(() => progressReducer(NO_PROGRESS, { type: "lesson_complete" })).toThrow("Unknown progress action");
  });
});

describe("courseProgress", () => {
  it("describes a course you haven't enrolled in", () => {
    const status = courseProgress(NO_PROGRESS, course);
    expect(status).toMatchObject({ enrolled: false, completedCount: 0, total: 5, percent: 0, hasStarted: false });
    expect(status.lastLesson.id).toBe(lessonIds[0]);
  });

  it("works out counts, percent, where to continue and what's next", () => {
    const state = run([
      enrol,
      complete(lessonIds[0]),
      complete(lessonIds[1]),
      { type: "lesson_visited", courseId: course.id, lessonId: lessonIds[1], at: 20 },
    ]);
    const status = courseProgress(state, course);
    expect(status).toMatchObject({ enrolled: true, completedCount: 2, percent: 40, hasStarted: true, isFinished: false });
    expect(status.lastLesson.id).toBe(lessonIds[1]);
    expect(status.nextUnfinished.id).toBe(lessonIds[2]);
  });

  it("knows when a course is finished", () => {
    const status = courseProgress(run([enrol, ...lessonIds.map((id) => complete(id, 7))]), course);
    expect(status).toMatchObject({ isFinished: true, percent: 100, completedAt: 7 });
    expect(status.nextUnfinished).toBeUndefined();
  });
});

describe("cleanProgress (reading saved data back)", () => {
  it("rejects anything that isn't an object of courses", () => {
    expect(() => cleanProgress([])).toThrow();
    expect(() => cleanProgress(null)).toThrow();
    expect(() => cleanProgress("progress")).toThrow();
  });

  it("drops unknown courses and lessons, duplicates and bad values", () => {
    const cleaned = cleanProgress({
      [course.id]: { enrolledAt: "yesterday", completed: [lessonIds[0], lessonIds[0], "deleted-lesson", 42], lastLessonId: "gone" },
      "no-such-course": { completed: [] },
      "ui-design-basics": null,
    });
    expect(cleaned).toEqual({
      [course.id]: { enrolledAt: 0, completed: [lessonIds[0]], lastLessonId: null, lastVisitedAt: 0, completedAt: null },
    });
  });

  it("only believes a course is finished if every lesson really is done", () => {
    expect(cleanProgress({ [course.id]: { completed: [lessonIds[0]], completedAt: 5 } })[course.id].completedAt).toBeNull();
    expect(cleanProgress({ [course.id]: { completed: lessonIds, completedAt: 5 } })[course.id].completedAt).toBe(5);
  });
});
