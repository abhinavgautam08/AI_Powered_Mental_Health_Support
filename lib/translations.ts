export type Language = "en-US" | "hi-IN"

export interface Translations {
  // Header
  appTitle: string

  // Chat Interface
  chatTitle: string
  chatSubtitle: string
  messagePlaceholder: string
  voiceInputTitle: string
  sendMessage: string
  listening: string
  speakNow: string

  // Buttons and Actions
  scanNow: string
  addJournalEntry: string
  saveEntry: string
  saveChanges: string
  cancel: string
  update: string
  backToChat: string
  settings: string
  saving: string
  updating: string
  savePreferences: string
  updateLanguage: string

  // Tabs
  chat: string
  mood: string
  journal: string
  preferences: string
  language: string
  moodTracker: string

  // Mood Tracker
  currentMood: string
  moodHistory: string
  recentMoodChanges: string
  lastUpdated: string
  noDataYet: string
  noDataAvailable: string

  // Journal
  noJournalEntries: string
  noJournalEntriesYet: string
  startWriting: string
  writeThoughts: string

  // Settings
  settingsTitle: string
  settingsDescription: string
  applicationPreferences: string
  customizeExperience: string
  customizeApplication: string
  languageSettings: string
  languageDescription: string
  configureLanguage: string

  // Preferences
  autoMessageMood: string
  autoMessageDescription: string
  autoMessageMoodDescription: string
  offlineMode: string
  offlineModeDescription: string
  voiceInputLanguage: string
  voiceLanguageDescription: string
  voiceInputLanguageDescription: string

  // Languages
  english: string
  hindi: string
  englishUS: string
  hindiIndia: string

  // Emotions
  emotions: {
    happy: string
    neutral: string
    sad: string
    anxious: string
    stressed: string
    angry: string
  }

  // Notifications
  emotionDetected: string
  journalEntryAdded: string
  journalEntrySaved: string
  thoughtsSavedToJournal: string
  preferencesUpdated: string
  preferencesUpdatedDescription: string
  languageUpdated: string
  offlineModeActivated: string
  onlineModeActivated: string
  emotionDetectionEnabled: string
  emotionDetectionDisabled: string
  journalingSuggestion: string
  journalingSuggestionDescription: string
  updateFailed: string
  updateFailedDescription: string

  // Personality Types
  personalities: {
    supportive: string
    therapist: string
    coach: string
    supportiveDescription: string
    therapistDescription: string
    coachDescription: string
  }

  // Crisis Resources
  crisisSupport: string
  crisisDescription: string
  crisisHotlines: string
  onlineResources: string
  emergencyNote: string

  // Additional UI elements
  switchToOnlineMode: string
  switchToOfflineMode: string
  turnOffEmotionDetection: string
  turnOnEmotionDetection: string
  speakYourMessage: string
  useVoiceInput: string
  speechRecognitionError: string
  error: string
  pleaseTryAgain: string
  speechRecognitionNotSupported: string
  browserDoesntSupportSpeechRecognition: string
  languageIsActive: string
  clickScanNow: string
  emotionScanningTurnedOff: string
  apiKeyInvalid: string
  noValidApiKeyFound: string
  usingAiPoweredResponses: string
  usingLocalResponses: string
  apiKeyIssuesDetected: string
  apiKeyError: string
  issueWithApiKey: string
}

