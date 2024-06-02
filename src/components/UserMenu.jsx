import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/authContext.js";
import "./UserMenu.css";

// The signed-in person's name, opening a small menu: My learning, Sign out.
//
// A "disclosure" pattern: a button that shows and hides a group of links.
// (Not role="menu": that promises arrow-key behaviour like a desktop app's
// menu bar. A simple list of links and a button is easier for everyone.)
function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const panelId = useId();
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  // Opened on this page only: going anywhere closes it (header menu trick)
  const [openedOn, setOpenedOn] = useState(null);
  const isOpen = openedOn === location.key;

  // While it's open, a click or tap anywhere OUTSIDE closes it.
  // An effect, because it listens to the whole document (outside React);
  // and a cleanup, to stop listening when it closes.
  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event) {
      if (!wrapperRef.current.contains(event.target)) setOpenedOn(null);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  function handleKeyDown(event) {
    if (event.key === "Escape" && isOpen) {
      event.stopPropagation(); // don't also close the header's phone menu
      setOpenedOn(null);
      buttonRef.current.focus();
    }
  }

  function handleSignOut() {
    // ORDER MATTERS. Leave the page first (flushSync: right now, not as a
    // slow transition), THEN sign out. The other way round, the current
    // page re-draws signed-out first, and a protected page's RequireAuth
    // sends you to /sign-in before you ever reach "/".
    navigate("/", { flushSync: true });
    signOut();
  }

  return (
    <div ref={wrapperRef} className="user-menu" onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        className="user-menu__button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setOpenedOn(isOpen ? null : location.key)}
      >
        <span className="user-menu__avatar" aria-hidden="true">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span>
          <span className="visually-hidden">Account: </span>
          {user.name}
        </span>
        <span className="user-menu__chevron" aria-hidden="true" />
      </button>

      <div id={panelId} className="user-menu__panel" hidden={!isOpen}>
        <p className="user-menu__who">
          Signed in as
          <strong>{user.email}</strong>
        </p>
        <ul className="user-menu__items">
          <li>
            <Link to="/dashboard" className="user-menu__item">
              My learning
            </Link>
          </li>
          <li>
            <button type="button" className="user-menu__item" onClick={handleSignOut}>
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserMenu;
