import { getCourses } from "../data/catalog.js";

// "/courses". Just the titles for now: the real catalogue comes in Step 8.
function CoursesPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">All courses</h1>
        <p className="page-lead">The full catalogue, with photos and filters, arrives in Steps 8 and 9.</p>
      </div>
      <ul>
        {getCourses().map((course) => (
          <li key={course.id}>{course.title}</li>
        ))}
      </ul>
    </>
  );
}

export default CoursesPage;
