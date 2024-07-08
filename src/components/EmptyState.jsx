import PageTitle from "./PageTitle.jsx";
import "./EmptyState.css";

// A friendly "nothing here" message: no courses match, a page doesn't
// exist, nothing enrolled yet...
//
// One component for all of them, so they look and behave the same, and
// every one tells you what to do next.
//
// icon: an emoji or short text shown large (decorative)
// title: the headline
// headingLevel: h1 when it IS the page (404), h2 when it's part of one
// children: the explanation
// actions: buttons or links (a "slot", like CourseCard's footer)
function EmptyState({ icon, title, headingLevel = 2, children, actions }) {
  const Heading = `h${headingLevel}`;

  return (
    <div className="empty-state">
      {/* When it IS the page (a 404, "not found"...), it names the page */}
      {headingLevel === 1 && <PageTitle title={title} />}
      {icon && (
        <span className="empty-state__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <Heading className="empty-state__title">{title}</Heading>
      {children && <div className="empty-state__text">{children}</div>}
      {actions && <div className="empty-state__actions">{actions}</div>}
    </div>
  );
}

export default EmptyState;
