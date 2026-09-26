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
  hostname: "vomyra.com",
  productName: "Vomyra",
  companyName: "Vomyra AI",
  logoUrl: "/images/logo_2.svg",
  logoDarkUrl: "/images/logo_2.svg",
  iconUrl: "/icons/vozon-mark-192.png",
  urls: { app: "https://vomyra.com", api: "https://api.vomyra.com", links: "https://api.vomyra.com" },
  colors: { primary: "#10b981", secondary: "#071b18", accent: "#34d399", surface: "#09090b" },
  defaultTheme: "dark",
  support: { email: "support@vomyra.com", phone: "+91-9540312540", websiteUrl: "https://vomyra.com", helpCenterUrl: "https://vomyra.com/docs", statusPageUrl: "" },
  legal: { termsUrl: "https://vomyra.com/terms", privacyUrl: "https://vomyra.com/privacy", cookiePolicyUrl: "", legalBusinessName: "Vomyra AI", businessAddress: "A-135, Sector 63, Noida, Uttar Pradesh 201309" },
  poweredBy: { visible: false, text: "" },
  authentication: { registrationMode: "open", googleSignIn: true },
};
