import { Link } from "react-router";

// "/". A simple version for now: the full home page comes in Step 7.
function HomePage() {
  return (
    <div className="page-header">
      <h1 className="page-title">Learn something new today</h1>
      <p className="page-lead">
        Short, practical courses in web development, design and data, with progress saved as you go.
      </p>
      <p style={{ marginTop: "1.25rem" }}>
        {/* <Link> instead of <a>: the router swaps the page without asking
            the server for a new one, so it's instant and nothing reloads */}
        <Link to="/courses" className="button button--primary">
          Browse courses
        </Link>
      </p>
    </div>
  );
}

export default HomePage;
