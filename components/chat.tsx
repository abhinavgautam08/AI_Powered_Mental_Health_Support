"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoodTracker } from "@/components/mood-tracker"
import { JournalEntry } from "@/components/journal-entry"
import { ChatMessage } from "@/components/chat-message"
import { PersonalitySelector } from "@/components/personality-selector"
import { detectEmotion, getAIResponse, translateText, isApiKeyValid } from "@/lib/ai-helpers"
import type { Emotion, Message, Personality } from "@/lib/types"
import { CrisisResources } from "@/components/crisis-resources"
import { useToast } from "@/hooks/use-toast"
import { Mic, Send, Camera, CameraOff } from "lucide-react"
import { FaceEmotionDetector } from "@/components/face-emotion-detector"
import { SettingsDialog } from "@/components/settings-dialog"
import { useRouter } from "next/navigation"
import { differenceInSeconds } from "date-fns"
import { getTranslation, getCurrentLanguage, type Language } from "@/lib/translations"

// Declare SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function Chat() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => getCurrentLanguage())
  const t = getTranslation(currentLanguage)
  const [messages, setMessages] = useState<Message[]>(() => {
    const language = getCurrentLanguage()
    const t = getTranslation(language)
    return [
      {
        role: "assistant",
        content:
          language === "hi-IN"
            ? "नमस्ते! मैं MentalHS-Ai हूँ, आपका मानसिक स्वास्थ्य सहायक। आज आप कैसा महसूस कर रहे हैं?"
            : "Hi there! I'm MentalHS-Ai, Your mental health assistant. How are you feeling today?",
        timestamp: new Date(),
      },
    ]
  })
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [personality, setPersonality] = useState<Personality>("supportive")
  const [emotions, setEmotions] = useState<{ emotion: Emotion; timestamp: Date }[]>([])
  const [journalEntries, setJournalEntries] = useState<{ content: string; emotion: Emotion; timestamp: Date }[]>([])
  const [showCrisisResources, setShowCrisisResources] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [emotionDetectionEnabled, setEmotionDetectionEnabled] = useState(false)
  const [faceEmotion, setFaceEmotion] = useState<Emotion | null>(null)
  const [lastEmotionTime, setLastEmotionTime] = useState<Date | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const recognitionRef = useRef<any>(null)
  // Add a new state for API key status and offline mode
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null)
  const [offlineMode, setOfflineMode] = useState(false)
  // Add state for API key configuration dialog
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  // Add state for voice input language
  const [voiceLanguage, setVoiceLanguage] = useState(() => {
    // Try to load from localStorage if available
    if (typeof window !== "undefined") {
      try {
        const savedSettings = localStorage.getItem("app_settings")
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          if (settings.voiceLanguage) {
            return settings.voiceLanguage
          }
        }
      } catch (error) {
        console.error("Error loading language setting from localStorage:", error)
      }
    }
    return "en-US" // Default to English
  })
  // Add state for active tab
  const [activeTab, setActiveTab] = useState("chat")
  // Add state for auto-messaging
  const [autoMessageEnabled, setAutoMessageEnabled] = useState(true)
  // Add a new state variable to track whether an auto-message has been sent after the most recent scan
  const [autoMessageSent, setAutoMessageSent] = useState(false)
  const router = useRouter()

  // Function to add emotion with duplicate prevention
  const addEmotion = (emotion: Emotion) => {
    setEmotions((prev) => {
      // If there are no emotions yet, just add this one
      if (prev.length === 0) {
        return [{ emotion, timestamp: new Date() }]
      }

      // Get the last emotion
      const lastEmotion = prev[prev.length - 1]

      // Check if this is the same emotion and occurred within 5 seconds
      if (lastEmotion.emotion === emotion && differenceInSeconds(new Date(), new Date(lastEmotion.timestamp)) <= 5) {
        // It's a duplicate, return the array unchanged
        return prev
      }

      // It's not a duplicate, add it
      return [...prev, { emotion, timestamp: new Date() }]
    })
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = voiceLanguage // Use the selected language

      recognitionRef.current.onresult = async (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")

        setInput(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsListening(false)
        toast({
          title: t.speechRecognitionError,
          description: `${t.error}: ${event.error}. ${t.pleaseTryAgain}`,
          variant: "destructive",
        })
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [toast, voiceLanguage, t]) // Add voiceLanguage as a dependency

  // Check API key status on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const valid = await isApiKeyValid()
        setApiKeyValid(valid)

        if (!valid) {
          setOfflineMode(true)
          toast({
            title: t.offlineModeActivated,
            description: t.apiKeyIssuesDetected,
            duration: 5000,
          })
        }
      } catch (error) {
        console.error("Error checking API key:", error)
        setApiKeyValid(false)
        setOfflineMode(true)
        toast({
          title: t.apiKeyError,
          description: t.issueWithApiKey,
          variant: "destructive",
          duration: 5000,
        })
      }
    }

    checkApiKey()
  }, [toast, t])

  const handleLanguageChange = (language: string) => {
    setVoiceLanguage(language)
    setCurrentLanguage(language as Language)

    // Save to localStorage
    try {
      const savedSettings = localStorage.getItem("app_settings")
      const settings = savedSettings ? JSON.parse(savedSettings) : {}
      settings.voiceLanguage = language
      localStorage.setItem("app_settings", JSON.stringify(settings))
    } catch (error) {
      console.error("Error saving language setting to localStorage:", error)
    }

    // If currently listening, restart with new language
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.lang = language
          recognitionRef.current.start()
        }
      }, 100)
    }
  }

  // Add an event listener for language changes
  useEffect(() => {
    const handleLanguageEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.language) {
        handleLanguageChange(event.detail.language)
      }
    }

    window.addEventListener("languageChanged", handleLanguageEvent as EventListener)

    return () => {
      window.removeEventListener("languageChanged", handleLanguageEvent as EventListener)
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: t.speechRecognitionNotSupported,
        description: t.browserDoesntSupportSpeechRecognition,
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      toast({
        title: t.listening,
        description: `${t.speakNow} ${voiceLanguage === "hi-IN" ? t.hindi : t.english} ${t.languageIsActive}`,
      })
    }
  }

  const toggleEmotionDetection = () => {
    setEmotionDetectionEnabled(!emotionDetectionEnabled)

    if (!emotionDetectionEnabled) {
      toast({
        title: t.emotionDetectionEnabled,
        description: t.clickScanNow,
      })
    } else {
      toast({
        title: t.emotionDetectionDisabled,
        description: t.emotionScanningTurnedOff,
      })
    }
  }

  const toggleOfflineMode = () => {
    setOfflineMode(!offlineMode)

    // If trying to go online but API key is invalid, show a warning
    if (!offlineMode && apiKeyValid === false) {
      toast({
        title: t.apiKeyInvalid,
        description: t.noValidApiKeyFound,
        variant: "destructive",
        duration: 5000,
      })
    } else {
      toast({
        title: offlineMode ? t.onlineModeActivated : t.offlineModeActivated,
        description: offlineMode ? t.usingAiPoweredResponses : t.usingLocalResponses,
        duration: 3000,
      })
    }
  }

  // Update the handleFaceEmotionDetected function to use the new addEmotion function
  const handleFaceEmotionDetected = (emotion: Emotion) => {
    setFaceEmotion(emotion)
    setLastEmotionTime(new Date())

    // Add to emotions history using the new function
    addEmotion(emotion)

    // Switch to mood tab to show the updated emotion (on mobile only)
    if (window.innerWidth < 768) {
      setActiveTab("mood")

      // Switch back to chat after 3 seconds
      setTimeout(() => {
        setActiveTab("chat")
      }, 3000)
    }

    // Show toast for the detected emotion
    const isHindi = voiceLanguage === "hi-IN"
    toast({
      title: isHindi ? "भावना का पता चला" : "Emotion Detected",
      description: isHindi
        ? `आप ${emotion === "happy" ? "खुश" : emotion === "sad" ? "उदास" : emotion === "anxious" ? "चिंतित" : emotion === "stressed" ? "तनावग्रस्त" : emotion === "angry" ? "गुस्से में" : "सामान्य"} महसूस कर रहे हैं।`
        : `You appear to be feeling ${emotion}.`,
      duration: 3000,
    })

    // Only auto-send if the feature is enabled AND we haven't sent an auto-message yet
    if (autoMessageEnabled && !autoMessageSent) {
      // Auto send the detected emotion as a message after a short delay
      setTimeout(() => {
        // Don't send if user is already typing something
        if (input.trim() === "") {
          const isHindi = voiceLanguage === "hi-IN"
          const emotionMessages = {
            happy: isHindi ? "मैं आज खुश महसूस कर रहा हूँ!" : "I'm feeling happy today!",
            neutral: isHindi ? "मैं ठीक महसूस कर रहा हूँ।" : "I'm feeling okay.",
            sad: isHindi ? "मैं अभी उदास महसूस कर रहा हूँ।" : "I'm feeling sad right now.",
            anxious: isHindi ? "मैं चीजों के बारे में चिंतित महसूस कर रहा हूँ।" : "I'm feeling anxious about things.",
            stressed: isHindi ? "मैं तनावग्रस्त महसूस कर रहा हूँ।" : "I'm feeling stressed out.",
            angry: isHindi ? "मैं निराश और गुस्से में महसूस कर रहा हूँ।" : "I'm feeling frustrated and angry.",
          }

          // Send the message
          handleSendMessage(emotionMessages[emotion])

          // Mark that we've sent an auto-message
          setAutoMessageSent(true)
        }
      }, 1500)
    }
  }

  // Check for crisis keywords
  const checkForCrisisKeywords = (text: string) => {
    const crisisKeywords = [
      "suicide",
      "kill myself",
      "end my life",
      "want to die",
      "harm myself",
      "self harm",
      "emergency",
      "crisis",
      // Hindi keywords
      "आत्महत्या",
      "खुदकुशी",
      "मरना चाहता हूं",
      "जीना नहीं चाहता",
      "खुद को नुकसान",
    ]

    return crisisKeywords.some((keyword) => text.toLowerCase().includes(keyword))
  }

  const handleSendMessage = async (predefinedMessage?: string) => {
    // Use predefined message if provided, otherwise use input state
    const messageToSend = predefinedMessage || input

    if (!messageToSend.trim()) return

    // Store original input for display
    const originalInput = messageToSend
    setInput("")
    setIsLoading(true)

    try {
      // Rest of the function remains the same, just replace all instances of 'originalInput' with 'messageToSend'
      // Check if input is in Hindi and translate if needed
      let processedInput = originalInput
      let isTranslated = false

      // Simple Hindi detection (can be improved)
      const hindiPattern = /[\u0900-\u097F]/
      if (hindiPattern.test(originalInput) && !offlineMode) {
        try {
          // Use the free translation API directly for Hindi text
          const translatedText = await translateText(originalInput, "hi", "en")
          if (translatedText && translatedText !== originalInput) {
            processedInput = translatedText
            isTranslated = true
          }
        } catch (error) {
          console.error("Translation error:", error)
          // Continue with original text if translation fails
          processedInput = originalInput
        }
      }

      // Check for crisis keywords in both original and translated text
      const isCrisis = checkForCrisisKeywords(originalInput) || checkForCrisisKeywords(processedInput)
      if (isCrisis) {
        setShowCrisisResources(true)
      }

      const userMessage: Message = {
        role: "user",
        content: originalInput,
        timestamp: new Date(),
        translated: isTranslated ? processedInput : undefined,
      }

      setMessages((prev) => [...prev, userMessage])

      // Detect emotion from user message (use face emotion if available)
      let detectedEmotion: Emotion
      if (faceEmotion) {
        detectedEmotion = faceEmotion
        setFaceEmotion(null) // Reset after using
      } else {
        try {
          // Pass the offline mode to the detectEmotion function
          detectedEmotion = await detectEmotion(processedInput, offlineMode)
        } catch (emotionError) {
          console.error("Error detecting emotion, using neutral:", emotionError)
          detectedEmotion = "neutral" // Fallback to neutral if emotion detection fails
        }
      }

      // Add to emotions history using the new function
      addEmotion(detectedEmotion)

      // Get AI response based on personality and detected emotion
      let aiResponse: string
      try {
        // Pass the offline mode and language to the getAIResponse function
        aiResponse = await getAIResponse(
          processedInput,
          personality,
          detectedEmotion,
          messages,
          offlineMode,
          voiceLanguage,
        )
      } catch (responseError) {
        console.error("Error getting AI response, using fallback:", responseError)
        // Use a simple fallback response if AI response fails
        const isHindi = voiceLanguage === "hi-IN"
        const fallbackResponses = {
          happy: isHindi
            ? "यह सुनकर बहुत अच्छा लगा! आप और किस बारे में बात करना चाहेंगे?"
            : "That's great to hear! What else would you like to talk about?",
          neutral: isHindi ? "मैं यहाँ सुनने के लिए हूँ। आपके मन में क्या बात है?" : "I'm here to listen. What's on your mind?",
          sad: isHindi
            ? "मुझे खुशी है कि आप उदास महसूस कर रहे हैं। क्या आप इसके बारे में और बात करना चाहेंगे?"
            : "I'm sorry you're feeling down. Would you like to talk more about it?",
          anxious: isHindi
            ? "लगता है आप चिंतित महसूस कर रहे हैं। आइए एक पल के लिए सांस लेते हैं।"
            : "It sounds like you might be feeling anxious. Let's take a moment to breathe.",
          stressed: isHindi
            ? "लगता है आप दबाव में हैं। अभी हम किस एक छोटी सी बात पर ध्यान दे सकते हैं?"
            : "It seems like you're under stress. What's one small thing we could focus on right now?",
          angry: isHindi
            ? "मैं देख सकता हूँ कि आप परेशान हैं। क्या इस बारे में बात करने से मदद मिलेगी कि क्या हुआ था?"
            : "I can see you're upset. Would it help to talk about what happened?",
        }
        aiResponse =
          fallbackResponses[detectedEmotion] ||
          (isHindi
            ? "मैं यहाँ सुनने के लिए हूँ। आज मैं आपकी कैसे सहायता कर सकता हूँ?"
            : "I'm here to listen. How can I support you today?")
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
          emotion: detectedEmotion,
        },
      ])

      // Suggest journaling for strong emotions
      if (["sad", "anxious", "stressed"].includes(detectedEmotion)) {
        const isHindi = voiceLanguage === "hi-IN"
        toast({
          title: isHindi ? "जर्नलिंग सुझाव" : "Journaling Suggestion",
          description: isHindi
            ? "अपनी भावनाओं के बारे में लिखना मददगार हो सकता है। क्या आप एक जर्नल एंट्री जोड़ना चाहेंगे?"
            : "Writing about your feelings might help. Would you like to add a journal entry?",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("Error processing message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm here to listen. Could you tell me more about what you're experiencing?",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const addJournalEntry = (content: string, emotion: Emotion) => {
    setJournalEntries((prev) => [...prev, { content, emotion, timestamp: new Date() }])
    toast({
      title: t.journalEntryAdded,
      description: t.thoughtsSavedToJournal,
    })
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t.chatTitle}</h2>
            <p className="text-muted-foreground">{t.chatSubtitle}</p>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleEmotionDetection}
              className={emotionDetectionEnabled ? "bg-primary text-primary-foreground" : ""}
              title={emotionDetectionEnabled ? t.turnOffEmotionDetection : t.turnOnEmotionDetection}
            >
              {emotionDetectionEnabled ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
            </Button>
            <PersonalitySelector personality={personality} setPersonality={setPersonality} />
          </div>
        </div>

        {showCrisisResources && <CrisisResources onClose={() => setShowCrisisResources(false)} />}

        {emotionDetectionEnabled && (
          <div className="mt-4">
            <FaceEmotionDetector
              onEmotionDetected={handleFaceEmotionDetected}
              onScanRequest={() => setAutoMessageSent(false)}
            />
          </div>
        )}

        <Card className="mt-4 flex flex-1 flex-col">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4" style={{ height: "calc(100vh - 350px)" }}>
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-pulse">●</div>
                  <div className="animate-pulse animation-delay-200">●</div>
                  <div className="animate-pulse animation-delay-400">●</div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder={`${t.messagePlaceholder} (${t.voiceInputLanguage})`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="button"
                size="icon"
                onClick={toggleListening}
                variant={isListening ? "default" : "outline"}
                className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
                disabled={isLoading}
                title={t.speakYourMessage}
              >
                <Mic className="h-4 w-4" />
                <span className="sr-only">{t.useVoiceInput}</span>
              </Button>
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">{t.sendMessage}</span>
              </Button>
            </form>
          </div>
        </Card>

        {/* Mobile Tabs */}
        <div className="md:hidden mt-4">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="chat">{t.chat}</TabsTrigger>
              <TabsTrigger value="mood">{t.mood}</TabsTrigger>
              <TabsTrigger value="journal">{t.journal}</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="p-0 mt-0">
              {/* Chat is already shown above */}
            </TabsContent>
            <TabsContent value="mood" className="p-0 mt-2">
              <MoodTracker emotions={emotions} />
            </TabsContent>
            <TabsContent value="journal" className="p-0 mt-2">
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => {
                    const latestEmotion = emotions.length > 0 ? emotions[emotions.length - 1].emotion : "neutral"
                    addJournalEntry("", latestEmotion)
                  }}
                >
                  {t.addJournalEntry}
                </Button>

                {journalEntries.map((entry, index) => (
                  <JournalEntry
                    key={index}
                    entry={entry}
                    onSave={(content) => {
                      const updatedEntries = [...journalEntries]
                      updatedEntries[index] = { ...entry, content }
                      setJournalEntries(updatedEntries)
                    }}
                  />
                ))}

                {journalEntries.length === 0 && (
                  <p className="text-center text-muted-foreground">{t.noJournalEntriesYet}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block border-t md:border-l md:border-t-0 md:w-[350px] fixed top-16 bottom-0 right-0 overflow-auto">
          <Tabs defaultValue="mood">
            <TabsList className="w-full grid grid-cols-2 sticky top-0 bg-background z-10">
              <TabsTrigger value="mood">{t.moodTracker}</TabsTrigger>
              <TabsTrigger value="journal">{t.journal}</TabsTrigger>
            </TabsList>
            <TabsContent value="mood" className="p-4">
              <MoodTracker emotions={emotions} />
            </TabsContent>
            <TabsContent value="journal" className="p-4">
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => {
                    const latestEmotion = emotions.length > 0 ? emotions[emotions.length - 1].emotion : "neutral"
                    addJournalEntry("", latestEmotion)
                  }}
                >
                  {t.addJournalEntry}
                </Button>

                {journalEntries.map((entry, index) => (
                  <JournalEntry
                    key={index}
                    entry={entry}
                    onSave={(content) => {
                      const updatedEntries = [...journalEntries]
                      updatedEntries[index] = { ...entry, content }
                      setJournalEntries(updatedEntries)
                    }}
                  />
                ))}

                {journalEntries.length === 0 && (
                  <p className="text-center text-muted-foreground">{t.noJournalEntriesYet}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        onLanguageChange={handleLanguageChange}
        onAutoMessageChange={setAutoMessageEnabled}
        currentLanguage={voiceLanguage}
        autoMessageEnabled={autoMessageEnabled}
        isOpen={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
    </div>
  )
}
