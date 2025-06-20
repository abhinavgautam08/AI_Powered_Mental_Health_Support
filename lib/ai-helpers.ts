import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import type { Emotion, Message, Personality } from "@/lib/types"
import { getApiKey, setApiKey, getDefaultApiKey } from "@/lib/api-config"

// Create a custom Google provider instance
let googleAI: ReturnType<typeof createGoogleGenerativeAI> | null = null
let apiKeyValidated = false
let apiKeyValid = false

// Function to update the API key
export async function updateApiKey(newApiKey: string): Promise<boolean> {
  // Reset validation state
  apiKeyValidated = false
  apiKeyValid = false
  googleAI = null

  // Update the API key in the config
  setApiKey(newApiKey)

  // Validate the new key
  return await initializeGoogleAI()
}

// Function to validate and initialize the Google AI provider
const initializeGoogleAI = async (): Promise<boolean> => {
  // If we've already validated, return the cached result
  if (apiKeyValidated) {
    return apiKeyValid
  }

  // Get the API key from the config
  const apiKey = getApiKey()

  // If no API key, don't even try
  if (!apiKey || apiKey.trim() === "") {
    console.warn("No Google API key found or key is empty")
    apiKeyValidated = true
    apiKeyValid = false
    return false
  }

  try {
    // Create the provider
    googleAI = createGoogleGenerativeAI({
      apiKey: apiKey,
    })

    // Test the API key with a simple request
    try {
      await generateText({
        model: googleAI("gemini-1.5-flash"),
        prompt: "test",
      })
      apiKeyValidated = true
      apiKeyValid = true
      return true
    } catch (error) {
      console.error("API key validation failed:", error)

      // If this is the default API key and it failed, we should log a specific error
      if (apiKey === getDefaultApiKey()) {
        console.error("Default API key validation failed. The key may have expired or reached its quota limit.")
      }

      apiKeyValidated = true
      apiKeyValid = false
      googleAI = null
      return false
    }
  } catch (error) {
    console.error("Failed to initialize Google AI provider:", error)
    apiKeyValidated = true
    apiKeyValid = false
    return false
  }
}

// Function to translate text using the free Google Translate API
async function translateWithFreeAPI(text: string, fromLang: string, toLang: string): Promise<string> {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`,
    )

    if (!response.ok) {
      throw new Error(`Translation API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Extract translated text from response
    let translatedText = ""
    if (data && data[0]) {
      data[0].forEach((item: any) => {
        if (item[0]) translatedText += item[0]
      })
    }

    return translatedText || text
  } catch (fallbackError) {
    console.error("Error using free translation API:", fallbackError)
    return text // Return original text if translation fails
  }
}

// Function to translate text from one language to another
export async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  // If text is empty or languages are the same, return the original text
  if (!text.trim() || fromLang === toLang) {
    return text
  }

  try {
    // Check API key validity if not already checked
    if (!apiKeyValidated) {
      await initializeGoogleAI()
    }

    // Only try Google AI if we have a valid API key and provider
    if (apiKeyValid && googleAI) {
      try {
        const { text: translatedText } = await generateText({
          model: googleAI("gemini-1.5-flash"),
          prompt: `Translate the following text from ${fromLang} to ${toLang}. Only respond with the translation, nothing else:
          
          "${text}"`,
        })

        if (translatedText && translatedText.trim()) {
          return translatedText.trim()
        }
      } catch (error) {
        console.error("Error using AI for translation, falling back to free API:", error)
        // Continue to fallback
      }
    }

    // Always fall back to free translation API if Google AI fails or is not available
    return await translateWithFreeAPI(text, fromLang, toLang)
  } catch (error) {
    console.error("Translation error:", error)

    // Final fallback - try the free API directly
    try {
      return await translateWithFreeAPI(text, fromLang, toLang)
    } catch (finalError) {
      console.error("Final translation fallback failed:", finalError)
      return text // Return original text if all translation attempts fail
    }
  }
}

