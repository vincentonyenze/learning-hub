import "./ProgressBar.css";

// "2 of 6 lessons done" as a bar, readable by everyone:
//   - role="progressbar" with aria-value*: screen readers announce it as a
//     progress bar at a percentage
//   - aria-valuetext gives the words: "2 of 6 lessons done", not just "33"
//   - the same words are visible next to it: never just a coloured bar
//
// label: what it's the progress OF ("React from Scratch progress")
function ProgressBar({ done, total, label, size = "medium" }) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const text = `${done} of ${total} lessons done`;

  return (
    <div className={`progress progress--${size}`}>
      <div
        className="progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-valuetext={`${text} (${percent}%)`}
      >
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
      {/* Already spoken by aria-valuetext, so hidden from screen readers
          here to avoid hearing it twice */}
      <p className="progress__text" aria-hidden="true">
        <span>{text}</span>
        <span className="progress__percent">{percent}%</span>
      </p>
    </div>
  );
}

export default ProgressBar;
