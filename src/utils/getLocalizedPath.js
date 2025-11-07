export function getLocalizedPath(lang, path) {
  if (!path.startsWith("/")) path = "/" + path;
  return `/${lang}${path}`;
}