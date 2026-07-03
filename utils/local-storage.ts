import { BrandKit, HistoryEntry } from "@/types/qr";

const HISTORY_KEY = "pixelqr_history";
const BRAND_KITS_KEY = "pixelqr_brand_kits";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
}

export function getHistory(): HistoryEntry[] {
  return read<HistoryEntry[]>(HISTORY_KEY, []);
}

export function saveHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  const list = getHistory();
  const idx = list.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    list[idx] = entry;
  } else {
    list.unshift(entry);
  }
  write(HISTORY_KEY, list);
  return list;
}

export function deleteHistoryEntry(id: string): HistoryEntry[] {
  const list = getHistory().filter((e) => e.id !== id);
  write(HISTORY_KEY, list);
  return list;
}

export function getBrandKits(): BrandKit[] {
  return read<BrandKit[]>(BRAND_KITS_KEY, []);
}

export function saveBrandKit(kit: BrandKit): BrandKit[] {
  const list = getBrandKits();
  const idx = list.findIndex((k) => k.id === kit.id);
  if (idx >= 0) {
    list[idx] = kit;
  } else {
    list.push(kit);
  }
  write(BRAND_KITS_KEY, list);
  return list;
}

export function deleteBrandKit(id: string): BrandKit[] {
  const list = getBrandKits().filter((k) => k.id !== id);
  write(BRAND_KITS_KEY, list);
  return list;
}
