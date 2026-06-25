import { describe, expect, it } from 'vitest';
import {
  getMapLikeValue,
  hasMapLikeKey,
  mapLikeKeys,
  setMapLikeValue,
} from '@/lib/map-like';

describe('map-like helpers', () => {
  it('reads string keys from Map, object, and entry array shapes', () => {
    expect(getMapLikeValue(new Map([['en', { name: 'English' }]]), 'en')).toEqual({ name: 'English' });
    expect(getMapLikeValue({ en: { name: 'English' } }, 'en')).toEqual({ name: 'English' });
    expect(getMapLikeValue([['en', { name: 'English' }]], 'en')).toEqual({ name: 'English' });
  });

  it('reads numeric keys even when Mongo serializes them as object strings', () => {
    expect(getMapLikeValue(new Map([[1, { completedAt: 'now' }]]), 1)).toEqual({ completedAt: 'now' });
    expect(getMapLikeValue({ 1: { completedAt: 'now' } }, 1)).toEqual({ completedAt: 'now' });
    expect(hasMapLikeKey({ 1: true }, 1)).toBe(true);
  });

  it('sets values without requiring a native Map', () => {
    const objectResult = setMapLikeValue({ MADOKU: { elo: 1200 } }, 'MADOKU', { elo: 1216 });
    expect(getMapLikeValue(objectResult, 'MADOKU')).toEqual({ elo: 1216 });

    const mapResult = setMapLikeValue(new Map(), 'MADOKU', { elo: 1216 });
    expect(getMapLikeValue(mapResult, 'MADOKU')).toEqual({ elo: 1216 });
  });

  it('lists keys for every supported shape', () => {
    expect(mapLikeKeys(new Map([['1', true], ['2', true]]))).toEqual(['1', '2']);
    expect(mapLikeKeys({ 1: true, 2: true })).toEqual(['1', '2']);
    expect(mapLikeKeys([['1', true], ['2', true]])).toEqual(['1', '2']);
  });
});
