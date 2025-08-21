import { useEffect } from 'react'

interface KeyboardShortcut {
  key: string
  metaKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  callback: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          metaKey = false,
          ctrlKey = false,
          shiftKey = false,
          altKey = false,
          callback,
        } = shortcut

        const isMetaKey = metaKey && (event.metaKey || event.ctrlKey)
        const isCtrlKey = ctrlKey && event.ctrlKey
        const isShiftKey = shiftKey && event.shiftKey
        const isAltKey = altKey && event.altKey

        const keyMatches = event.key.toLowerCase() === key.toLowerCase()
        const modifiersMatch = 
          (metaKey ? isMetaKey : !event.metaKey && !event.ctrlKey) &&
          (ctrlKey ? isCtrlKey : !event.ctrlKey) &&
          (shiftKey ? isShiftKey : !event.shiftKey) &&
          (altKey ? isAltKey : !event.altKey)

        if (keyMatches && modifiersMatch) {
          event.preventDefault()
          callback()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Common keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  SAVE: { key: 's', metaKey: true, description: 'Save document' },
  NEW: { key: 'n', metaKey: true, description: 'New document' },
  DUPLICATE: { key: 'd', metaKey: true, description: 'Duplicate document' },
  DELETE: { key: 'Backspace', metaKey: true, description: 'Delete document' },
  TOGGLE_PREVIEW: { key: 'p', metaKey: true, description: 'Toggle preview' },
  COMMAND_PALETTE: { key: 'k', metaKey: true, description: 'Open command palette' },
  FLOW_BUILDER: { key: 'b', metaKey: true, description: 'Open flow builder' },
  SEARCH: { key: 'f', metaKey: true, description: 'Search documents' },
  ESCAPE: { key: 'Escape', description: 'Close dialogs/palettes' },
} as const