import React, { useMemo } from 'react';
import { renderMarkdownSafe } from '../engine/markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const html = useMemo(() => renderMarkdownSafe(content), [content]);

  return (
    <div
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
