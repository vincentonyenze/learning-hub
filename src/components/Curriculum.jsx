import { useState } from "react";
import { courseMinutes, formatDuration, getLessons } from "../data/catalog.js";
import Disclosure from "./Disclosure.jsx";
import LessonRow from "./LessonRow.jsx";
import "./Curriculum.css";

// A course's modules, each opening to show its lessons.
//
// COMPOSITION: this component is mostly other components put together.
//   Curriculum ─┬─ Disclosure (one per module) ─── LessonRow (one per lesson)
// Disclosure doesn't know about lessons, and LessonRow doesn't know it's
// inside a Disclosure. Curriculum is the only piece that knows both, so
// each part stays small and reusable.
function Curriculum({ course }) {
  // Which modules are open. The first one starts open, so the page shows
  // some lessons straight away.
  const [openIds, setOpenIds] = useState(() => new Set([course.modules[0].id]));

  const allOpen = openIds.size === course.modules.length;
  const lessons = getLessons(course);

  // Lessons are numbered across the whole course (1-7), not per module.
  // The flat list already has them in order: look each number up by id.
  // (Counting up a variable while drawing the list would work today, but
  // rendering should only calculate, never keep running totals: React may
  // render a component more than once, or not in order.)
  const lessonNumber = new Map(lessons.map((lesson, index) => [lesson.id, index + 1]));

  function setOpen(moduleId, isOpen) {
    setOpenIds((current) => {
      const next = new Set(current); // a copy: state is never changed in place
      if (isOpen) next.add(moduleId);
      else next.delete(moduleId);
      return next;
    });
  }

  function toggleAll() {
    setOpenIds(allOpen ? new Set() : new Set(course.modules.map((module) => module.id)));
  }

  return (
    <div className="curriculum">
      <div className="curriculum__bar">
        <p className="curriculum__summary">
          {course.modules.length} modules · {lessons.length} lessons · {formatDuration(courseMinutes(course))}
        </p>
        <button type="button" className="button button--ghost curriculum__toggle" onClick={toggleAll}>
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {course.modules.map((module, index) => {
        const minutes = module.lessons.reduce((total, lesson) => total + lesson.minutes, 0);

        return (
          <Disclosure
            key={module.id}
            open={openIds.has(module.id)}
            onToggle={(isOpen) => setOpen(module.id, isOpen)}
            summary={
              <span className="curriculum__module">
                {/* A heading inside the summary keeps the page outline
                    (H2 Curriculum > H3 module) */}
                <h3 className="curriculum__module-title">
                  <span className="curriculum__module-number">Module {index + 1}</span>
                  {module.title}
                </h3>
                <span className="curriculum__module-meta">
                  {module.lessons.length} {module.lessons.length === 1 ? "lesson" : "lessons"} ·{" "}
                  {formatDuration(minutes)}
                </span>
              </span>
            }
          >
            <ol className="curriculum__lessons">
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <LessonRow courseId={course.id} lesson={lesson} number={lessonNumber.get(lesson.id)} />
                </li>
              ))}
            </ol>
          </Disclosure>
        );
      })}
    </div>
  );
}

export default Curriculum;
