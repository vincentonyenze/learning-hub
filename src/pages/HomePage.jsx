import { Link } from "react-router";
import CourseCard from "../components/CourseCard.jsx";
import PageTitle from "../components/PageTitle.jsx";
import { CATEGORIES } from "../data/courses.js";
import { getCourses, getFeaturedCourses } from "../data/catalog.js";
import { heroImage } from "../data/media.js";
import "./HomePage.css";

const CATEGORY_ICONS = { "Web Development": "💻", Design: "🎨", Data: "📊" };

// "/": what the site is, the best courses, and ways in by subject
function HomePage() {
  const featured = getFeaturedCourses(3);
  const courses = getCourses();

  return (
    <>
      {/* The home page: just the site's name */}
      <PageTitle />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__text">
          <h1 id="hero-title" className="page-title">
            Learn something new today
          </h1>
          <p className="page-lead">
            Short, practical courses in web development, design and data. Learn at your own pace, and pick up
            right where you left off.
          </p>
          <p className="hero__actions">
            <Link to="/courses" className="button button--primary">
              Browse courses
            </Link>
            <Link to="/dashboard" className="button button--secondary">
              Go to my learning
            </Link>
          </p>
        </div>
        {/* Sets the mood, says nothing the text doesn't: decorative */}
        <img className="hero__image" src={heroImage} alt="" width="1600" height="900" />
      </section>

      <section className="home-section" aria-labelledby="featured-title">
        <div className="home-section__header">
          <h2 id="featured-title" className="home-section__title">
            Top-rated courses
          </h2>
          <Link to="/courses">See all {courses.length} courses</Link>
        </div>
        <ul className="course-grid">
          {featured.map((course) => (
            <li key={course.id}>
              {/* h3: these sit under the "Top-rated courses" h2 */}
              <CourseCard course={course} headingLevel={3} />
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="categories-title">
        <h2 id="categories-title" className="home-section__title">
          Browse by subject
        </h2>
        <ul className="categories">
          {CATEGORIES.map((category) => {
            const count = courses.filter((course) => course.category === category).length;
            return (
              <li key={category}>
                {/* The filter lives in the address: /courses?category=Design.
                    The catalogue reads it in Step 9. */}
                <Link
                  className="category card"
                  to={{ pathname: "/courses", search: `?${new URLSearchParams({ category })}` }}
                >
                  <span className="category__icon" aria-hidden="true">
                    {CATEGORY_ICONS[category]}
                  </span>
                  <span className="category__name">{category}</span>
                  <span className="category__count">
                    {count} {count === 1 ? "course" : "courses"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

export default HomePage;
