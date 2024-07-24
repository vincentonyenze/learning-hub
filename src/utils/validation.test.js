import { describe, expect, it } from "vitest";
import { BIO_MAX, checkEmail, checkName, validateProfile, validateSignIn } from "./validation.js";

describe("checkName", () => {
  it.each([
    ["", "Enter your name"],
    ["   ", "Enter your name"],
    ["A", "at least 2 characters"],
    [" A ", "at least 2 characters"], // spaces don't count
    ["x".repeat(51), "50 characters or fewer"],
  ])("rejects %j", (value, message) => {
    expect(checkName(value)).toContain(message);
  });

  it.each(["Jo", "Test Student", "x".repeat(50), "  Spaced Out  "])("accepts %j", (value) => {
    expect(checkName(value)).toBe("");
  });
});

describe("checkEmail", () => {
  it.each(["", "test", "test@", "test@example", "a b@example.com", "@example.com"])("rejects %j", (value) => {
    expect(checkEmail(value)).not.toBe("");
  });

  it.each(["test.student@example.com", "  padded@example.com  ", "a+tag@sub.example.org"])("accepts %j", (value) => {
    expect(checkEmail(value)).toBe("");
  });
});

describe("validateSignIn", () => {
  it("lists only the fields with problems", () => {
    expect(validateSignIn({ name: "", email: "" })).toEqual({
      name: "Enter your name",
      email: "Enter your email address",
    });
    expect(validateSignIn({ name: "Test Student", email: "nope" })).toEqual({
      email: "Enter an email address like name@example.com",
    });
    expect(validateSignIn({ name: "Test Student", email: "test@example.com" })).toEqual({});
  });
});

describe("validateProfile", () => {
  const valid = { name: "Test Student", bio: "", dailyGoal: "20" };

  it("accepts a valid profile", () => {
    expect(validateProfile(valid)).toEqual({});
  });

  it("allows a bio of exactly the limit, but not one more", () => {
    expect(validateProfile({ ...valid, bio: "x".repeat(BIO_MAX) })).toEqual({});
    expect(validateProfile({ ...valid, bio: "x".repeat(BIO_MAX + 1) })).toHaveProperty("bio");
  });

  it("ignores spaces around the bio when counting", () => {
    expect(validateProfile({ ...valid, bio: `  ${"x".repeat(BIO_MAX)}  ` })).toEqual({});
  });

  it("only accepts the offered daily goals", () => {
    expect(validateProfile({ ...valid, dailyGoal: "45" })).toHaveProperty("dailyGoal");
    expect(validateProfile({ ...valid, dailyGoal: 60 })).toEqual({});
  });
});
