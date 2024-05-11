// list of meta properties we want to return
type OpenGraph = {
  title?: string;
  favicon?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_image_type?: string;
  og_image_width?: string;
  og_image_height?: string;
  og_image_alt?: string;
  og_url?: string;
  og_site_name?: string;
  og_type?: string;
  og_locale?: string;
  article_publisher?: string;
  article_published_time?: string;
  article_modified_time?: string;
  author?: string;
  twitterSite?: string;
  fb_pages?: string;
};

// list of meta properties we want to extract
const metaProperties = [
  "og:title",
  "og:description",
  "og:image",
  "og:image:type",
  "og:image:width",
  "og:image:height",
  "og:image:alt",
  "og:url",
  "og:site_name",
  "og:type",
  "og:locale",
  "article:publisher",
  "article:published_time",
  "article:modified_time",
  "author",
  "twitterSite:",
  "fb:pages",
];

// extracts metadata from an HTML string
export const extractFromHTML = (html: string) => {
  const cheerio = require("cheerio");
  // load the HTML content into cheerio
  const $ = cheerio.load(html);

  // extract meta tags
  const meta = $("meta").toArray();

  // loop through meta tags and extract the ones we want
  const output: OpenGraph = {};
  if ($("title").text()) output.title = $("title").text();
  if ($('link[rel="icon"]').attr("href"))
    output.favicon = $('link[rel="icon"]').attr("href");
  meta.forEach((tag: any) => {
    const property = $(tag).attr("property");
    if (property && metaProperties.includes(property)) {
      output[
        property.replace(/:/g, "_").replace(/-/g, "_") as keyof OpenGraph
      ] = $(tag).attr("content");
    }
  });

  // return object or null if object is empty
  return Object.keys(output).length > 0 ? output : null;
};

// extracts metadata from a URL
export const extractFromUrl = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  return extractFromHTML(html);
};
