import { nanoid } from 'nanoid';

export type DocumentType = 'markdown' | 'mdx';

export interface DocumentData {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  tags: string[];
  updatedAt: number;
  createdAt: number;
  version: number; // doc schema version for upgrades
}

export type DocMeta = Pick<DocumentData, 'id' | 'title' | 'type' | 'updatedAt' | 'tags'>;

const STORAGE_KEY = 'mdxflow:documents';
const PENDING_INSERT_KEY = 'mdxflow:pendingInsert';
const VERSION_KEY = 'mdxflow:version';
const TRASH_KEY = 'mdxflow:trash';

const CURRENT_VERSION = 1;

// Default seed content for new documents
const DEFAULT_MARKDOWN_CONTENT = `# Welcome to MDXFlow

This is a sample Markdown document with a Mermaid diagram:

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[Alternative]
    C --> E[End]
    D --> E
\`\`\`

You can:
- Edit this document in the editor
- Create flowcharts using the builder
- Export to Markdown or Mermaid
- Use the command palette (⌘K)

## Features

- **Live Preview**: See your changes instantly
- **Mermaid Support**: Render diagrams directly in Markdown
- **Local Storage**: Your data stays private and offline
- **Export Options**: Download as .md or copy to clipboard

Happy writing! 🚀`;

const DEFAULT_MDX_CONTENT = `# Welcome to MDX

This is an MDX document that supports JSX components:

\`\`\`mermaid
graph LR
    A[MDX] --> B[Markdown]
    A --> C[JSX Components]
    B --> D[Rich Content]
    C --> D
\`\`\`

## What is MDX?

MDX lets you write **Markdown** with embedded **React components**.

You can create interactive content and rich documentation.

## Get Started

1. Edit this content
2. Add your own components
3. Build amazing documents

> **Note**: This is a simplified MDX preview. Full component support coming soon!
`;

