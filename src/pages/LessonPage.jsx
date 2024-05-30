import { Link, Navigate, useOutletContext, useParams } from "react-router";
import EmptyState from "../components/EmptyState.jsx";
import { findLesson, getLessons } from "../data/catalog.js";
import "./LessonPage.css";

const TYPE_LABELS = { reading: "Reading", exercise: "Exercise" };

// "/courses/:courseId/lessons/:lessonId": one lesson, inside LearnLayout.
function LessonPage() {
  // The course comes from the parent layout's <Outlet context>, already
  // looked up: no need to find it again here
  const { course } = useOutletContext();
  const { lessonId } = useParams();
  const found = findLesson(course, lessonId);
  const lessons = getLessons(course);

  if (!found) {
    return (
      <EmptyState
        icon="📄"
        title="Lesson not found"
        headingLevel={1}
        actions={
          <>
            <Link to={`/courses/${course.id}/lessons/${lessons[0].id}`} className="button button--primary">
              Go to the first lesson
            </Link>
            <Link to={`/courses/${course.id}`} className="button button--secondary">
              Course overview
            </Link>
          </>
        }
      >
        <p>
          <cite>{course.title}</cite> doesn't have a lesson called <code>{lessonId}</code>.
        </p>
      </EmptyState>
    );
  }

  const { lesson, index, previous, next } = found;
  const lessonUrl = (other) => `/courses/${course.id}/lessons/${other.id}`;

  return (
    <article className="lesson">
      <header className="lesson__header">
        <p className="lesson__module">{lesson.moduleTitle}</p>
        <h1 className="page-title">{lesson.title}</h1>
        <p className="lesson__meta">
          <span>
            Lesson {index + 1} of {lessons.length}
          </span>
          <span className={`tag ${lesson.type === "exercise" ? "tag--accent" : "tag--primary"}`}>
            {TYPE_LABELS[lesson.type]}
          </span>
          <span>{lesson.minutes} min</span>
        </p>
      </header>

      {lesson.type === "exercise" ? (
        // An exercise reads as a task to do, so it gets its own box
        <section className="lesson__task" aria-labelledby="task-title">
          <h2 id="task-title" className="lesson__task-title">
            <span aria-hidden="true">✍️</span> Your task
          </h2>
          {lesson.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ) : (
        <div className="lesson__body">
          {lesson.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}

      <section className="lesson__takeaways card" aria-labelledby="takeaways-title">
        <h2 id="takeaways-title" className="lesson__takeaways-title">
          Key takeaways
        </h2>
        <ul>
          {lesson.takeaways.map((takeaway) => (
            <li key={takeaway}>{takeaway}</li>
          ))}
        </ul>
      </section>

      {/* Its own landmark, so it can be found by name. The direction is in
          the visible text ("Previous", "Next"), not just in an arrow. */}
      <nav className="lesson-nav" aria-label="Lesson">
        {previous ? (
          <Link to={lessonUrl(previous)} className="lesson-nav__link lesson-nav__link--previous">
            <span className="lesson-nav__direction">
              <span aria-hidden="true">← </span>Previous
            </span>
            <span className="lesson-nav__title">{previous.title}</span>
          </Link>
        ) : (
          <Link to={`/courses/${course.id}`} className="lesson-nav__link lesson-nav__link--previous">
            <span className="lesson-nav__direction">
              <span aria-hidden="true">← </span>Back to
            </span>
            <span className="lesson-nav__title">Course overview</span>
          </Link>
        )}

        {next ? (
          <Link to={lessonUrl(next)} className="lesson-nav__link lesson-nav__link--next">
            <span className="lesson-nav__direction">
              Next<span aria-hidden="true"> →</span>
            </span>
            <span className="lesson-nav__title">{next.title}</span>
          </Link>
        ) : (
          <Link to={`/courses/${course.id}`} className="lesson-nav__link lesson-nav__link--next">
            <span className="lesson-nav__direction">
              Last lesson<span aria-hidden="true"> ✓</span>
            </span>
            <span className="lesson-nav__title">Back to the course</span>
          </Link>
        )}
      </nav>
    </article>
  );
}

// "/courses/:courseId/lessons" on its own (no lesson named): go straight
// to the first lesson.
//   replace: the bare /lessons address is swapped out of history, so Back
//   doesn't bounce you into the redirect again.
export function FirstLessonRedirect() {
  const { course } = useOutletContext();
  return <Navigate to={getLessons(course)[0].id} replace />;
}

export default LessonPage;
