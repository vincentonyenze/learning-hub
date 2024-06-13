import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../auth/authContext.js";
import { afterSignInPath } from "../auth/redirect.js";
import ErrorSummary from "../components/ErrorSummary.jsx";
import TextField from "../components/TextField.jsx";
import { validateSignIn } from "../utils/validation.js";
import "./SignInPage.css";

const FIELD_LABELS = { name: "Your name", email: "Email address" };

// "/sign-in": a PRETEND sign-in (no server yet): your name and email,
// remembered in this browser.
function SignInPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  // Where you were going before being sent here (RequireAuth or the
  // header's Sign in link put it in the navigation's state)
  const location = useLocation();
  const from = location.state?.from;
  const wasRedirected = location.state?.reason === "protected";

  const [values, setValues] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  // Errors only appear once you've tried to submit. Nobody wants "Enter
  // your email" shouting at them before they've started typing.
  const [triedToSubmit, setTriedToSubmit] = useState(false);
  const summaryRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    // After a failed attempt, re-check as you type, so a fixed field's
    // error disappears straight away
    if (triedToSubmit) setErrors(validateSignIn(next));
  }

  function handleSubmit(event) {
    event.preventDefault(); // a form would otherwise reload the page
    const found = validateSignIn(values);
    setErrors(found);
    setTriedToSubmit(true);

    if (Object.keys(found).length > 0) {
      // Move focus to the summary, so keyboard and screen reader users
      // land on the list of problems instead of on a button that "did
      // nothing". (requestAnimationFrame: the summary appears on the next
      // render, so wait for it to be on the page.)
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    signIn(values);
    // Back to where you were going. replace: the sign-in page leaves
    // history, so Back doesn't return you to a form you've finished.
    navigate(afterSignInPath(from), { replace: true });
  }

  if (user) {
    return (
      <div className="sign-in card">
        <h1 className="sign-in__title">You're signed in</h1>
        <p>
          You're signed in as <strong>{user.name}</strong> ({user.email}).
        </p>
        <p className="sign-in__actions">
          <Link to="/courses" className="button button--primary">
            Browse courses
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="sign-in card">
      <h1 className="sign-in__title">Sign in</h1>
      {wasRedirected ? (
        // role="status": announced, so screen reader users know why
        // they've landed on a sign-in page instead of the lesson
        <p className="sign-in__reason" role="status">
          Please sign in to continue. You'll go straight back to the page you wanted.
        </p>
      ) : (
        <p className="sign-in__lead">Sign in to save your progress and pick up where you left off.</p>
      )}

      {/* Every problem in one place, each a link to its field */}
      <ErrorSummary ref={summaryRef} errors={errors} labels={FIELD_LABELS} />

      {/* noValidate: we show our own, clearer messages instead of the
          browser's pop-up bubbles */}
      <form className="sign-in__form" onSubmit={handleSubmit} noValidate>
        <TextField
          label={FIELD_LABELS.name}
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
        />
        <TextField
          label={FIELD_LABELS.email}
          hint="We'll only use it to show who's signed in."
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <button type="submit" className="button button--primary sign-in__submit">
          Sign in
        </button>
      </form>

      <p className="sign-in__note">
        <strong>This is a practice project.</strong> There's no password and no server: your name is only kept in this
        browser. Real accounts come later, with a backend.
      </p>
    </div>
  );
}

export default SignInPage;
