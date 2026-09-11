import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
}

// Configure marked defaults
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Preprocess raw text from LLMs to repair missing newlines around headers and lists
 */
function normalizeMarkdown(raw: string): string {
  if (!raw) return '';

  return raw
    // Ensure headings preceded by text get clean double newlines
    .replace(/([^\n])\s*(#{1,6}\s+)/g, '$1\n\n$2')
    // Ensure bullet items (- , * , • ) preceded by text get clean newlines
    .replace(/([^\n])\s+([•\-*]\s+)/g, '$1\n$2')
    // Ensure numbered lists (1. , 2. ) preceded by text get clean newlines
    .replace(/([^\n])\s+(\d+\.\s+)/g, '$1\n$2')
    // Clean up triple+ newlines
    .replace(/\n{3,}/g, '\n\n');
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const html = useMemo(() => {
    const normalized = normalizeMarkdown(content);
    try {
      return marked.parse(normalized) as string;
    } catch (err) {
      console.error('Markdown parse error:', err);
      return normalized;
    }
  }, [content]);

  return (
    <div
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
