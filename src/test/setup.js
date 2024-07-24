// Runs before every test file (see "setupFiles" in vite.config.js)

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup(); // remove whatever a test rendered
  localStorage.clear(); // a signed-in user or progress must not leak into the next test
});