// Function to detect emotion from text using keyword-based approach
function detectEmotionFromKeywords(text: string): Emotion {
  const lowerText = text.toLowerCase()

  if (
    lowerText.includes("happy") ||
    lowerText.includes("joy") ||
    lowerText.includes("great") ||
    lowerText.includes("wonderful") ||
    // Hindi keywords for happy
    lowerText.includes("खुश") ||
    lowerText.includes("प्रसन्न") ||
    lowerText.includes("आनंदित")
  ) {
    return "happy"
  } else if (
    lowerText.includes("sad") ||
    lowerText.includes("depressed") ||
    lowerText.includes("unhappy") ||
    lowerText.includes("miserable") ||
    // Hindi keywords for sad
    lowerText.includes("दुखी") ||
    lowerText.includes("उदास") ||
    lowerText.includes("निराश")
  ) {
    return "sad"
  } else if (
    lowerText.includes("anxious") ||
    lowerText.includes("worry") ||
    lowerText.includes("nervous") ||
    lowerText.includes("fear") ||
    // Hindi keywords for anxious
    lowerText.includes("चिंतित") ||
    lowerText.includes("घबराहट") ||
    lowerText.includes("डर")
  ) {
    return "anxious"
  } else if (
    lowerText.includes("stress") ||
    lowerText.includes("overwhelm") ||
    lowerText.includes("pressure") ||
    // Hindi keywords for stressed
    lowerText.includes("तनाव") ||
    lowerText.includes("दबाव") ||
    lowerText.includes("परेशान")
  ) {
    return "stressed"
  } else if (
    lowerText.includes("angry") ||
    lowerText.includes("mad") ||
    lowerText.includes("furious") ||
    lowerText.includes("upset") ||
    // Hindi keywords for angry
    lowerText.includes("गुस्सा") ||
    lowerText.includes("क्रोधित") ||
    lowerText.includes("नाराज")
  ) {
    return "angry"
  }

  // Default to neutral if no keywords match
  return "neutral"
}

// Function to detect emotion from text
export async function detectEmotion(text: string, offlineMode = false): Promise<Emotion> {
  try {
    // Always use keyword-based detection first
    const keywordEmotion = detectEmotionFromKeywords(text)

    // If in offline mode, just return the keyword-based emotion
    if (offlineMode) {
      return keywordEmotion
    }

    // Check API key validity if not already checked
    if (!apiKeyValidated) {
      await initializeGoogleAI()
    }

    // Only try AI-based detection if Google AI is available and API key is valid
    if (apiKeyValid && googleAI) {
      try {
        const { text: result } = await generateText({
          model: googleAI("gemini-1.5-flash"),
          prompt: `
            Analyze the following text and determine the primary emotion expressed.
            Choose exactly one emotion from this list: happy, neutral, sad, anxious, stressed, angry.
            Only respond with the emotion name, nothing else.
            
            Text: "${text}"
          `,
        })

        const aiEmotion = result.trim().toLowerCase() as Emotion

        // Validate the emotion is one of our accepted types
        if (["happy", "neutral", "sad", "anxious", "stressed", "angry"].includes(aiEmotion)) {
          return aiEmotion
        }
      } catch (innerError) {
        console.error("Error in AI emotion detection, using keyword-based fallback:", innerError)
        // Continue with keyword-based detection
      }
    }

    // Return the emotion detected by keywords if AI detection fails or is unavailable
    return keywordEmotion
  } catch (error) {
    console.error("Error detecting emotion:", error)
    // Return neutral as a safe fallback
    return "neutral"
  }
}

