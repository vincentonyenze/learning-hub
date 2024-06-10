import { Link } from "react-router";
import CourseCard from "../../components/CourseCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { getCourse } from "../../data/catalog.js";
import { courseProgress } from "../../progress/progress.js";
import { useProgress } from "../../progress/progressContext.js";

// "/dashboard/courses": every course you're enrolled in, most recently
// used first. The same CourseCard as the catalogue, with a FOOTER (the
// slot it was built with in Step 7) showing your progress.
function MyCoursesPage() {
  const { progress } = useProgress();

  const enrolled = Object.entries(progress)
    .map(([courseId, entry]) => ({ course: getCourse(courseId), entry }))
    .filter(({ course }) => course)
    .toSorted((a, b) => b.entry.lastVisitedAt - a.entry.lastVisitedAt);

  return (
    <>
      <h1 className="dashboard__title">My courses</h1>

      {enrolled.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No courses yet"
          actions={
            <Link to="/courses" className="button button--primary">
              Browse courses
            </Link>
          }
        >
          <p>Courses you enrol in will be listed here.</p>
        </EmptyState>
      ) : (
        <ul className="course-grid">
          {enrolled.map(({ course }) => {
            const status = courseProgress(progress, course);
            return (
              <li key={course.id}>
                <CourseCard
                  course={course}
                  headingLevel={2}
                  footer={
                    <p className="my-course__status">
                      <span>
                        {status.completedCount} of {status.total} lessons done
                      </span>
                      <Link to={`/courses/${course.id}/lessons/${status.lastLesson.id}`}>
                        {status.hasStarted ? "Continue" : "Start"}
                        <span className="visually-hidden"> {course.title}</span>
                      </Link>
                    </p>
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default MyCoursesPage;
