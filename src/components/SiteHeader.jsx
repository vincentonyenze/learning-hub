import { Link } from "react-router";
import "./SiteHeader.css";

// The bar across the top of every page. Router links: clicking one changes
// the page without reloading. (Step 6 marks the current page.)
function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand">
          <img className="site-header__logo" src="/favicon.svg" alt="" width="32" height="32" />
          Learning Hub
        </Link>

        <nav className="site-header__nav" aria-label="Main">
          <ul className="site-header__links">
            <li>
              <Link to="/courses" className="site-header__link">
                Courses
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="site-header__link">
                My learning
              </Link>
            </li>
          </ul>
        </nav>

        <Link to="/sign-in" className="button button--primary">
          Sign in
        </Link>
      </div>
    </header>
  );
}

export default SiteHeader;
