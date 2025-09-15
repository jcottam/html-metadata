// Mock File API for Node.js environment
if (typeof globalThis.File === "undefined") {
  globalThis.File = class File {
    constructor(
      public chunks: any[],
      public filename: string,
      public options: any = {}
    ) {}
  } as any
}

// Mock FileList API for Node.js environment
if (typeof globalThis.FileList === "undefined") {
  globalThis.FileList = class FileList extends Array {
    constructor() {
      super()
    }
  } as any
}
