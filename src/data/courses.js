// The course catalogue: courses contain modules, modules contain lessons.
//
//   course ─┬─ module ─┬─ lesson
//           │          └─ lesson
//           └─ module ─── lesson
//
// The pages will follow the same shape: /courses/:courseId shows a course,
// /courses/:courseId/lessons/:lessonId shows one of its lessons.
//
// ids are "slugs": readable, lowercase, with dashes. They go in the
// address bar, so they must be unique (course ids across the catalogue,
// lesson ids within their course) and never change.
//
// A lesson's `body` is a list of paragraphs, and `takeaways` the points to
// remember. `type` is "reading" (explanation) or "exercise" (something to do).

export const CATEGORIES = ["Web Development", "Design", "Data"];
export const LEVELS = ["Beginner", "Intermediate"];

export const courses = [
  {
    id: "html-css-foundations",
    title: "HTML & CSS Foundations",
    subtitle: "Build and style your first web pages, the right way from the start.",
    description:
      "Start from an empty file and finish with a responsive, accessible page you wrote yourself. You'll learn how HTML gives a page its meaning, how CSS makes it look good, and how to make it work on any screen.",
    category: "Web Development",
    level: "Beginner",
    instructorId: "amara-okafor",
    rating: 4.8,
    ratingCount: 2140,
    students: 18320,
    updated: "2026-09",
    outcomes: [
      "Structure pages with meaningful HTML elements",
      "Style text, colours and spacing with CSS",
      "Lay out pages with Flexbox and Grid",
      "Make pages that work on phones and large screens",
    ],
    modules: [
      {
        id: "html-basics",
        title: "HTML basics",
        lessons: [
          {
            id: "how-the-web-works",
            title: "How the web works",
            type: "reading",
            minutes: 8,
            body: [
              "When you open a website, your browser asks a server for a file. That file is HTML: plain text with tags that describe what each part of the page is.",
              "The browser reads the HTML, fetches anything it links to (styles, images, scripts) and draws the result. Every page you've ever visited started this way.",
            ],
            takeaways: ["Browsers request files from servers", "HTML describes what content is", "CSS and images are fetched separately"],
          },
          {
            id: "your-first-page",
            title: "Your first page",
            type: "exercise",
            minutes: 15,
            body: [
              "Create a file called index.html and add a doctype, an html element, a head with a title, and a body with a heading and a paragraph.",
              "Open it in your browser. Change the text, save, and refresh: that loop of edit, save, check is how all web development works.",
            ],
            takeaways: ["Every page needs a doctype, head and body", "The title shows in the browser tab", "Save and refresh to see changes"],
          },
          {
            id: "semantic-elements",
            title: "Semantic elements",
            type: "reading",
            minutes: 10,
            body: [
              "Elements like header, nav, main, article and footer tell browsers and screen readers what each part of the page is for, not just how it looks.",
              "A button made from a div looks the same but can't be reached with the keyboard. Choosing the right element gives you accessibility for free.",
            ],
            takeaways: ["Pick elements for meaning, not looks", "Landmarks help screen reader users jump around", "Real buttons work with the keyboard"],
          },
        ],
      },
      {
        id: "css-basics",
        title: "Styling with CSS",
        lessons: [
          {
            id: "selectors-and-the-cascade",
            title: "Selectors and the cascade",
            type: "reading",
            minutes: 12,
            body: [
              "A CSS rule picks elements with a selector and sets properties on them. When two rules disagree, the more specific one wins, and if they're equal, the later one does.",
              "Most CSS confusion comes from rules fighting each other. Keeping selectors simple, mostly single classes, avoids nearly all of it.",
            ],
            takeaways: ["Selectors choose, properties style", "Specificity decides which rule wins", "Prefer simple class selectors"],
          },
          {
            id: "the-box-model",
            title: "The box model",
            type: "reading",
            minutes: 10,
            body: [
              "Every element is a box made of content, padding, border and margin. By default, width only counts the content, which makes sizes hard to predict.",
              "Setting box-sizing to border-box makes width include padding and border. Almost every modern stylesheet starts with that rule.",
            ],
            takeaways: ["Content, padding, border, margin", "border-box makes widths predictable", "Margins can collapse between blocks"],
          },
        ],
      },
      {
        id: "layout",
        title: "Layout and responsive design",
        lessons: [
          {
            id: "flexbox",
            title: "Flexbox",
            type: "reading",
            minutes: 14,
            body: [
              "Flexbox lines items up in a row or a column and shares out the spare space. It's perfect for navigation bars, button groups and centring things.",
              "The parent gets display: flex; the children follow its rules for direction, alignment and gaps.",
            ],
            takeaways: ["One direction at a time", "justify-content and align-items for alignment", "gap for space between items"],
          },
          {
            id: "grid",
            title: "CSS Grid",
            type: "reading",
            minutes: 14,
            body: [
              "Grid lays items out in rows and columns at once. With repeat(auto-fill, minmax(...)) a card grid can fit as many columns as there's room for, with no media queries.",
              "Use Flexbox for a line of things, and Grid for a page or a grid of cards.",
            ],
            takeaways: ["Two directions at once", "auto-fill and minmax for responsive grids", "Flexbox for lines, Grid for layouts"],
          },
          {
            id: "build-a-responsive-page",
            title: "Build a responsive page",
            type: "exercise",
            minutes: 30,
            body: [
              "Build a simple profile page: a header with navigation, a grid of three cards and a footer. Use semantic elements and a single stylesheet.",
              "Shrink your browser window and fix anything that breaks. Add a media query only when the layout really needs one.",
            ],
            takeaways: ["Start mobile-friendly", "Test by resizing the window", "Fewer media queries is better"],
          },
        ],
      },
    ],
  },
  {
    id: "modern-javascript",
    title: "Modern JavaScript",
    subtitle: "The language of the web, from variables to async code.",
    description:
      "Learn the JavaScript that real projects use today: modern syntax, working with arrays and objects, modules, and handling data that arrives later with promises and async functions.",
    category: "Web Development",
    level: "Intermediate",
    instructorId: "daniel-reyes",
    rating: 4.7,
    ratingCount: 1680,
    students: 12950,
    updated: "2026-08",
    outcomes: [
      "Write clean modern JavaScript with let, const and arrow functions",
      "Transform data with map, filter and reduce",
      "Split code into modules",
      "Fetch data and handle errors with async and await",
    ],
    modules: [
      {
        id: "language-basics",
        title: "Language basics",
        lessons: [
          {
            id: "values-and-variables",
            title: "Values and variables",
            type: "reading",
            minutes: 10,
            body: [
              "JavaScript has a handful of value types: strings, numbers, booleans, null, undefined, objects and arrays. Variables are names that point at values.",
              "Use const by default and let only when the variable really needs to change. Avoid var: its scoping rules surprise everyone.",
            ],
            takeaways: ["const by default, let when it changes", "Objects and arrays are reference values", "Avoid var"],
          },
          {
            id: "functions",
            title: "Functions",
            type: "reading",
            minutes: 12,
            body: [
              "Functions package up code you can run again with different inputs. Arrow functions are a shorter way to write them, and are ideal for small callbacks.",
              "A function that only uses its inputs and returns a result, without changing anything else, is called pure. Pure functions are the easiest to test.",
            ],
            takeaways: ["Functions take inputs and return results", "Arrow functions for short callbacks", "Pure functions are easy to test"],
          },
        ],
      },
      {
        id: "working-with-data",
        title: "Working with data",
        lessons: [
          {
            id: "array-methods",
            title: "map, filter and reduce",
            type: "reading",
            minutes: 15,
            body: [
              "map turns each item into something new, filter keeps the items that pass a test, and reduce combines all items into one value.",
              "None of them change the original array. That makes them safe to chain, and is exactly how React expects you to update lists.",
            ],
            takeaways: ["map transforms, filter selects, reduce combines", "They return new arrays", "Chain them for readable data pipelines"],
          },
          {
            id: "objects-and-destructuring",
            title: "Objects and destructuring",
            type: "reading",
            minutes: 12,
            body: [
              "Destructuring pulls values out of objects and arrays into variables in one line. The spread syntax copies them into new ones.",
              "{ ...task, done: true } makes a new object with one change: the pattern behind most state updates you'll write.",
            ],
            takeaways: ["Destructuring unpacks values", "Spread copies into a new object", "Copy and change instead of editing in place"],
          },
          {
            id: "practise-with-a-shopping-list",
            title: "Practise with a shopping list",
            type: "exercise",
            minutes: 25,
            body: [
              "Start with an array of items, each with a name, price and quantity. Use filter to find items over £5, map to build labels, and reduce to work out the total.",
              "Write each step as a small pure function and log the results. Then change the data and check every result still makes sense.",
            ],
            takeaways: ["Small functions, one job each", "Check results with different data", "Totals with reduce"],
          },
        ],
      },
      {
        id: "async-javascript",
        title: "Async JavaScript",
        lessons: [
          {
            id: "promises",
            title: "Promises",
            type: "reading",
            minutes: 14,
            body: [
              "Some answers take time, like data from a server. A promise is a placeholder for a value that will arrive later, or an error if something goes wrong.",
              "then runs when the value arrives and catch when it fails. Every promise ends up one way or the other.",
            ],
            takeaways: ["A promise is a future value", "then for success, catch for errors", "Always handle the error case"],
          },
          {
            id: "async-await-and-fetch",
            title: "async, await and fetch",
            type: "exercise",
            minutes: 25,
            body: [
              "async and await let you write promise code top to bottom, like normal code. Use them with fetch to load JSON from a public API and show it on a page.",
              "Remember that fetch only fails when there's no answer at all: check response.ok yourself, and wrap the whole thing in try and catch.",
            ],
            takeaways: ["await pauses until a promise settles", "Check response.ok", "try and catch for errors"],
          },
        ],
      },
    ],
  },
  {
    id: "react-from-scratch",
    title: "React from Scratch",
    subtitle: "Components, state and hooks, explained step by step.",
    description:
      "Understand React instead of memorising it. Build interfaces from components, manage state, fetch data with effects, and organise a growing app with custom hooks and context.",
    category: "Web Development",
    level: "Intermediate",
    instructorId: "daniel-reyes",
    rating: 4.9,
    ratingCount: 3025,
    students: 21410,
    updated: "2026-10",
    outcomes: [
      "Build interfaces from small reusable components",
      "Manage state with useState and useReducer",
      "Load data safely with useEffect",
      "Share logic with custom hooks",
    ],
    modules: [
      {
        id: "components",
        title: "Thinking in components",
        lessons: [
          {
            id: "jsx-and-components",
            title: "JSX and components",
            type: "reading",
            minutes: 12,
            body: [
              "A component is a function that returns what should be on the screen, written in JSX: HTML-like syntax inside JavaScript.",
              "Big interfaces are just small components put together. A good component does one job and can be reused anywhere.",
            ],
            takeaways: ["Components are functions that return JSX", "Compose small components into big ones", "className instead of class"],
          },
          {
            id: "props",
            title: "Passing data with props",
            type: "reading",
            minutes: 10,
            body: [
              "Props are a component's inputs, passed like HTML attributes. Data flows down through props, and events flow back up through functions you pass down.",
              "The special children prop lets a component wrap other content, which is how layouts and cards are built.",
            ],
            takeaways: ["Props flow down", "Pass functions down for events", "children for wrapping content"],
          },
        ],
      },
      {
        id: "state",
        title: "State and events",
        lessons: [
          {
            id: "use-state",
            title: "useState",
            type: "reading",
            minutes: 14,
            body: [
              "State is data that changes over time and should update the screen when it does. useState gives you the current value and a function to change it.",
              "Never change state in place: give React a new value. That's how it knows something changed and needs redrawing.",
            ],
            takeaways: ["State changes redraw the component", "Always replace, never mutate", "Keep state as small as possible"],
          },
          {
            id: "build-a-counter-and-a-todo-list",
            title: "Build a counter and a to-do list",
            type: "exercise",
            minutes: 35,
            body: [
              "Build a counter with plus, minus and reset buttons. Then build a to-do list where you can add, tick and delete tasks.",
              "Keep the list in one place, pass it down as props, and update it with map and filter.",
            ],
            takeaways: ["One owner for each piece of state", "Lift state up when siblings need it", "Use map and filter for list updates"],
          },
        ],
      },
      {
        id: "effects-and-hooks",
        title: "Effects and custom hooks",
        lessons: [
          {
            id: "use-effect",
            title: "useEffect and cleanup",
            type: "reading",
            minutes: 16,
            body: [
              "Effects synchronise your component with things outside React: the network, timers, the browser. They run after the screen updates.",
              "Return a cleanup function to stop what the effect started. In development React runs effects twice on purpose to check your cleanup works.",
            ],
            takeaways: ["Effects talk to the outside world", "The dependency list says when to run again", "Clean up what you start"],
          },
          {
            id: "custom-hooks",
            title: "Custom hooks",
            type: "reading",
            minutes: 12,
            body: [
              "A custom hook is a function starting with use that calls other hooks. It lets several components share stateful logic, like loading data, without copying it.",
              "Each component that calls the hook gets its own separate state.",
            ],
            takeaways: ["Hooks share logic, not state", "Names start with use", "Call hooks at the top level only"],
          },
        ],
      },
    ],
  },
  {
    id: "ui-design-basics",
    title: "UI Design Basics",
    subtitle: "Make interfaces that look good and are easy to use.",
    description:
      "Learn the core ideas behind good interface design: hierarchy, spacing, colour, typography and feedback. No drawing skills needed, just a willingness to look closely.",
    category: "Design",
    level: "Beginner",
    instructorId: "mei-lin",
    rating: 4.6,
    ratingCount: 980,
    students: 7420,
    updated: "2026-07",
    outcomes: [
      "Create clear visual hierarchy",
      "Use spacing and alignment consistently",
      "Choose readable type and accessible colours",
      "Design helpful feedback and empty states",
    ],
    modules: [
      {
        id: "visual-hierarchy",
        title: "Visual hierarchy",
        lessons: [
          {
            id: "what-matters-most",
            title: "What matters most?",
            type: "reading",
            minutes: 9,
            body: [
              "Every screen has one main job. Hierarchy uses size, weight, colour and position to make that job obvious at a glance.",
              "If everything is bold, nothing stands out. Decide what's most important first, then make the rest quieter.",
            ],
            takeaways: ["One main job per screen", "Size, weight and colour create hierarchy", "Make secondary things quieter"],
          },
          {
            id: "spacing-and-alignment",
            title: "Spacing and alignment",
            type: "reading",
            minutes: 11,
            body: [
              "Things that are close together look related. Use space to group items, and bigger gaps to separate groups.",
              "Pick a small set of spacing sizes and use only those. Consistent spacing makes a design feel calm and finished.",
            ],
            takeaways: ["Proximity shows relationships", "Use a spacing scale", "Align things to shared edges"],
          },
        ],
      },
      {
        id: "type-and-colour",
        title: "Type and colour",
        lessons: [
          {
            id: "readable-typography",
            title: "Readable typography",
            type: "reading",
            minutes: 12,
            body: [
              "Body text should be at least 16 pixels, with lines around 60 to 75 characters long and comfortable line spacing.",
              "One typeface in a few sizes and weights is usually enough. Variety should come from hierarchy, not from many fonts.",
            ],
            takeaways: ["16px or more for body text", "Keep lines a readable length", "One typeface is often enough"],
          },
          {
            id: "colour-and-contrast",
            title: "Colour and contrast",
            type: "reading",
            minutes: 12,
            body: [
              "Text needs enough contrast with its background: at least 4.5 to 1 for normal text. Free checkers will tell you the ratio.",
              "Never use colour alone to show meaning. Pair red with an icon or a word, so everyone gets the message.",
            ],
            takeaways: ["4.5:1 contrast for text", "Don't rely on colour alone", "Use a small palette"],
          },
        ],
      },
      {
        id: "feedback",
        title: "Feedback and states",
        lessons: [
          {
            id: "loading-empty-and-error-states",
            title: "Loading, empty and error states",
            type: "reading",
            minutes: 10,
            body: [
              "Real screens are often loading, empty or broken. Designing only the perfect, full version leaves users confused in every other case.",
              "Good states explain what's happening and what to do next: a skeleton while loading, a helpful message when empty, a retry button on errors.",
            ],
            takeaways: ["Design every state, not just the happy one", "Explain what to do next", "Skeletons feel faster than spinners"],
          },
          {
            id: "redesign-a-screen",
            title: "Redesign a screen",
            type: "exercise",
            minutes: 30,
            body: [
              "Take a screenshot of an app you use and list three problems with its hierarchy, spacing or contrast.",
              "Sketch an improved version on paper or in a design tool, and write one sentence explaining each change.",
            ],
            takeaways: ["Critique before you redesign", "Explain your choices", "Small changes add up"],
          },
        ],
      },
    ],
  },
  {
    id: "accessible-web",
    title: "Accessibility for the Web",
    subtitle: "Build websites everyone can use, including with a keyboard or screen reader.",
    description:
      "One in five people has a disability. Learn how people use the web with keyboards, screen readers and zoom, and the practical techniques that make your sites work for all of them.",
    category: "Design",
    level: "Intermediate",
    instructorId: "mei-lin",
    rating: 4.9,
    ratingCount: 760,
    students: 5130,
    updated: "2026-09",
    outcomes: [
      "Test pages with only a keyboard",
      "Use headings, landmarks and labels correctly",
      "Manage focus in dynamic interfaces",
      "Know when (and when not) to use ARIA",
    ],
    modules: [
      {
        id: "how-people-browse",
        title: "How people browse",
        lessons: [
          {
            id: "assistive-technology",
            title: "Assistive technology",
            type: "reading",
            minutes: 10,
            body: [
              "Screen readers read pages aloud and let people jump between headings, links and landmarks. Others use only a keyboard, voice control, or zoom the page to 400%.",
              "All of them rely on the same thing: correct HTML. Most accessibility problems are really HTML problems.",
            ],
            takeaways: ["Many people don't use a mouse", "Screen readers navigate by structure", "Good HTML is the foundation"],
          },
          {
            id: "keyboard-testing",
            title: "Keyboard testing",
            type: "exercise",
            minutes: 20,
            body: [
              "Put your mouse away and use a website with Tab, Shift+Tab, Enter, Space and the arrow keys.",
              "Note every time you can't see where focus is, can't reach something, or get stuck. Those are bugs.",
            ],
            takeaways: ["Every action must work from the keyboard", "Focus must always be visible", "Watch for focus traps"],
          },
        ],
      },
      {
        id: "structure",
        title: "Structure and labels",
        lessons: [
          {
            id: "headings-and-landmarks",
            title: "Headings and landmarks",
            type: "reading",
            minutes: 11,
            body: [
              "Headings are a page's outline: one h1, then h2s for sections and h3s inside them. Screen reader users skim pages by jumping between them.",
              "Landmarks like header, nav, main and footer let them jump straight to the part they want.",
            ],
            takeaways: ["One h1 per page", "Don't skip heading levels", "Use landmark elements"],
          },
          {
            id: "forms-and-labels",
            title: "Forms and labels",
            type: "reading",
            minutes: 13,
            body: [
              "Every input needs a real label connected with for and id. Placeholder text is not a label: it disappears as soon as you type.",
              "Connect hints and errors with aria-describedby, and mark invalid fields with aria-invalid, so they're read out with the field.",
            ],
            takeaways: ["Every input gets a label", "Placeholders aren't labels", "Connect errors to their field"],
          },
        ],
      },
      {
        id: "dynamic-interfaces",
        title: "Dynamic interfaces",
        lessons: [
          {
            id: "managing-focus",
            title: "Managing focus",
            type: "reading",
            minutes: 14,
            body: [
              "When the element someone is on disappears, focus falls back to the top of the page. Always decide where focus should go next.",
              "Dialogs should move focus inside when they open and return it when they close. Single-page apps should move focus when the page changes.",
            ],
            takeaways: ["Never lose the user's place", "Dialogs move and return focus", "Move focus on page changes"],
          },
          {
            id: "aria-done-right",
            title: "ARIA done right",
            type: "reading",
            minutes: 12,
            body: [
              "ARIA attributes describe things HTML can't, like aria-pressed on a toggle button or aria-live for updates. But a real element beats ARIA every time.",
              "The first rule of ARIA: if a native element does the job, use it instead.",
            ],
            takeaways: ["Native elements first", "ARIA describes, it doesn't add behaviour", "Live regions announce changes"],
          },
        ],
      },
    ],
  },
  {
    id: "data-analysis-basics",
    title: "Data Analysis Basics",
    subtitle: "Turn spreadsheets into answers with clear thinking and simple charts.",
    description:
      "Learn how analysts work: asking good questions, cleaning messy data, summarising it, and showing results with honest charts. Everything is done in a spreadsheet, so there's nothing to install.",
    category: "Data",
    level: "Beginner",
    instructorId: "jonas-berg",
    rating: 4.5,
    ratingCount: 640,
    students: 4870,
    updated: "2026-06",
    outcomes: [
      "Turn vague goals into questions data can answer",
      "Clean and organise messy data",
      "Summarise data with averages and pivot tables",
      "Choose the right chart and avoid misleading ones",
    ],
    modules: [
      {
        id: "asking-questions",
        title: "Asking good questions",
        lessons: [
          {
            id: "from-goals-to-questions",
            title: "From goals to questions",
            type: "reading",
            minutes: 9,
            body: [
              "'Sell more' is a goal, not a question. 'Which products sell best on weekends?' is something data can answer.",
              "Good questions are specific, measurable and tied to a decision someone will actually make.",
            ],
            takeaways: ["Turn goals into specific questions", "Tie questions to decisions", "Know what you'd do with the answer"],
          },
        ],
      },
      {
        id: "cleaning-data",
        title: "Cleaning data",
        lessons: [
          {
            id: "spotting-problems",
            title: "Spotting problems",
            type: "reading",
            minutes: 12,
            body: [
              "Real data has gaps, typos, duplicates and numbers stored as text. Analysing it before cleaning gives confident, wrong answers.",
              "Sort each column, look at the smallest and largest values, and count the blanks. Problems usually jump out.",
            ],
            takeaways: ["Never trust raw data", "Sort and scan every column", "Count blanks and duplicates"],
          },
          {
            id: "clean-a-sales-sheet",
            title: "Clean a sales sheet",
            type: "exercise",
            minutes: 25,
            body: [
              "Take a small sales spreadsheet and fix it: remove duplicate rows, make dates consistent, and turn text numbers into real numbers.",
              "Keep the original untouched and write down every change you make, so someone else could repeat it.",
            ],
            takeaways: ["Keep the original data", "Record every change", "Consistent formats first"],
          },
        ],
      },
      {
        id: "summaries-and-charts",
        title: "Summaries and charts",
        lessons: [
          {
            id: "averages-and-pivots",
            title: "Averages and pivot tables",
            type: "reading",
            minutes: 14,
            body: [
              "An average can hide a lot: one huge sale makes everything look better. The median, the middle value, is often more honest.",
              "Pivot tables group and summarise rows in seconds, like total sales per month or per product.",
            ],
            takeaways: ["Median resists outliers", "Pivot tables group and total", "Always check the count too"],
          },
          {
            id: "honest-charts",
            title: "Honest charts",
            type: "reading",
            minutes: 11,
            body: [
              "Bar charts compare amounts, line charts show change over time, and pie charts are rarely the best choice.",
              "Start bar chart axes at zero, label everything, and give each chart a title that states the finding.",
            ],
            takeaways: ["Pick the chart for the question", "Bar axes start at zero", "Titles should say the finding"],
          },
        ],
      },
    ],
  },
];
