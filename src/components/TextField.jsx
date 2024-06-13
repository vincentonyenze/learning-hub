import { useId } from "react";
import "./TextField.css";

// A labelled text box with an optional hint and error, wired up so screen
// readers read all three together: "Email address, edit text, invalid,
// We'll only use it to ..., Enter an email address like ...".
//
// Everything else (type, value, onChange, autoComplete, ref...) is passed
// straight through to the <input> with ...inputProps.
// multiline: a <textarea> instead, for longer text
// after: extra content under the box (e.g. a character count)
function TextField({ label, hint, error, multiline = false, after, ...inputProps }) {
  const Control = multiline ? "textarea" : "input";
  // useId: a unique id per field, so labels and messages connect even if
  // the same form appears twice on a page
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  // Read in this order: the hint, then the error
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={error ? "field field--error" : "field"}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
      <Control
        id={id}
        className="field__input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {after}
    </div>
  );
}

export default TextField;
