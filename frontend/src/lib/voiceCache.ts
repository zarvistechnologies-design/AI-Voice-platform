import { getSession } from "@/lib/auth";
import { getDashboardQueryClient } from "@/lib/dashboardQueryClient";

export const VOICE_QUERY_SCOPE = "voice";

const voiceCacheGenerations = new Map<string, number>();

function voiceSessionScope() {
  const session = getSession();
  return session
    ? `${session.id}:${session.signedInAt}:${session.organization?.id ?? ""}`
    : "";
}

export function voiceCacheGeneration(dependencies: readonly string[]) {
  const generations: string[] = [];
  for (const [prefix, generation] of voiceCacheGenerations) {
    if (dependencies.some((path) => path.startsWith(prefix))) {
      generations.push(`${prefix}:${generation}`);
    }
  }
  return generations.sort().join("|");
}

export function voiceCacheKey(path: string, dependencies: readonly string[] = [path]) {
  const session = getSession();
  return session
    ? [
        VOICE_QUERY_SCOPE,
        `${session.id}:${session.signedInAt}`,
        session.organization?.id ?? "",
        path,
        voiceCacheGeneration(dependencies),
      ] as const
    : null;
}

export function currentVoiceSessionScope() {
  return voiceSessionScope();
}

export function invalidateVoiceCache(...pathPrefixes: string[]) {
  for (const prefix of pathPrefixes) {
    voiceCacheGenerations.set(prefix, (voiceCacheGenerations.get(prefix) ?? 0) + 1);
  }
  void getDashboardQueryClient().invalidateQueries({
    predicate: ({ queryKey }) => {
      const path = queryKey[3];
      return queryKey[0] === VOICE_QUERY_SCOPE
        && typeof path === "string"
        && pathPrefixes.some((prefix) => path.startsWith(prefix));
    },
    refetchType: "none",
  });
}