// Migration handler
function runMigrations(): void {
  try {
    if (typeof window === 'undefined') return;
    
    const currentVersion = parseInt(localStorage.getItem(VERSION_KEY) || '0');
    
    if (currentVersion < CURRENT_VERSION) {
      // Run migrations here
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
    }
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

export function getAllDocuments(): DocMeta[] {
  try {
    if (typeof window === 'undefined') return [];
    
    runMigrations();
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const documents: DocumentData[] = JSON.parse(stored);
    return documents.map(({ id, title, type, updatedAt, tags }) => ({
      id,
      title,
      type,
      updatedAt,
      tags,
    }));
  } catch (error) {
    console.error('Error loading documents:', error);
    return [];
  }
}

export function getDocument(id: string): DocumentData | null {
  try {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const documents: DocumentData[] = JSON.parse(stored);
    return documents.find(doc => doc.id === id) || null;
  } catch (error) {
    console.error('Error loading document:', error);
    return null;
  }
}

export function createDocument(partial?: Partial<DocumentData>): DocumentData {
  const now = Date.now();
  const isMarkdown = partial?.type === 'markdown' || !partial?.type;
  
  const document: DocumentData = {
    id: nanoid(),
    title: 'New Document',
    content: isMarkdown ? DEFAULT_MARKDOWN_CONTENT : DEFAULT_MDX_CONTENT,
    type: 'markdown',
    tags: [],
    updatedAt: now,
    createdAt: now,
    version: CURRENT_VERSION,
    ...partial,
  };
  
  saveDocument(document);
  return document;
}

export function saveDocument(doc: DocumentData): void {
  try {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    const documents: DocumentData[] = stored ? JSON.parse(stored) : [];
    
    const existingIndex = documents.findIndex(d => d.id === doc.id);
    const updatedDoc = { 
      ...doc, 
      updatedAt: Date.now(),
      version: CURRENT_VERSION 
    };
    
    if (existingIndex >= 0) {
      documents[existingIndex] = updatedDoc;
    } else {
      documents.push(updatedDoc);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch (error) {
    console.error('Error saving document:', error);
    throw new Error('Failed to save document');
  }
}

export function deleteDocument(id: string): void {
  try {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    const documents: DocumentData[] = JSON.parse(stored);
    const filtered = documents.filter(doc => doc.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
}

export function softDeleteDocument(id: string): void {
  try {
    if (typeof window === 'undefined') return;
    
    const doc = getDocument(id);
    if (!doc) return;
    
    // Move to trash
    const trash = getTrash();
    trash.push(doc);
    localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
    
    // Remove from main storage
    deleteDocument(id);
  } catch (error) {
    console.error('Error soft deleting document:', error);
    throw new Error('Failed to delete document');
  }
}

export function restoreDocument(id: string): void {
  try {
    if (typeof window === 'undefined') return;
    
    const trash = getTrash();
    const docIndex = trash.findIndex(doc => doc.id === id);
    
    if (docIndex >= 0) {
      const doc = trash[docIndex];
      
      // Restore to main storage
      saveDocument(doc);
      
      // Remove from trash
      trash.splice(docIndex, 1);
      localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
    }
  } catch (error) {
    console.error('Error restoring document:', error);
    throw new Error('Failed to restore document');
  }
}

export function getTrash(): DocumentData[] {
  try {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(TRASH_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading trash:', error);
    return [];
  }
}

export function duplicateDocument(id: string): DocumentData {
  const original = getDocument(id);
  if (!original) {
    throw new Error('Document not found');
  }
  
  const duplicate = createDocument({
    title: `${original.title} (copy)`,
    content: original.content,
    type: original.type,
    tags: [...original.tags],
  });
  
  return duplicate;
}

export function searchDocuments(query: string, tags?: string[]): DocMeta[] {
  try {
    const allDocs = getAllDocuments();
    
    return allDocs.filter(doc => {
      // Text search
      const matchesQuery = !query || 
        doc.title.toLowerCase().includes(query.toLowerCase());
      
      // Tag filter
      const matchesTags = !tags || tags.length === 0 || 
        tags.some(tag => doc.tags.includes(tag));
      
      return matchesQuery && matchesTags;
    });
  } catch (error) {
    console.error('Error searching documents:', error);
    return [];
  }
}

export function importDocuments(jsonData: string): void {
  try {
    if (typeof window === 'undefined') return;
    
    const importedDocs: DocumentData[] = JSON.parse(jsonData);
    const stored = localStorage.getItem(STORAGE_KEY);
    const existingDocs: DocumentData[] = stored ? JSON.parse(stored) : [];
    
    // Merge documents, avoiding duplicates
    const combinedDocs = [...existingDocs];
    
    importedDocs.forEach(importedDoc => {
      // Generate new ID to avoid conflicts
      const newDoc = {
        ...importedDoc,
        id: nanoid(),
        updatedAt: Date.now(),
        version: CURRENT_VERSION,
      };
      combinedDocs.push(newDoc);
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combinedDocs));
  } catch (error) {
    console.error('Error importing documents:', error);
    throw new Error('Failed to import documents');
  }
}

export function exportDocuments(): string {
  try {
    if (typeof window === 'undefined') return '[]';
    
    const stored = localStorage.getItem(STORAGE_KEY);
    const documents: DocumentData[] = stored ? JSON.parse(stored) : [];
    
    return JSON.stringify(documents, null, 2);
  } catch (error) {
    console.error('Error exporting documents:', error);
    throw new Error('Failed to export documents');
  }
}

export function setPendingInsert(content: string): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PENDING_INSERT_KEY, content);
  } catch (error) {
    console.error('Error setting pending insert:', error);
  }
}

export function getPendingInsert(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(PENDING_INSERT_KEY);
  } catch (error) {
    console.error('Error getting pending insert:', error);
    return null;
  }
}

export function clearPendingInsert(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PENDING_INSERT_KEY);
  } catch (error) {
    console.error('Error clearing pending insert:', error);
  }
}