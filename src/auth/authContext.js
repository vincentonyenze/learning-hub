import { createContext, useContext } from "react";

// THE CONTEXT API: sharing one value with every component that needs it,
// without passing it down through every component in between.
//
// Who's signed in matters to the header, the sign-in page, the dashboard,
// lesson pages... Passing `user` as a prop from the top through every
// layout and page that doesn't use it ("prop drilling") would be messy.
// Instead:
//   1. createContext() makes a "channel"            (here)
//   2. <AuthProvider> puts a value into it          (AuthProvider.jsx)
//   3. any component below reads it with useAuth() (anywhere)
//
// null is what you'd get with no provider above you: a mistake, caught
// in useAuth below.
export const AuthContext = createContext(null);

// { user, signIn(user), signOut(), updateProfile(details) }
//   user: { name, email, bio, dailyGoal, reminders } when signed in,
//   null when not
export function useAuth() {
  const auth = useContext(AuthContext);
  if (auth === null) {
    // Fail loudly and clearly, instead of "cannot read properties of null"
    // somewhere far away
    throw new Error("useAuth() needs an <AuthProvider> above it");
  }
  return auth;
}
