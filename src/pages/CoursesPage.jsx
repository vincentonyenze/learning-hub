import { Link } from "react-router";
import CourseCard from "../components/CourseCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { courseMinutes, formatDuration, getCourses, getLessons } from "../data/catalog.js";
import "./CoursesPage.css";

// "/courses": the whole catalogue.
//
// Laid out as a sidebar (filters, from Step 9) beside the results. For now
// the sidebar sums up what's on offer.
function CoursesPage() {
  const courses = getCourses();

  const totalLessons = courses.reduce((total, course) => total + getLessons(course).length, 0);
  const totalMinutes = courses.reduce((total, course) => total + courseMinutes(course), 0);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">All courses</h1>
        <p className="page-lead">
          Practical courses taught by people who do this work every day. Start any of them for free.
        </p>
      </div>

      <div className="catalogue">
        <aside className="catalogue__sidebar card" aria-label="Catalogue summary">
          <dl className="catalogue__stats">
            <div>
              <dt>Courses</dt>
              <dd>{courses.length}</dd>
            </div>
            <div>
              <dt>Lessons</dt>
              <dd>{totalLessons}</dd>
            </div>
            <div>
              <dt>Hours of learning</dt>
              <dd>{formatDuration(totalMinutes)}</dd>
            </div>
          </dl>
        </aside>

        <section className="catalogue__results" aria-labelledby="results-title">
          <div className="catalogue__bar">
            {/* A heading screen reader users can jump to, read as "6 courses" */}
            <h2 id="results-title" className="catalogue__count">
              {courses.length} {courses.length === 1 ? "course" : "courses"}
            </h2>
          </div>

          {courses.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No courses yet"
              actions={
                <Link to="/" className="button button--secondary">
                  Back to the home page
                </Link>
              }
            >
              <p>New courses are on the way. Check back soon.</p>
            </EmptyState>
          ) : (
            <ul className="course-grid">
              {courses.map((course) => (
                <li key={course.id}>
                  {/* h3: under the "6 courses" h2 */}
                  <CourseCard course={course} headingLevel={3} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default CoursesPage;
