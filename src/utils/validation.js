// Checking form fields. Plain JavaScript, no React, so the rules can be
// tested on their own and reused by any form.
//
// Each check returns an error message, or "" when the value is fine.

export function checkName(value) {
  const name = value.trim();
  if (name === "") return "Enter your name";
  if (name.length < 2) return "Your name must be at least 2 characters";
  if (name.length > 50) return "Your name must be 50 characters or fewer";
  return "";
}

// Deliberately simple: something@something.something. Perfect email
// checking is impossible with a pattern; the only real test is sending a
// message to it, which needs a server.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function checkEmail(value) {
  const email = value.trim();
  if (email === "") return "Enter your email address";
  if (!EMAIL_PATTERN.test(email)) return "Enter an email address like name@example.com";
  return "";
}

// All the sign-in form's errors: { name: "...", email: "..." }, with only
// the fields that have a problem
export function validateSignIn({ name, email }) {
  const errors = { name: checkName(name), email: checkEmail(email) };
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}

// ===== Profile (Settings page) =====

export const BIO_MAX = 200;
export const DAILY_GOALS = [10, 20, 30, 60]; // minutes a day

export function checkBio(value) {
  if (value.trim().length > BIO_MAX) return `Your bio must be ${BIO_MAX} characters or fewer`;
  return "";
}

export function checkDailyGoal(value) {
  return DAILY_GOALS.includes(Number(value)) ? "" : "Choose how many minutes a day";
}

// All the profile form's errors, only for fields with a problem
export function validateProfile({ name, bio, dailyGoal }) {
  const errors = { name: checkName(name), bio: checkBio(bio), dailyGoal: checkDailyGoal(dailyGoal) };
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}
