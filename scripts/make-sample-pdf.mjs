// Writes a placeholder PDF for each test room into LOCAL_PDF_DIR (default storage/pdfs), which is git-ignored.
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const baseDir = process.env.LOCAL_PDF_DIR ?? "storage/pdfs";
const samples = [
  { key: "rooms/the-last-train/v1.en.pdf", title: "The Last Train - sample dossier (English)" },
  { key: "rooms/the-last-train/v1.es.pdf", title: "The Last Train - dossier de muestra (Español)" },
  { key: "rooms/the-last-train/v1.ca.pdf", title: "The Last Train - dossier de mostra (Català)" },
  { key: "rooms/the-last-train/v1.en.solution.pdf", title: "The Last Train - sample solution (English)" },
  { key: "rooms/the-last-train/v1.es.solution.pdf", title: "The Last Train - solucion de muestra (Español)" },
  { key: "rooms/the-last-train/v1.ca.solution.pdf", title: "The Last Train - solucio de mostra (Català)" },
];

function buildPdf(title) {
  const text = title.replace(/[()\\]/g, "\\$&");
  const stream = `BT /F1 24 Tf 72 720 Td (${text}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = objects.map((body, i) => {
    const offset = pdf.length;
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
    return offset;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return pdf;
}

const force = process.env.FORCE === "1";

for (const sample of samples) {
  const file = path.resolve(baseDir, sample.key);
  if (!force) {
    try {
      const existing = await stat(file);
      if (existing.size > 2048) {
        console.log(`Skip ${path.relative(process.cwd(), file)} (real PDF already there)`);
        continue;
      }
    } catch {
      // missing — write the stub
    }
  }
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, buildPdf(sample.title), "latin1");
  console.log(`Wrote ${path.relative(process.cwd(), file)}`);
}
