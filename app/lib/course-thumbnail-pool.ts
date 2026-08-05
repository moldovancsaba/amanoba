/**
 * Course Thumbnail Pool
 *
 * What: Manages a pool of course thumbnail images for random assignment
 * Why: Provides visual variety for courses without custom thumbnails
 *
 * Usage:
 * import { getRandomThumbnail, addThumbnailToPool } from '@/lib/course-thumbnail-pool';
 * const thumbnail = getRandomThumbnail();
 */

/**
 * Pool of course thumbnail URLs
 * 
 * These are randomly assigned to courses that don't have a custom thumbnail.
 * Images are high-quality, professional, and education/learning themed.
 */
export const COURSE_THUMBNAIL_POOL: string[] = [
  // Initial set - added 2026-08-05
  'https://i.ibb.co/C5GmMSCX/60-A14650-AEFA-41-B9-85-B3-3-F2-C63241-F1-A.png',
  'https://i.ibb.co/Q3dWrqC3/4-ABC0-DD4-F387-4-A36-86-D1-4-BABBADA791-D.png',
  'https://i.ibb.co/DDpm7xg5/9-D06-E9-E9-5421-4000-8170-EA863-BB10-E5-B.png',
  'https://i.ibb.co/3mrrqg4y/4-F494472-114-E-44-EB-922-D-EE9-A798-E781-E.png',
  'https://i.ibb.co/Y4CMSWRc/3-B15-FA86-2-CDE-4-DF5-A07-F-43-E09791-F999.png',
  'https://i.ibb.co/S7rTB05C/A6526412-05-E6-4227-88-AE-6-A566-BCD970-D.png',
  'https://i.ibb.co/0VVdfyCj/274-FEFD4-FB1-F-44-EC-8-E6-B-A671-EBFFBBD2.png',
  'https://i.ibb.co/jYR5TmB/8-BD937-BA-DFC2-4-CBC-BD5-C-2-D3-B78-B5-F4-E2.png',
];

/**
 * Get a random thumbnail from the pool
 * 
 * @param seed - Optional seed for deterministic selection (e.g., course ID)
 * @returns Random thumbnail URL from the pool
 * 
 * @example
 * // Truly random
 * const thumbnail = getRandomThumbnail();
 * 
 * // Deterministic based on course ID (same course always gets same thumbnail)
 * const thumbnail = getRandomThumbnail('AI_BASICS_2024');
 */
export function getRandomThumbnail(seed?: string): string {
  if (seed) {
    // Deterministic selection based on seed
    // Use simple hash function for consistent thumbnail per course
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    const index = Math.abs(hash) % COURSE_THUMBNAIL_POOL.length;
    return COURSE_THUMBNAIL_POOL[index];
  }
  
  // Truly random selection
  const randomIndex = Math.floor(Math.random() * COURSE_THUMBNAIL_POOL.length);
  return COURSE_THUMBNAIL_POOL[randomIndex];
}

/**
 * Get all thumbnails in the pool
 * 
 * @returns Array of all thumbnail URLs
 */
export function getAllThumbnails(): string[] {
  return [...COURSE_THUMBNAIL_POOL];
}

/**
 * Get thumbnail pool size
 * 
 * @returns Number of thumbnails in the pool
 */
export function getThumbnailPoolSize(): number {
  return COURSE_THUMBNAIL_POOL.length;
}

/**
 * Add new thumbnail(s) to the pool
 * 
 * Note: This modifies the in-memory pool. For persistent changes,
 * edit this file directly and redeploy.
 * 
 * @param urls - Single URL or array of URLs to add
 * 
 * @example
 * addThumbnailToPool('https://example.com/image.png');
 * addThumbnailToPool([
 *   'https://example.com/image1.png',
 *   'https://example.com/image2.png'
 * ]);
 */
export function addThumbnailToPool(urls: string | string[]): void {
  const urlArray = Array.isArray(urls) ? urls : [urls];
  COURSE_THUMBNAIL_POOL.push(...urlArray);
}

/**
 * Get a specific thumbnail by index
 * 
 * @param index - Index in the pool (0 to poolSize - 1)
 * @returns Thumbnail URL at that index, or first thumbnail if index is invalid
 */
export function getThumbnailByIndex(index: number): string {
  if (index < 0 || index >= COURSE_THUMBNAIL_POOL.length) {
    return COURSE_THUMBNAIL_POOL[0];
  }
  return COURSE_THUMBNAIL_POOL[index];
}

/**
 * Get multiple random thumbnails (no duplicates)
 * 
 * @param count - Number of thumbnails to get
 * @returns Array of random thumbnail URLs
 * 
 * @example
 * const thumbnails = getMultipleRandomThumbnails(3);
 * // Returns 3 different thumbnails
 */
export function getMultipleRandomThumbnails(count: number): string[] {
  const shuffled = [...COURSE_THUMBNAIL_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, COURSE_THUMBNAIL_POOL.length));
}
