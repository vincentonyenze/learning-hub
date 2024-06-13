import "./ErrorSummary.css";

// "There are 2 problems": every error in a form, in one place, each a link
// that jumps INTO its field. Shared by the sign-in and settings forms.
//
// errors: { fieldName: "message" }
// labels: { fieldName: "Field label" }
// ref: so the form can move focus here after a failed submit (React 19:
//   a ref is passed like any other prop)
function ErrorSummary({ errors, labels, ref }) {
  const list = Object.entries(errors);
  if (list.length === 0) return null;

  return (
    <div ref={ref} className="error-summary" role="alert" tabIndex={-1} aria-labelledby="error-summary-title">
      <h2 id="error-summary-title" className="error-summary__title">
        There {list.length === 1 ? "is a problem" : `are ${list.length} problems`}
      </h2>
      <ul>
        {list.map(([field, message]) => (
          <li key={field}>
            <a
              href={`#${field}`}
              onClick={(event) => {
                event.preventDefault();
                document.querySelector(`[name="${field}"]`)?.focus();
              }}
            >
              {labels[field]}: {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ErrorSummary;