export const translations: Record<Language, Translations> = {
  "en-US": {
    appTitle: "MentalHS-Ai",

    chatTitle: "Chat with Ai",
    chatSubtitle: "Share your thoughts and feelings in a safe space",
    messagePlaceholder: "Type your message...",
    voiceInputTitle: "Speak your message",
    sendMessage: "Send message",
    listening: "Listening...",
    speakNow: "Speak now",

    scanNow: "Scan Now",
    addJournalEntry: "Add Journal Entry",
    saveEntry: "Save Entry",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    update: "Update",
    backToChat: "Back to Chat",
    settings: "Settings",
    saving: "Saving...",
    updating: "Updating...",
    savePreferences: "Save Preferences",
    updateLanguage: "Update Language",

    chat: "Chat",
    mood: "Mood",
    journal: "Journal",
    preferences: "Preferences",
    language: "Language",
    moodTracker: "Mood Tracker",

    currentMood: "Current Mood",
    moodHistory: "Mood History",
    recentMoodChanges: "Recent Mood Changes",
    lastUpdated: "Last updated",
    noDataYet: "No data yet",
    noDataAvailable: "No data available yet",

    noJournalEntries: "No journal entries yet. Start writing to track your thoughts.",
    noJournalEntriesYet: "No journal entries yet. Start writing to track your thoughts.",
    startWriting: "Start writing to track your thoughts",
    writeThoughts: "Write your thoughts here...",

    settingsTitle: "Settings",
    settingsDescription: "Manage your application settings and preferences",
    applicationPreferences: "Application Preferences",
    customizeExperience: "Customize your application experience",
    customizeApplication: "Customize your application experience",
    languageSettings: "Language Settings",
    languageDescription: "Configure language preferences for voice input and interface",
    configureLanguage: "Configure language preferences for voice input and interface",

    autoMessageMood: "Auto Message Mood",
    autoMessageDescription: "Automatically send a message when a new mood is detected",
    autoMessageMoodDescription: "Automatically send a message when a new mood is detected",
    offlineMode: "Offline Mode",
    offlineModeDescription: "Use local responses without making API calls",
    voiceInputLanguage: "Voice Input Language",
    voiceLanguageDescription: "Select the language for voice input. This affects speech recognition only.",
    voiceInputLanguageDescription: "Select the language for voice input. This affects speech recognition only.",

    english: "English (US)",
    hindi: "Hindi (India)",
    englishUS: "English (US)",
    hindiIndia: "Hindi (India)",

    emotions: {
      happy: "happy",
      neutral: "neutral",
      sad: "sad",
      anxious: "anxious",
      stressed: "stressed",
      angry: "angry",
    },

    emotionDetected: "Emotion Detected",
    journalEntryAdded: "Journal Entry Added",
    journalEntrySaved: "Your thoughts have been saved to your journal.",
    thoughtsSavedToJournal: "Your thoughts have been saved to your journal.",
    preferencesUpdated: "Preferences Updated",
    preferencesUpdatedDescription: "Your preferences have been updated successfully.",
    languageUpdated: "Language Updated",
    offlineModeActivated: "Offline Mode Activated",
    onlineModeActivated: "Online Mode Activated",
    emotionDetectionEnabled: "Emotion Detection Enabled",
    emotionDetectionDisabled: "Emotion Detection Disabled",
    journalingSuggestion: "Journaling Suggestion",
    journalingSuggestionDescription: "Writing about your feelings might help. Would you like to add a journal entry?",
    updateFailed: "Update Failed",
    updateFailedDescription: "There was a problem updating your preferences.",

    personalities: {
      supportive: "Supportive Friend",
      therapist: "Therapist",
      coach: "Motivational Coach",
      supportiveDescription: "Warm, empathetic responses focused on emotional support",
      therapistDescription: "Professional guidance with therapeutic techniques",
      coachDescription: "Action-oriented advice to help you achieve goals",
    },

    crisisSupport: "Crisis Support",
    crisisDescription: "If you're experiencing a mental health emergency, please reach out for immediate help.",
    crisisHotlines: "Crisis Hotlines",
    onlineResources: "Online Resources",
    emergencyNote:
      "Remember: If you or someone else is in immediate danger, please call emergency services (911 in the US) right away.",

    switchToOnlineMode: "Switch to online mode",
    switchToOfflineMode: "Switch to offline mode",
    turnOffEmotionDetection: "Turn off emotion detection",
    turnOnEmotionDetection: "Turn on emotion detection",
    speakYourMessage: "Speak your message (Hindi supported)",
    useVoiceInput: "Use voice input",
    speechRecognitionError: "Speech Recognition Error",
    error: "Error",
    pleaseTryAgain: "Please try again.",
    speechRecognitionNotSupported: "Speech Recognition Not Supported",
    browserDoesntSupportSpeechRecognition: "Your browser doesn't support speech recognition.",
    languageIsActive: "language is active.",
    clickScanNow: "Click 'Scan Now' to analyze your current emotional state.",
    emotionScanningTurnedOff: "Emotion scanning has been turned off.",
    apiKeyInvalid: "API Key Invalid",
    noValidApiKeyFound: "No valid API key found. Some features will use fallback responses.",
    usingAiPoweredResponses: "Using AI-powered responses when available.",
    usingLocalResponses: "Using local responses without API calls.",
    apiKeyIssuesDetected: "API key issues detected. Using offline mode with local responses.",
    apiKeyError: "API Key Error",
    issueWithApiKey: "There was an issue with the API key. Using offline mode.",
  },

  "hi-IN": {
    appTitle: "मानसिक स्वास्थ्य-Ai",

    chatTitle: "Ai के साथ चैट करें",
    chatSubtitle: "एक सुरक्षित स्थान में अपने विचार और भावनाएं साझा करें",
    messagePlaceholder: "अपना संदेश टाइप करें...",
    voiceInputTitle: "अपना संदेश बोलें",
    sendMessage: "संदेश भेजें",
    listening: "सुन रहा है...",
    speakNow: "अब बोलें",

    scanNow: "अभी स्कैन करें",
    addJournalEntry: "जर्नल एंट्री जोड़ें",
    saveEntry: "एंट्री सेव करें",
    saveChanges: "परिवर्तन सेव करें",
    cancel: "रद्द करें",
    update: "अपडेट करें",
    backToChat: "चैट पर वापस जाएं",
    settings: "सेटिंग्स",
    saving: "सेव कर रहे हैं...",
    updating: "अपडेट कर रहे हैं...",
    savePreferences: "प्राथमिकताएं सेव करें",
    updateLanguage: "भाषा अपडेट करें",

    chat: "चैट",
    mood: "मूड",
    journal: "जर्नल",
    preferences: "प्राथमिकताएं",
    language: "भाषा",
    moodTracker: "मूड ट्रैकर",

    currentMood: "वर्तमान मूड",
    moodHistory: "मूड इतिहास",
    recentMoodChanges: "हाल के मूड परिवर्तन",
    lastUpdated: "अंतिम अपडेट",
    noDataYet: "अभी तक कोई डेटा नहीं",
    noDataAvailable: "अभी तक कोई डेटा उपलब्ध नहीं है",

    noJournalEntries: "अभी तक कोई जर्नल एंट्री नहीं है। अपने विचारों को ट्रैक करने के लिए लिखना शुरू करें।",
    noJournalEntriesYet: "अभी तक कोई जर्नल एंट्री नहीं है। अपने विचारों को ट्रैक करने के लिए लिखना शुरू करें।",
    startWriting: "अपने विचारों को ट्रैक करने के लिए लिखना शुरू करें",
    writeThoughts: "यहाँ अपने विचार लिखें...",

    settingsTitle: "सेटिंग्स",
    settingsDescription: "अपनी एप्लिकेशन सेटिंग्स और प्राथमिकताओं को प्रबंधित करें",
    applicationPreferences: "एप्लिकेशन प्राथमिकताएं",
    customizeExperience: "अपने एप्लिकेशन अनुभव को कस्टमाइज़ करें",
    customizeApplication: "अपने एप्लिकेशन अनुभव को कस्टमाइज़ करें",
    languageSettings: "भाषा सेटिंग्स",
    languageDescription: "आवाज इनपुट और इंटरफेस के लिए भाषा प्राथमिकताएं कॉन्फ़िगर करें",
    configureLanguage: "आवाज इनपुट और इंटरफेस के लिए भाषा प्राथमिकताएं कॉन्फ़िगर करें",

    autoMessageMood: "ऑटो मैसेज मूड",
    autoMessageDescription: "जब नया मूड का पता चले तो स्वचालित रूप से संदेश भेजें",
    autoMessageMoodDescription: "जब नया मूड का पता चले तो स्वचालित रूप से संदेश भेजें",
    offlineMode: "ऑफलाइन मोड",
    offlineModeDescription: "API कॉल के बिना स्थानीय प्रतिक्रियाओं का उपयोग करें",
    voiceInputLanguage: "आवाज इनपुट भाषा",
    voiceLanguageDescription: "आवाज इनपुट के लिए भाषा चुनें। यह केवल स्पीच रिकग्निशन को प्रभावित करता है।",
    voiceInputLanguageDescription: "आवाज इनपुट के लिए भाषा चुनें। यह केवल स्पीच रिकग्निशन को प्रभावित करता है।",

    english: "अंग्रेजी (यूएस)",
    hindi: "हिंदी (भारत)",
    englishUS: "अंग्रेजी (यूएस)",
    hindiIndia: "हिंदी (भारत)",

    emotions: {
      happy: "खुश",
      neutral: "सामान्य",
      sad: "उदास",
      anxious: "चिंतित",
      stressed: "तनावग्रस्त",
      angry: "गुस्से में",
    },

    emotionDetected: "भावना का पता चला",
    journalEntryAdded: "जर्नल एंट्री जोड़ी गई",
    journalEntrySaved: "आपके विचार आपके जर्नल में सेव कर दिए गए हैं।",
    thoughtsSavedToJournal: "आपके विचार आपके जर्नल में सेव कर दिए गए हैं।",
    preferencesUpdated: "प्राथमिकताएं अपडेट हुईं",
    preferencesUpdatedDescription: "आपकी प्राथमिकताएं सफलतापूर्वक अपडेट हो गई हैं।",
    languageUpdated: "भाषा अपडेट हुई",
    offlineModeActivated: "ऑफलाइन मोड सक्रिय",
    onlineModeActivated: "ऑनलाइन मोड सक्रिय",
    emotionDetectionEnabled: "भावना पहचान सक्षम",
    emotionDetectionDisabled: "भावना पहचान अक्षम",
    journalingSuggestion: "जर्नलिंग सुझाव",
    journalingSuggestionDescription: "अपनी भावनाओं के बारे में लिखना मददगार हो सकता है। क्या आप एक जर्नल एंट्री जोड़ना चाहेंगे?",
    updateFailed: "अपडेट असफल",
    updateFailedDescription: "आपकी प्राथमिकताओं को अपडेट करने में समस्या हुई।",

    personalities: {
      supportive: "सहायक मित्र",
      therapist: "चिकित्सक",
      coach: "प्रेरणादायक कोच",
      supportiveDescription: "भावनात्मक समर्थन पर केंद्रित गर्म, सहानुभूतिपूर्ण प्रतिक्रियाएं",
      therapistDescription: "चिकित्सीय तकनीकों के साथ पेशेवर मार्गदर्शन",
      coachDescription: "आपके लक्ष्यों को प्राप्त करने में मदद के लिए कार्य-उन्मुख सलाह",
    },

    crisisSupport: "संकट सहायता",
    crisisDescription: "यदि आप मानसिक स्वास्थ्य आपातकाल का सामना कर रहे हैं, तो कृपया तुरंत सहायता के लिए संपर्क करें।",
    crisisHotlines: "संकट हॉटलाइन",
    onlineResources: "ऑनलाइन संसाधन",
    emergencyNote: "याद रखें: यदि आप या कोई और तत्काल खतरे में है, तो कृपया तुरंत आपातकालीन सेवाओं (भारत में 112) को कॉल करें।",

    switchToOnlineMode: "ऑनलाइन मोड पर स्विच करें",
    switchToOfflineMode: "ऑफलाइन मोड पर स्विच करें",
    turnOffEmotionDetection: "भावना पहचान बंद करें",
    turnOnEmotionDetection: "भावना पहचान चालू करें",
    speakYourMessage: "अपना संदेश बोलें (हिंदी समर्थित)",
    useVoiceInput: "आवाज इनपुट का उपयोग करें",
    speechRecognitionError: "स्पीच रिकग्निशन त्रुटि",
    error: "त्रुटि",
    pleaseTryAgain: "कृपया पुनः प्रयास करें।",
    speechRecognitionNotSupported: "स्पीच रिकग्निशन समर्थित नहीं",
    browserDoesntSupportSpeechRecognition: "आपका ब्राउज़र स्पीच रिकग्निशन का समर्थन नहीं करता।",
    languageIsActive: "भाषा सक्रिय है।",
    clickScanNow: "अपनी वर्तमान भावनात्मक स्थिति का विश्लेषण करने के लिए 'अभी स्कैन करें' पर क्लिक करें।",
    emotionScanningTurnedOff: "भावना स्कैनिंग बंद कर दी गई है।",
    apiKeyInvalid: "API की अमान्य",
    noValidApiKeyFound: "कोई वैध API की नहीं मिली। कुछ सुविधाएं फॉलबैक प्रतिक्रियाओं का उपयोग करेंगी।",
    usingAiPoweredResponses: "उपलब्ध होने पर AI-संचालित प्रतिक्रियाओं का उपयोग कर रहे हैं।",
    usingLocalResponses: "API कॉल के बिना स्थानीय प्रतिक्रियाओं का उपयोग कर रहे हैं।",
    apiKeyIssuesDetected: "API की समस्याएं मिलीं। स्थानीय प्रतिक्रियाओं के साथ ऑफलाइन मोड का उपयोग कर रहे हैं।",
    apiKeyError: "API की त्रुटि",
    issueWithApiKey: "API की के साथ समस्या थी। ऑफलाइन मोड का उपयोग कर रहे हैं।",
  },
}

export function getTranslation(language: Language): Translations {
  return translations[language] || translations["en-US"]
}

export function getCurrentLanguage(): Language {
  if (typeof window !== "undefined") {
    try {
      const savedSettings = localStorage.getItem("app_settings")
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        if (settings.voiceLanguage) {
          return settings.voiceLanguage as Language
        }
      }
    } catch (error) {
      console.error("Error loading language setting:", error)
    }
  }
  return "en-US"
}
