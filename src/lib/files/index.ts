import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/env";

export interface FileStore {
  /** Response that hands the PDF to the browser: the file itself locally, a redirect to a signed URL on S3. */
  downloadResponse(key: string, fileName: string): Promise<Response>;
}

/** Development-only: serves PDFs from LOCAL_PDF_DIR, which must stay outside public/ and out of git. */
class LocalFileStore implements FileStore {
  constructor(private readonly baseDir: string) {}

  async downloadResponse(key: string, fileName: string): Promise<Response> {
    const base = path.resolve(this.baseDir);
    const file = path.resolve(base, key);
    if (!file.startsWith(base + path.sep)) {
      throw new Error(`File key escapes the storage directory: ${key}`);
    }
    const content = await readFile(file);
    return new Response(new Uint8Array(content), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  }
}

let store: FileStore | undefined;

function createStore(): FileStore {
  switch (env.fileStore()) {
    case "local":
      return new LocalFileStore(env.localPdfDir());
  }
}

export function fileStore(): FileStore {
  store ??= createStore();
  return store;
}
