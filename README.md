# HTML Metadata

[![npm](https://img.shields.io/npm/v/%40jcottam%2Fhtml-metadata)](https://www.npmjs.com/package/@jcottam/html-metadata)
[![license](https://img.shields.io/npm/l/%40jcottam%2Fhtml-metadata)](https://en.wikipedia.org/wiki/MIT_license)
[![developed by](https://img.shields.io/badge/developed_by-jcottam-white)](http://www.johnryancottam.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Compatible-green)](https://nodejs.org/)
[![Browser](https://img.shields.io/badge/Browser-Compatible-orange)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

`@jcottam/html-metadata` is a lightweight, TypeScript-first JavaScript library for extracting HTML meta tags, Open Graph tags, and other metadata from HTML content or URLs. Perfect for social media sharing, SEO analysis, and web scraping applications.

**Compatibility:** Works seamlessly with Node.js (CommonJS) and modern browsers (ES6+).

## Features

- 🚀 **Fast & Lightweight** - Built on Cheerio for optimal performance
- 📱 **Open Graph Support** - Extract all Open Graph meta tags for social media
- 🎯 **TypeScript Ready** - Full type definitions and IntelliSense support
- 🌐 **URL & HTML Support** - Extract from URLs or HTML strings directly
- 🔧 **Configurable** - Customizable extraction with filtering and timeout options
- 🛡️ **Error Resilient** - Graceful handling of malformed HTML and network errors
- 📦 **Zero Dependencies** - Only depends on Cheerio for HTML parsing

## Installation

```sh
npm install @jcottam/html-metadata
```

## Usage

### ES6/ESM Import

```typescript
import { extractFromUrl, extractFromHTML } from "@jcottam/html-metadata"
```

### CommonJS Require

```javascript
const { extractFromUrl, extractFromHTML } = require("@jcottam/html-metadata")
```

## Examples

### Extract metadata from a URL

```typescript
import { extractFromUrl } from "@jcottam/html-metadata"

// Basic usage
const metadata = await extractFromUrl("https://www.retool.com")
console.log(metadata)
// Output: { lang: "en", title: "Retool", og:title: "...", og:description: "...", ... }

// With options
const options = {
  timeout: 5000, // 5 second timeout
  metaTags: ["og:title", "og:description", "og:image"], // Only extract specific tags
}
const filteredMetadata = await extractFromUrl("https://example.com", options)
```

### Extract metadata from HTML string

```typescript
import { extractFromHTML } from "@jcottam/html-metadata"

const html = `
<html lang="en">
  <head>
    <title>My Website</title>
    <meta property="og:title" content="My Amazing Website" />
    <meta property="og:description" content="This is a brief description" />
    <meta property="og:image" content="https://example.com/image.jpg" />
    <link rel="icon" href="/favicon.ico" />
  </head>
</html>
`

const metadata = extractFromHTML(html)
console.log(metadata)
// Output: {
//   lang: "en",
//   title: "My Website",
//   "og:title": "My Amazing Website",
//   "og:description": "This is a brief description",
//   "og:image": "https://example.com/image.jpg",
//   favicon: "/favicon.ico"
// }
```

### Resolve relative URLs with baseUrl

```typescript
const html = '<html><head><link rel="icon" href="/favicon.ico" /></head></html>'
const options = { baseUrl: "https://example.com" }
const metadata = extractFromHTML(html, options)
console.log(metadata.favicon) // "https://example.com/favicon.ico"
```

## API Reference

### Methods

#### `extractFromHTML(html: string, options?: Options): ExtractedData`

Extracts metadata from an HTML string.

**Parameters:**

- `html` (string): The HTML content to parse
- `options` (Options, optional): Configuration options

**Returns:** `ExtractedData` - Object containing extracted metadata

#### `extractFromUrl(url: string, options?: Options): Promise<ExtractedData | null>`

Extracts metadata from a URL by fetching the HTML content.

**Parameters:**

- `url` (string): The URL to fetch and extract metadata from
- `options` (Options, optional): Configuration options

**Returns:** `Promise<ExtractedData | null>` - Promise that resolves to extracted metadata or null if extraction fails

### Types

#### `Options`

```typescript
type Options = {
  /** Base URL for resolving relative links (e.g., favicon, apple-touch-icon) */
  baseUrl?: string
  /** Fetch timeout in milliseconds for URL extraction */
  timeout?: number
  /** Specific meta tags to extract. If not provided, all meta tags will be extracted */
  metaTags?: string[]
}
```

#### `ExtractedData`

```typescript
type ExtractedData = {
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
```

### Example Response

```json
{
  "lang": "en",
  "title": "Retool | The fastest way to build internal software.",
  "og:type": "website",
  "og:url": "https://retool.com/",
  "og:title": "Retool | The fastest way to build internal software.",
  "og:description": "Retool is the fastest way to build internal software. Use Retool's building blocks to build apps and workflow automations that connect to your databases and APIs, instantly.",
  "og:image": "https://d3399nw8s4ngfo.cloudfront.net/og-image-default.webp",
  "favicon": "/favicon.png",
  "apple-touch-icon": "/apple-touch-icon.png"
}
```

## Browser Usage & CORS

When using `extractFromUrl` in browsers, you may encounter CORS restrictions. To bypass CORS:

1. **Server-side usage**: Run `extractFromUrl` on a server
2. **Proxy services**: Use a CORS proxy like [AllOrigins](https://api.allorigins.win)
3. **Browser extensions**: Use CORS-disabling browser extensions for development

## Error Handling

The library handles errors gracefully:

```typescript
// Network errors return null
const result = await extractFromUrl("https://invalid-url.com")
if (result === null) {
  console.log("Failed to fetch or parse the URL")
}

// Malformed HTML is handled gracefully
const metadata = extractFromHTML(
  "<html><head><meta property='og:title' content='Test'"
)
console.log(metadata["og:title"]) // "Test"
```

## Supported Meta Tags

The library extracts the following types of metadata:

- **HTML attributes**: `lang` from `<html>` tag
- **Title**: Content from `<title>` tag
- **Favicon**: `href` from `<link rel="icon">` tags
- **Apple Touch Icon**: `href` from `<link rel="apple-touch-icon">` tags
- **Meta tags**: All `<meta>` tags with `name` or `property` attributes
- **Open Graph**: All `og:*` properties
- **Twitter Cards**: All `twitter:*` properties
- **Custom meta tags**: Any custom meta tags you define

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
git clone https://github.com/jcottam/html-metadata.git
cd html-metadata
npm install
```

### Scripts

```bash
npm run build    # Build the library
npm test         # Run tests
npm run release  # Release new version
```

### Testing

The project uses [Vitest](https://vitest.dev/) for testing. Run tests with:

```bash
npm test
```

## Dependencies

- **[Cheerio](https://cheerio.js.org/)**: Fast, flexible HTML parsing
- **[Vitest](https://vitest.dev/)**: Next-generation testing framework
- **[Rollup](https://rollupjs.org/)**: Module bundler for multiple formats

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository and create a feature branch
2. **Make changes** and ensure tests pass (`npm test`)
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

### Development Guidelines

- Follow TypeScript best practices
- Add JSDoc comments for new functions
- Ensure all tests pass
- Update README for new features
- Use conventional commit messages

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

## Changelog

### v3.0.3

- Updated dependencies to latest versions
- Enhanced TypeScript type definitions
- Added comprehensive test coverage
- Improved error handling and documentation
- Added JSDoc comments for better IDE support
