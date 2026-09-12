export function publicUrl(path: string) {
  const cleaned = path.replace(/^\//, "");
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${cleaned}`;
}
