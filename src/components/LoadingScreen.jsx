import "./LoadingScreen.css";

// Shown on a FIRST visit straight to a lazily loaded page (say, a bookmark
// to /dashboard), while that page's code downloads. Moving between pages
// inside the app shows the slim bar in RootLayout instead.
function LoadingScreen() {
  return (
    <div className="loading-screen" role="status">
      <span className="loading-screen__spinner" aria-hidden="true" />
      <span>Loading Learning Hub…</span>
    </div>
  );
}

export default LoadingScreen;
