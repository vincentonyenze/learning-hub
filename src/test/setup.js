// Runs before every test file (see "setupFiles" in vite.config.js)

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// ===== Stand-ins for what jsdom (the pretend browser) doesn't have =====
// Just enough for the app's code to run. The real behaviour (a modal
// dialog's backdrop and Escape, real scrolling) was checked in Chrome.

// <dialog>: open, close, and the "close" event with a returnValue
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close(returnValue) {
    if (!this.open) return;
    if (returnValue !== undefined) this.returnValue = returnValue;
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
}

// <form method="dialog">: in a browser, its buttons close the dialog with
// the button's value. jsdom would try to submit the form instead.
document.addEventListener("submit", (event) => {
  const form = event.target;
  if (form.getAttribute("method") !== "dialog") return;
  event.preventDefault();
  form.closest("dialog")?.close(event.submitter?.value ?? "");
});

// ScrollRestoration calls window.scrollTo, which jsdom doesn't do
window.scrollTo = () => {};

afterEach(() => {
  cleanup(); // remove whatever a test rendered
  localStorage.clear(); // a signed-in user or progress must not leak into the next test
});
