type PlatformHostConfiguration = {
  platformHosts?: string;
  clientUrl?: string;
  siteUrl?: string;
};

export function whiteLabelFrontendEnabled() {
  return process.env.NEXT_PUBLIC_WHITE_LABEL_ENABLED === "true";
}

export function cleanRequestHostname(value: string) {
  const candidate = value.split(",", 1)[0]?.trim().toLowerCase() ?? "";
  if (!candidate) return "";
  try {
    const url = new URL(`http://${candidate}`);
    if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) return "";
    return url.hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  } catch {
    return "";
  }
}

function hostnameFromUrl(value: string | undefined) {
  try {
    return value ? new URL(value).hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "") : "";
  } catch {
    return "";
  }
}

export function configuredPlatformHosts(configuration: PlatformHostConfiguration = {}) {
  const hosts = new Set(["localhost", "127.0.0.1", "::1", "vozon.ai", "www.vozon.ai"]);
  for (const item of (configuration.platformHosts ?? "").split(",")) {
    const hostname = cleanRequestHostname(item);
    if (hostname) hosts.add(hostname);
  }
  for (const value of [configuration.clientUrl, configuration.siteUrl]) {
    const hostname = hostnameFromUrl(value);
    if (hostname) hosts.add(hostname);
  }
  return hosts;
}

export function isConfiguredPlatformHostname(hostname: string, configuration: PlatformHostConfiguration = {}) {
  const normalized = cleanRequestHostname(hostname);
  return Boolean(normalized && configuredPlatformHosts(configuration).has(normalized));
}
