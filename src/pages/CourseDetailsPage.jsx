import { Link, useParams } from "react-router";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import CourseCard from "../components/CourseCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import {
  courseMinutes,
  formatDuration,
  formatMonth,
  formatNumber,
  getCourse,
  getInstructor,
  getLessons,
  getRelatedCourses,
} from "../data/catalog.js";
import { COVER_SIZE, courseCover, instructorPhoto, PORTRAIT_SIZE } from "../data/media.js";
import "./CourseDetailsPage.css";

// "/courses/:courseId": one course in full.
//
// ONE route serves every course. ":courseId" in the route's path is a
// PARAMETER: whatever is in that part of the address. On
// /courses/react-from-scratch, useParams() gives { courseId: "react-from-scratch" }.
function CourseDetailsPage() {
  const { courseId } = useParams();
  const course = getCourse(courseId);

  // An old or mistyped link: the address matched the route's PATTERN, but
  // there's no such course. Say so clearly, and offer a way on.
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
      >
        <p>
          We couldn't find a course called <code>{courseId}</code>. It may have been renamed or removed.
        </p>
      </EmptyState>
    );
  }

  const instructor = getInstructor(course.instructorId);
  const lessons = getLessons(course);
  const exercises = lessons.filter((lesson) => lesson.type === "exercise").length;
  const related = getRelatedCourses(course);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Courses", to: "/courses" },
          { label: course.category, to: `/courses?${new URLSearchParams({ category: course.category })}` },
          { label: course.title },
        ]}
      />

      <section className="course-hero" aria-labelledby="course-title">
        <div className="course-hero__text">
          <p className="course-hero__tags">
            <span className="tag tag--primary">{course.category}</span>
            <span className="tag">{course.level}</span>
          </p>
          <h1 id="course-title" className="page-title">
            {course.title}
          </h1>
          <p className="page-lead">{course.subtitle}</p>

          <p className="course-hero__facts">
            <span>
              <span aria-hidden="true" className="course-hero__star">
                ★
              </span>{" "}
              <strong>{course.rating}</strong> ({formatNumber(course.ratingCount)} ratings)
            </span>
            <span>{formatNumber(course.students)} students</span>
            <span>Updated {formatMonth(course.updated)}</span>
          </p>

          <p className="course-hero__instructor">
            <img src={instructorPhoto(instructor.id)} alt="" {...PORTRAIT_SIZE} />
            <span>
              Taught by <a href="#instructor">{instructor.name}</a>
            </span>
          </p>

          <p className="course-hero__actions">
            {/* The lesson pages arrive in Steps 12 and 13 */}
            <Link to={`/courses/${course.id}/lessons/${lessons[0].id}`} className="button button--primary">
              Start the course
            </Link>
            <a href="#curriculum" className="button button--secondary">
              See the lessons
            </a>
          </p>
        </div>

        <img className="course-hero__cover" src={courseCover(course.id)} alt="" {...COVER_SIZE} />
      </section>

      <div className="course-body">
        <div className="course-body__main">
          <section className="course-section" aria-labelledby="about-title">
            <h2 id="about-title" className="course-section__title">
              About this course
            </h2>
            <p>{course.description}</p>
          </section>

          <section className="course-section card course-learn" aria-labelledby="learn-title">
            <h2 id="learn-title" className="course-section__title">
              What you'll learn
            </h2>
            <ul className="course-learn__list">
              {course.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </section>

          <section id="curriculum" className="course-section" aria-labelledby="curriculum-title">
            <h2 id="curriculum-title" className="course-section__title">
              Curriculum
            </h2>
            {/* A plain outline for now: Step 11 turns it into sections you
                can open and close */}
            <ol className="curriculum-outline">
              {course.modules.map((module) => (
                <li key={module.id}>
                  <h3>{module.title}</h3>
                  <ol>
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        {lesson.title} <span className="curriculum-outline__time">{lesson.minutes} min</span>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          </section>

          <section id="instructor" className="course-section" aria-labelledby="instructor-title">
            <h2 id="instructor-title" className="course-section__title">
              Your instructor
            </h2>
            <div className="instructor card">
              <img className="instructor__photo" src={instructorPhoto(instructor.id)} alt="" {...PORTRAIT_SIZE} />
              <div>
                <p className="instructor__name">{instructor.name}</p>
                <p className="instructor__role">{instructor.title}</p>
                <p>{instructor.bio}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Course facts at a glance, beside the main text on wide screens */}
        <aside className="course-body__aside card" aria-labelledby="includes-title">
          <h2 id="includes-title" className="course-section__title">
            This course includes
          </h2>
          <dl className="course-includes">
            <div>
              <dt>Length</dt>
              <dd>{formatDuration(courseMinutes(course))}</dd>
            </div>
            <div>
              <dt>Modules</dt>
              <dd>{course.modules.length}</dd>
            </div>
            <div>
              <dt>Lessons</dt>
              <dd>{lessons.length}</dd>
            </div>
            <div>
              <dt>Hands-on exercises</dt>
              <dd>{exercises}</dd>
            </div>
            <div>
              <dt>Level</dt>
              <dd>{course.level}</dd>
            </div>
          </dl>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="course-section course-related" aria-labelledby="related-title">
          <h2 id="related-title" className="course-section__title">
            More in {course.category}
          </h2>
          <ul className="course-grid">
            {related.map((other) => (
              <li key={other.id}>
                <CourseCard course={other} headingLevel={3} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export default CourseDetailsPage;
