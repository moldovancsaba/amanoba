# Course Thumbnail Management

**What**: System for managing course thumbnail images with a random assignment pool  
**Why**: Provides visual variety for courses without requiring custom thumbnails for each course  
**Status**: ✅ Active (implemented 2026-08-05)

---

## Overview

Courses can have thumbnails assigned in two ways:

1. **Custom Thumbnail** - Directly set on the course (overrides pool)
2. **Random from Pool** - Automatically assigned from a curated pool of images

The thumbnail pool contains high-quality, professional, education/learning themed images that are randomly assigned to new courses.

---

## Current Thumbnail Pool

**Location**: `/workspace/app/lib/course-thumbnail-pool.ts`

**Current Images** (8 total):
- https://i.ibb.co/C5GmMSCX/60-A14650-AEFA-41-B9-85-B3-3-F2-C63241-F1-A.png
- https://i.ibb.co/Q3dWrqC3/4-ABC0-DD4-F387-4-A36-86-D1-4-BABBADA791-D.png
- https://i.ibb.co/DDpm7xg5/9-D06-E9-E9-5421-4000-8170-EA863-BB10-E5-B.png
- https://i.ibb.co/3mrrqg4y/4-F494472-114-E-44-EB-922-D-EE9-A798-E781-E.png
- https://i.ibb.co/Y4CMSWRc/3-B15-FA86-2-CDE-4-DF5-A07-F-43-E09791-F999.png
- https://i.ibb.co/S7rTB05C/A6526412-05-E6-4227-88-AE-6-A566-BCD970-D.png
- https://i.ibb.co/0VVdfyCj/274-FEFD4-FB1-F-44-EC-8-E6-B-A671-EBFFBBD2.png
- https://i.ibb.co/jYR5TmB/8-BD937-BA-DFC2-4-CBC-BD5-C-2-D3-B78-B5-F4-E2.png

---

## Adding New Thumbnails

### Option 1: Edit the Pool File Directly (Recommended)

1. Open `/workspace/app/lib/course-thumbnail-pool.ts`
2. Add new URLs to the `COURSE_THUMBNAIL_POOL` array:

```typescript
export const COURSE_THUMBNAIL_POOL: string[] = [
  // Existing images...
  'https://i.ibb.co/C5GmMSCX/60-A14650-AEFA-41-B9-85-B3-3-F2-C63241-F1-A.png',
  // ... more existing images
  
  // New images - added YYYY-MM-DD
  'https://i.ibb.co/NEW-IMAGE-1.png',
  'https://i.ibb.co/NEW-IMAGE-2.png',
  'https://i.ibb.co/NEW-IMAGE-3.png',
];
```

3. Commit and push:
```bash
git add app/lib/course-thumbnail-pool.ts
git commit -m "feat: add new course thumbnails to pool"
git push origin main
```

4. Vercel will automatically deploy the update

### Option 2: Programmatic Addition (Runtime Only)

For testing or temporary additions (not persisted to code):

```typescript
import { addThumbnailToPool } from '@/lib/course-thumbnail-pool';

// Add single thumbnail
addThumbnailToPool('https://i.ibb.co/NEW-IMAGE.png');

// Add multiple thumbnails
addThumbnailToPool([
  'https://i.ibb.co/NEW-IMAGE-1.png',
  'https://i.ibb.co/NEW-IMAGE-2.png',
]);
```

**Note**: This only affects the current runtime and won't persist after restart.

---

## Using the Thumbnail Pool

### In Course Creation Scripts

```typescript
import { getRandomThumbnail } from '../app/lib/course-thumbnail-pool';

// Get truly random thumbnail
const thumbnail = getRandomThumbnail();

// Get deterministic thumbnail (same course ID = same thumbnail)
const thumbnail = getRandomThumbnail(courseId);
```

### In API Routes

```typescript
import { getRandomThumbnail } from '@/lib/course-thumbnail-pool';

const course = await Course.create({
  // ... other fields
  thumbnail: getRandomThumbnail(courseId), // Deterministic
});
```

### Available Functions

```typescript
// Get single random thumbnail
getRandomThumbnail(): string
getRandomThumbnail(seed: string): string // Deterministic

// Get all thumbnails
getAllThumbnails(): string[]

// Get pool size
getThumbnailPoolSize(): number

// Get specific thumbnail by index
getThumbnailByIndex(index: number): string

// Get multiple random thumbnails (no duplicates)
getMultipleRandomThumbnails(count: number): string[]

// Add thumbnail(s) to pool (runtime only)
addThumbnailToPool(urls: string | string[]): void
```

---

## Scripts

### Assign Random Thumbnail to Existing Course

```bash
# Updates AI dummies course with random thumbnail from pool
npx tsx --env-file=.env.local scripts/assign-random-thumbnail-to-course.ts
```

To modify for a different course, edit the script:
```typescript
const course = await Course.findOne({ courseId: 'YOUR_COURSE_ID' });
```

### Reset Courses with Random Thumbnails

The main course reset script (`scripts/reset-courses-now.ts`) automatically assigns random thumbnails from the pool.

---

## Thumbnail Selection Strategy

### Deterministic Selection (Recommended)

Uses course ID as a seed to ensure the same course always gets the same thumbnail:

```typescript
const thumbnail = getRandomThumbnail(courseId);
```

**Benefits**:
- Consistent: Same course always shows same thumbnail
- Predictable: Easier to debug and verify
- Better UX: Students see the same image they remember

