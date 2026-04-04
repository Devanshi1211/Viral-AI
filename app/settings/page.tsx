import { Suspense } from 'react'
import SettingsClient from './SettingsClient'

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
          Loading settings...
        </div>
      }
    >
      <SettingsClient />
    </Suspense>
  )
}
