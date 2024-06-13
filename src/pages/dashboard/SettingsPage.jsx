import { useEffect, useRef, useState } from "react";
import { useBlocker } from "react-router";
import { useAuth } from "../../auth/authContext.js";
import ErrorSummary from "../../components/ErrorSummary.jsx";
import TextField from "../../components/TextField.jsx";
import UnsavedChangesDialog from "../../components/UnsavedChangesDialog.jsx";
import { BIO_MAX, DAILY_GOALS, validateProfile } from "../../utils/validation.js";
import "./SettingsPage.css";

const LABELS = { name: "Display name", bio: "About you", dailyGoal: "Daily goal" };

// The form's values, from the saved user (all as form fields hold them)
function fromUser(user) {
  return { name: user.name, bio: user.bio, dailyGoal: String(user.dailyGoal), reminders: user.reminders };
}

// "/dashboard/settings": edit your profile
function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const saved = fromUser(user);

  const [values, setValues] = useState(saved);
  const [errors, setErrors] = useState({});
  const [triedToSave, setTriedToSave] = useState(false);
  const [message, setMessage] = useState("");
  const summaryRef = useRef(null);

  // DIRTY: has anything changed since the last save? Derived by comparing
  // the form with what's saved, never stored, so it can't go stale (type
  // a letter and delete it again: not dirty)
  const isDirty =
    values.name.trim() !== saved.name ||
    values.bio.trim() !== saved.bio ||
    values.dailyGoal !== saved.dailyGoal ||
    values.reminders !== saved.reminders;

  // ===== Leaving with unsaved changes =====
  // 1. Inside the app (a link, Back): useBlocker pauses the navigation
  //    while this returns true, and lets us ask first
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  // 2. Closing the tab or refreshing: the browser's own "Leave site?"
  //    prompt. Browsers don't allow custom text here, only the prompt
  //    itself. An effect, because it's a listener on the window, only
  //    while there's something to lose.
  useEffect(() => {
    if (!isDirty) return;
    function handleBeforeUnload(event) {
      event.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function change(name, value) {
    const next = { ...values, [name]: value };
    setValues(next);
    setMessage("");
    if (triedToSave) setErrors(validateProfile(next));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validateProfile(values);
    setErrors(found);
    setTriedToSave(true);

    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    if (!isDirty) {
      setMessage("Nothing to save: you haven't changed anything.");
      return;
    }
    updateProfile(values);
    // Show the cleaned-up values (trimmed), now that they're saved
    setValues({ ...values, name: values.name.trim(), bio: values.bio.trim() });
    setTriedToSave(false);
    setMessage("Your profile has been saved.");
  }

  const bioLength = values.bio.trim().length;

  return (
    <>
      <h1 className="dashboard__title">Settings</h1>

      <form className="settings card" onSubmit={handleSubmit} noValidate>
        <ErrorSummary ref={summaryRef} errors={errors} labels={LABELS} />

        <TextField
          label={LABELS.name}
          hint="Shown in the header and on your certificates."
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => change("name", event.target.value)}
          error={errors.name}
        />

        <div className="field">
          <span className="field__label">Email address</span>
          {/* Shown, not editable: in this practice version your progress is
              filed under your email, so changing it would hide it */}
          <p className="settings__readonly">{user.email}</p>
          <p className="field__hint">Your email can't be changed in this practice version.</p>
        </div>

        <TextField
          label={LABELS.bio}
          hint={`Optional. Up to ${BIO_MAX} characters.`}
          name="bio"
          multiline
          rows={4}
          // No maxLength: the browser would silently cut pasted text off.
          // Better to show the count and explain when it's too long.
          value={values.bio}
          onChange={(event) => change("bio", event.target.value)}
          error={errors.bio}
          after={
            // Not a live region: announcing every key press would be noise.
            // The limit is in the hint, and going over shows an error.
            <p className={bioLength > BIO_MAX ? "field__count field__count--over" : "field__count"}>
              {bioLength} / {BIO_MAX}
            </p>
          }
        />

        <div className="field">
          <label htmlFor="daily-goal" className="field__label">
            {LABELS.dailyGoal}
          </label>
          <p id="daily-goal-hint" className="field__hint">
            How long you'd like to learn each day.
          </p>
          <select
            id="daily-goal"
            name="dailyGoal"
            className="field__input settings__select"
            aria-describedby="daily-goal-hint"
            value={values.dailyGoal}
            onChange={(event) => change("dailyGoal", event.target.value)}
          >
            {DAILY_GOALS.map((minutes) => (
              <option key={minutes} value={String(minutes)}>
                {minutes} minutes a day
              </option>
            ))}
          </select>
        </div>

        <label className="settings__checkbox">
          <input
            type="checkbox"
            name="reminders"
            checked={values.reminders}
            onChange={(event) => change("reminders", event.target.checked)}
          />
          <span>
            Remind me to learn
            <span className="field__hint">A gentle nudge if I miss a day (pretend: nothing is sent).</span>
          </span>
        </label>

        <div className="settings__footer">
          <button type="submit" className="button button--primary">
            Save changes
          </button>
          {isDirty && <span className="settings__dirty">Unsaved changes</span>}
          {/* Always on the page, so changes to its text are announced */}
          <p className="settings__message" role="status">
            {message}
          </p>
        </div>
      </form>

      {/* useBlocker says "blocked" while a navigation is waiting for an answer */}
      {blocker.state === "blocked" && (
        <UnsavedChangesDialog onStay={() => blocker.reset()} onLeave={() => blocker.proceed()} />
      )}
    </>
  );
}

export default SettingsPage;
