import "./globals.css";
import Link from "next/link";
import { Metadata } from "next";
import { ClientLayout } from "@/components/ClientLayout";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = defaultMetadata;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background font-sans">
        <ClientLayout>
          <header className="bg-background shadow-sm border-b">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="text-2xl font-bold text-primary">
                    MDXFlow
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/documents" 
                    className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Documents
                  </Link>
                  <Link 
                    href="/builder" 
                    className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Flow Builder
                  </Link>
                  <Link 
                    href="/editor/new" 
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
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

          <footer className="bg-background border-t">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="text-center text-muted-foreground text-sm">
                © 2024 MDXFlow. Built with Next.js, React Flow, and Mermaid.
              </div>
            </div>
          </footer>
        </ClientLayout>
      </body>
    </html>
  );
}
