export default function useQuery() {
  const saveQueryState = (routerKey: string, params: any) => {
    const cacheKey = `cachedQuery:${routerKey}`;
    sessionStorage.setItem(cacheKey, JSON.stringify(params));
  };

  const recoverQueryState = (routerKey: string) => {
    const cacheKey = `cachedQuery:${routerKey}`;
    const params = sessionStorage.getItem(cacheKey) || '{}';
    return JSON.parse(params);
  };

  const removeAllQueryState = () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('cachedQuery:')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  return {
    saveQueryState,
    recoverQueryState,
    removeAllQueryState,
  };
}
