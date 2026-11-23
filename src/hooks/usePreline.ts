import { useEffect } from 'react'

// Preline only auto-initializes on window load, so components React mounts
// later (route changes, conditional renders) need a re-init. Pass deps that
// change when new Preline markup appears.
export function usePreline(deps: React.DependencyList = []) {
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => window.HSStaticMethods?.autoInit(), deps)
}
