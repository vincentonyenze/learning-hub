import { NavLink, Outlet } from "react-router";
import { useAuth } from "../auth/authContext.js";
import "./DashboardLayout.css";

const SECTIONS = [
  // end: only "current" on exactly /dashboard. Without it, Overview would
  // count as current on /dashboard/courses too (it's "below" it).
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/courses", label: "My courses" },
  { to: "/dashboard/settings", label: "Settings" },
];

// The frame around every dashboard page: a greeting, and links between
// the sections. Nested in RootLayout, behind RequireAuth.
//
// These look like tabs, but they're LINKS to separate pages (each has its
// own address, works with Back, and can be bookmarked). So they're a <nav>
// of NavLinks, not ARIA tabs, which are for panels on one page.
function DashboardLayout() {
  const { user } = useAuth();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <p className="dashboard__eyebrow">My learning</p>
        {/* The section's own heading is each page's h1; this is a greeting */}
        <p className="dashboard__greeting">Welcome back, {firstName}</p>
      </div>

      <nav className="dashboard__nav" aria-label="Dashboard">
        <ul>
          {SECTIONS.map((section) => (
            <li key={section.to}>
              <NavLink to={section.to} end={section.end} className="dashboard__link">
                {section.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="dashboard__content">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