// Function to get AI response based on personality and emotion
export async function getAIResponse(
  userMessage: string,
  personality: Personality,
  detectedEmotion: Emotion,
  messageHistory: Message[],
  offlineMode = false,
  language = "en-US", // Add language parameter
): Promise<string> {
  // Create a context from the message history (last 10 messages)
  const recentMessages = messageHistory
    .slice(-10)
    .map((msg) => {
      const content = msg.translated && msg.role === "user" ? msg.translated : msg.content
      return `${msg.role === "user" ? "User" : "Assistant"}: ${content}`
    })
    .join("\n")

  // Create personality-specific system prompts
  const isHindi = language === "hi-IN"
  const languageInstruction = isHindi
    ? "Respond in Hindi (Devanagari script). Use natural, conversational Hindi."
    : "Respond in English."

  const personalityPrompts = {
    supportive: `You are a supportive friend who listens and provides emotional support. 
      You're warm, empathetic, and non-judgmental. You validate feelings and offer gentle encouragement.
      The user's current emotional state appears to be: ${detectedEmotion}.
      ${languageInstruction}`,

    therapist: `You are a professional therapist who helps people understand their thoughts and feelings. 
      You use therapeutic techniques like cognitive reframing and mindfulness. You ask thoughtful questions
      and provide evidence-based guidance.
      The user's current emotional state appears to be: ${detectedEmotion}.
      ${languageInstruction}`,

    coach: `You are a motivational coach who helps people achieve their goals. 
      You're action-oriented, encouraging, and focused on solutions. You help break down problems
      into manageable steps and provide accountability.
      The user's current emotional state appears to be: ${detectedEmotion}.
      ${languageInstruction}`,
  }

  // Create emotion-specific guidance
  const emotionGuidance = {
    happy: "Celebrate their positive feelings and help maintain this state.",
    neutral: "Engage them in thoughtful conversation and explore their current situation.",
    sad: "Provide comfort and validate their feelings. Offer gentle perspective when appropriate.",
    anxious: "Help them ground themselves and break down their worries. Suggest calming techniques.",
    stressed: "Acknowledge their stress and help prioritize. Suggest stress management techniques.",
    angry: "Allow them to express feelings safely. Help identify the source of anger and constructive outlets.",
  }

  // Fallback responses based on emotion and personality
  const fallbackResponses = {
    supportive: {
      happy: isHindi
        ? "यह सुनकर बहुत खुशी हुई! मुझे खुशी है कि आपके साथ सब कुछ अच्छा चल रहा है। हाल ही में आपको खुशी किस बात से मिली है?"
        : "That's wonderful to hear! I'm glad things are going well for you. What's been bringing you joy lately?",
      neutral: isHindi
        ? "मैं यहाँ बात करने के लिए हूँ। आपका दिन कैसा रहा?"
        : "I'm here to chat. How has your day been going so far?",
      sad: isHindi
        ? "मुझे खुशी है कि आप उदास महसूस कर रहे हैं। ऐसा महसूस करना ठीक है, और अगर आप इसके बारे में और बात करना चाहते हैं तो मैं यहाँ सुनने के लिए हूँ।"
        : "I'm sorry you're feeling down. It's okay to feel this way, and I'm here to listen if you want to talk more about it.",
      anxious: isHindi
        ? "लगता है आप चिंतित महसूस कर रहे हैं। आइए एक साथ गहरी सांस लेते हैं। अभी आपके मन में क्या चल रहा है?"
        : "It sounds like you're feeling anxious. Let's take a deep breath together. What's on your mind right now?",
      stressed: isHindi
        ? "लगता है आप बहुत दबाव में हैं। अभी हम किस एक छोटी सी बात पर ध्यान दे सकते हैं?"
        : "It seems like you're under a lot of pressure. What's one small thing we could focus on right now?",
      angry: isHindi
        ? "मैं देख सकता हूँ कि आप परेशान हैं। कभी-कभी गुस्सा आना सामान्य बात है। क्या इस बारे में बात करने से मदद मिलेगी कि क्या हुआ था?"
        : "I can see you're upset. It's okay to feel angry sometimes. Would it help to talk about what happened?",
    },
    therapist: {
      happy: isHindi
        ? "मैं देख रहा हूँ कि आप सकारात्मक अवस्था में हैं। आपको क्या लगता है कि इस भावना में कौन से कारक योगदान दे रहे हैं?"
        : "I notice you're in a positive state. What factors do you think contributed to this feeling?",
      neutral: isHindi
        ? "अभी आप अपनी भावनात्मक स्थिति का कैसे वर्णन करेंगे? आपके मन में क्या विचार आ रहे हैं?"
        : "How would you describe your emotional state right now? What thoughts are you having?",
      sad: isHindi
        ? "अवसाद और उदासी सामान्य मानवीय अनुभव हैं। क्या आप पहचान सकते हैं कि इन भावनाओं में क्या योगदान हो सकता है?"
        : "Depression and sadness are common human experiences. Can you identify what might be contributing to these feelings?",
      anxious: isHindi
        ? "चिंता अक्सर भविष्य की घटनाओं के बारे में चिंता करने से जुड़ी होती है। आपके मन में कौन सी विशिष्ट चिंताएं हैं?"
        : "Anxiety often involves worrying about future events. What specific concerns are on your mind?",
      stressed: isHindi
        ? "तनाव आपके शरीर की मांगों के प्रति प्रतिक्रिया है। आइए पहचानते हैं कि इस दबाव का कारण क्या है और मुकाबला करने की रणनीतियों का पता लगाते हैं।"
        : "Stress is your body's response to demands. Let's identify what's causing this pressure and explore coping strategies.",
      angry: isHindi
        ? "गुस्सा अक्सर अन्य भावनाओं को छुपाता है। जब आप गुस्से के नीचे देखते हैं, तो कौन सी अन्य भावनाएं मौजूद हो सकती हैं?"
        : "Anger often masks other emotions. When you look beneath the anger, what other feelings might be present?",
    },
    coach: {
      happy: isHindi
        ? "बहुत बढ़िया ऊर्जा! आइए इस सकारात्मक गति का उपयोग करते हैं। आज आप किस लक्ष्य पर प्रगति करना चाहेंगे?"
        : "Great energy! Let's channel this positive momentum. What's one goal you'd like to make progress on today?",
      neutral: isHindi
        ? "आइए हमारी बातचीत के लिए एक इरादा निर्धारित करते हैं। आप क्या हासिल करना चाहते हैं या किस दिशा में काम करना चाहते हैं?"
        : "Let's set an intention for our conversation. What would you like to accomplish or work toward?",
      sad: isHindi
        ? "जब प्रेरणा कम हो तो भी छोटे कदम मायने रखते हैं। कौन सा एक छोटा काम अभी संभव लग सकता है?"
        : "Even when motivation is low, small steps matter. What's one tiny action that might feel manageable right now?",
      anxious: isHindi
        ? "आइए चिंता के कारणों को छोटे, कार्यान्वित करने योग्य भागों में बांटते हैं। सबसे तत्काल चिंता क्या है?"
        : "Let's break down what's causing worry into smaller, actionable parts. What's the most immediate concern?",
      stressed: isHindi
        ? "जब हम अभिभूत होते हैं, तो प्राथमिकता निर्धारण महत्वपूर्ण है। सबसे महत्वपूर्ण बात क्या है जिस पर आपका ध्यान देने की जरूरत है?"
        : "When we're overwhelmed, prioritization is key. What's the most important thing that needs your attention?",
      angry: isHindi
        ? "उस ऊर्जा को उत्पादक रूप से पुनर्निर्देशित किया जा सकता है। इस भावना को संसाधित करने के बाद, आप कौन सी रचनात्मक कार्रवाई कर सकते हैं?"
        : "That energy can be redirected productively. Once you've processed this feeling, what constructive action could you take?",
    },
  }

  // If in offline mode, just return the fallback response
  if (offlineMode) {
    return fallbackResponses[personality][detectedEmotion]
  }

  try {
    // Skip Google AI response attempt if we know the API key is invalid
    if (!apiKeyValidated) {
      await initializeGoogleAI()
    }

    // Only attempt AI response if Google AI is available and API key is valid
    if (apiKeyValid && googleAI) {
      try {
        const { text } = await generateText({
          model: googleAI("gemini-1.5-flash"),
          system: `${personalityPrompts[personality]}
            
            Guidelines:
            - ${emotionGuidance[detectedEmotion]}
            - Keep responses concise (2-4 sentences) and conversational.
            - Never identify yourself as an AI, model, or assistant. Respond as the personality type.
            - Don't use phrases like "I understand" or "I'm sorry to hear that" too frequently.
            - Avoid clinical language unless you're in therapist mode.
            - Never suggest medical treatments or diagnose conditions.
            - If the user mentions self-harm or suicide, provide crisis resources.
            
            Recent conversation:
            ${recentMessages}`,
          prompt: userMessage,
        })

        return text
      } catch (innerError) {
        console.error("Error in AI response generation, using fallback:", innerError)
        // Continue to fallback
      }
    }

    // Use fallback responses if API call fails or no API key
    return fallbackResponses[personality][detectedEmotion]
  } catch (error) {
    console.error("Error getting AI response:", error)
    return fallbackResponses[personality][detectedEmotion]
  }
}

// Export a function to check if the API key is valid
export async function isApiKeyValid(): Promise<boolean> {
  await initializeGoogleAI()
  return apiKeyValid
}
