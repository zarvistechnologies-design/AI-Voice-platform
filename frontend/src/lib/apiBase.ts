const publicApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
const proxyMode = process.env.NEXT_PUBLIC_API_PROXY_MODE ?? "auto";
const apiTargetsLoopback = /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::|\/|$)/i.test(publicApiUrl);
const openedFromAnotherDevice = typeof window !== "undefined" &&
  !["localhost", "127.0.0.1", "::1", "[::1]"].includes(window.location.hostname);

export const API_URL =
  proxyMode === "off"
    ? publicApiUrl || "http://localhost:5000"
    : proxyMode === "on" || process.env.NODE_ENV === "production" || (apiTargetsLoopback && openedFromAnotherDevice)
      ? ""
      : publicApiUrl || "http://localhost:5000";
