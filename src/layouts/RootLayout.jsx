import { Outlet } from "react-router";
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

      <footer className="footer">
        <div className="container">
          Learning Hub. A practice project: courses and progress are stored in your browser.
        </div>
      </footer>
    </div>
  );
}

export default RootLayout;
