'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import dynamic from 'next/dynamic';

const MermaidDiagram = dynamic(() => import('./MermaidDiagram'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded" />
});

interface MDXPreviewProps {
  content: string;
  className?: string;
}

export default function MDXPreview({ content, className = '' }: MDXPreviewProps) {
  const [isClient, setIsClient] = useState(false);
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Process MDX-like content by converting <Mermaid chart="..." /> to markdown mermaid blocks
    let processed = content;
    
    // Convert <Mermaid chart="content" /> to ```mermaid blocks
    processed = processed.replace(
      /<Mermaid\s+chart=["']([^"']+)["']\s*\/?>/g,
      (_match, chartContent) => {
        // Decode basic HTML entities
        const decoded = chartContent
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&');
        
        return `\`\`\`mermaid\n${decoded}\n\`\`\``;
      }
    );

    setProcessedContent(processed);
  }, [content, isClient]);

  if (!isClient) {
    return (
      <div className={`prose prose-gray max-w-none ${className}`}>
        <div className="animate-pulse">Loading preview...</div>
      </div>
    );
  }

  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>MDX Preview:</strong> Rendered with Markdown + custom components
        </p>
      </div>
      
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          code(props) {
            const { className, children, ...restProps } = props;
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isInline = !language;
            
            if (!isInline && language === 'mermaid') {
              return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
            }
            
            return (
              <code className={className} {...restProps}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  {children}
                </table>
              </div>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}