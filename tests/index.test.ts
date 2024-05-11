import { describe, expect } from "@jest/globals";
import { extractFromUrl, extractFromHTML } from "../src/index";

describe("Extract metadata from an HTML string", () => {
  it("should return OpenGraph data object if metadata is found", () => {
    const data = extractFromHTML(
      "<html><head><meta property='og:title' content='Hello World' /><meta property='og:description' content='This is a test' /></head></html>"
    );
    expect(data).toBeInstanceOf(Object);
    expect(data).not.toBeNull();
  });

  it("should return null if no metadata is found", () => {
    const data = extractFromHTML("<html><head></head></html>");
    expect(data).toBeNull();
  });
});

describe("Extract metadata from a URL", () => {
  it("should return OpenGraph data object if metadata is found", async () => {
    const data = await extractFromUrl(
      "https://medium.com/@thebusinessbench0/how-can-the-best-ai-tools-drive-unmatched-efficiency-in-your-brand-strategy-40f52181447e"
    );
    expect(data).toBeInstanceOf(Object);
    expect(data).not.toBeNull();
  });
});
