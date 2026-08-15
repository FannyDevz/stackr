import { create } from 'zustand'

// Imperative prompt()/confirm() replacements that render as real modals
// (centered on desktop, bottom sheet on mobile). window.prompt/confirm don't
// work inside the Electron desktop build, so all such flows go through here.

export interface PromptConfig {
  kind: 'prompt'
  title: string
  label?: string
  defaultValue?: string
  placeholder?: string
  confirmText?: string
}
export interface ConfirmConfig {
  kind: 'confirm'
  title: string
  message?: string
  confirmText?: string
  danger?: boolean
}

type Active =
  | (PromptConfig & { resolve: (v: string | null) => void })
  | (ConfirmConfig & { resolve: (v: boolean) => void })

interface DialogStore {
  active: Active | null
  setActive: (a: Active | null) => void
}

export const useDialog = create<DialogStore>((set) => ({
  active: null,
  setActive: (active) => set({ active }),
}))

/** Ask for a line of text. Resolves to the string, or null if cancelled. */
export function showPrompt(cfg: Omit<PromptConfig, 'kind'>): Promise<string | null> {
  return new Promise((resolve) => useDialog.getState().setActive({ kind: 'prompt', ...cfg, resolve }))
}

/** Ask to confirm an action. Resolves to true (confirmed) or false (cancelled). */
export function showConfirm(cfg: Omit<ConfirmConfig, 'kind'>): Promise<boolean> {
  return new Promise((resolve) => useDialog.getState().setActive({ kind: 'confirm', ...cfg, resolve }))
}
