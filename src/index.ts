import * as cheerio from "cheerio"

/**
 * Configuration options for metadata extraction
 */
export type Options = {
  /** Base URL for resolving relative links (e.g., favicon, apple-touch-icon) */
  baseUrl?: string
  /** Fetch timeout in milliseconds for URL extraction */
  timeout?: number
  /** Specific meta tags to extract. If not provided, all meta tags will be extracted */
  metaTags?: string[]
}

/**
 * Extracted metadata object containing key-value pairs of meta tags and their content
 */
export type ExtractedData = {
  /** Language attribute from the HTML tag */
  lang?: string
  /** Page title from the title tag */
  title?: string
  /** Favicon URL */
  favicon?: string
  /** Apple touch icon URL */
  "apple-touch-icon"?: string
  /** Open Graph and other meta tag properties */
  [key: string]: string | undefined
}

/**
 * Extracts metadata from an HTML string
 *
 * @param html - The HTML content to parse
 * @param options - Optional configuration for extraction
 * @returns Object containing extracted metadata
 *
 * @example
 * ```typescript
 * const html = '<html><head><meta property="og:title" content="My Site" /></head></html>'
 * const metadata = extractFromHTML(html)
 * console.log(metadata['og:title']) // "My Site"
 * ```
 */
export const extractFromHTML = (
  html: string,
  options?: Options
): ExtractedData => {
  const output: ExtractedData = {}
  try {
    // Use cheerio with more lenient parsing options
    const $ = cheerio.load(html, {
      xmlMode: false,
    })

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
    output["apple-touch-icon"] = appleTouchIconHref
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

    // Also try to extract meta tags using regex for malformed HTML
    if (html.includes("<meta") && !html.includes("</meta>")) {
      const metaRegex = /<meta\s+([^>]*?)(?:\s*\/?>|$)/gi
      let match
      while ((match = metaRegex.exec(html)) !== null) {
        const attributes = match[1]
        const nameMatch = attributes.match(/name\s*=\s*["']([^"']*)["']/i)
        const propertyMatch = attributes.match(
          /property\s*=\s*["']([^"']*)["']/i
        )
        const contentMatch = attributes.match(/content\s*=\s*["']([^"']*)["']/i)

        if (contentMatch) {
          const content = contentMatch[1]
          if (nameMatch) {
            output[nameMatch[1]] = content
          }
          if (propertyMatch) {
            output[propertyMatch[1]] = content
          }
        }
      }
    }

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

/**
 * Extracts metadata from a URL by fetching the HTML content
 *
 * @param url - The URL to fetch and extract metadata from
 * @param options - Optional configuration for extraction
 * @returns Promise that resolves to extracted metadata or null if extraction fails
 *
 * @example
 * ```typescript
 * const metadata = await extractFromUrl('https://example.com')
 * if (metadata) {
 *   console.log(metadata['og:title'])
 * }
 * ```
 */
export const extractFromUrl = async (
  url: string,
  options?: Options
): Promise<ExtractedData | null> => {
  return new Promise((resolve) => {
    // Validate URL first
    try {
      new URL(url)
    } catch {
      resolve(null)
      return
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    if (options?.timeout) {
      timeoutId = setTimeout(() => {
        // timed out, returning null
        resolve(null)
      }, options.timeout)
    }

    fetch(url)
      .then((response) => {
        if (timeoutId) clearTimeout(timeoutId)
        if (!response.ok) {
          resolve(null)
          return
        }
        response
          .text()
          .then((html) => {
            resolve(
              extractFromHTML(html, {
                ...options,
                baseUrl: options?.baseUrl || url,
              })
            )
          })
          .catch(() => {
            resolve(null)
          })
      })
      .catch(() => {
        if (timeoutId) clearTimeout(timeoutId)
        resolve(null)
      })
  })
}
