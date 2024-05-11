import { Link, useLocation } from "react-router";
import EmptyState from "../components/EmptyState.jsx";

// Any address that no route matches: a mistyped link, or an old bookmark.
// It still sits inside the root layout, so the header is there to help.
function NotFoundPage() {
  // The address that didn't match, to show back to the person
  const { pathname } = useLocation();

  return (
    <EmptyState
      icon="404"
      title="Page not found"
      // It IS the page, so its title is the page's h1
      headingLevel={1}
      actions={
        <>
          <Link to="/" className="button button--primary">
            Go to the home page
          </Link>
          <Link to="/courses" className="button button--secondary">
            Browse courses
          </Link>
        </>
      }
    >
      <p>
        There's nothing at <code>{pathname}</code>. The link may be mistyped, or the page may have moved.
      </p>
    </EmptyState>
  );
}

export default NotFoundPage;
