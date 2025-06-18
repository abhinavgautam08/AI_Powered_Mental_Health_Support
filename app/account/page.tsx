"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Settings, Languages } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getTranslation, getCurrentLanguage, type Language } from "@/lib/translations"

export default function AccountPage() {
  const { toast } = useToast()
  const router = useRouter()

  // Preferences state
  const [autoMessageEnabled, setAutoMessageEnabled] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false)

  // Language state
  const [voiceLanguage, setVoiceLanguage] = useState("en-US")
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false)

  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => getCurrentLanguage())
  const t = getTranslation(currentLanguage)

  // Load saved settings on component mount
  useEffect(() => {
    // Load settings from localStorage if available
    try {
      const savedSettings = localStorage.getItem("app_settings")
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        if (settings.autoMessageEnabled !== undefined) setAutoMessageEnabled(settings.autoMessageEnabled)
        if (settings.offlineMode !== undefined) setOfflineMode(settings.offlineMode)
        if (settings.voiceLanguage) setVoiceLanguage(settings.voiceLanguage)
      }
    } catch (error) {
      console.error("Error loading settings from localStorage:", error)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    try {
      const settings = {
        autoMessageEnabled,
        offlineMode,
        voiceLanguage,
      }
      localStorage.setItem("app_settings", JSON.stringify(settings))
    } catch (error) {
      console.error("Error saving settings to localStorage:", error)
    }
  }

  // Handle preferences update
  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingPreferences(true)

    try {
      // Save preferences to localStorage
      saveSettings()

      toast({
        title: t.preferencesUpdated,
        description: t.preferencesUpdatedDescription,
      })
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast({
        title: t.updateFailed,
        description: t.updateFailedDescription,
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPreferences(false)
    }
  }

  // Handle language update
  const handleLanguageUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingLanguage(true)

    try {
      // Save language preference to localStorage
      saveSettings()

      // Update current language for translations
      setCurrentLanguage(voiceLanguage as Language)

      // Update any active speech recognition instances
      const event = new CustomEvent("languageChanged", { detail: { language: voiceLanguage } })
      window.dispatchEvent(event)

      const newT = getTranslation(voiceLanguage as Language)
      toast({
        title: newT.languageUpdated,
        description: `${newT.languageUpdated} ${voiceLanguage === "en-US" ? newT.english : newT.hindi}.`,
      })
    } catch (error) {
      console.error("Error updating language:", error)
      toast({
        title: t.updateFailed,
        description: t.updateFailedDescription,
        variant: "destructive",
      })
    } finally {
      setIsUpdatingLanguage(false)
    }
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>{t.backToChat}</span>
          </Link>
        </div>
        <ModeToggle />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t.settingsTitle}</h1>
        <p className="text-muted-foreground">{t.settingsDescription}</p>
      </div>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{t.preferences}</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{t.language}</span>
          </TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t.applicationPreferences}</CardTitle>
              <CardDescription>{t.customizeApplication}</CardDescription>
            </CardHeader>
            <form onSubmit={handlePreferencesUpdate}>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-message">{t.autoMessageMood}</Label>
                    <p className="text-sm text-muted-foreground">{t.autoMessageMoodDescription}</p>
                  </div>
                  <Switch id="auto-message" checked={autoMessageEnabled} onCheckedChange={setAutoMessageEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="offline-mode">{t.offlineMode}</Label>
                    <p className="text-sm text-muted-foreground">{t.offlineModeDescription}</p>
                  </div>
                  <Switch id="offline-mode" checked={offlineMode} onCheckedChange={setOfflineMode} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdatingPreferences} className="w-full sm:w-auto">
                  {isUpdatingPreferences ? t.saving : t.savePreferences}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Language Tab */}
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>{t.languageSettings}</CardTitle>
              <CardDescription>{t.configureLanguage}</CardDescription>
            </CardHeader>
            <form onSubmit={handleLanguageUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <Label>{t.voiceInputLanguage}</Label>
                  </div>

                  <RadioGroup value={voiceLanguage} onValueChange={setVoiceLanguage} className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="en-US" id="en-US" />
                      <Label htmlFor="en-US" className="font-normal">
                        {t.englishUS}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hi-IN" id="hi-IN" />
                      <Label htmlFor="hi-IN" className="font-normal">
                        {t.hindiIndia}
                      </Label>
                    </div>
                  </RadioGroup>

                  <p className="text-xs text-muted-foreground">{t.voiceInputLanguageDescription}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdatingLanguage} className="w-full sm:w-auto">
                  {isUpdatingLanguage ? t.updating : t.updateLanguage}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
