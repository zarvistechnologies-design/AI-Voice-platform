export type BrandConfig = {
  source: "platform" | "white_label";
  hostname: string;
  productName: string;
  companyName: string;
  logoUrl: string;
  logoDarkUrl: string;
  iconUrl: string;
  urls: { app: string; api: string; links: string };
  colors: { primary: string; secondary: string; accent: string; surface: string };
  defaultTheme: "light" | "dark" | "system";
  themeStyle?: "green" | "recent";
  support: { email: string; phone: string; websiteUrl: string; helpCenterUrl: string; statusPageUrl: string };
  legal: { termsUrl: string; privacyUrl: string; cookiePolicyUrl: string; legalBusinessName: string; businessAddress: string };
  poweredBy: { visible: boolean; text: string };
  authentication: { registrationMode: "invite_only" | "open"; googleSignIn: boolean };
};

export const defaultBrand: BrandConfig = {
  source: "platform",
  hostname: "vozon.ai",
  productName: "Vozon",
  companyName: "Vozon AI",
  logoUrl: "/images/vozon-logo.svg",
  logoDarkUrl: "/images/vozon-logo.svg",
  iconUrl: "/images/vozon-mark.svg",
  urls: { app: "https://vozon.ai", api: "https://api.vozon.ai", links: "https://api.vozon.ai" },
  colors: { primary: "#2563eb", secondary: "#1d4ed8", accent: "#60a5fa", surface: "#09090b" },
  defaultTheme: "dark",
  themeStyle: "recent",
  support: { email: "hello@vozon.ai", phone: "+91 78925 18414", websiteUrl: "https://vozon.ai", helpCenterUrl: "https://vozon.ai/docs", statusPageUrl: "" },
  legal: { termsUrl: "https://vozon.ai/terms", privacyUrl: "https://vozon.ai/privacy", cookiePolicyUrl: "", legalBusinessName: "Vozon AI", businessAddress: "A-135, Sector 63, Noida, Uttar Pradesh 201309" },
  poweredBy: { visible: false, text: "" },
  authentication: { registrationMode: "open", googleSignIn: true },
};
