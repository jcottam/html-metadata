const cheerio = require("cheerio");

export type Options = {
  timeout?: number; // fetch timeout in milliseconds
  metaTags?: string[]; // list of meta tags to extract
};

const formatKeys = (obj: any) => {
  return Object.keys(obj).reduce((acc: any, key: string) => {
    acc[key.replace(":", "_")] = obj[key];
    return acc;
  }, {});
};

// extracts metadata from an HTML string
export const extractFromHTML = (html: string, options?: Options) => {
  const $ = cheerio.load(html);
  const output: any = {};
  const meta = $("meta").toArray();
  output.favicon = $('link[rel="icon"]').attr("href");
  meta.forEach((tag: any) => {
    const name = $(tag).attr("name");
    const property = $(tag).attr("property");
    if (name) output[name] = $(tag).attr("content");
    if (property) output[property] = $(tag).attr("content");
  });

  if (options?.metaTags) {
    const filteredOutput = options.metaTags.reduce((acc: any, tag: string) => {
      if (output[tag]) {
        acc[tag] = output[tag];
      }
      return acc;
    }, {});
    return formatKeys(filteredOutput);
  }

  return formatKeys(output);
};

// extracts metadata from a URL
export const extractFromUrl = async (url: string, options?: Options) => {
  return new Promise((resolve, reject) => {
    if (options?.timeout) {
      setTimeout(() => {
        // timed out, returning null
        resolve(null);
      }, options.timeout);
    }
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          resolve(null);
        }
        response.text().then((html) => {
          resolve(extractFromHTML(html, options));
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
