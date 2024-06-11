import { useState } from "react";
import { useNavigate } from "react-router";
import { courseProgress } from "../progress/progress.js";
import { useProgress } from "../progress/progressContext.js";
import "./LessonComplete.css";

// The bottom of a lesson: mark it as done, or do that and move on.
//
// "Mark as complete" is a TOGGLE button (aria-pressed): pressed means
// done. It stays the same button when its state changes, so keyboard
// focus stays on it. (Swapping it for a different "Completed" button
// would drop focus to the top of the page.)
function LessonComplete({ course, lesson, next }) {
  const { progress, completeLesson, uncompleteLesson } = useProgress();
  const navigate = useNavigate();
  // What just happened, announced through the status region below
  const [message, setMessage] = useState("");

  const status = courseProgress(progress, course);
  const isDone = status.completed.has(lesson.id);

  function toggle() {
    if (isDone) {
      uncompleteLesson(course.id, lesson.id);
      setMessage("Marked as not done.");
    } else {
      completeLesson(course.id, lesson.id);
      // The count INCLUDING this lesson: progress hasn't updated yet
      const done = status.completedCount + 1;
      setMessage(
        done === status.total
          ? "Lesson complete. That was the last one: you've finished the course!"
          : `Lesson complete. ${done} of ${status.total} done.`
      );
    }
  }

  function completeAndContinue() {
    completeLesson(course.id, lesson.id);
    navigate(`/courses/${course.id}/lessons/${next.id}`);
  }

  return (
    <section className="lesson-complete" aria-label="Your progress">
      <div className="lesson-complete__actions">
        {!isDone && next && (
          <button type="button" className="button button--primary" onClick={completeAndContinue}>
            Complete and continue<span aria-hidden="true"> →</span>
          </button>
        )}
        <button
          type="button"
          className={isDone ? "button button--secondary lesson-complete__toggle is-done" : "button button--secondary lesson-complete__toggle"}
          aria-pressed={isDone}
          onClick={toggle}
        >
          <span className="lesson-complete__box" aria-hidden="true">
            {isDone ? "✓" : ""}
          </span>
          {isDone ? "Completed" : "Mark as complete"}
        </button>
      </div>
      {/* Always on the page (empty at first), so screen readers notice
          when its text changes: a status region that's ADDED with its
          text already inside is often not read out */}
      <p className="lesson-complete__message" role="status">
        {message}
      </p>
    </section>
  );
}

export default LessonComplete;
