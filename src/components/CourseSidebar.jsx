import { getLessons } from "../data/catalog.js";
import LessonRow from "./LessonRow.jsx";
import "./CourseSidebar.css";

const NONE = new Set();

// Every lesson in a course, grouped by module, with the one you're on
// marked. Reuses LessonRow from the curriculum (Step 11), which was built
// with isCurrent for exactly this.
//
// The module names are labels, not headings: the sidebar comes before the
// lesson on the page, and headings here would come before the lesson's
// own h1 in a screen reader's list of headings.
// completed: a Set of finished lesson ids
function CourseSidebar({ course, currentLessonId, completed = NONE }) {
  const lessonNumber = new Map(getLessons(course).map((lesson, index) => [lesson.id, index + 1]));

  return (
    <nav className="course-sidebar" aria-label="Lessons">
      {course.modules.map((module, index) => (
        <section key={module.id} className="course-sidebar__module" aria-labelledby={`module-${module.id}`}>
          <p id={`module-${module.id}`} className="course-sidebar__module-title">
            <span>Module {index + 1}</span> {module.title}
          </p>
          <ol className="course-sidebar__lessons">
            {module.lessons.map((lesson) => (
              <li key={lesson.id}>
                <LessonRow
                  courseId={course.id}
                  lesson={lesson}
                  number={lessonNumber.get(lesson.id)}
                  isCurrent={lesson.id === currentLessonId}
                  isDone={completed.has(lesson.id)}
                />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </nav>
  );
}

export default CourseSidebar;
