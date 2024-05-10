import { Link } from "react-router";
import { courseMinutes, formatDuration, formatNumber, getInstructor, getLessons } from "../data/catalog.js";
import { COVER_SIZE, courseCover, instructorPhoto, PORTRAIT_SIZE } from "../data/media.js";
import "./CourseCard.css";

// One course as a card: cover, category, title, instructor, length, rating.
//
// Reusable: the home page, the catalogue and the dashboard all show courses
// with this same card. It gets just a course, and works out the rest.
//
// headingLevel: which heading the title should be (h2 under a page title,
//   h3 under a section heading), so every page keeps a proper outline.
// footer: optional extra content at the bottom, e.g. a progress bar on the
//   dashboard (Step 17). A "slot": the card doesn't need to know what it is.
function CourseCard({ course, headingLevel = 3, footer }) {
  const Heading = `h${headingLevel}`; // a tag name in a variable: <Heading> is <h2> or <h3>
  const instructor = getInstructor(course.instructorId);
  const lessonCount = getLessons(course).length;

  return (
    <article className="course-card card">
      <img
        className="course-card__cover"
        src={courseCover(course.id)}
        // Decorative: the title right below says what the course is
        alt=""
        {...COVER_SIZE}
        loading="lazy"
      />

      <div className="course-card__body">
        <p className="course-card__tags">
          <span className="tag tag--primary">{course.category}</span>
          <span className="tag">{course.level}</span>
        </p>

        <Heading className="course-card__title">
          {/* The title is THE link to the course. Its ::after stretches over
              the whole card (see the CSS), so the card is clickable
              everywhere, but there's one clear link for keyboards and
              screen readers. */}
          <Link to={`/courses/${course.id}`} className="course-card__link">
            {course.title}
          </Link>
        </Heading>

        <p className="course-card__subtitle">{course.subtitle}</p>

        <p className="course-card__instructor">
          <img src={instructorPhoto(instructor.id)} alt="" {...PORTRAIT_SIZE} />
          {instructor.name}
        </p>

        <p className="course-card__meta">
          <span>
            {lessonCount} lessons · {formatDuration(courseMinutes(course))}
          </span>
          <span>
            <span aria-hidden="true" className="course-card__star">
              ★
            </span>
            <span className="visually-hidden">Rated</span> {course.rating}{" "}
            <span className="course-card__count">({formatNumber(course.ratingCount)})</span>
          </span>
        </p>

        {footer && <div className="course-card__footer">{footer}</div>}
      </div>
    </article>
  );
}

export default CourseCard;
