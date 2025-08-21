'use client';

import "./globals.css";
import Link from "next/link";
import { useState } from "react";
import { CommandPalette } from "@/components/CommandPalette";
import { Toaster } from "@/components/ui/toaster";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background font-sans">
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
                <button
                  onClick={() => setCommandPaletteOpen(true)}
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                >
                  ⌘K
                </button>
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

        <CommandPalette open={commandPaletteOpen} setOpen={setCommandPaletteOpen} />
        <Toaster />
      </body>
    </html>
  );
}
