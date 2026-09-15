import { getSession } from "@/lib/auth";
import { getDashboardQueryClient } from "@/lib/dashboardQueryClient";

const DASHBOARD_API_QUERY_SCOPE = "dashboard-api";

type ApiCacheGenerationScope = {
  sessionKey: string;
  namespaces: Map<string, Map<string, number>>;
};

let apiCacheGenerationScope: ApiCacheGenerationScope | null = null;

function sessionKey(session: NonNullable<ReturnType<typeof getSession>>) {
  return `${session.id}:${session.organization?.id ?? ""}:${session.signedInAt}`;
}

function generationScope(session: NonNullable<ReturnType<typeof getSession>>) {
  const currentSessionKey = sessionKey(session);
  if (apiCacheGenerationScope?.sessionKey !== currentSessionKey) {
    apiCacheGenerationScope = {
      sessionKey: currentSessionKey,
      namespaces: new Map(),
    };
  }
  return apiCacheGenerationScope;
}

function resourceGeneration(
  session: NonNullable<ReturnType<typeof getSession>>,
  namespace: string,
  resource: string,
) {
  const scope = generationScope(session);
  let resources = scope.namespaces.get(namespace);
  if (!resources) {
    resources = new Map();
    scope.namespaces.set(namespace, resources);
  }
  const generation = resources.get(resource) ?? 0;
  resources.set(resource, generation);
  return generation;
}

function scopedKey(namespace: string, resource: string) {
  const session = getSession();
  if (!session) return null;
  return [
    DASHBOARD_API_QUERY_SCOPE,
    session.id,
    session.organization?.id ?? "",
    session.signedInAt,
    namespace,
    resource,
    resourceGeneration(session, namespace, resource),
  ] as const;
}

export function cachedApiRequest<T>(
  namespace: string,
  resource: string,
  ttlMs: number,
  loader: () => Promise<T>,
) {
  const queryKey = scopedKey(namespace, resource);
  if (!queryKey) return loader();
  return getDashboardQueryClient().fetchQuery({
    queryKey,
    queryFn: loader,
    staleTime: ttlMs,
  });
}

export function invalidateApiCache(namespace: string, resourcePrefix = "") {
  const session = getSession();
  if (!session) return;

  const scope = generationScope(session);
  const resources = scope.namespaces.get(namespace);
  if (resources) {
    for (const [resource, generation] of resources) {
      if (resource.startsWith(resourcePrefix)) {
        resources.set(resource, generation + 1);
      }
    }
  }

  void getDashboardQueryClient().invalidateQueries({
    predicate: ({ queryKey }) => (
      queryKey[0] === DASHBOARD_API_QUERY_SCOPE
      && queryKey[1] === session.id
      && queryKey[2] === (session.organization?.id ?? "")
      && queryKey[3] === session.signedInAt
      && queryKey[4] === namespace
      && typeof queryKey[5] === "string"
      && queryKey[5].startsWith(resourcePrefix)
    ),
    refetchType: "none",
  });
}
