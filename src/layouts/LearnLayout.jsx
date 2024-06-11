import { useState } from "react";
import { Link, Outlet, useParams } from "react-router";
import CourseSidebar from "../components/CourseSidebar.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getCourse, getLessons } from "../data/catalog.js";
import { courseProgress } from "../progress/progress.js";
import { useProgress } from "../progress/progressContext.js";
import "./LearnLayout.css";

// The frame around every lesson of a course: the lesson list beside the
// lesson itself. A layout NESTED inside RootLayout:
//
//   RootLayout (header, footer)
//   └─ <Outlet> → LearnLayout (this: lesson list)
//                 └─ <Outlet> → LessonPage (one lesson)
//
// Moving from lesson to lesson only swaps the inner <Outlet>: this layout
// and the sidebar stay put.
function LearnLayout() {
  // Child routes see their parents' parameters too: on
  // /courses/react-from-scratch/lessons/use-state this gives BOTH
  // { courseId: "react-from-scratch", lessonId: "use-state" }
  const { courseId, lessonId } = useParams();
  const course = getCourse(courseId);
  const { progress } = useProgress();

  // Phones only: is the lesson list showing? Labelled with the lesson it
  // was opened on (like the header menu, Step 6), so choosing a lesson
  // closes it without any code to reset it.
  const [openedOn, setOpenedOn] = useState(null);
  const listOpen = openedOn === lessonId;

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
          We couldn't find a course called <code>{courseId}</code>.
        </p>
      </EmptyState>
    );
  }

  const status = courseProgress(progress, course);

  return (
    <div className="learn">
      <aside className="learn__sidebar" aria-labelledby="learn-course-title">
        <p className="learn__eyebrow">Course</p>
        <p id="learn-course-title" className="learn__course-title">
          <Link to={`/courses/${course.id}`}>{course.title}</Link>
        </p>
        <div className="learn__progress">
          <ProgressBar
            done={status.completedCount}
            total={getLessons(course).length}
            label={`${course.title} progress`}
            size="small"
          />
        </div>

        {/* Only shown on narrow screens (see the CSS), where the lesson
            list folds away so the lesson itself comes first */}
        <button
          type="button"
          className="button button--secondary learn__toggle"
          aria-expanded={listOpen}
          aria-controls="lesson-list"
          onClick={() => setOpenedOn(listOpen ? null : lessonId)}
        >
          {listOpen ? "Hide lessons" : "Show all lessons"}
        </button>

        {/* ONE list for every screen size: wide screens always show it,
            narrow ones only when it's open (data-open, in the CSS) */}
        <div id="lesson-list" className="learn__list" data-open={listOpen}>
          <CourseSidebar course={course} currentLessonId={lessonId} completed={status.completed} />
        </div>
      </aside>

      <div className="learn__content">
        {/* The lesson goes here. `context` hands the course down to it, so
            the lesson page doesn't have to look it up again. */}
        <Outlet context={{ course }} />
      </div>
    </div>
  );
}

export default LearnLayout;
