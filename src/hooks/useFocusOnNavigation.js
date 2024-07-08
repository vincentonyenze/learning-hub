import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

// After moving to another page, put keyboard focus on the new page's main
// heading.
//
// Why: a normal website reloads, and screen readers announce the new page.
// A single-page app just swaps content, so:
//   - screen readers say nothing: did the link even work?
//   - focus stays on the link you pressed, which may have disappeared,
//     dropping focus back to the top of the page
// Focusing the <h1> fixes both: it's read out ("Settings, heading level
// 1"), and the next Tab continues from the top of the new page's content.
//
// Only when the PATH changes. Filtering the catalogue changes the address
// too (?category=Design), but that's the same page: stealing focus from
// the filters would be awful.
export function useFocusOnNavigation() {
  const { pathname } = useLocation();
  // The path we last handled. Starting with the current one means the very
  // first page load is left alone (the browser handles that), and
  // StrictMode's double run in development changes nothing.
  const handledPath = useRef(pathname);

  useEffect(() => {
    if (handledPath.current === pathname) return;
    handledPath.current = pathname;

    // Effects run after the new page is on screen, so its h1 exists
    const target = document.querySelector("main h1") ?? document.querySelector("main");
    if (!target) return;
    // tabindex -1: focusable by code, but not added to the Tab order
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    // preventScroll: ScrollRestoration decides the scroll position
    target.focus({ preventScroll: true });
  }, [pathname]);
}
