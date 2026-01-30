# assessmentGameId Migration Plan

**Status**: Planned (low priority)  
**Created**: 2026-01-30  
**Purpose**: Document deprecated `assessmentGameId` and path to removal.

---

## Current state

- **Lesson model** (`app/lib/models/lesson.ts`): Field `assessmentGameId?: mongoose.Types.ObjectId` is **deprecated**. Comment in schema: "use quizConfig".
- **Usage**: Admin course editor (lesson form), lesson API (PATCH/POST), day page (link to play game after lesson). Still supported for backward compatibility.
- **Preferred**: Use `quizConfig` (e.g. `questionCount`, `lessonId`, `courseId`) for lesson quizzes and assessments.

## Migration plan

1. **Keep** `assessmentGameId` in the Lesson schema and API until all courses/lessons are migrated or we decide to drop support.
2. **Prefer** `quizConfig` for new lessons; admin UI can show both for edit, but new lessons should set quizConfig.
3. **Optional later**: Add a one-off script to copy `assessmentGameId` → quizConfig where applicable, then stop reading `assessmentGameId` in day page and admin.
4. **Removal**: After migration and a period without reads, remove the field from the schema and API (breaking change for old clients).

## References

- `app/lib/models/lesson.ts` (schema)
- `app/[locale]/admin/courses/[courseId]/page.tsx` (form)
- `app/[locale]/courses/[courseId]/day/[dayNumber]/page.tsx` (play link)
- `app/api/admin/courses/[courseId]/lessons/route.ts`, `[lessonId]/route.ts`
