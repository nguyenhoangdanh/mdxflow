"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  FileText, 
  Plus, 
  GitBranch, 
  Home,
  PlusCircle,
  FolderOpen
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { getAllDocuments, createDocument } from "@/lib/storage"

interface CommandPaletteProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter()
  const [documents, setDocuments] = useState(getAllDocuments())

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  // Refresh documents when opening
  useEffect(() => {
    if (open) {
      setDocuments(getAllDocuments())
    }
  }, [open])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/editor/new"))}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Create New Document</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          
          <CommandItem
            onSelect={() => runCommand(() => router.push("/builder"))}
          >
            <GitBranch className="mr-2 h-4 w-4" />
            <span>Open Flow Builder</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          
          <CommandItem
            onSelect={() => runCommand(() => router.push("/documents"))}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Documents</span>
          </CommandItem>
        </CommandGroup>

        {documents.length > 0 && (
          <CommandGroup heading="Recent Documents">
            {documents.slice(0, 5).map((doc) => (
              <CommandItem
                key={doc.id}
                onSelect={() => runCommand(() => router.push(`/editor/${doc.id}`))}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{doc.title}</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {doc.type.toUpperCase()}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => {
              runCommand(() => {
                const newDoc = createDocument({ 
                  title: "Quick Note",
                  type: "markdown" 
                })
                router.push(`/editor/${newDoc.id}`)
              })
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Quick Markdown Note</span>
          </CommandItem>
          
          <CommandItem
            onSelect={() => {
              runCommand(() => {
                const newDoc = createDocument({ 
                  title: "Quick MDX Component",
                  type: "mdx" 
                })
                router.push(`/editor/${newDoc.id}`)
              })
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Quick MDX Document</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}