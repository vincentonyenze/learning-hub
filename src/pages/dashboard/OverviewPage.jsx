import { Link } from "react-router";
import EmptyState from "../../components/EmptyState.jsx";
import { getCourse } from "../../data/catalog.js";
import { COVER_SIZE, courseCover } from "../../data/media.js";
import { courseProgress } from "../../progress/progress.js";
import { useProgress } from "../../progress/progressContext.js";
import "./OverviewPage.css";

// "/dashboard": your learning at a glance
function OverviewPage() {
  const { progress } = useProgress();

  // Everything here is DERIVED from the progress state: nothing extra is
  // stored, so it can never be out of date
  const enrolled = Object.entries(progress)
    .map(([courseId, entry]) => ({ course: getCourse(courseId), entry }))
    .filter(({ course }) => course) // ignore anything left from a removed course
    .map(({ course, entry }) => ({ course, entry, status: courseProgress(progress, course) }));

  const lessonsDone = enrolled.reduce((total, item) => total + item.status.completedCount, 0);
  const coursesFinished = enrolled.filter((item) => item.status.isFinished).length;

  // The course you touched most recently, if it isn't finished
  const latest = enrolled
    .filter((item) => !item.status.isFinished)
    .toSorted((a, b) => b.entry.lastVisitedAt - a.entry.lastVisitedAt)[0];

  return (
    <>
      <h1 className="dashboard__title">Overview</h1>

      {enrolled.length === 0 ? (
        <EmptyState
          icon="🎒"
          title="You haven't started a course yet"
          actions={
            <Link to="/courses" className="button button--primary">
              Browse courses
            </Link>
          }
        >
          <p>Enrol in any course and it'll appear here, with your progress.</p>
        </EmptyState>
      ) : (
        <>
          <dl className="stats">
            <div className="stats__item card">
              <dt>Courses enrolled</dt>
              <dd>{enrolled.length}</dd>
            </div>
            <div className="stats__item card">
              <dt>Lessons completed</dt>
              <dd>{lessonsDone}</dd>
            </div>
            <div className="stats__item card">
              <dt>Courses finished</dt>
              <dd>{coursesFinished}</dd>
            </div>
          </dl>

          {latest && (
            <section className="continue card" aria-labelledby="continue-title">
              <img className="continue__cover" src={courseCover(latest.course.id)} alt="" {...COVER_SIZE} />
              <div className="continue__body">
                <h2 id="continue-title" className="continue__label">
                  Continue where you left off
                </h2>
                <p className="continue__course">{latest.course.title}</p>
                <p className="continue__meta">
                  Next up: {latest.status.lastLesson.title} · {latest.status.completedCount} of{" "}
                  {latest.status.total} lessons done
                </p>
                <p>
                  <Link
                    to={`/courses/${latest.course.id}/lessons/${latest.status.lastLesson.id}`}
                    className="button button--primary"
                  >
                    Continue learning
                  </Link>
                </p>
              </div>
            </section>
          )}

          <p className="overview__more">
            <Link to="/dashboard/courses">See all your courses</Link>
          </p>
        </>
      )}
    </>
  );
}

export default OverviewPage;
