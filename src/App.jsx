import SiteHeader from "./components/SiteHeader.jsx";

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
          <p className="page-lead">
            A temporary page to check the design: colours, type and buttons, in light and dark mode.
          </p>
        </div>

        <div className="card" style={{ padding: "1.5rem", display: "grid", gap: "1rem", maxWidth: "36rem" }}>
          <p>
            <span className="tag tag--primary">Beginner</span> <span className="tag tag--accent">New</span>{" "}
            <span className="tag">6 hours</span>
          </p>
          <p>
            Cards, tags and buttons will be reused all over the site, so they're shared styles in{" "}
            <code>index.css</code>.
          </p>
          <p style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button type="button" className="button button--primary">
              Primary
            </button>
            <button type="button" className="button button--secondary">
              Secondary
            </button>
            <button type="button" className="button button--ghost">
              Ghost
            </button>
          </p>
        </div>
      </main>

      <footer className="footer">
        <div className="container">Learning Hub. A practice project: courses and progress are stored in your browser.</div>
      </footer>
    </div>
  );
}

export default App;
