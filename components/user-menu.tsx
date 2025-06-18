"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Settings } from "lucide-react"

export function UserMenu() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={() => router.push("/account")}
      title="Settings"
    >
      <Settings className="h-4 w-4" />
      <span className="sr-only">Settings</span>
    </Button>
  )
}
