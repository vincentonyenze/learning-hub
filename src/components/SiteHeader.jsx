import { useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import "./SiteHeader.css";

const LINKS = [
  { to: "/courses", label: "Courses" },
  { to: "/dashboard", label: "My learning" },
];

// The bar across the top of every page.
//
// Wide screens: links and Sign in are always visible.
// Narrow screens: they fold into a panel behind a Menu button.
function SiteHeader() {
  const location = useLocation();
  const toggleRef = useRef(null);

  // Which page the menu was opened on, or null when it's closed. The menu
  // counts as open only while you're still on THAT page: follow a link and
  // location.key changes, so it's closed, with nothing to reset by hand.
  // (The same "label it, then compare" idea as P16's useFetch.)
  const [openedOn, setOpenedOn] = useState(null);
  const isOpen = openedOn === location.key;

  function toggleMenu() {
    setOpenedOn(isOpen ? null : location.key);
  }

  // Escape closes the menu and puts focus back on the button, so keyboard
  // users don't lose their place
  function handleKeyDown(event) {
    if (event.key === "Escape" && isOpen) {
      setOpenedOn(null);
      toggleRef.current.focus();
    }
  }

  return (
    <header className="site-header" onKeyDown={handleKeyDown}>
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand">
          <img className="site-header__logo" src="/favicon.svg" alt="" width="32" height="32" />
          Learning Hub
        </Link>

        {/* Only shown on narrow screens (see the CSS). aria-expanded tells
            screen readers whether the menu it controls is open. */}
        <button
          ref={toggleRef}
          type="button"
          className="site-header__toggle"
          aria-expanded={isOpen}
          aria-controls="site-menu"
          onClick={toggleMenu}
        >
          <span aria-hidden="true">{isOpen ? "✕" : "☰"}</span>
          Menu
        </button>

        <div id="site-menu" className="site-header__menu" data-open={isOpen}>
          <nav className="site-header__nav" aria-label="Main">
            <ul className="site-header__links">
              {LINKS.map((link) => (
                <li key={link.to}>
                  {/* NavLink: a Link that knows when it's the current page.
                      It then adds aria-current="page" (screen readers say
                      "current page") and an "active" class. It also counts
                      pages BELOW it: /courses/react-from-scratch keeps
                      "Courses" marked. */}
                  <NavLink to={link.to} className="site-header__link">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Link to="/sign-in" className="button button--primary site-header__sign-in">
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