### Truly Random Selection

Picks a random thumbnail on each call:

```typescript
const thumbnail = getRandomThumbnail();
```

**Use Cases**:
- Testing different thumbnails
- Rotating thumbnails periodically
- Assigning to temporary/preview content

---

## Image Requirements

When adding new thumbnails to the pool:

### Technical Requirements
- **Format**: PNG or JPG
- **Size**: Recommended 800px width minimum
- **Aspect Ratio**: 16:9 or 4:3 preferred
- **File Size**: Under 500KB for fast loading
- **Hosting**: Use reliable CDN (ImgBB, Cloudinary, or Vercel Blob)

### Content Requirements
- **Theme**: Education, learning, or technology related
- **Style**: Professional, clean, modern
- **Quality**: High resolution, no pixelation
- **Colors**: Bright, engaging, but not overwhelming
- **Avoid**: Text overlays, specific branding, dated imagery

### Image Sources
- Unsplash (education, technology, learning themes)
- Pexels (similar to Unsplash, free high-quality)
- Custom designs (created by design team)
- AI-generated (Midjourney, DALL-E with proper licensing)

---

## Brand Default Fallback

If a course has no thumbnail and the pool fails, the system falls back to the brand default thumbnail.

**Current Brand Default**: 
```
https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80
```

**Configured in**: Brand metadata (`brand.metadata.defaultCourseThumbnail`)

**Update with**:
```bash
npx tsx --env-file=.env.local scripts/set-default-thumbnail.ts
```

---

## Thumbnail Priority

When displaying a course, the system checks thumbnails in this order:

1. **Course thumbnail field** - If set, use it (highest priority)
2. **Random from pool** - If course.thumbnail is null/undefined, assign from pool
3. **Brand default** - If pool is empty, use brand default
4. **Fallback** - If all else fails, show placeholder

**Implementation** (in `/app/api/courses/route.ts`):
```typescript
thumbnail: course.thumbnail || defaultThumbnail || null
```

---

## Testing

### Test Random Selection
```typescript
import { getRandomThumbnail, getThumbnailPoolSize } from '@/lib/course-thumbnail-pool';

console.log('Pool size:', getThumbnailPoolSize()); // Should be 8
console.log('Random 1:', getRandomThumbnail());
console.log('Random 2:', getRandomThumbnail());
console.log('Deterministic:', getRandomThumbnail('AI_BASICS')); // Always same result
```

### Test Course Assignment
1. Create a course without thumbnail
2. Check that it gets assigned a random thumbnail from pool
3. Verify the thumbnail loads in the browser

### Visual QA Checklist
- [ ] Thumbnail loads correctly in course catalog
- [ ] Image is clear and not pixelated
- [ ] Aspect ratio looks good (no stretching)
- [ ] Theme matches course content (education/learning)
- [ ] Same course shows same thumbnail on refresh

---

## Troubleshooting

### Thumbnail Not Showing

**Check 1**: Is the URL accessible?
```bash
curl -I https://i.ibb.co/YOUR-IMAGE.png
# Should return 200 OK
```

**Check 2**: Is the course using a thumbnail?
```typescript
const course = await Course.findOne({ courseId: 'YOUR_ID' });
console.log('Thumbnail:', course.thumbnail);
```

**Check 3**: Is the pool populated?
```typescript
import { getThumbnailPoolSize } from '@/lib/course-thumbnail-pool';
console.log('Pool size:', getThumbnailPoolSize());
```

### Wrong Thumbnail Assigned

If a course gets an incorrect/inappropriate thumbnail:

1. **Override with custom thumbnail**:
```typescript
course.thumbnail = 'https://specific-image-url.png';
await course.save();
```

2. **Remove bad image from pool**:
   - Edit `app/lib/course-thumbnail-pool.ts`
   - Remove the URL from the array
   - Commit and push

### Pool Empty

If the pool is empty (returns 0):
1. Check `app/lib/course-thumbnail-pool.ts` exists
2. Verify the `COURSE_THUMBNAIL_POOL` array has entries
3. Rebuild: `npm run build`
4. Restart server

---

## Future Enhancements

### Potential Improvements
- [ ] Admin UI to upload thumbnails directly
- [ ] Category-specific thumbnail pools (AI courses get AI-themed images)
- [ ] AI-generated thumbnails based on course content
- [ ] Thumbnail A/B testing (which images drive more enrollments)
- [ ] Automatic image optimization/resizing
- [ ] CDN integration for faster loading

### Database Schema (Future)
Could add a `ThumbnailPool` collection to manage thumbnails via admin UI:
```typescript
{
  url: string;
  category?: string;
  tags?: string[];
  addedBy: string;
  addedAt: Date;
  usageCount: number;
}
```

---

## Related Files

- `/workspace/app/lib/course-thumbnail-pool.ts` - Thumbnail pool implementation
- `/workspace/app/api/courses/route.ts` - Course API with thumbnail assignment
- `/workspace/scripts/assign-random-thumbnail-to-course.ts` - Script to assign thumbnails
- `/workspace/scripts/reset-courses-now.ts` - Course creation with thumbnails
- `/workspace/app/lib/models/course.ts` - Course model schema

---

**Last Updated**: 2026-08-05  
**Maintained By**: Development Team  
**Contact**: For questions about thumbnail management, see `docs/HANDOVER.md`
