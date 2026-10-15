import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

const SIGNED_URL_TTL_SECONDS = 15 * 60;

/** Private bucket from infra/app/pdfs.tf. Each download gets a fresh, short-lived signed URL. */
class S3FileStore implements FileStore {
  private readonly s3 = new S3Client({});

  constructor(private readonly bucket: string) {}

  async downloadResponse(key: string, fileName: string): Promise<Response> {
    // The URL also stops working when the signing credentials expire, if that happens first.
    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ResponseContentType: "application/pdf",
        ResponseContentDisposition: `attachment; filename="${fileName}"`,
      }),
      { expiresIn: SIGNED_URL_TTL_SECONDS },
    );
    return new Response(null, {
      status: 303,
      headers: { Location: url, "Cache-Control": "private, no-store" },
    });
  }
}

let store: FileStore | undefined;

function createStore(): FileStore {
  switch (env.fileStore()) {
    case "local":
      return new LocalFileStore(env.localPdfDir());
    case "s3":
      return new S3FileStore(env.pdfBucket());
  }
}

export function fileStore(): FileStore {
  store ??= createStore();
  return store;
}
