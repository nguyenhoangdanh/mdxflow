'use client';

import { useEffect, useState } from 'react';

interface MDXPreviewProps {
  content: string;
  className?: string;
}

export default function MDXPreview({ content, className = '' }: MDXPreviewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`prose prose-gray max-w-none ${className}`}>
        <div className="animate-pulse">Loading preview...</div>
      </div>
    );
  }

  // For now, render as plain text until MDX runtime is properly configured
  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>MDX Preview:</strong> Full MDX compilation will be available soon. 
          For now, content is displayed as plain text.
        </p>
      </div>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  );
}