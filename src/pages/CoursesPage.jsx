import { useRef } from "react";
import { useSearchParams } from "react-router";
import CourseCard from "../components/CourseCard.jsx";
import CourseFilters from "../components/CourseFilters.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PageTitle from "../components/PageTitle.jsx";
import { DEFAULT_FILTERS, filterCourses, getCourses, readFilters, SORT_OPTIONS } from "../data/catalog.js";
import "./CoursesPage.css";

// "/courses": the whole catalogue, searchable and filterable.
//
// THE ADDRESS IS THE STATE. The filters aren't kept in useState: they live
// in the URL (/courses?category=Design&sort=rating), read with
// useSearchParams. So a filtered view can be bookmarked, shared, refreshed,
// and Back goes to the previous filters, all without extra code.
function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = useRef(null);

  // Address -> filters (unknown values fall back to the defaults)
  const filters = readFilters(searchParams);

  // Derived on every render, never stored
  const allCourses = getCourses();
  const courses = filterCourses(allCourses, filters);
  const counts = Object.groupBy(allCourses, (course) => course.category);
  const subjectCounts = Object.fromEntries(Object.entries(counts).map(([name, list]) => [name, list.length]));
  const isFiltered = filters.q !== "" || filters.category !== "" || filters.level !== "";

  // Write changes into the address. Defaults are left out, so the address
  // stays short: plain /courses means "everything, most popular first".
  //   replace: true -> change the current history entry instead of adding
  //   one. Used while typing, or Back would undo the search one letter
  //   at a time.
  //   flushSync: true -> update the page straight away. Navigations
  //   normally run as a TRANSITION (low priority, may wait). Controlled
  //   form fields can't wait: React would redraw them with the OLD value
  //   between key presses. Typing "access" left just "s", and pressing
  //   Down three times in Sort by only moved one place. So every change
  //   from these fields is applied immediately.
  function updateFilters(changes, { replace = false } = {}) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        for (const [name, value] of Object.entries(changes)) {
          if (value === "" || value === DEFAULT_FILTERS[name]) next.delete(name);
          else next.set(name, value);
        }
        return next;
      },
      { replace, flushSync: true }
    );
  }

  function clearFilters() {
    // Keep the sort order: it isn't a filter, it's how you like to browse
    updateFilters({ q: "", category: "", level: "" });
    // Both Clear buttons vanish once there's nothing to clear, which would
    // drop keyboard focus to the top of the page. Continue from the search
    // box instead. (flushSync above means the page has already updated.)
    searchInput.current.focus();
  }

  const countText = `${courses.length} ${courses.length === 1 ? "course" : "courses"}`;

  return (
    <>
      {/* Says what's shown: "Design courses" is more useful in a tab
          than "All courses" when a subject is picked */}
      <PageTitle title={filters.category ? `${filters.category} courses` : "All courses"} />
      <div className="page-header">
        <h1 className="page-title">All courses</h1>
        <p className="page-lead">
          Practical courses taught by people who do this work every day. Start any of them for free.
        </p>
      </div>

      <div className="catalogue">
        <aside className="catalogue__sidebar card" aria-label="Filters">
          <CourseFilters
            filters={filters}
            counts={subjectCounts}
            searchRef={searchInput}
            onChange={updateFilters}
            onSearch={(q) => updateFilters({ q }, { replace: true })}
          />
          {isFiltered && (
            <button type="button" className="button button--secondary catalogue__clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </aside>

        <section className="catalogue__results" aria-labelledby="results-title">
          <div className="catalogue__bar">
            <h2 id="results-title" className="catalogue__count">
              {isFiltered ? `${countText} found` : countText}
            </h2>
            <div className="catalogue__sort">
              <label htmlFor="sort">Sort by</label>
              <select
                id="sort"
                className="catalogue__select"
                value={filters.sort}
                onChange={(event) => updateFilters({ sort: event.target.value })}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Read out after every change, so screen reader users hear what
              their filters did without hunting for it */}
          <p className="visually-hidden" role="status">
            {countText} {isFiltered ? "match your filters" : "in the catalogue"}
          </p>

          {courses.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No courses match"
              actions={
                <button type="button" className="button button--primary" onClick={clearFilters}>
                  Clear filters
                </button>
              }
            >
              <p>
                {filters.q ? (
                  <>
                    Nothing matches “{filters.q}”
                    {filters.category || filters.level ? " with these filters" : ""}.
                  </>
                ) : (
                  "No courses fit this combination."
                )}{" "}
                Try fewer words, or another subject or level.
              </p>
            </EmptyState>
          ) : (
            <ul className="course-grid">
              {courses.map((course) => (
                <li key={course.id}>
                  <CourseCard course={course} headingLevel={3} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default CoursesPage;
