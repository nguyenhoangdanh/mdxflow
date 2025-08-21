import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MDXFlow - Markdown & Flowchart Editor",
  description: "A powerful Markdown/MDX editor with drag-and-drop flowchart builder using React Flow and Mermaid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50 font-sans">
        <header className="bg-white shadow-sm border-b">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  MDXFlow
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/documents" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Documents
                </Link>
                <Link 
                  href="/builder" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Flow Builder
                </Link>
                <Link 
                  href="/editor/new" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  New Document
                </Link>
              </div>
            </div>
          </nav>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500 text-sm">
              © 2024 MDXFlow. Built with Next.js, React Flow, and Mermaid.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
