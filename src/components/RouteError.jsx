import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import PageTitle from "./PageTitle.jsx";
import "./RouteError.css";

// What you see when a page crashes, instead of a blank white screen.
//
// An ERROR BOUNDARY: when anything inside a route throws while rendering
// (a bug, bad data), React Router stops showing that route and shows its
// nearest ErrorBoundary instead. useRouteError() says what went wrong.
//
// Two versions, for the two places they're used (router.jsx):
//   PageError: inside the layout, so the header still works
//   AppError:  the last resort, if the layout itself breaks

function ErrorMessage() {
  const error = useRouteError();

  // Errors thrown ON PURPOSE as responses (like a 404) carry a status
  const isResponse = isRouteErrorResponse(error);
  const title = isResponse && error.status === 404 ? "Page not found" : "Something went wrong";

  return (
    <div className="route-error" role="alert">
      <PageTitle title={title} />
      <span className="route-error__icon" aria-hidden="true">
        {isResponse ? error.status : "⚠"}
      </span>
      <h1 className="route-error__title">{title}</h1>
      <p className="route-error__text">
        {isResponse
          ? "This page couldn't be shown."
          : "Sorry, this page ran into a problem. Your progress is safe: it's saved separately."}{" "}
        Try again, or head back to somewhere that works.
      </p>
      <p className="route-error__actions">
        {/* A full reload: the simplest way to start this page afresh */}
        <button type="button" className="button button--primary" onClick={() => window.location.reload()}>
          Try again
        </button>
        {/* reloadDocument: a real page load, in case the app is in a bad state */}
        <Link to="/" reloadDocument className="button button--secondary">
          Go to the home page
        </Link>
      </p>

      {/* The technical details, only while developing (import.meta.env.DEV
          is false in the real, built site). Visitors don't need a stack
          trace; you do. */}
      {import.meta.env.DEV && error instanceof Error && (
        <details className="route-error__details">
          <summary>Error details (development only)</summary>
          <pre>{error.stack ?? error.message}</pre>
        </details>
      )}
    </div>
  );
}

// Inside RootLayout's <Outlet>: header and footer stay
export function PageError() {
  return <ErrorMessage />;
}

// The whole app failed (even the layout): a minimal page of its own
export function AppError() {
  return (
    <main id="main" className="main container">
      <p className="route-error__brand">Learning Hub</p>
      <ErrorMessage />
    </main>
  );
}
