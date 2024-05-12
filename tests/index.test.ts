import { describe, expect, test } from "vitest";
import { extractFromUrl, extractFromHTML } from "../src/index";
import { Options } from "../src/index";

describe("extractFromUrl", () => {
  test("return metadata", async () => {
    // const url = "https://www.alpine-suites.com";
    const url =
      "https://medium.com/@thebusinessbench0/how-can-the-best-ai-tools-drive-unmatched-efficiency-in-your-brand-strategy-40f52181447e";
    const options: Options = {
      metaTags: ["title", "favicon", "og:title", "og:description", "og:image"],
    };
    const data = await extractFromUrl(url, options);
    expect(data).toBeInstanceOf(Object);
    expect(data).not.toBeNull();
  });

  test("return null if no metadata or web page is found", async () => {
    const data = await extractFromUrl("https://www.google.com/invalid");
    expect(data).toBeNull();
  });
});

describe("extractFromHTML", () => {
  test("return metadata from HTML string", () => {
    const data = extractFromHTML(
      "<html><head><meta property='og:title' content='Hello World' /><meta property='og:description' content='This is a test' /></head></html>"
    );
    console.log("data: ", data);
    expect(data).toEqual({
      og_title: "Hello World",
      og_description: "This is a test",
    });
  });
});
