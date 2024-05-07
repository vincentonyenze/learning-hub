import SiteHeader from "./components/SiteHeader.jsx";
import { getCourses, getInstructor } from "./data/catalog.js";
import { COVER_SIZE, courseCover, heroImage, instructorPhoto, PORTRAIT_SIZE } from "./data/media.js";

// The frame every page will sit in. In Step 5 this becomes the router's
// root layout, and the <main> content becomes whichever page you're on.
function App() {
  return (
    <div className="app">
      {/* Keyboard and screen reader users can skip the header on every page */}
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <SiteHeader />

      {/* tabIndex="-1": the skip link (and, in Step 21, page changes) can
          move focus here, though it isn't something you'd Tab to */}
      <main id="main" className="main container" tabIndex="-1">
        <div className="page-header">
          <h1 className="page-title">Learn something new today</h1>
          <p className="page-lead">A temporary page to check the photos. The real pages start in Step 5.</p>
        </div>

        <img src={heroImage} alt="" width="1600" height="900" style={{ borderRadius: "var(--radius)", marginBottom: "1.5rem" }} />

        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))", gap: "1rem", padding: 0, listStyle: "none" }}>
          {getCourses().map((course) => {
            const instructor = getInstructor(course.instructorId);
            return (
              <li key={course.id} className="card" style={{ overflow: "hidden" }}>
                <img src={courseCover(course.id)} alt="" {...COVER_SIZE} />
                <div style={{ padding: "1rem", display: "grid", gap: "0.5rem" }}>
                  <strong>{course.title}</strong>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-muted)" }}>
                    <img
                      src={instructorPhoto(instructor.id)}
                      alt=""
                      {...PORTRAIT_SIZE}
                      style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
                    />
                    {instructor.name}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </main>

      <footer className="footer">
        <div className="container">Learning Hub. A practice project: courses and progress are stored in your browser.</div>
      </footer>
    </div>
  );
}

export default App;
