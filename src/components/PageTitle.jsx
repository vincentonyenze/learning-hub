// The browser tab's title: "UI Design Basics · Learning Hub".
//
// React 19 lets any component render <title>: React moves it into the
// page's <head> for you, and puts the old one back when the component goes
// away. So each page simply says what it's called.
//
// Titles matter more than they look: they're the tab text, the name in
// history and bookmarks, and the FIRST thing a screen reader says when a
// page loads. Most specific first, site name last.
function PageTitle({ title }) {
  return <title>{title ? `${title} · Learning Hub` : "Learning Hub"}</title>;
}

export default PageTitle;
