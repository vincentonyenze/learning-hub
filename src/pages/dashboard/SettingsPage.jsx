import { useAuth } from "../../auth/authContext.js";

// "/dashboard/settings". Just your details for now: the profile form,
// with validation and unsaved-changes warnings, comes in Step 20.
function SettingsPage() {
  const { user } = useAuth();

  return (
    <>
      <h1 className="dashboard__title">Settings</h1>
      <div className="card" style={{ padding: "1.25rem", maxWidth: "32rem" }}>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p style={{ marginTop: "0.75rem", color: "var(--color-muted)" }}>Editing your profile arrives in Step 20.</p>
      </div>
    </>
  );
}

export default SettingsPage;
