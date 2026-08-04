import { useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { ToastState } from '../types'

export function useAutoDismissToast(
  toast: ToastState,
  setToast: Dispatch<SetStateAction<ToastState>>,
  timeoutMs = 3200,
) {
  useEffect(() => {
    if (!toast.message) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setToast({ message: '', type: 'success' })
    }, timeoutMs)

    return () => window.clearTimeout(timeoutId)
  }, [setToast, timeoutMs, toast.message])
}
