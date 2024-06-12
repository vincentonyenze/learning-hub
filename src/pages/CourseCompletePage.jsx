import { Link, useParams } from "react-router";
import { useAuth } from "../auth/authContext.js";
import CourseCard from "../components/CourseCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import { courseMinutes, formatDuration, getCourse, getCourses, getInstructor } from "../data/catalog.js";
import { courseProgress } from "../progress/progress.js";
import { useProgress } from "../progress/progressContext.js";
import "./CourseCompletePage.css";

// "/courses/:courseId/complete": the 100% moment, with a certificate
function CourseCompletePage() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const { user } = useAuth();
  const { progress } = useProgress();

  if (!course) {
    return (
      <EmptyState
        icon="📚"
        title="Course not found"
        headingLevel={1}
        actions={
          <Link to="/courses" className="button button--primary">
            Browse all courses
          </Link>
        }
      />
    );
  }

  const status = courseProgress(progress, course);

  // Someone typed the address, or unticked a lesson: be honest about it
  if (!status.isFinished) {
    return (
      <EmptyState
        icon="🏁"
        title="Not finished yet"
        headingLevel={1}
        actions={
          <Link
            to={`/courses/${course.id}/lessons/${(status.nextUnfinished ?? status.lastLesson).id}`}
            className="button button--primary"
          >
            {status.enrolled ? "Keep going" : "Start the course"}
          </Link>
        }
      >
        <p>
          Finish every lesson of <cite>{course.title}</cite> to get your certificate.
        </p>
        <div className="complete__progress">
          <ProgressBar done={status.completedCount} total={status.total} label={`${course.title} progress`} />
        </div>
      </EmptyState>
    );
  }

  const instructor = getInstructor(course.instructorId);
  const finishedOn = new Date(status.completedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Ideas for what's next: courses you haven't started, same subject first
  const nextCourses = getCourses()
    .filter((other) => other.id !== course.id && !progress[other.id])
    .toSorted((a, b) => Number(b.category === course.category) - Number(a.category === course.category) || b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="complete">
      <div className="complete__intro">
        <span className="complete__icon" aria-hidden="true">
          🎉
        </span>
        <h1 className="page-title">Congratulations, {user.name.split(" ")[0]}!</h1>
        <p className="page-lead">
          You finished all {status.total} lessons of <cite>{course.title}</cite>.
        </p>
      </div>

      {/* A certificate. "print-area": when printing, only this shows (see
          the print styles in index.css) */}
      <section className="certificate print-area" aria-labelledby="certificate-title">
        <p className="certificate__brand">Learning Hub</p>
        <h2 id="certificate-title" className="certificate__title">
          Certificate of completion
        </h2>
        <p className="certificate__text">This certifies that</p>
        <p className="certificate__name">{user.name}</p>
        <p className="certificate__text">has completed the course</p>
        <p className="certificate__course">{course.title}</p>
        <dl className="certificate__details">
          <div>
            <dt>Completed</dt>
            <dd>{finishedOn}</dd>
          </div>
          <div>
            <dt>Length</dt>
            <dd>
              {status.total} lessons · {formatDuration(courseMinutes(course))}
            </dd>
          </div>
          <div>
            <dt>Instructor</dt>
            <dd>{instructor.name}</dd>
          </div>
        </dl>
        <p className="certificate__note">A practice certificate from a learning project. Not an official qualification.</p>
      </section>

      <p className="complete__actions">
        {/* Opens the browser's print dialog (or "Save as PDF") */}
        <button type="button" className="button button--primary" onClick={() => window.print()}>
          Print or save as PDF
        </button>
        <Link to="/dashboard" className="button button--secondary">
          Back to my learning
        </Link>
      </p>

      {nextCourses.length > 0 && (
        <section className="complete__next" aria-labelledby="next-title">
          <h2 id="next-title" className="complete__next-title">
            What to learn next
          </h2>
          <ul className="course-grid">
            {nextCourses.map((other) => (
              <li key={other.id}>
                <CourseCard course={other} headingLevel={3} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default CourseCompletePage;
