import { render, screen, waitFor, within } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { describe, expect, it } from "vitest";
import { PageError } from "./components/RouteError.jsx";
import { currentPath, renderApp } from "./test/renderApp.jsx";

// The whole app, used like a person would: real routes, real pages, real
// providers. Only the address bar is pretend (a memory router).
//
// "findBy..." WAITS for something to appear: needed for lazy pages, whose
// code loads first (Step 22).

const h1 = () => screen.getByRole("heading", { level: 1 });

describe("browsing", () => {
  it("goes from the home page to the catalogue, with title and focus", async () => {
    const { user, router } = renderApp("/");
    expect(h1()).toHaveTextContent("Learn something new today");

    await user.click(screen.getByRole("link", { name: "Browse courses" }));

    expect(currentPath(router)).toBe("/courses");
    expect(h1()).toHaveTextContent("All courses");
    await waitFor(() => expect(document.title).toBe("All courses · Learning Hub"));
    // Step 21: focus moves to the new page's heading
    expect(h1()).toHaveFocus();
  });

  it("filters from the address, and keeps filters in it", async () => {
    const { user, router } = renderApp("/courses?category=Design");
    expect(screen.getByRole("heading", { name: "2 courses found" })).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Beginner" }));

    expect(screen.getByRole("heading", { name: "1 course found" })).toBeInTheDocument();
    expect(router.state.location.search).toBe("?category=Design&level=Beginner");
    // Same page, different filters: focus stays on the radio button
    expect(screen.getByRole("radio", { name: "Beginner" })).toHaveFocus();
  });

  it("searches as you type", async () => {
    const { user } = renderApp("/courses");
    // A limit worth knowing: this can NOT catch Step 9's bug (each key
    // wiping the last). Testing Library finishes every pending update,
    // slow transitions included, before the next key press, so the timing
    // that caused it in Chrome never happens here. Only a check in a real
    // browser found it.
    await user.type(screen.getByRole("searchbox", { name: "Search" }), "access");

    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("access");
    expect(screen.getByRole("heading", { name: "1 course found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Accessibility for the Web" })).toBeInTheDocument();
  });

  it("explains unknown addresses at every level", () => {
    renderApp("/courses/knitting");
    expect(h1()).toHaveTextContent("Course not found");
  });

  it("shows a 404 page for addresses no route matches", () => {
    renderApp("/no-such-page");
    expect(h1()).toHaveTextContent("Page not found");
    expect(screen.getByText("/no-such-page")).toBeInTheDocument();
  });
});

describe("signing in", () => {
  it("sends you to sign in from a lesson, then brings you back", async () => {
    const { user, router } = renderApp("/courses/react-from-scratch/lessons/use-state");

    expect(await screen.findByRole("heading", { level: 1, name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Please sign in to continue");

    await user.type(screen.getByLabelText("Your name"), "Test Student");
    await user.type(screen.getByLabelText(/Email address/), "test.student@example.com");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("heading", { level: 1, name: "useState" })).toBeInTheDocument();
    expect(currentPath(router)).toBe("/courses/react-from-scratch/lessons/use-state");
  });

  it("explains every problem when the form is empty", async () => {
    const { user } = renderApp("/sign-in");
    await user.click(await screen.findByRole("button", { name: "Sign in" }));

    const summary = screen.getByRole("alert");
    expect(summary).toHaveTextContent("There are 2 problems");
    // Focus moves on the next animation frame, once the summary is on the
    // page: WAIT for it, rather than checking at one exact moment
    await waitFor(() => expect(summary).toHaveFocus());
    expect(screen.getByLabelText("Your name")).toHaveAttribute("aria-invalid", "true");
  });
});

describe("learning", () => {
  it("enrols, starts a course and tracks progress", async () => {
    const { user } = renderApp("/courses/react-from-scratch", { signedIn: true });

    await user.click(screen.getByRole("button", { name: "Enrol for free" }));
    expect(screen.getByText("You're enrolled!")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Start the course" }));
    expect(await screen.findByRole("heading", { level: 1, name: "JSX and components" })).toBeInTheDocument();

    const toggle = screen.getByRole("button", { name: "Mark as complete" });
    await user.click(toggle);

    // The same button, now pressed: focus stays put (Step 18)
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveTextContent("Completed");
    expect(screen.getByRole("progressbar", { name: "React from Scratch progress" })).toHaveAttribute(
      "aria-valuetext",
      "1 of 6 lessons done (17%)"
    );
  });

  it("finishes a course and shows the certificate", async () => {
    const { user } = renderApp("/courses/data-analysis-basics/lessons/from-goals-to-questions", { signedIn: true });

    // "Complete and continue" through the first 4 lessons...
    for (let lesson = 1; lesson <= 4; lesson++) {
      await user.click(await screen.findByRole("button", { name: "Complete and continue" }));
    }
    // ...and the last one with the toggle
    expect(await screen.findByRole("heading", { level: 1, name: "Honest charts" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Mark as complete" }));
    expect(screen.getByText(/you've finished the course!/)).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "See your certificate" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Congratulations, Test!" })).toBeInTheDocument();
    const certificate = screen.getByRole("region", { name: "Certificate of completion" });
    expect(within(certificate).getByText("Test Student")).toBeInTheDocument();
    expect(within(certificate).getByText("Data Analysis Basics")).toBeInTheDocument();
  });

  it("refuses a certificate for an unfinished course", async () => {
    renderApp("/courses/data-analysis-basics/complete", { signedIn: true });
    expect(await screen.findByRole("heading", { level: 1, name: "Not finished yet" })).toBeInTheDocument();
  });
});

describe("the dashboard", () => {
  it("sums up your progress and offers to continue", async () => {
    renderApp("/dashboard", {
      signedIn: true,
      progress: {
        "react-from-scratch": {
          enrolledAt: 1,
          completed: ["jsx-and-components", "props"],
          lastLessonId: "use-state",
          lastVisitedAt: 2,
        },
      },
    });

    expect(await screen.findByRole("heading", { level: 1, name: "Overview" })).toBeInTheDocument();
    expect(screen.getByText("Lessons completed").nextElementSibling).toHaveTextContent("2");
    expect(screen.getByRole("link", { name: "Continue learning" })).toHaveAttribute(
      "href",
      "/courses/react-from-scratch/lessons/use-state"
    );
  });

  it("asks before leaving Settings with unsaved changes", async () => {
    const { user, router } = renderApp("/dashboard/settings", { signedIn: true });
    const name = await screen.findByLabelText(/Display name/);

    await user.type(name, " Jr");
    await user.click(screen.getByRole("link", { name: "Courses" }));

    // useBlocker held the navigation, and asks
    const dialog = screen.getByRole("dialog", { name: "Leave without saving?" });
    expect(currentPath(router)).toBe("/dashboard/settings");

    await user.click(within(dialog).getByRole("button", { name: "Keep editing" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(name).toHaveValue("Test Student Jr");

    await user.click(screen.getByRole("link", { name: "Courses" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Leave without saving" }));
    await waitFor(() => expect(currentPath(router)).toBe("/courses"));
  });
});

describe("when a page crashes", () => {
  it("shows a friendly error instead of a blank page", () => {
    function BrokenPage() {
      throw new Error("Test crash");
    }
    // A tiny router of its own, with the same error boundary as the app
    const router = createMemoryRouter([{ path: "/", element: <BrokenPage />, ErrorBoundary: PageError }]);
    // React logs caught errors to the console; that's expected here
    const originalError = console.error;
    console.error = () => {};
    render(<RouterProvider router={router} />);
    console.error = originalError;

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});
