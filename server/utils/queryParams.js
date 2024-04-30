export function parseQueryString(url) {
  const queryString = url.split("?")[1];
  if (!queryString) return {};

  const queryParams = {};
  queryString.split("&").forEach((pair) => {
    const [key, value] = pair.split("=");
    queryParams[key] = value;
  });

  return queryParams;
}
