import { BrandKit, Collection, DesignSnapshot, GalleryEntry, HistoryEntry } from "@/types/qr";

const HISTORY_KEY = "pixelqr_history";
const BRAND_KITS_KEY = "pixelqr_brand_kits";
const GALLERY_KEY = "pixelqr_gallery";
const COLLECTIONS_KEY = "pixelqr_collections";
const SNAPSHOTS_KEY = "pixelqr_snapshots";

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

export function getGallery(): GalleryEntry[] {
  return read<GalleryEntry[]>(GALLERY_KEY, []);
}

export function publishToGallery(entry: GalleryEntry): GalleryEntry[] {
  const list = getGallery();
  list.unshift(entry);
  write(GALLERY_KEY, list);
  return list;
}

export function removeFromGallery(id: string): GalleryEntry[] {
  const list = getGallery().filter((e) => e.id !== id);
  write(GALLERY_KEY, list);
  return list;
}

export function toggleGalleryLike(id: string): GalleryEntry[] {
  const list = getGallery().map((e) => {
    if (e.id === id) {
      return { ...e, liked: !e.liked, likes: e.liked ? e.likes - 1 : e.likes + 1 };
    }
    return e;
  });
  write(GALLERY_KEY, list);
  return list;
}

export function getCollections(): Collection[] {
  return read<Collection[]>(COLLECTIONS_KEY, []);
}

export function saveCollection(collection: Collection): Collection[] {
  const list = getCollections();
  const idx = list.findIndex((c) => c.id === collection.id);
  if (idx >= 0) {
    list[idx] = collection;
  } else {
    list.push(collection);
  }
  write(COLLECTIONS_KEY, list);
  return list;
}

export function deleteCollection(id: string): Collection[] {
  const list = getCollections().filter((c) => c.id !== id);
  write(COLLECTIONS_KEY, list);
  return list;
}

export function getSnapshots(): DesignSnapshot[] {
  return read<DesignSnapshot[]>(SNAPSHOTS_KEY, []);
}

export function saveSnapshot(snapshot: DesignSnapshot): DesignSnapshot[] {
  const list = getSnapshots();
  list.unshift(snapshot);
  if (list.length > 60) list.length = 60;
  write(SNAPSHOTS_KEY, list);
  return list;
}

export function deleteSnapshot(id: string): DesignSnapshot[] {
  const list = getSnapshots().filter((s) => s.id !== id);
  write(SNAPSHOTS_KEY, list);
  return list;
}
