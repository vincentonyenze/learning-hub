import { useOutletContext, useParams } from "react-router";
import { findLesson } from "../data/catalog.js";

// "/courses/:courseId/lessons/:lessonId": one lesson, inside LearnLayout.
// A simple version: Step 13 adds the lesson's content, previous/next,
// and "lesson not found".
function LessonPage() {
  // The course comes from the parent layout's <Outlet context>, already
  // looked up: no need to find it again here
  const { course } = useOutletContext();
  const { lessonId } = useParams();
  const found = findLesson(course, lessonId);

  return (
    <article>
      <p className="tag tag--primary">{found ? found.lesson.moduleTitle : "Lesson"}</p>
      <h1 className="page-title" style={{ marginTop: "0.75rem" }}>
        {found ? found.lesson.title : "Lesson not found"}
      </h1>
      <p className="page-lead">The lesson itself arrives in Step 13.</p>
    </article>
  );
}

export default LessonPage;
