import "./SiteHeader.css";

// The bar across the top of every page. Plain links for now: Step 5 turns
// them into router links, and Step 6 marks the current page.
function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="/" className="site-header__brand">
          <img className="site-header__logo" src="/favicon.svg" alt="" width="32" height="32" />
          Learning Hub
        </a>

        <nav className="site-header__nav" aria-label="Main">
          <ul className="site-header__links">
            <li>
              <a href="/courses" className="site-header__link">
                Courses
              </a>
            </li>
            <li>
              <a href="/dashboard" className="site-header__link">
                My learning
              </a>
            </li>
          </ul>
        </nav>

        <a href="/sign-in" className="button button--primary">
          Sign in
        </a>
      </div>
    </header>
  );
}

export default SiteHeader;
