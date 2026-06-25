export type MapLike<TValue = unknown> =
  | Map<string | number, TValue>
  | Record<string, TValue>
  | Array<[string | number, TValue]>
  | null
  | undefined;

export function getMapLikeValue<TValue>(
  mapLike: MapLike<TValue>,
  key: string | number
): TValue | undefined {
  if (!mapLike) {
    return undefined;
  }

  if (mapLike instanceof Map) {
    return mapLike.get(key) ?? mapLike.get(String(key));
  }

  if (Array.isArray(mapLike)) {
    return mapLike.find(([entryKey]) => String(entryKey) === String(key))?.[1];
  }

  if (typeof mapLike === 'object') {
    return mapLike[String(key)];
  }

  return undefined;
}

export function hasMapLikeKey(
  mapLike: MapLike,
  key: string | number
): boolean {
  return getMapLikeValue(mapLike, key) !== undefined;
}

export function setMapLikeValue<TValue>(
  mapLike: MapLike<TValue>,
  key: string | number,
  value: TValue
): Map<string | number, TValue> | Record<string, TValue> {
  if (mapLike instanceof Map) {
    mapLike.set(key, value);
    return mapLike;
  }

  if (mapLike && typeof mapLike === 'object' && !Array.isArray(mapLike)) {
    mapLike[String(key)] = value;
    return mapLike;
  }

  return new Map<string | number, TValue>([[key, value]]);
}

export function mapLikeKeys(mapLike: MapLike): string[] {
  if (!mapLike) {
    return [];
  }

  if (mapLike instanceof Map) {
    return Array.from(mapLike.keys()).map(String);
  }

  if (Array.isArray(mapLike)) {
    return mapLike.map(([key]) => String(key));
  }

  if (typeof mapLike === 'object') {
    return Object.keys(mapLike);
  }

  return [];
}
