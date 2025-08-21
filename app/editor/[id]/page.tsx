'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDocument, saveDocument, deleteDocument, duplicateDocument, type DocumentData } from '@/lib/storage';
import { downloadText, copyToClipboard, getFileExtension, sanitizeFilename } from '@/lib/file';
import MarkdownPreview from '@/components/MarkdownPreview';
import MDXPreview from '@/components/MDXPreview';

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const router = useRouter();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setDocumentId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!documentId) return;
    
    const loadDocument = () => {
      try {
        const doc = getDocument(documentId);
        if (!doc) {
          alert('Document not found');
          router.push('/documents');
          return;
        }
        setDocument(doc);
        setLastSaved(doc.updatedAt);
      } catch (error) {
        console.error('Error loading document:', error);
        alert('Failed to load document');
        router.push('/documents');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [documentId, router]);

  const handleSave = async () => {
    if (!document) return;
    
    setIsSaving(true);
    try {
      saveDocument(document);
      setLastSaved(Date.now());
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save on content changes
  useEffect(() => {
    if (!document || !lastSaved) return;
    
    const timer = setTimeout(() => {
      handleSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [document?.content, document?.title, document?.type]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopy = async () => {
    if (!document) return;
    
    try {
      await copyToClipboard(document.content);
      alert('Content copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    if (!document) return;
    
    try {
      const filename = `${sanitizeFilename(document.title)}${getFileExtension(document.type)}`;
      downloadText(filename, document.content);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  const handleDuplicate = () => {
    if (!document) return;
    
    try {
      const duplicated = duplicateDocument(document.id);
      router.push(`/editor/${duplicated.id}`);
    } catch (error) {
      console.error('Error duplicating document:', error);
      alert('Failed to duplicate document');
    }
  };

  const handleDelete = () => {
    if (!document) return;
    
    if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
      try {
        deleteDocument(document.id);
        router.push('/documents');
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document');
      }
    }
  };

  const updateDocument = (updates: Partial<DocumentData>) => {
    if (!document) return;
    setDocument({ ...document, ...updates });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-300 rounded mb-6"></div>
          <div className="h-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Document Not Found</h1>
          <Link href="/documents" className="text-blue-600 hover:text-blue-800">
            ← Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/documents" className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={document.title}
                onChange={(e) => updateDocument({ title: e.target.value })}
                className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                placeholder="Document title"
              />
              <select
                value={document.type}
                onChange={(e) => updateDocument({ type: e.target.value as 'markdown' | 'mdx' })}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="markdown">Markdown</option>
                <option value="mdx">MDX</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isSaving && (
              <span className="text-sm text-gray-500">Saving...</span>
            )}
            {lastSaved && !isSaving && (
              <span className="text-sm text-gray-500">
                Saved {new Date(lastSaved).toLocaleTimeString()}
              </span>
            )}
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
            
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
            
            <button
              onClick={handleDuplicate}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v-5a2 2 0 00-2-2H8z" />
              </svg>
              Duplicate
            </button>
            
            <Link
              href="/builder"
              className="inline-flex items-center px-3 py-1.5 border border-blue-300 shadow-sm text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
              </svg>
              Flow Builder
            </Link>
          </div>
          
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <div className="border-r p-4 bg-gray-50 text-sm font-medium text-gray-700">
            Editor
          </div>
          <textarea
            value={document.content}
            onChange={(e) => updateDocument({ content: e.target.value })}
            className="flex-1 p-4 resize-none focus:outline-none focus:ring-0 border-0 font-mono text-sm"
            placeholder="Start writing your document..."
          />
        </div>

        {/* Preview Pane */}
        {showPreview && (
          <div className="w-1/2 flex flex-col">
            <div className="p-4 bg-gray-50 text-sm font-medium text-gray-700 border-b">
              Preview
            </div>
            <div className="flex-1 p-4 overflow-auto bg-white">
              {document.type === 'mdx' ? (
                <MDXPreview content={document.content} />
              ) : (
                <MarkdownPreview content={document.content} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}