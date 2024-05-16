import { Link } from "react-router";
import "./Breadcrumbs.css";

// "Courses › Design › UI Design Basics": where this page sits in the site.
//
// items: [{ label, to }]. The last item is the current page: it isn't a
// link, and is marked aria-current="page".
function Breadcrumbs({ items }) {
  return (
    // A named landmark: screen readers announce "Breadcrumb, navigation"
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {/* An ordered list: the order means something (bigger to smaller) */}
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={item.label}>
              {isCurrent ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
