import { describe, expect, test } from "vitest";
import { extractFromUrl, extractFromHTML } from "../src/index";

describe("extractFromUrl", () => {
  test("return metadata when found", async () => {
    const data = await extractFromUrl(
      "https://medium.com/@thebusinessbench0/how-can-the-best-ai-tools-drive-unmatched-efficiency-in-your-brand-strategy-40f52181447e"
    );
    expect(data).toBeInstanceOf(Object);
    expect(data).not.toBeNull();
  });

  test("return null if no metadata or web page found", async () => {
    const data = await extractFromUrl("https://www.google.com/invalid");
    expect(data).toBeNull();
  });
});

describe("extractFromHTML", () => {
  test("should return OpenGraph data object if metadata is found", () => {
    const data = extractFromHTML(
      "<html><head><meta property='og:title' content='Hello World' /><meta property='og:description' content='This is a test' /></head></html>"
    );
    expect(data).toEqual({
      og_title: "Hello World",
      og_description: "This is a test",
    });
  });
});
