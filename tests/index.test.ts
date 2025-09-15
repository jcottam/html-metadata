import { describe, expect, test, vi } from "vitest"
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

  test("handle timeout correctly", async () => {
    const url = "https://httpstat.us/200?sleep=5000" // 5 second delay
    const options: Options = { timeout: 1000 } // 1 second timeout
    const data = await extractFromUrl(url, options)
    expect(data).toBeNull()
  }, 10000)

  test("handle network errors gracefully", async () => {
    const data = await extractFromUrl(
      "https://this-domain-does-not-exist-12345.com"
    )
    expect(data).toBeNull()
  })

  test("handle invalid URLs", async () => {
    const data = await extractFromUrl("not-a-valid-url")
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

  test("extract title from title tag", () => {
    const html = "<html><head><title>My Website Title</title></head></html>"
    const data = extractFromHTML(html)
    expect(data.title).toBe("My Website Title")
  })

  test("extract favicon with relative URL", () => {
    const html =
      '<html><head><link rel="icon" href="/favicon.ico" /></head></html>'
    const data = extractFromHTML(html)
    expect(data.favicon).toBe("/favicon.ico")
  })

  test("extract favicon with absolute URL", () => {
    const html =
      '<html><head><link rel="icon" href="https://example.com/favicon.ico" /></head></html>'
    const data = extractFromHTML(html)
    expect(data.favicon).toBe("https://example.com/favicon.ico")
  })

  test("resolve relative favicon with baseUrl", () => {
    const html =
      '<html><head><link rel="icon" href="/favicon.ico" /></head></html>'
    const options: Options = { baseUrl: "https://example.com" }
    const data = extractFromHTML(html, options)
    expect(data.favicon).toBe("https://example.com/favicon.ico")
  })

  test("extract apple-touch-icon", () => {
    const html =
      '<html><head><link rel="apple-touch-icon" href="/apple-touch-icon.png" /></head></html>'
    const data = extractFromHTML(html)
    expect(data["apple-touch-icon"]).toBe("/apple-touch-icon.png")
  })

  test("extract meta tags with name attribute", () => {
    const html =
      '<html><head><meta name="description" content="My description" /></head></html>'
    const data = extractFromHTML(html)
    expect(data.description).toBe("My description")
  })

  test("extract meta tags with property attribute", () => {
    const html =
      '<html><head><meta property="og:title" content="My OG Title" /></head></html>'
    const data = extractFromHTML(html)
    expect(data["og:title"]).toBe("My OG Title")
  })

  test("filter meta tags with options", () => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="My OG Title" />
          <meta property="og:description" content="My OG Description" />
          <meta name="description" content="My description" />
        </head>
      </html>
    `
    const options: Options = { metaTags: ["og:title", "description"] }
    const data = extractFromHTML(html, options)
    expect(data).toEqual({
      "og:title": "My OG Title",
      description: "My description",
    })
  })

  test("handle empty HTML string", () => {
    const data = extractFromHTML("")
    expect(data).toEqual({
      lang: "",
      title: "",
      favicon: "",
      "apple-touch-icon": "",
    })
  })

  test("handle malformed HTML gracefully", () => {
    const html = "<html><head><meta property='og:title' content='Test'"
    const data = extractFromHTML(html)
    expect(data["og:title"]).toBe("Test")
  })

  test("handle HTML without head tag", () => {
    const html = "<html><body><p>Content</p></body></html>"
    const data = extractFromHTML(html)
    expect(data).toEqual({
      lang: "",
      title: "",
      favicon: "",
      "apple-touch-icon": "",
    })
  })

  test("extract multiple meta tags", () => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="Title" />
          <meta property="og:description" content="Description" />
          <meta property="og:image" content="https://example.com/image.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
        </head>
      </html>
    `
    const data = extractFromHTML(html)
    expect(data["og:title"]).toBe("Title")
    expect(data["og:description"]).toBe("Description")
    expect(data["og:image"]).toBe("https://example.com/image.jpg")
    expect(data["twitter:card"]).toBe("summary_large_image")
  })

  test("handle meta tags without content attribute", () => {
    const html = '<html><head><meta property="og:title" /></head></html>'
    const data = extractFromHTML(html)
    expect(data["og:title"]).toBe("")
  })

  test("handle meta tags with empty content", () => {
    const html =
      '<html><head><meta property="og:title" content="" /></head></html>'
    const data = extractFromHTML(html)
    expect(data["og:title"]).toBe("")
  })
})
