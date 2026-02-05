# DATABASE MIGRATION EXECUTION PLAN - PHASE 1
## Quiz Quality Audit & Enhancement Data

**Date**: 2026-01-24  
**Status**: 🟡 IN PROGRESS  
**Target**: Production Migration of 2,100 audited questions  

---

## MIGRATION STEPS

### Step 1: Schema Update (COMPLETE ✅)
- [x] Updated QuizQuestion model with new fields:
  - `uuid: String` (unique, sparse, indexed)
  - `hashtags: [String]` (indexed for filtering)
  - `questionType: Enum` ('recall' | 'application' | 'critical-thinking')
  - `metadata.auditedAt: Date`
  - `metadata.auditedBy: String`
- [x] Added new indexes for UUID, hashtags, question type

### Step 2: Add Audit Fields to Existing Questions
**Script**: `scripts/migrate-add-audit-fields.ts`
**Purpose**: Populate new schema fields with default values
**Operations**:
- Generate UUID for all questions that don't have one
- Initialize hashtags array (empty)
- Initialize audit metadata fields (undefined)
**Run**:
```bash
MONGODB_URI=$(sed -n 's/^MONGODB_URI=//p' .env.local) npx tsx scripts/migrate-add-audit-fields.ts
```

### Step 3: Populate Audit Data (Phase 1)
**Script**: `scripts/migrate-audit-data-phase-1.ts`
**Purpose**: Update questions with audit data (hashtags, question types, audit timestamps)
**Scope**: Productivity 2026 course (30 lessons × 10 languages = 2,100 questions)
**Operations**:
- Update existing Q1-Q5 with hashtags and question types
- Add Q6-Q7 new questions (if not already present)
- Set auditedAt = current timestamp
- Set auditedBy = "AI Developer"
**Run**:
```bash
MONGODB_URI=$(sed -n 's/^MONGODB_URI=//p' .env.local) npx tsx scripts/migrate-audit-data-phase-1.ts
```

### Step 4: Verification
**Script**: Inline MongoDB queries
**Checks**:
1. All 2,100 questions have UUIDs ✓
2. All 2,100 questions have hashtags array ✓
3. All 2,100 questions have questionType ✓
4. All 2,100 questions have metadata.auditedAt ✓
5. All 2,100 questions have metadata.auditedBy ✓
6. No duplicate UUIDs ✓
7. All hashtags follow pattern (#topic #difficulty #type #language) ✓

---

## EXECUTION TIMELINE

```
START: 2026-01-24 (now)
│
├─ Step 1: Schema Update ........... ✅ COMPLETE (30 min)
│
├─ Step 2: Add Audit Fields ........ ⏳ PENDING (30 min)
│  └─ Generate UUIDs for all existing questions
│
├─ Step 3: Populate Audit Data ..... ⏳ PENDING (30 min)
│  └─ Update with hashtags, question types, metadata
│
├─ Step 4: Verification ............ ⏳ PENDING (15 min)
│  └─ Confirm all data migrated correctly
│
└─ END: Ready for Production ........ ⏳ PENDING
   Total Time: ~2 hours
```

---

## MIGRATION DATA SUMMARY

### Phase 1 Target
- **Course**: Productivity 2026
- **Lessons**: 30 (Days 1-30)
- **Languages**: 10 (hu, en, tr, bg, pl, vi, id, ar, pt, hi)
- **Audit Units**: 300 (30 lessons × 10 languages)
- **Total Questions**: 2,100 (7 questions per lesson × 300 units)

### Questions Breakdown
| Question # | Type | Count | Hashtags Example |
|----------|------|-------|------------------|
| Q1 | recall | 300 | #day-01 #foundation #recall #hu |
| Q2 | recall | 300 | #day-01 #foundation #recall #hu |
| Q3 | recall | 300 | #day-01 #foundation #recall #hu |
| Q4 | application | 300 | #day-01 #purpose #application #hu |
| Q5 | application | 300 | #day-01 #scenario #application #hu |
| Q6 | application | 300 | #day-01 #practice #application #hu |
| Q7 | critical-thinking | 300 | #day-01 #synthesis #critical-thinking #hu |
| **TOTAL** | **mixed** | **2,100** | - |

### Distribution
- **Recall**: 900 questions (42.9%)
- **Application**: 900 questions (42.9%)
- **Critical Thinking**: 300 questions (14.3%)
- **Total**: 2,100 questions

---

## ROLLBACK PLAN

If issues arise during migration:

### Pre-Migration Safety
```bash
# 1. Create backup BEFORE starting migration
mongodump --uri="$MONGODB_URI" --out=./backup-2026-01-24-pre-migration
```

### If Migration Fails
```bash
# 1. Stop the migration script (Ctrl+C)
# 2. Restore from backup
mongorestore --uri="$MONGODB_URI" ./backup-2026-01-24-pre-migration

# 3. Investigate issues
# 4. Fix script if needed
# 5. Retry
```

---

## VERIFICATION QUERIES

After migration, run these queries to verify success:

### Check 1: UUID Coverage
```javascript
db.quiz_questions.countDocuments({ uuid: { $exists: true, $ne: null } })
// Should be: 2,100
```

### Check 2: Hashtag Coverage
```javascript
db.quiz_questions.countDocuments({ hashtags: { $exists: true, $size: { $gte: 1 } } })
// Should be: 2,100
```

### Check 3: Question Type Coverage
```javascript
db.quiz_questions.countDocuments({ questionType: { $exists: true, $ne: null } })
// Should be: 2,100
```

### Check 4: Audit Metadata
```javascript
db.quiz_questions.countDocuments({ 
  $and: [
    { 'metadata.auditedAt': { $exists: true } },
    { 'metadata.auditedBy': { $eq: 'AI Developer' } }
  ]
})
// Should be: 2,100
```

### Check 5: UUID Uniqueness
```javascript
db.quiz_questions.aggregate([
  { $group: { _id: "$uuid", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])
// Should return: [] (empty)
```

---

## SUCCESS CRITERIA

All of the following must be true:

- [x] Schema updated with new fields
- [ ] All 2,100 questions have unique UUIDs
- [ ] All 2,100 questions have hashtags
- [ ] All 2,100 questions have questionType
- [ ] All 2,100 questions have metadata.auditedAt
- [ ] All 2,100 questions have metadata.auditedBy = "AI Developer"
- [ ] No migration errors in log
- [ ] Application loads without errors
- [ ] Quizzes render correctly with new data

---

## NEXT PHASE

After Phase 1 is verified and production-tested:

**Phase 2**: Audit data migration for Courses 2-8
- Estimated: 14,700 questions
- Follows same process
- Can run in parallel with Phase 1 if database allows

---

## CONTACT & ESCALATION

**Issues During Migration**:
1. Check logs for errors
2. Review verification queries
3. Restore from backup if needed
4. Contact: Sultan (Product Owner)

---

**Ready to execute migration when approved.**
