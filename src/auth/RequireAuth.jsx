import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./authContext.js";

// A route that only lets signed-in people through to its child routes.
//
//   { element: <RequireAuth />, children: [ ...pages that need sign-in ] }
//
// Signed in:  renders <Outlet />, so the child route appears as normal.
// Signed out: sends you to /sign-in instead, carrying WHERE YOU WERE GOING
//             in the navigation's `state`, so sign-in can bring you back.
//
// ⚠ "Protected-looking" only. The lesson text is still in the JavaScript
// the browser downloaded, and anyone can fake being signed in. Real
// protection means the SERVER refusing to send the data (Level 4).
function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // replace: the protected address isn't left in history, so Back from
    // the sign-in page doesn't bounce straight back into this redirect
    // reason: so the sign-in page can explain why you're there (the
    // header's Sign in link passes `from` too, but no reason)
    return <Navigate to="/sign-in" replace state={{ from: location, reason: "protected" }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
