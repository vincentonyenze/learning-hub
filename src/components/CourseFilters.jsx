import { CATEGORIES, LEVELS } from "../data/courses.js";
import "./CourseFilters.css";

// The catalogue's search box and filters. Controlled: the values come from
// the page (which reads them from the address), and every change is passed
// back up with onChange({ name: value }).
//
// counts: how many courses each subject has, shown beside its name
// searchRef: lets the page move focus to the search box. In React 19 a ref
//   is passed like any other prop.
function CourseFilters({ filters, counts, searchRef, onChange, onSearch }) {
  return (
    // role="search": a landmark screen reader users can jump straight to.
    // Nothing to submit: results update as you type and click.
    <form className="filters" role="search" aria-label="Courses" onSubmit={(event) => event.preventDefault()}>
      <div className="filters__group">
        <label htmlFor="course-search" className="filters__label">
          Search
        </label>
        <input
          ref={searchRef}
          id="course-search"
          type="search"
          className="filters__search"
          placeholder="Title, topic or teacher"
          autoComplete="off"
          value={filters.q}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>

      {/* A group of radio buttons: fieldset + legend name the group, so a
          screen reader says "Subject, Design, radio button, 2 of 4" */}
      <fieldset className="filters__group">
        <legend className="filters__label">Subject</legend>
        <RadioOption name="category" value="" checked={filters.category === ""} onChange={onChange}>
          All subjects
        </RadioOption>
        {CATEGORIES.map((category) => (
          <RadioOption
            key={category}
            name="category"
            value={category}
            checked={filters.category === category}
            onChange={onChange}
          >
            {category} <span className="filters__count">{counts[category] ?? 0}</span>
          </RadioOption>
        ))}
      </fieldset>

      <fieldset className="filters__group">
        <legend className="filters__label">Level</legend>
        <RadioOption name="level" value="" checked={filters.level === ""} onChange={onChange}>
          Any level
        </RadioOption>
        {LEVELS.map((level) => (
          <RadioOption key={level} name="level" value={level} checked={filters.level === level} onChange={onChange}>
            {level}
          </RadioOption>
        ))}
      </fieldset>
    </form>
  );
}

// One radio button with its label. The whole row is clickable, because the
// input sits inside its <label>.
function RadioOption({ name, value, checked, onChange, children }) {
  return (
    <label className="filters__option">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange({ [name]: value })}
      />
      <span>{children}</span>
    </label>
  );
}

export default CourseFilters;
