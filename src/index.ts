import * as cheerio from "cheerio"

export type Options = {
  baseUrl?: string // base URL for relative links
  timeout?: number // fetch timeout in milliseconds
  metaTags?: string[] // list of meta tags to extract
}

export type ExtractedData = {
  [key: string]: string
}

// extracts metadata from an HTML string, returns an object of key-value pairs
export const extractFromHTML = (
  html: string,
  options?: Options | undefined
): ExtractedData => {
  const $ = cheerio.load(html)
  const output: ExtractedData = {}
  try {
    const meta = $("meta").toArray() || undefined
    output.lang = $("html").attr("lang") || ""
    output.title = $("title").text() || ""
    // extract favicon, .ico file
    const faviconHref = $("link[rel*='icon']").attr("href") || ""
    output.favicon = faviconHref
      ? faviconHref.startsWith("http")
        ? faviconHref
        : options?.baseUrl
        ? new URL(faviconHref, options.baseUrl).href
        : faviconHref
      : ""
    // extract apple-touch-icon
    const appleTouchIconHref =
      $('link[rel*="apple-touch-icon"]').attr("href") || ""
    output.appleTouchIcon = appleTouchIconHref
      ? appleTouchIconHref.startsWith("http")
        ? appleTouchIconHref
        : options?.baseUrl
        ? new URL(appleTouchIconHref, options.baseUrl).href
        : appleTouchIconHref
      : ""
    // extract meta tags
    meta.forEach((tag: any) => {
      const name = $(tag).attr("name")
      const property = $(tag).attr("property")
      if (name) output[name] = $(tag).attr("content") || ""
      if (property) output[property] = $(tag).attr("content") || ""
    })

    if (options?.metaTags) {
      const filteredOutput = options.metaTags.reduce(
        (acc: any, tag: string) => {
          if (output[tag]) {
            acc[tag] = output[tag]
          }
          return acc
        },
        {}
      )
      return filteredOutput
    }
    return output
  } catch (error) {
    console.error(error)
    return {}
  }
}

// extracts metadata from a URL
export const extractFromUrl = async (
  url: string,
  options?: Options
): Promise<ExtractedData | null> => {
  return new Promise((resolve, reject) => {
    if (options?.timeout) {
      setTimeout(() => {
        // timed out, returning null
        resolve(null)
      }, options.timeout)
    }
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          resolve(null)
        }
        response.text().then((html) => {
          resolve(extractFromHTML(html, { ...options, baseUrl: url }))
        })
      })
      .catch((error) => {
        reject(error)
      })
  })
}
