const cheerio = require("cheerio")

export type Options = {
  timeout?: number // fetch timeout in milliseconds
  metaTags?: string[] // list of meta tags to extract
}

export type ExtractedData = {
  [key: string]: string
}

// extracts metadata from an HTML string, returns an object of key-value pairs
export const extractFromHTML = (
  html: string,
  options?: Options
): ExtractedData => {
  const $ = cheerio.load(html)
  const output: ExtractedData = {}
  try {
    const meta = $("meta").toArray() || undefined
    output.title = $("title").text() || undefined
    output.favicon = $('link[rel="icon"]').attr("href")
    meta.forEach((tag: any) => {
      const name = $(tag).attr("name")
      const property = $(tag).attr("property")
      if (name) output[name] = $(tag).attr("content")
      if (property) output[property] = $(tag).attr("content")
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
          resolve(extractFromHTML(html, options))
        })
      })
      .catch((error) => {
        reject(error)
      })
  })
}
