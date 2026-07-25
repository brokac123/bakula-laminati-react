const STORAGE_KEY = "bakula:recently-viewed";
const MAX_ITEMS = 6;

export function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(slug: string) {
  try {
    const current = getRecentlyViewed().filter((s) => s !== slug);
    current.unshift(slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(0, MAX_ITEMS)));
  } catch {
    // localStorage unavailable (private browsing, etc.) - not critical.
  }
}
