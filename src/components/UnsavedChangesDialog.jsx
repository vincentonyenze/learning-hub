import { useEffect, useRef } from "react";
import "./UnsavedChangesDialog.css";

// "You have unsaved changes": shown when you try to leave a page with an
// edited form. A modal <dialog>, so the page behind can't be reached and
// Escape works (Project 16).
//
// onStay(): stay on the page, changes kept
// onLeave(): go where you were going, changes lost
function UnsavedChangesDialog({ onStay, onLeave }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="unsaved"
      aria-labelledby="unsaved-title"
      aria-describedby="unsaved-text"
      // Every way of closing ends here. The buttons below sit in a
      // <form method="dialog">: pressing one closes the dialog and sets
      // its returnValue to the button's value. Escape closes it with no
      // value, so anything but "leave" means STAY: the safe choice.
      onClose={(event) => (event.currentTarget.returnValue === "leave" ? onLeave() : onStay())}
    >
      <h2 id="unsaved-title" className="unsaved__title">
        Leave without saving?
      </h2>
      <p id="unsaved-text">You've changed your profile but haven't saved it. If you leave now, your changes will be lost.</p>
      <form method="dialog" className="unsaved__actions">
        {/* First, so it gets focus when the dialog opens: the safe answer */}
        <button type="submit" value="stay" className="button button--primary">
          Keep editing
        </button>
        <button type="submit" value="leave" className="button button--danger">
          Leave without saving
        </button>
      </form>
    </dialog>
  );
}

export default UnsavedChangesDialog;
