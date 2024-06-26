# HTML Metadata

[![npm](https://img.shields.io/npm/v/%40jcottam%2Fhtml-metadata)](https://www.npmjs.com/package/@jcottam/html-metadata)
[![license](https://img.shields.io/npm/l/%40jcottam%2Fhtml-metadata)](https://en.wikipedia.org/wiki/MIT_license)
[![developed by](https://img.shields.io/badge/developed_by-javascript.johnny-white)](http://www.johnryancottam.com)

`@jcottam/html-metadata` is a JavaScript library that simplifies the extraction of [HTML meta](https://www.w3schools.com/tags/tag_meta.asp) and [Open Graph](https://ogp.me/) tags from HTML content or URLs. These tags provide structured metadata for webpages, useful for social media sharing and SEO purposes.

The library is compatible with both server and browser environments, supporting ES6 and CommonJS module systems. ES6 modules are suitable for modern browsers, while CommonJS modules are commonly used in server-side JavaScript environments like Node.js.

Contributions to this open-source project are welcome.

![HTML metadata](https://imagedelivery.net/6poAymKUmuHuReMW_n6-MA/45759903-8755-4aa4-a718-e0176107d800/public)

## Features

![NodeJS](https://img.shields.io/badge/server-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/browser-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

- Lightning-fast performance for optimal efficiency.
- Versatile compatibility with both Node.js and web browsers.
- Effortlessly extract [HTML meta](https://www.w3schools.com/tags/tag_meta.asp) and [Open Graph](https://ogp.me/) tags from HTML code or URLs.
- Seamlessly parse and access metadata such as `og:title`, `og:description`, `og:image`, `favicon`, and more.
- Developed using TypeScript to ensure robust type safety.
- Simple integration into web applications for hassle-free implementation.
- Comprehensive support for error handling and customization options.

Please report bugs by [filing an issue](https://github.com/jcottam/html-metadata/issues). Contribute to the project by following the guidelines outlined in the [contributing](#contributing) section.

## Installation

```sh
npm install @jcottam/html-metadata
```

## Usage

**_ES6 and CommonJS syntax supported. Examples below are in CommonJS syntax._**

### Extract tags from a URL

```ts
const { extractFromUrl } = require("@jcottam/html-metadata")

extractFromUrl("https://www.retool.com").then((data) => console.log(data))
```

### Extract tags from an HTML string

Useful in serverless environments like Cloudflare Workers where server-side fetches and `Response` objects are at play.

```ts
const { extractFromHTML } = require("@jcottam/html-metadata")

const data = extractFromHTML(
  "<html><head><meta property='og:title' content='Hello World' /></head></html>"
)
```

## Documentation

### Methods

```ts
extractFromHTML: (html: string, options?: Options) => ExtractedData
```

```ts
extractFromUrl: (url: string, options?: Options) =>
  Promise<ExtractedData | null>
```

### Types

```ts
type Options = {
  timeout?: number // fetch timeout in milliseconds
  metaTags?: string[] // list of meta tags to extract
}

type ExtractedData = {
  [key: string]: string
}
```

### Example Response

```json
{
  "og:type": "website",
  "og:url": "https://retool.com/",
  "og:title": "Retool | The fastest way to build internal software.",
  "og:description": "Retool is the fastest way to build internal software. Use Retool's building blocks to build apps and workflow automations that connect to your databases and APIs, instantly.",
  "og:image": "https://d3399nw8s4ngfo.cloudfront.net/og-image-default.webp",
  "favicon": "/favicon.png",
  "twitter:card": "summary_large_image",
  "twitter:creator": "@retool",
  "twitter:title": "Retool | The fastest way to build internal software.",
  "twitter:description": "Retool is the fastest way to build internal software. Use Retool's building blocks to build apps and workflow automations that connect to your databases and APIs, instantly.",
  "twitter:image": "https://d3399nw8s4ngfo.cloudfront.net/og-image-default.webp"
}
```

### CORS issues (when using the library in the browser)

To circumvent CORS (Cross-Origin Resource Sharing) issues, one approach is to execute the extractFromUrl function from a server-side environment. Alternatively, if you are working in a browser-based setting, you can proxy the request through a free service such as allorigins.win.

For instance, you can use the following URL format to access the desired resource: https://api.allorigins.win/get?url=https://www.retool.com. This will allow you to retrieve the necessary data without running into CORS restrictions. By leveraging this method, you can effectively work around CORS limitations and access the desired information seamlessly.

## Third Party Tools

The module utilizes the following third-party tools for testing and functionality:

- [Vitest](https://vitest.dev/): Next-generation testing framework.
- [Cheerio](https://www.npmjs.com/package/cheerio): A fast, flexible, and lean implementation of core jQuery designed for server-side Node.js.
- [Markdwown-Badges](https://ileriayo.github.io/markdown-badges/): Badges for your personal developer branding, profile, and projects.
<!-- - [Axios](https://www.npmjs.com/package/axios): A promise-based HTTP client for making HTTP requests in Node.js and browser environments. -->

## Contributing

We welcome contributions to the @jcottam/html-metadata module! If you'd like to contribute, please follow these guidelines:

1. [Fork the repository](#forking-the-repository) and create a branch.
1. [Make your changes](#making-changes) and ensure that the code style and tests pass.
1. [Submit a pull request](#issuing-a-pull-request) with a detailed description of your changes.

### Forking the Repository

Click on the "Fork" button in the top right corner of the repository page. This will create a copy of the repository under your GitHub account.

### Cloning the Forked Repository

```sh
git clone https://github.com/your-username/@jcottam/html-metadata.git
```

### Making Changes

Create a new branch to work on your changes:

```sh
git checkout -b feature-branch
```

Make your desired changes to the codebase, documentation, or any other relevant files.

#### Build

```sh
npm install
npm run build
```

#### Test

```sh
npm run test
```

### Committing Changes

1. Stage the changes you have made:

```sh
git add .
```

2. Commit the staged changes with a descriptive message:

```sh
git commit -m "Add feature XYZ"
```

### Pushing Changes

```sh
git push origin feature-branch
```

### Issuing a Pull Request

1. Visit your forked repository on GitHub.
2. Click on the "New pull request" button next to the branch selection drop-down.
3. Select the base branch (usually the main branch of the original repository) and the compare branch (your feature branch).
4. Provide a descriptive title and detailed description of your changes in the pull request.
5. Click on the "Create pull request" button to submit your pull request for review.

### Review and Collaboration

1. The maintainers of the original repository will review your pull request.
2. Any feedback or changes required will be communicated through comments on the pull request.
3. Once the changes are approved, your pull request will be merged into the main repository.
