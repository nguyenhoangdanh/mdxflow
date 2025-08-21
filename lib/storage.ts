import { v4 as uuidv4 } from 'uuid';

export interface DocumentData {
  id: string;
  title: string;
  content: string;
  type: 'markdown' | 'mdx';
  updatedAt: number;
}

export type DocMeta = Pick<DocumentData, 'id' | 'title' | 'type' | 'updatedAt'>;

const STORAGE_KEY = 'mdxflow:documents';
const PENDING_INSERT_KEY = 'mdxflow:pendingInsert';

// Default seed content for new documents
const DEFAULT_CONTENT = `# Welcome to MDXFlow

This is a sample document with a Mermaid diagram:

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[Alternative]
    C --> E[End]
    D --> E
\`\`\`

You can edit this document and create flowcharts using the builder!`;

export function getAllDocuments(): DocMeta[] {
  try {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const documents: DocumentData[] = JSON.parse(stored);
    return documents.map(({ id, title, type, updatedAt }) => ({
      id,
      title,
      type,
      updatedAt,
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
  const document: DocumentData = {
    id: uuidv4(),
    title: 'New Document',
    content: DEFAULT_CONTENT,
    type: 'markdown',
    updatedAt: Date.now(),
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
    const updatedDoc = { ...doc, updatedAt: Date.now() };
    
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

export function duplicateDocument(id: string): DocumentData {
  const original = getDocument(id);
  if (!original) {
    throw new Error('Document not found');
  }
  
  const duplicate = createDocument({
    title: `${original.title} (copy)`,
    content: original.content,
    type: original.type,
  });
  
  return duplicate;
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