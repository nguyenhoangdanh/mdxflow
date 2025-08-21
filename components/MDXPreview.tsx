'use client';

import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import mermaid from 'mermaid';

interface MDXPreviewProps {
  content: string;
  className?: string;
}

// Mermaid component for MDX
function MermaidComponent({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize Mermaid only on client
    if (typeof window !== 'undefined') {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'strict',
        fontFamily: 'inherit',
      });
    }
  }, []);

  useEffect(() => {
    if (!isClient || !ref.current || !chart) return;

    const renderMermaid = async () => {
      try {
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (ref.current) {
          ref.current.innerHTML = `<div class="text-red-500 p-4 border border-red-300 rounded">
            Error rendering Mermaid diagram: ${error}
          </div>`;
        }
      }
    };

    renderMermaid();
  }, [chart, isClient]);

  if (!isClient) {
    return <div className="animate-pulse">Loading diagram...</div>;
  }

  return (
    <div 
      ref={ref}
      className="my-4 p-4 border rounded-lg bg-gray-50 flex justify-center"
    />
  );
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
          // Handle code blocks with Mermaid
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code(props: any) {
            const { className, children, ...restProps } = props;
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isInline = !language;
            
            if (!isInline && language === 'mermaid') {
              return <MermaidComponent chart={String(children).replace(/\n$/, '')} />;
            }
            
            return (
              <code className={className} {...restProps}>
                {children}
              </code>
            );
          },
          
          // Style tables
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
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}