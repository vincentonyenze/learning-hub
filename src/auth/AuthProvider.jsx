import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { BIO_MAX, DAILY_GOALS } from "../utils/validation.js";
import { AuthContext } from "./authContext.js";

// ⚠ PRETEND sign-in. There's no server, so nothing here is secure: anyone
// can edit localStorage and "be" anyone. It shows how an app SHARES who's
// signed in. Real sign-in (passwords, sessions, tokens) needs a backend:
// Project 22.

const STORAGE_KEY = "learning-hub.user.v1";

// What's read back from storage -> a clean user, or throw
function cleanUser(value) {
  if (value === null) return null;
  if (typeof value?.name !== "string" || typeof value?.email !== "string") {
    throw new Error("Not a user");
  }
  return {
    name: value.name.slice(0, 50),
    email: value.email.slice(0, 254),
    // Profile details (Settings), with safe defaults for older saves
    bio: typeof value.bio === "string" ? value.bio.slice(0, BIO_MAX) : "",
    dailyGoal: DAILY_GOALS.includes(value.dailyGoal) ? value.dailyGoal : 20,
    reminders: value.reminders === true,
  };
}

// Holds who's signed in, and makes it available to everything inside it
// through AuthContext. Wraps the whole app (main.jsx).
function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(STORAGE_KEY, null, cleanUser);

  const value = {
    user,
    signIn: ({ name, email }) =>
      setUser({ name: name.trim(), email: email.trim().toLowerCase(), bio: "", dailyGoal: 20, reminders: false }),
    // Change profile details; the email (whose progress this is) stays
    updateProfile: ({ name, bio, dailyGoal, reminders }) =>
      setUser((current) => ({
        ...current,
        name: name.trim(),
        bio: bio.trim(),
        dailyGoal: Number(dailyGoal),
        reminders,
      })),
    signOut: () => setUser(null),
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export default AuthProvider;
