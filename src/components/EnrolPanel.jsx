import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../auth/authContext.js";
import { courseProgress } from "../progress/progress.js";
import { useProgress } from "../progress/progressContext.js";
import "./EnrolPanel.css";

// The main buttons on a course page. They depend on who's looking:
//   signed out    -> "Sign in to start" (and come back here after)
//   not enrolled  -> "Enrol for free"
//   enrolled      -> progress so far, and "Continue: <lesson>"
function EnrolPanel({ course }) {
  const { user } = useAuth();
  const { progress, enrol } = useProgress();
  const location = useLocation();
  // Set when you press Enrol, so the confirmation is only announced then,
  // not every time an enrolled student opens the page
  const [justEnrolled, setJustEnrolled] = useState(false);

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
            type="button"
            className="button button--primary"
            onClick={() => {
              enrol(course.id);
              setJustEnrolled(true);
            }}
          >
            Enrol for free
          </button>
          <a href="#curriculum" className="button button--secondary">
            See the lessons
          </a>
        </p>
        <p className="enrol__note">Learn at your own pace. Your progress is saved as you go.</p>
      </div>
    );
  }

  return (
    <div className="enrol">
      {/* role="status": read out when it appears after pressing Enrol */}
      <p className="enrol__status" role="status">
        <span className="tag tag--primary">{justEnrolled ? "You're enrolled!" : "Enrolled"}</span>
        <span>
          {status.completedCount} of {status.total} lessons done
        </span>
      </p>
      <p className="enrol__actions">
        <Link to={lessonUrl(status.lastLesson)} className="button button--primary">
          {status.hasStarted ? `Continue: ${status.lastLesson.title}` : "Start the course"}
        </Link>
        <a href="#curriculum" className="button button--secondary">
          See the lessons
        </a>
      </p>
    </div>
  );
}

export default EnrolPanel;
