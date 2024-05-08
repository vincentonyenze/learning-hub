import { Link, useLocation } from "react-router";

// Any address that no route matches: a mistyped link, or an old bookmark.
// It still sits inside the root layout, so the header is there to help.
function NotFoundPage() {
  // The address that didn't match, to show back to the person
  const { pathname } = useLocation();

  return (
    <div className="page-header">
      <p className="tag tag--accent">404</p>
      <h1 className="page-title" style={{ marginTop: "0.75rem" }}>
        Page not found
      </h1>
      <p className="page-lead">
        There's nothing at <code>{pathname}</code>. The link may be mistyped, or the page may have moved.
      </p>
      <p style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.25rem" }}>
        <Link to="/" className="button button--primary">
          Go to the home page
        </Link>
        <Link to="/courses" className="button button--secondary">
          Browse courses
        </Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
