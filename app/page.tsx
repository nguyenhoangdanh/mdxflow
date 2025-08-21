import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: 'Home',
  description: 'A powerful Markdown/MDX editor with an integrated drag-and-drop flowchart builder. Create, edit, and visualize your ideas seamlessly with React Flow and Mermaid.',
  path: '/',
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
            Welcome to <span className="text-primary">MDXFlow</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A powerful Markdown/MDX editor with an integrated drag-and-drop flowchart builder. 
            Create, edit, and visualize your ideas seamlessly.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/documents"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
              >
                View Documents
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/editor/new"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-background hover:bg-muted md:py-4 md:text-lg md:px-10"
              >
                Create New
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="text-primary mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Markdown & MDX Editor</h3>
              <p className="text-muted-foreground">
                Write and edit documents in Markdown or MDX with live preview. 
                Support for GitHub Flavored Markdown and custom components.
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="text-primary mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Drag & Drop Flowcharts</h3>
              <p className="text-muted-foreground">
                Create flowcharts visually with React Flow. Drag nodes, connect them, 
                and export to Mermaid diagrams for embedding in your documents.
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="text-primary mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Local Storage</h3>
              <p className="text-muted-foreground">
                All your documents are stored locally in your browser. 
                No accounts needed, your data stays private and accessible offline.
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="text-primary mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Mermaid Integration</h3>
              <p className="text-muted-foreground">
                Render beautiful diagrams with Mermaid. Support for flowcharts, 
                sequence diagrams, and more directly in your Markdown.
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="text-primary mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Export & Share</h3>
              <p className="text-muted-foreground">
                Copy to clipboard or download your documents as .md or .mdx files. 
                Share your work easily with others.
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="text-primary mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9V3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Deploy Anywhere</h3>
              <p className="text-muted-foreground">
                Built with Next.js for easy deployment to Vercel, Netlify, or any static hosting platform. 
                No backend required.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold mb-2">Create a Document</h3>
              <p className="text-muted-foreground">Start with a new Markdown or MDX document</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold mb-2">Design Flowcharts</h3>
              <p className="text-muted-foreground">Use the Flow Builder to create visual diagrams</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold mb-2">Export & Share</h3>
              <p className="text-muted-foreground">Download or copy your documents to share</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
