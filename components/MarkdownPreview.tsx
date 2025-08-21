'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export default function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize Mermaid only on client
    if (typeof window !== 'undefined') {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
      });
    }
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    // Re-render Mermaid diagrams when content changes
    const renderMermaidDiagrams = async () => {
      try {
        const mermaidElements = containerRef.current?.querySelectorAll('.mermaid-diagram');
        if (mermaidElements) {
          for (let i = 0; i < mermaidElements.length; i++) {
            const element = mermaidElements[i] as HTMLElement;
            const code = element.textContent || '';
            
            try {
              const { svg } = await mermaid.render(`mermaid-${Date.now()}-${i}`, code);
              element.innerHTML = svg;
            } catch (error) {
              console.error('Mermaid rendering error:', error);
              element.innerHTML = `<div class="text-red-500 p-4 border border-red-300 rounded">
                Error rendering Mermaid diagram: ${error}
              </div>`;
            }
          }
        }
      } catch (error) {
        console.error('Error processing Mermaid diagrams:', error);
      }
    };

    // Small delay to ensure DOM is updated
    const timer = setTimeout(renderMermaidDiagrams, 100);
    return () => clearTimeout(timer);
  }, [content, isClient]);

  if (!isClient) {
    return (
      <div className={`prose prose-gray max-w-none ${className}`}>
        <div className="animate-pulse">Loading preview...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`prose prose-gray max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code(props: any) {
            const { className, children, ...restProps } = props;
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isInline = !language;
            
            if (!isInline && language === 'mermaid') {
              return (
                <div className="mermaid-diagram my-4 p-4 border rounded-lg bg-gray-50">
                  {String(children).replace(/\n$/, '')}
                </div>
              );
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
          th({ children }) {
            return (
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}