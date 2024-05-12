import { describe, expect, test } from "vitest";
import { extractFromUrl, extractFromHTML } from "../src/index";
import { Options } from "../src/index";

describe("extractFromUrl", () => {
  test("return metadata", async () => {
    const url = "https://retool.com";
    const options: Options = {
      metaTags: ["title", "favicon", "og:title", "og:description", "og:image"],
    };
    const data = await extractFromUrl(url, options);
    console.log("data: ", data);
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
    expect(data).toEqual({
      "og:title": "Hello World",
      "og:description": "This is a test",
    });
  });
});
