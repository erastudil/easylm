import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

export interface DocumentMetadata {
  title: string;
  author: string;
  subject?: string;
  date?: string;
}

/**
 * Trigger a browser client-side download using a Blob and URL.createObjectURL.
 * Fully private, zero server communication.
 */
export function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Strip Markdown syntax down to clean human-readable plain text.
 */
export function stripMarkdown(md: string): string {
  if (!md) return '';
  return md
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, '')) // Code blocks
    .replace(/^#{1,6}\s+/gm, '') // Headers
    .replace(/^>\s+/gm, '') // Blockquotes
    .replace(/^\s*[-*+]\s+/gm, '• ') // Unordered lists
    .replace(/^\s*\d+\.\s+/gm, (m) => m) // Ordered lists
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Italic
    .replace(/~~(.*?)~~/g, '$1') // Strikethrough
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/\|/g, ' ') // Table borders
    .replace(/^[-:\s|]{3,}$/gm, '') // Table header separators
    .replace(/\n{3,}/g, '\n\n') // Collapse excessive newlines
    .trim();
}

/**
 * Extract Markdown tables and convert them to RFC-4180 CSV format.
 */
export function markdownTableToCsv(md: string): string | null {
  const lines = md.split('\n');
  const tableLines: string[] = [];
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      // Skip delimiter row like |---|---|
      if (/^\|[-:\s|]+\|$/.test(trimmed)) continue;
      tableLines.push(trimmed);
    } else if (inTable) {
      break;
    }
  }

  if (tableLines.length === 0) return null;

  return tableLines
    .map((row) => {
      const cells = row
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim());
      return cells
        .map((c) => {
          if (c.includes(',') || c.includes('"') || c.includes('\n')) {
            return `"${c.replace(/"/g, '""')}"`;
          }
          return c;
        })
        .join(',');
    })
    .join('\r\n');
}

/**
 * Convert Markdown text to clean LaTeX article source code.
 */
