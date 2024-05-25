import "./Disclosure.css";

// A section you can open and close, built on the browser's own
// <details> and <summary> elements. They come with keyboard support
// (Enter/Space), and screen readers announce them as "expanded" or
// "collapsed", with no ARIA to get wrong.
//
// Generic on purpose: it knows nothing about courses. The page decides
// what goes in the summary (always visible) and the children (the
// content that opens).
//
// open / onToggle(isOpen): controlled, so a parent can open or close
// several at once ("Expand all").
function Disclosure({ summary, open, onToggle, children }) {
  return (
    <details
      className="disclosure"
      open={open}
      // The browser opens or closes <details> by itself when you click its
      // summary. onToggle fires afterwards: report the NEW state up, so the
      // parent's state stays in step with what's on screen.
      onToggle={(event) => {
        if (event.currentTarget.open !== open) onToggle(event.currentTarget.open);
      }}
    >
      <summary className="disclosure__summary">
        {summary}
        <span className="disclosure__icon" aria-hidden="true" />
      </summary>
      <div className="disclosure__content">{children}</div>
    </details>
  );
}

export default Disclosure;
