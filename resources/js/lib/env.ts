// Runtime environment flags injected by the host (see resources/views/app.blade.php).
// In the bundled desktop (Electron) build, the blade sets window.__STACKR_DESKTOP__.

declare global {
  interface Window {
    __STACKR_DESKTOP__?: boolean
  }
}

export const isDesktop: boolean = typeof window !== 'undefined' && window.__STACKR_DESKTOP__ === true
