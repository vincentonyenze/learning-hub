import { useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../auth/authContext.js";
import { courseProgress } from "../progress/progress.js";
import { useProgress } from "../progress/progressContext.js";
import ProgressBar from "./ProgressBar.jsx";
import "./EnrolPanel.css";

// The main buttons on a course page. They depend on who's looking:
//   signed out    -> "Sign in to start" (and come back here after)
//   not enrolled  -> "Enrol for free"
//   enrolled      -> progress so far, and "Continue: <lesson>"
function EnrolPanel({ course }) {
  const { user } = useAuth();
  const { progress, enrol, leaveCourse } = useProgress();
  const location = useLocation();
  // Set when you press Enrol, so the confirmation is only announced then,
  // not every time an enrolled student opens the page
  const [justEnrolled, setJustEnrolled] = useState(false);
  // "Leave course" asks first: leaving deletes your progress in it
  const [confirmingLeave, setConfirmingLeave] = useState(false);
  const [justLeft, setJustLeft] = useState(false);
  const leaveRef = useRef(null);
  const enrolRef = useRef(null);

  const status = courseProgress(progress, course);
  const lessonUrl = (lesson) => `/courses/${course.id}/lessons/${lesson.id}`;

  if (!user) {
    return (
      <div className="enrol">
        <p className="enrol__actions">
          <Link to="/sign-in" state={{ from: location }} className="button button--primary">
            Sign in to start
          </Link>
          <a href="#curriculum" className="button button--secondary">
            See the lessons
          </a>
        </p>
        <p className="enrol__note">Free. Sign in to enrol and save your progress.</p>
      </div>
    );
  }

  if (!status.enrolled) {
    return (
      <div className="enrol">
        <p className="enrol__actions">
          <button
            ref={enrolRef}
            type="button"
            className="button button--primary"
            onClick={() => {
              enrol(course.id);
              setJustEnrolled(true);
              setJustLeft(false);
            }}
          >
            Enrol for free
          </button>
          <a href="#curriculum" className="button button--secondary">
            See the lessons
          </a>
        </p>
        {/* After leaving: confirm it happened (and, being a status, read out) */}
        <p className="enrol__note" role="status">
          {justLeft
            ? `You've left ${course.title}. Your progress in it was deleted.`
            : "Learn at your own pace. Your progress is saved as you go."}
        </p>
      </div>
    );
  }

  return (
    <div className="enrol">
      {/* role="status": read out when it appears after pressing Enrol */}
      <p className="enrol__status" role="status">
        <span className="tag tag--primary">{justEnrolled ? "You're enrolled!" : "Enrolled"}</span>
        {status.isFinished && <span className="tag tag--accent">Completed</span>}
      </p>
      <div className="enrol__progress">
        <ProgressBar done={status.completedCount} total={status.total} label={`${course.title} progress`} />
      </div>
      <p className="enrol__actions">
        {status.isFinished ? (
          <Link to={`/courses/${course.id}/complete`} className="button button--primary">
            View your certificate
          </Link>
        ) : (
          <Link to={lessonUrl(status.lastLesson)} className="button button--primary">
            {status.hasStarted ? `Continue: ${status.lastLesson.title}` : "Start the course"}
          </Link>
        )}
        <a href="#curriculum" className="button button--secondary">
          See the lessons
        </a>
      </p>

      {confirmingLeave ? (
        // Asking right here instead of a pop-up: no focus trap, nothing to
        // dismiss, and the question sits next to the button you pressed
        <div className="enrol__confirm" role="group" aria-labelledby="leave-question">
          <p id="leave-question">
            Leave <strong>{course.title}</strong>? Your progress ({status.completedCount} of {status.total} lessons)
            will be deleted.
          </p>
          <p className="enrol__actions">
            <button
              type="button"
              className="button button--danger"
              // Focus moves here when the question appears, so keyboard
              // users can answer straight away
              autoFocus
              onClick={() => {
                leaveCourse(course.id);
                setConfirmingLeave(false);
                setJustEnrolled(false);
                setJustLeft(true);
                // The Leave button is gone: continue from "Enrol for free",
                // which appears in its place (after this render)
                requestAnimationFrame(() => enrolRef.current?.focus());
              }}
            >
              Yes, leave the course
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => {
                setConfirmingLeave(false);
                // Back to the button that asked the question
                requestAnimationFrame(() => leaveRef.current?.focus());
              }}
            >
              Cancel
            </button>
          </p>
        </div>
      ) : (
        <p>
          <button ref={leaveRef} type="button" className="enrol__leave" onClick={() => setConfirmingLeave(true)}>
            Leave this course
          </button>
        </p>
      )}
    </div>
  );
}

export default EnrolPanel;
