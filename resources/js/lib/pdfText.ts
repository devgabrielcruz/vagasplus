// Lê o texto de um PDF no próprio navegador (o arquivo nunca é enviado ao servidor).
// O pdf.js é carregado só quando alguém anexa um PDF, para não pesar no resto do site.

export const PDF_MAX_BYTES = 5 * 1024 * 1024;
const MAX_PAGES = 8;

export type PdfErrorCode = 'type' | 'size' | 'password' | 'empty' | 'failed';

export class PdfTextError extends Error {
    constructor(
        public readonly code: PdfErrorCode,
        message: string,
    ) {
        super(message);
    }
}

export async function extractPdfText(file: File): Promise<string> {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        throw new PdfTextError('type', 'Envie um arquivo PDF.');
    }
    if (file.size > PDF_MAX_BYTES) {
        throw new PdfTextError('size', 'O PDF é maior que 5 MB. Cole o texto do currículo no campo abaixo.');
    }

    try {
        const [pdfjs, worker] = await Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]);
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

        const doc = await pdfjs.getDocument({ data: await file.arrayBuffer(), isEvalSupported: false }).promise;
        const pages: string[] = [];

        try {
            for (let n = 1; n <= Math.min(doc.numPages, MAX_PAGES); n++) {
                const page = await doc.getPage(n);
                const content = await page.getTextContent();
                pages.push(content.items.map((i) => ('str' in i ? i.str + (i.hasEOL ? '\n' : ' ') : '')).join(''));
            }
        } finally {
            await doc.destroy();
        }

        const text = pages
            .join('\n\n')
            .replace(/[ \t]+/g, ' ')
            .replace(/ *\n */g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        if (text.length < 30) {
            throw new PdfTextError('empty', 'Não encontramos texto neste PDF (parece ser uma imagem escaneada). Cole o texto do currículo no campo abaixo.');
        }

        return text;
    } catch (e) {
        if (e instanceof PdfTextError) throw e;
        if ((e as { name?: string })?.name === 'PasswordException') {
            throw new PdfTextError('password', 'Este PDF tem senha. Remova a proteção ou cole o texto do currículo no campo abaixo.');
        }
        throw new PdfTextError('failed', 'Não foi possível ler este PDF. Cole o texto do currículo no campo abaixo.');
    }
}
