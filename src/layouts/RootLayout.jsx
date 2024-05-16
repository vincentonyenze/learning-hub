import { Outlet, ScrollRestoration } from "react-router";
import SiteHeader from "../components/SiteHeader.jsx";

// The frame around EVERY page: skip link, header, footer. Only the part in
// <main> changes as you move around the site.
//
// <Outlet /> is where the router puts the current page. On "/" that's the
// home page, on "/courses" the course list, and so on. The layout itself
// stays on screen, so the header doesn't flicker or lose its state.
function RootLayout() {
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
        <Outlet />
      </main>

      {/* A normal website starts each new page at the top; a single-page
          app doesn't, because the browser never loads a new page. This
          scrolls to the top on every new page, and back to where you were
          when you press Back.
          It remembers positions by location.key, but every page you open
          directly (typed, bookmarked, refreshed) gets the same key,
          "default", so two such pages would share one position. Adding the
          path keeps them apart. */}
      <ScrollRestoration getKey={(location) => `${location.key}:${location.pathname}`} />

      <footer className="footer">
        <div className="container">
          Learning Hub. A practice project: courses and progress are stored in your browser.
        </div>
      </footer>
    </div>
  );
}

export default RootLayout;
