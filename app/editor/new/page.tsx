'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createDocument, getPendingInsert, clearPendingInsert } from '@/lib/storage';

export default function NewDocumentPage() {
  const router = useRouter();

  useEffect(() => {
    // Create a new document and redirect to the editor
    const createAndRedirect = () => {
      try {
        // Check for pending insert content
        const pendingContent = getPendingInsert();
        
        let content = undefined;
        if (pendingContent) {
          content = pendingContent;
          clearPendingInsert();
        }
        
        const newDoc = createDocument(content ? { content } : undefined);
        router.replace(`/editor/${newDoc.id}`);
      } catch (error) {
        console.error('Error creating document:', error);
        alert('Failed to create document');
        router.push('/documents');
      }
    };

    createAndRedirect();
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Creating new document...</p>
        </div>
      </div>
    </div>
  );
}