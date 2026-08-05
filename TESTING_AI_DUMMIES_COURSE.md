# Testing "AI for dummies in a day" Course Creation

**Purpose**: Step-by-step guide to test the course database reset and creation endpoint

**Date**: 2026-08-05  
**Endpoint**: `POST /api/admin/courses/reset-and-create-ai-dummies`

---

## Prerequisites

### 1. Admin Access Required

You need:
- Valid authentication session (logged in as admin user)
- Admin role in the database
- Bearer token or cookie-based auth

### 2. Deployment URL

The endpoint is now live on the `main` branch. Get your deployment URL:
- **Production**: https://www.amanoba.com/api/admin/courses/reset-and-create-ai-dummies
- **Preview**: https://amanoba-{branch}-moldovan.vercel.app/api/admin/courses/reset-and-create-ai-dummies

---

## Testing Steps

### Step 1: Authenticate as Admin

**Option A: Browser-based (Recommended)**

1. Open your deployment URL in a browser
2. Sign in with your admin account (via SSO)
3. Open browser DevTools → Console
4. Run this JavaScript snippet:

```javascript
fetch('/api/admin/courses/reset-and-create-ai-dummies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include' // Uses your logged-in session
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

**Option B: cURL with Session Cookie**

1. Sign in to the platform in a browser
2. Open DevTools → Application → Cookies
3. Copy the `next-auth.session-token` value
4. Use it in the cURL request:

```bash
curl -X POST 'https://www.amanoba.com/api/admin/courses/reset-and-create-ai-dummies' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: next-auth.session-token=YOUR_SESSION_TOKEN_HERE'
```

---

### Step 2: Verify API Response

**Expected Success Response**:

```json
{
  "success": true,
  "message": "Database cleaned and new course created successfully",
  "course": {
    "courseId": "AI_DUMMIES_1DAY_EN",
    "name": "AI for dummies in a day",
    "durationDays": 1,
    "lessons": 1,
    "questions": 7
  },
  "deleted": {
    "courses": 3,
    "lessons": 42,
    "questions": 294,
    "progress": 125,
    "certificates": 8,
    "entitlements": 15
  }
}
```

**Expected Error Responses**:

**Unauthorized (not logged in)**:
```json
{
  "error": "Unauthorized"
}
```
Status: 401

**Forbidden (not admin)**:
```json
{
  "error": "Forbidden: Admin access required"
}
```
Status: 403

**Server Error**:
```json
{
  "error": "Failed to reset courses",
  "message": "Error details..."
}
```
Status: 500

---

### Step 3: Test Course Enrollment

After successful API call:

1. **Navigate to Course Catalog**
   - Go to: https://www.amanoba.com/en/courses (or your deployment URL + `/en/courses`)
   - You should see: **"AI for dummies in a day"**

2. **View Course Details**
   - Click on the course card
   - Verify course information:
     - Name: "AI for dummies in a day"
     - Duration: 1 day
     - Description: "A friendly 1-day introduction to AI..."
     - Thumbnail: AI-related image
     - Tags: AI, beginner, rapid, 1-day, introduction

3. **Enroll in Course**
   - Click "Enroll" or "Start Course"
   - Verify enrollment success
   - You should be redirected to Day 1 lesson

---

### Step 4: Test Lesson Content

After enrolling:

1. **Read Lesson Content**
   - Lesson should load: "AI Basics: What is AI and How Can You Use It?"
   - Verify all sections are present:
     - [ ] One-liner, Time, Deliverable (header)
     - [ ] Learning goal, Success criteria, Output
     - [ ] Who section
     - [ ] What section (What it is, What it is not, Theory, Terms)
     - [ ] Where section (Applies, Does not apply, Touchpoints)
     - [ ] When section (Use it when, Frequency, Late signals)
     - [ ] Why section (Benefits, Risks, Expectations)
     - [ ] How section (Steps, Do/Don't, Mistakes)
     - [ ] Guided exercise
     - [ ] Independent exercise
     - [ ] Self-check
     - [ ] Bibliography
     - [ ] Read more

2. **Check Content Quality**
   - [ ] No "[TODO]" or placeholders
   - [ ] No "lorem ipsum" dummy text
   - [ ] Clear deliverable: "Personal AI Use Case List"
   - [ ] All exercises present and actionable
   - [ ] Bibliography has real URLs
   - [ ] Language is beginner-friendly (no jargon)

3. **Complete Lesson**
   - Scroll to bottom
   - Click "Mark as Complete" or "Next"

---

### Step 5: Test Quiz Functionality

After completing the lesson:

1. **Take Quiz**
   - Quiz should prompt you to start
   - Click "Start Quiz" or "Take Quiz"

2. **Verify Quiz Questions**
   - You should see **3 questions** (from pool of 7)
   - Each question should have:
     - [ ] Clear question text (no "in this lesson", "Day 1", etc.)
     - [ ] 4 answer options
     - [ ] One correct answer
     - [ ] No silly or obvious wrong answers (plausible distractors)
     - [ ] Scenario-based language (natural, not administrative)

3. **Answer Questions**
   - Select answers for all 3 questions
   - Submit quiz

4. **Verify Results**
   - You should see your score (e.g., "2/3 correct - 67%")
   - Passing threshold: 70% (2 out of 3 correct needed)
   - If you failed, you should be able to retake
   - If you passed, course should be marked complete

---

### Step 6: Test Certification

After passing the quiz and completing the course:

1. **Check for Certificate**
   - Navigate to your profile: https://www.amanoba.com/en/profile/[your-player-id]
   - Look for "Certificates" section
   - You should see: **"AI Basics Certificate"** (or similar)

2. **View Certificate**
   - Click on the certificate
   - Verify details:
     - [ ] Your name
     - [ ] Course name: "AI for dummies in a day"
     - [ ] Completion date
     - [ ] Verification slug (unique URL)
     - [ ] Certificate status: Active (not revoked)

3. **Test Certificate Sharing**
   - Copy certificate URL (format: `/certificate/[slug]`)
   - Open in incognito/private window (not logged in)
   - Verify certificate displays publicly (if set to public)
   - Try toggling public/private setting

---

### Step 7: Test Profile Integration

1. **View Your Profile**
   - Go to: https://www.amanoba.com/en/profile/[your-player-id]
   - Verify course appears in "Completed Courses"
   - Check points awarded: +500 points
   - Check XP awarded: +100 XP

2. **Test Profile Privacy**
   - Open profile settings
   - Toggle profile visibility
   - Verify certificate visibility follows profile privacy settings

3. **Test Social Sharing** (if applicable)
   - Look for "Share on LinkedIn" or similar buttons
   - Test share functionality
   - Verify shared link goes to public certificate page

---

## Expected Quiz Questions

You may encounter any 3 of these 7 questions:

1. **Explaining AI to a friend** (EASY, APPLICATION)
   - Tests understanding of beginner-friendly language
   - Correct answer: Simple explanation without jargon

2. **Writing AI prompts** (MEDIUM, APPLICATION)
   - Tests understanding of specific vs vague prompts
   - Correct answer: Detailed prompt with context and tone

3. **AI impact on jobs** (MEDIUM, CRITICAL_THINKING)
   - Tests balanced understanding of AI disruption
   - Correct answer: Adaptation mindset, not fear or complacency

4. **AI medical advice** (HARD, CRITICAL_THINKING)
   - Tests understanding of AI limitations and safety
   - Correct answer: Never substitute AI for doctor consultation

5. **Improving AI prompts** (MEDIUM, APPLICATION)
   - Tests problem-solving when AI gives generic results
   - Correct answer: Add specific context and details

6. **How AI learns** (EASY, CONCEPT)
   - Tests understanding of AI learning fundamentals
   - Correct answer: Pattern recognition from millions of examples

7. **Defining AI use cases** (MEDIUM, APPLICATION)
   - Tests ability to create actionable AI use cases
   - Correct answer: Specific format with area, task, tool, first step

---

## Troubleshooting

### Issue: 401 Unauthorized

**Cause**: Not logged in or session expired

**Fix**:
1. Sign in to the platform
2. Refresh the page
3. Try the API call again

### Issue: 403 Forbidden

**Cause**: Not an admin user

**Fix**:
1. Verify your user has admin role in database
2. Use admin script: `npm run admin:set-role -- --email your@email.com --role admin`
3. Sign out and sign back in
4. Try again

### Issue: 500 Server Error

**Cause**: Database connection issue or MongoDB error

**Fix**:
1. Check server logs in Vercel dashboard
2. Verify `MONGODB_URI` environment variable is set
3. Check MongoDB Atlas connection status
4. Try again after a few minutes

### Issue: Course doesn't appear in catalog

**Cause**: Course creation may have partially failed

**Fix**:
1. Check server logs for errors
2. Try calling the endpoint again (it's safe to retry)
3. Verify in MongoDB that course was created (check `courses` collection)

### Issue: Quiz questions don't load

**Cause**: Quiz questions may not have been created

**Fix**:
1. Check server logs for quiz creation errors
2. Verify in MongoDB that questions exist (check `quizquestions` collection)
3. Try calling the endpoint again

---

## Success Criteria

The test is successful when:

- ✅ API call returns 200 status and success response
- ✅ Course appears in catalog
- ✅ Course details are correct
- ✅ Enrollment works
- ✅ Lesson content loads with all 13 sections
- ✅ Content is high-quality (no placeholders, clear deliverable, real bibliography)
- ✅ Quiz works (3 questions from pool of 7)
- ✅ Questions are standalone and scenario-based
- ✅ Quiz results are calculated correctly (70% pass threshold)
- ✅ Certificate is issued after course completion
- ✅ Certificate appears on profile
- ✅ Certificate can be shared publicly
- ✅ Points and XP are awarded

---

## Next Steps After Testing

Once testing is complete:

1. **Document Results**
   - Note any issues or bugs encountered
   - Verify all success criteria met
   - Take screenshots if needed

2. **Provide Feedback**
   - Was the lesson content clear and helpful?
   - Were the quiz questions fair and relevant?
   - Was the certification process smooth?

3. **Plan Next Course**
   - This is the 1-day rapid introduction (stage 1)
   - Next: 3-day course (when X users complete this one)
   - Use the same quality standards and structure

4. **Iterate on Content**
   - Collect user feedback
   - Improve lesson based on common questions
   - Adjust quiz difficulty if needed
   - Update deliverable examples

---

## Related Documentation

- **Course Details**: [COURSE_RESET_AND_CREATION_SUMMARY.md](COURSE_RESET_AND_CREATION_SUMMARY.md)
- **Content Quality System**: [CONTENT_CREATION_REFACTORING_SUMMARY.md](CONTENT_CREATION_REFACTORING_SUMMARY.md)
- **API Implementation**: `/workspace/app/api/admin/courses/reset-and-create-ai-dummies/route.ts`
- **Progressive Strategy**: [docs/product/PROGRESSIVE_COURSE_STRATEGY.md](docs/product/PROGRESSIVE_COURSE_STRATEGY.md)

---

**Test Status**: ⏳ Ready for testing  
**Last Updated**: 2026-08-05  
**Tested By**: [Your name here after testing]  
**Test Result**: [Pass/Fail - fill in after testing]
