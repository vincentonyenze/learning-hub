// The photos for courses and instructors.
//
// Importing an image gives back its address. Vite checks the file exists
// when building (a typo fails the build instead of showing a broken image),
// and adds a fingerprint to the file name (react-from-scratch-B3k9.webp) so
// browsers can cache it forever and still get a new version when it changes.
//
// Kept apart from courses.js so the course data stays plain JavaScript.

import hero from "../assets/hero.webp";
import accessibleWeb from "../assets/courses/accessible-web.webp";
import dataAnalysisBasics from "../assets/courses/data-analysis-basics.webp";
import htmlCssFoundations from "../assets/courses/html-css-foundations.webp";
import modernJavascript from "../assets/courses/modern-javascript.webp";
import reactFromScratch from "../assets/courses/react-from-scratch.webp";
import uiDesignBasics from "../assets/courses/ui-design-basics.webp";
import amaraOkafor from "../assets/instructors/amara-okafor.jpg";
import danielReyes from "../assets/instructors/daniel-reyes.jpg";
import jonasBerg from "../assets/instructors/jonas-berg.jpg";
import meiLin from "../assets/instructors/mei-lin.jpg";

export const heroImage = hero;

// Keyed by course id
const covers = {
  "html-css-foundations": htmlCssFoundations,
  "modern-javascript": modernJavascript,
  "react-from-scratch": reactFromScratch,
  "ui-design-basics": uiDesignBasics,
  "accessible-web": accessibleWeb,
  "data-analysis-basics": dataAnalysisBasics,
};

// Keyed by instructor id
const portraits = {
  "amara-okafor": amaraOkafor,
  "daniel-reyes": danielReyes,
  "mei-lin": meiLin,
  "jonas-berg": jonasBerg,
};

// Cover photos are 1200 x 675 (16:9), portraits 128 x 128
export const COVER_SIZE = { width: 1200, height: 675 };
export const PORTRAIT_SIZE = { width: 128, height: 128 };

// undefined when a course has no photo: pages show a fallback instead
export function courseCover(courseId) {
  return covers[courseId];
}

export function instructorPhoto(instructorId) {
  return portraits[instructorId];
}

// Who took each photo (shown on the credits in the footer and README)
export const photoCredits = [
  { photographer: "Alejandro Escamilla", url: "https://unsplash.com/photos/yC-Yzbqy7PY", usedFor: "Home page" },
  { photographer: "Alejandro Escamilla", url: "https://unsplash.com/photos/N7XodRrbzS0", usedFor: "HTML & CSS Foundations" },
  { photographer: "Alejandro Escamilla", url: "https://unsplash.com/photos/Dl6jeyfihLk", usedFor: "Modern JavaScript" },
  { photographer: "Galymzhan Abdugalimov", url: "https://unsplash.com/photos/ICW6QYOcdlg", usedFor: "React from Scratch" },
  { photographer: "Florian Klauer", url: "https://unsplash.com/photos/-K6JMRMj4x4", usedFor: "UI Design Basics" },
  { photographer: "Rayi Christian Wicaksono", url: "https://unsplash.com/photos/6PF6DaiWz48", usedFor: "Accessibility for the Web" },
  { photographer: "Aleksi Tappura", url: "https://unsplash.com/photos/PjH_BkzjxTA", usedFor: "Data Analysis Basics" },
];
