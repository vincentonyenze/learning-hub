import { Link } from "react-router";
import "./LessonRow.css";

const TYPES = {
  reading: { icon: "📖", label: "Reading" },
  exercise: { icon: "✍️", label: "Exercise" },
};

// One lesson as a link: its type, title and length.
//
// Used in the course curriculum now, and in the lesson sidebar from
// Step 12. Each place passes what it knows:
// isCurrent: this is the lesson on screen (the sidebar marks it)
// isDone: the student has completed it (a tick replaces the number)
function LessonRow({ courseId, lesson, number, isCurrent = false, isDone = false }) {
  const type = TYPES[lesson.type];

  return (
    <Link
      to={`/courses/${courseId}/lessons/${lesson.id}`}
      className={isDone ? "lesson-row lesson-row--done" : "lesson-row"}
      aria-current={isCurrent ? "page" : undefined}
    >
      <span className="lesson-row__number" aria-hidden={isDone ? "true" : undefined}>
        {isDone ? "✓" : number}
      </span>
      <span className="lesson-row__icon" aria-hidden="true">
        {type.icon}
      </span>
      <span className="lesson-row__title">
        {lesson.title}
        {/* Heard by screen readers, which can't see the icon: "What
            matters most?, Reading, 9 minutes" */}
        <span className="visually-hidden">
          , {type.label}
          {isDone ? ", completed" : ""}
        </span>
      </span>
      <span className="lesson-row__time">
        {lesson.minutes}
        <span aria-hidden="true"> min</span>
        <span className="visually-hidden"> minutes</span>
      </span>
    </Link>
  );
}

export default LessonRow;
