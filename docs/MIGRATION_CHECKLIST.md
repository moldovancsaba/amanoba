# DATABASE MIGRATION CHECKLIST
## Quiz Quality Audit & Enhancement - Production Deployment

**Project Status**: ✅ **AUDIT COMPLETE - READY FOR MIGRATION**  
**Date**: 2026-01-24  
**Total Questions to Migrate**: 16,800  

---

## PRE-MIGRATION CHECKLIST

### Backup & Safety
- [ ] Full MongoDB backup created
- [ ] Backup verified and stored securely
- [ ] Rollback procedure documented & tested
- [ ] Team notified of migration window

### Schema Preparation
- [ ] Review schema update specifications in Master Plan
- [ ] Add new fields to QuizQuestion schema:
  - `uuid: String` (v4 UUID, unique, indexed)
  - `hashtags: [String]` (array, indexed for filtering)
  - `questionType: Enum` (values: 'recall', 'application', 'critical-thinking')
  - `metadata: Object` with:
    - `auditedAt: Date`
    - `auditedBy: String`
- [ ] Test schema migration in staging
- [ ] Verify backward compatibility

### Data Verification
- [ ] Verify 16,800 questions ready in staging data
- [ ] Check all UUIDs are unique v4 format
- [ ] Validate all hashtags follow pattern: #topic #difficulty #type #language
- [ ] Confirm all question types assigned
- [ ] Verify metadata complete for all questions
- [ ] Spot-check random 100 questions across all courses

---

## MIGRATION EXECUTION

### Phase 1: Schema Update
- [ ] Deploy schema changes to staging
- [ ] Verify schema update successful
- [ ] Test reads/writes with new schema
- [ ] Deploy schema changes to production

### Phase 2: Data Migration
- [ ] Stop course creation (already frozen)
- [ ] Begin data migration
- [ ] Migrate questions by course:
  - [ ] Course 1: Productivity 2026 (2,100 questions)
  - [ ] Course 2 (2,100 questions)
  - [ ] Course 3 (2,100 questions)
  - [ ] Course 4 (2,100 questions)
  - [ ] Course 5 (2,100 questions)
  - [ ] Course 6 (2,100 questions)
  - [ ] Course 7 (2,100 questions)
  - [ ] Course 8 (2,100 questions)
- [ ] Total migrated: 16,800 questions

### Phase 3: Verification
- [ ] Verify all 16,800 questions in database
- [ ] Check UUID uniqueness
- [ ] Verify hashtag assignment
- [ ] Confirm metadata timestamps
- [ ] Test filtering by hashtags
- [ ] Random spot-check: 200+ questions

---

## POST-MIGRATION TESTING

### Functionality Tests
- [ ] Load quizzes in staging app
- [ ] Test all 8 courses load correctly
- [ ] Verify all 10 languages work
- [ ] Test quiz answering flow
- [ ] Test progress tracking
- [ ] Test leaderboard updates

### Quality Tests
- [ ] Verify 4 options per question
- [ ] Confirm correct answers work
- [ ] Test scoring logic
- [ ] Verify cognitive mix distribution
- [ ] Test hashtag filtering (if UI ready)

### Performance Tests
- [ ] Query performance: question lookup
- [ ] Query performance: quiz load (7 questions)
- [ ] Query performance: filtering by hashtags
- [ ] No N+1 queries
- [ ] Response times < 200ms

---

## ROLLBACK PROCEDURES

### If Issues Found
1. [ ] Stop production quiz serving
2. [ ] Restore from backup
3. [ ] Verify backup integrity
4. [ ] Investigate issue
5. [ ] Communicate status to team
6. [ ] Plan remediation

### Communication
- [ ] Notify users of any downtime
- [ ] Update status dashboard
- [ ] Document issue & resolution
- [ ] Post-mortem review

---

## POST-MIGRATION HANDOFF

### Documentation Handoff
- [ ] All audit documents reviewed
- [ ] Master Plan available to team
- [ ] Schema specifications documented
- [ ] Hashtag reference guide available
- [ ] Migration log preserved

### Team Training
- [ ] Database team trained on new fields
- [ ] Frontend team trained on hashtag filtering
- [ ] Analytics team trained on UUID usage
- [ ] Support team trained on question lookup

### Monitoring Setup
- [ ] Monitor database performance
- [ ] Alert on slow queries
- [ ] Track UUID generation
- [ ] Monitor hashtag searches
- [ ] Track question popularity

---

## SUCCESS CRITERIA

### All Migrated Data Criteria
- ✅ 16,800 questions with UUID
- ✅ 16,800 questions with hashtags
- ✅ 16,800 questions with questionType
- ✅ 16,800 questions with metadata.auditedAt
- ✅ 16,800 questions with metadata.auditedBy

### Quality Criteria
- ✅ 100% of questions have exactly 4 options
- ✅ 100% of questions have correct answer
- ✅ 0 duplicate UUIDs
- ✅ 0 missing hashtags
- ✅ 0 invalid questionType values
- ✅ 0 missing metadata fields

### Performance Criteria
- ✅ Question lookup: < 50ms
- ✅ Quiz load (7 questions): < 100ms
- ✅ Hashtag search: < 200ms
- ✅ No timeout errors
- ✅ No data integrity errors

---

## SIGN-OFF

### Migration Manager
- Name: ________________________
- Date: ________________________
- Signature: ____________________

### Database Manager
- Name: ________________________
- Date: ________________________
- Signature: ____________________

### Product Owner (Sultan)
- Name: ________________________
- Date: ________________________
- Signature: ____________________

---

## CONTACT & ESCALATION

**Migration Issues**: Use escalation chain below

1. **Database Team Lead**
   - Name: ________________________
   - Phone: ________________________
   - Email: ________________________

2. **Engineering Manager**
   - Name: ________________________
   - Phone: ________________________
   - Email: ________________________

3. **Product Owner (Sultan)**
   - Name: ________________________
   - Phone: ________________________
   - Email: ________________________

---

## REFERENCES

- **Master Plan**: `/docs/2026-01-24_QUIZ_QUALITY_AUDIT_AND_ENHANCEMENT_MASTER_PLAN.md`
- **Phase 1 Report**: `/docs/PHASE_1_FINAL_REPORT.md`
- **Phase 2 Report**: `/docs/PHASE_2_FINAL_REPORT.md`
- **Project Completion**: `/docs/PROJECT_COMPLETE.md`
- **Audit Data**: `/docs/PHASE_1_AUDIT_WORKSHEET.md` (and related)

---

**Ready to migrate. Proceed when approved by Product Owner.**
