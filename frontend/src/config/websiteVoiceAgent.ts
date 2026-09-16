export const websiteVoiceAgent = {
  id: process.env.NEXT_PUBLIC_WEBSITE_AGENT_ID?.trim() || "6a818ee880e87c6c405274b3",
  publicKey: process.env.NEXT_PUBLIC_WEBSITE_AGENT_PUBLIC_KEY?.trim() || "wpk_f2fc6a2375744227a4bf3c53889816dc",
  languages: [
    "English",
    "Hindi",
    "Bengali",
    "Tamil",
    "Kannada",
    "Telugu",
    "Malayalam",
    "Marathi",
    "Gujarati",
    "Punjabi",
    "Odia",
    "Assamese",
  ],
} as const;