export function markdownToLatex(content: string, meta?: DocumentMetadata): string {
  const title = meta?.title || 'Academic Report';
  const author = meta?.author || 'EasyLM Scholar';
  const date = meta?.date || new Date().toLocaleDateString();

  let body = content;

  // Protect code blocks before regex replacement
  const codeBlocks: string[] = [];
  body = body.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`\\begin{verbatim}\n${code.trim()}\n\\end{verbatim}`);
    return `%%CODEBLOCK_${idx}%%`;
  });

  // Convert headings
  body = body.replace(/^# (.*$)/gm, '\\section{$1}');
  body = body.replace(/^## (.*$)/gm, '\\subsection{$1}');
  body = body.replace(/^### (.*$)/gm, '\\subsubsection{$1}');
  body = body.replace(/^#### (.*$)/gm, '\\paragraph{$1}');

  // Convert bold and italic
  body = body.replace(/\*\*(.*?)\*\*/g, '\\textbf{$1}');
  body = body.replace(/\*(.*?)\*/g, '\\textit{$1}');

  // Convert inline code
  body = body.replace(/`([^`]+)`/g, '\\texttt{$1}');

  // Convert blockquotes
  body = body.replace(/^>\s+(.*$)/gm, '\\begin{quote}\n$1\n\\end{quote}');

  // Convert bullet lists
  body = body.replace(/^[-*+]\s+(.*$)/gm, '\\item $1');
  body = body.replace(/((?:\\item .*?\n)+)/g, '\\begin{itemize}\n$1\\end{itemize}\n');

  // Convert numbered lists
  body = body.replace(/^\d+\.\s+(.*$)/gm, '\\item $1');

  // Restore code blocks
  body = body.replace(/%%CODEBLOCK_(\d+)%%/g, (_m, idx) => codeBlocks[Number(idx)] || '');

  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath,amsfonts,amssymb}
\\usepackage{geometry}
\\geometry{margin=1in}
\\usepackage{hyperref}
\\usepackage{booktabs}

\\title{${escapeLatex(title)}}
\\author{${escapeLatex(author)}}
\\date{${escapeLatex(date)}}

\\begin{document}
\\maketitle

${meta?.subject ? `\\noindent\\textbf{Subject / Course:} ${escapeLatex(meta.subject)}\\\\\\bigskip\n` : ''}

${body}

\\end{document}
`;
}

function escapeLatex(s: string): string {
  return s
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Generate publication-ready HTML with academic print stylesheets.
 */
export function generateAcademicHtml(contentMd: string, meta: DocumentMetadata): string {
  const renderedHtml = DOMPurify.sanitize(marked.parse(contentMd) as string);
  const title = meta.title || 'Academic Paper';
  const author = meta.author || 'Author';
  const date = meta.date || new Date().toLocaleDateString();
  const subject = meta.subject || '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      margin: 1in;
      size: letter;
      @bottom-right {
        content: counter(page);
      }
    }
    body {
      font-family: "Charter", "Georgia", "Times New Roman", serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #111118;
      background: #ffffff;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    .header-block {
      border-bottom: 2px solid #8b5cf6;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    .header-title {
      font-size: 24pt;
      font-weight: 700;
      color: #09090e;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }
    .meta-row {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 10pt;
      color: #71717a;
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    h1, h2, h3, h4 {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #18181b;
      margin-top: 1.8rem;
      margin-bottom: 0.6rem;
      line-height: 1.3;
    }
    h1 { font-size: 16pt; border-bottom: 1px solid #e4e4e7; padding-bottom: 0.3rem; }
    h2 { font-size: 14pt; }
    h3 { font-size: 12pt; }
    p { margin: 0 0 1rem 0; text-align: justify; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1.5rem 0;
      font-size: 10.5pt;
    }
    th, td {
      border: 1px solid #d4d4d8;
      padding: 0.5rem 0.75rem;
      text-align: left;
    }
    th {
      background-color: #f4f4f5;
      font-weight: 600;
      color: #27272a;
    }
    code {
      font-family: "Cascadia Code", "Consolas", monospace;
      font-size: 9.5pt;
      background: #f4f4f5;
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      border: 1px solid #e4e4e7;
    }
    pre {
      font-family: "Cascadia Code", "Consolas", monospace;
      font-size: 9.5pt;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 1rem;
      overflow-x: auto;
      line-height: 1.45;
    }
    pre code { background: none; border: none; padding: 0; }
    blockquote {
      border-left: 4px solid #8b5cf6;
      margin: 1.2rem 0;
      padding: 0.5rem 0 0.5rem 1rem;
      color: #52525b;
      font-style: italic;
    }
    @media print {
      body { padding: 0; max-width: none; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header-block">
    <div class="header-title">${title}</div>
    <div class="meta-row">
      <span><strong>Author:</strong> ${author}</span>
      ${subject ? `<span><strong>Subject:</strong> ${subject}</span>` : ''}
      <span><strong>Date:</strong> ${date}</span>
      <span><strong>Source:</strong> Sovereign EasyLM</span>
    </div>
  </div>
  <div class="content-body">
    ${renderedHtml}
  </div>
</body>
</html>`;
}

/**
 * Open browser print dialogue to save as high-fidelity vector PDF.
 */
export function printOrSavePdf(contentMd: string, meta: DocumentMetadata): void {
  const html = generateAcademicHtml(contentMd, meta);
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    // Popup blocked, fallback to downloading HTML
    downloadBlob(html, `${sanitizeFilename(meta.title)}.html`, 'text/html');
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 350);
}

/**
 * Generate Microsoft Word compatible OpenXML / HTML package.
 * Seamlessly opens in Microsoft Word, LibreOffice, Pages, and Google Docs.
 */
export function exportWordDoc(contentMd: string, meta: DocumentMetadata): void {
  const renderedHtml = DOMPurify.sanitize(marked.parse(contentMd) as string);
  const title = meta.title || 'Document';
  const author = meta.author || 'Author';
  const date = meta.date || new Date().toLocaleDateString();
  const subject = meta.subject || '';

  const wordHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000000;
      margin: 1in;
    }
    .doc-header {
      border-bottom: 2pt solid #8b5cf6;
      padding-bottom: 12pt;
      margin-bottom: 24pt;
    }
    .doc-title {
      font-size: 22pt;
      font-weight: bold;
      color: #1e1b4b;
      margin-bottom: 6pt;
    }
    .doc-meta {
      font-size: 9.5pt;
      color: #71717a;
    }
    h1 { font-size: 16pt; font-weight: bold; color: #4338ca; margin-top: 18pt; margin-bottom: 6pt; }
    h2 { font-size: 13pt; font-weight: bold; color: #6d28d9; margin-top: 14pt; margin-bottom: 4pt; }
    h3 { font-size: 11.5pt; font-weight: bold; color: #7e22ce; margin-top: 10pt; margin-bottom: 3pt; }
    p { margin-bottom: 10pt; }
    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
    th, td { border: 1pt solid #71717a; padding: 6pt 8pt; text-align: left; }
    th { background-color: #f5f3ff; font-weight: bold; color: #4338ca; }
    code { font-family: 'Consolas', monospace; font-size: 9.5pt; background: #f4f4f5; padding: 2pt 4pt; }
    pre { font-family: 'Consolas', monospace; font-size: 9.5pt; background: #f4f4f5; padding: 10pt; border: 1pt solid #d4d4d8; }
    blockquote { border-left: 3pt solid #8b5cf6; padding-left: 10pt; color: #52525b; margin: 10pt 0; }
  </style>
</head>
<body>
  <div class="doc-header">
    <div class="doc-title">${title}</div>
    <div class="doc-meta">
      <strong>Author:</strong> ${author} &nbsp;|&nbsp;
      ${subject ? `<strong>Subject:</strong> ${subject} &nbsp;|&nbsp; ` : ''}
      <strong>Date:</strong> ${date}
    </div>
  </div>
  <div class="doc-body">
    ${renderedHtml}
  </div>
</body>
</html>`;

  downloadBlob(wordHtml, `${sanitizeFilename(title)}.doc`, 'application/msword');
}

/**
 * Export JSON structured document object.
 */
export function exportJsonDocument(contentMd: string, meta: DocumentMetadata): void {
  const payload = {
    title: meta.title,
    author: meta.author,
    subject: meta.subject || null,
    date: meta.date || new Date().toISOString(),
    generator: 'EasyLM Next Wave',
    license: 'AGPL-3.0-or-later',
    markdown: contentMd,
    plainText: stripMarkdown(contentMd)
  };
  downloadBlob(JSON.stringify(payload, null, 2), `${sanitizeFilename(meta.title)}.json`, 'application/json');
}

export function sanitizeFilename(name: string): string {
  const s = (name || 'document')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48);
  return s || 'document';
}
