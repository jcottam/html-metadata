import { describe, expect, test } from "vitest"
import { extractFromUrl, extractFromHTML } from "../src/index"
import { Options } from "../src/index"

describe("extractFromUrl", () => {
  test("return metadata from URL", async () => {
    const url = "https://www.stripe.com/"
    let options: Options = {
      metaTags: ["lang", "title", "og:image", "favicon", "apple-touch-icon"],
    }
    const data = await extractFromUrl(url, options)
    // console.log("data: ", data)
    expect(data?.title).toContain("Stripe")
    expect(data?.favicon).toBeTruthy()
    expect(data?.favicon).toMatch(/^\/.*|https?:\/\/.*/)
  })

  test("return null if no metadata or web page is found", async () => {
    const data = await extractFromUrl("https://www.google.com/invalid")
    expect(data).toBeNull()
  })
})

describe("extractFromHTML", () => {
  test("return metadata from HTML string", () => {
    const data = extractFromHTML(
      "<html lang='en'><head><meta property='og:title' content='Hello World' /><meta property='og:description' content='This is a test' /></head></html>"
    )
    // console.log("data: ", data)
    expect(data).toEqual({
      lang: "en",
      title: "",
      favicon: "",
      "apple-touch-icon": "",
      "og:title": "Hello World",
      "og:description": "This is a test",
    })
  })
})
