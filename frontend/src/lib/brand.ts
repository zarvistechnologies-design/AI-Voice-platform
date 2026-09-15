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
  support: { email: string; phone: string; websiteUrl: string; helpCenterUrl: string; statusPageUrl: string };
  legal: { termsUrl: string; privacyUrl: string; cookiePolicyUrl: string; legalBusinessName: string; businessAddress: string };
  poweredBy: { visible: boolean; text: string };
  authentication: { registrationMode: "invite_only" | "open"; googleSignIn: boolean };
};

export const defaultBrand: BrandConfig = {
  source: "platform",
  hostname: "www.vozon.ai",
  productName: "Vozon",
  companyName: "Vozon",
  logoUrl: "/images/logo_2.svg",
  logoDarkUrl: "/images/logo_2.svg",
  iconUrl: "/icons/vozon-mark-192.png",
  urls: { app: "https://www.vozon.ai", api: "https://api.vozon.ai", links: "https://api.vozon.ai" },
  colors: { primary: "#45ddce", secondary: "#071b18", accent: "#75fff0", surface: "#020807" },
  defaultTheme: "dark",
  support: { email: "hello@vozon.ai", phone: "", websiteUrl: "https://www.vozon.ai", helpCenterUrl: "https://www.vozon.ai/docs", statusPageUrl: "" },
  legal: { termsUrl: "https://www.vozon.ai/terms", privacyUrl: "https://www.vozon.ai/privacy", cookiePolicyUrl: "", legalBusinessName: "Vozon", businessAddress: "" },
  poweredBy: { visible: false, text: "" },
  authentication: { registrationMode: "open", googleSignIn: true },
};
