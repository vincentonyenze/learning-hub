import { describe, expect, it } from "vitest";
import { afterSignInPath } from "./redirect.js";

describe("afterSignInPath", () => {
  it("goes back to the page you were going to, with its filters", () => {
    expect(afterSignInPath({ pathname: "/courses/react-from-scratch/lessons/use-state" })).toBe(
      "/courses/react-from-scratch/lessons/use-state"
    );
    expect(afterSignInPath({ pathname: "/courses", search: "?level=Beginner", hash: "#results" })).toBe(
      "/courses?level=Beginner#results"
    );
  });

  it.each([
    ["nothing", undefined],
    ["no pathname", {}],
    ["a number", { pathname: 42 }],
    ["the sign-in page itself", { pathname: "/sign-in" }],
  ])("goes home for %s", (_case, from) => {
    expect(afterSignInPath(from)).toBe("/");
  });

  // An "open redirect" would send people to another website after signing
  // in: a classic way to trick them. Only addresses inside this site count.
  it.each(["//evil.example/steal", "https://evil.example", "javascript:alert(1)"])(
    "never leaves the site: %s",
    (pathname) => {
      expect(afterSignInPath({ pathname })).toBe("/");
    }
  );
});
