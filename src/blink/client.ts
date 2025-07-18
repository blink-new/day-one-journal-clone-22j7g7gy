import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'day-one-journal-clone-22j7g7gy',
  authRequired: true
})

// Add error handling for SDK initialization
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('iframe page platform api server')) {
      console.warn('SDK initialization issue detected, but app will continue to work')
      event.preventDefault()
    }
  })
}