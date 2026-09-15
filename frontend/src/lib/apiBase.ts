const publicApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
const proxyMode = process.env.NEXT_PUBLIC_API_PROXY_MODE ?? "auto";

export const API_URL =
  proxyMode === "off"
    ? publicApiUrl || "http://localhost:5000"
    : proxyMode === "on" || process.env.NODE_ENV === "production"
      ? ""
      : publicApiUrl || "http://localhost:5000";
