"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Personality } from "@/lib/types"
import { Heart, Brain, Sparkles, ChevronDown } from "lucide-react"
import { getTranslation, getCurrentLanguage } from "@/lib/translations"

interface PersonalitySelectorProps {
  personality: Personality
  setPersonality: (personality: Personality) => void
}

export function PersonalitySelector({ personality, setPersonality }: PersonalitySelectorProps) {
  const t = getTranslation(getCurrentLanguage())

  const personalities = [
    {
      id: "supportive" as Personality,
      name: t.personalities.supportive,
      icon: Heart,
      description: t.personalities.supportiveDescription,
    },
    {
      id: "therapist" as Personality,
      name: t.personalities.therapist,
      icon: Brain,
      description: t.personalities.therapistDescription,
    },
    {
      id: "coach" as Personality,
      name: t.personalities.coach,
      icon: Sparkles,
      description: t.personalities.coachDescription,
    },
  ]

  const currentPersonality = personalities.find((p) => p.id === personality)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-9 sm:h-10">
          {currentPersonality && (
            <>
              <currentPersonality.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">{currentPersonality.name}</span>
            </>
          )}
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] sm:w-[250px]">
        {personalities.map((p) => (
          <DropdownMenuItem key={p.id} onClick={() => setPersonality(p.id)} className="flex items-center gap-2 py-2">
            <p.icon className="h-4 w-4" />
            <div>
              <p className="text-sm">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
