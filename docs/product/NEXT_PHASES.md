# Next Phases: Detailed Implementation Plan

**Created**: 2025-01-17T16:30:00.000Z  
**Last Updated**: 2025-01-17T23:45:00.000Z  
**Current Phase**: Phase 2 & 3 Complete ✅  
**Next Phase**: Phase 4 - Assessment Integration

---

## 🎯 Phase 2: Course Builder & Student Dashboard (Weeks 3-4) ✅ COMPLETE

### Priority: HIGH  
**Timeline**: 2 weeks  
**Status**: ✅ COMPLETE (2025-01-17)

---

### 2.1 Course Builder Admin Interface

#### Admin Routes to Create
1. **Course List** (`/admin/courses`)
   - List all courses (active, draft, archived)
   - Search and filter
   - Create new course button
   - Course stats (enrollments, completions)

2. **Create Course** (`/admin/courses/new`)
   - Course metadata form:
     - Name (multi-language)
     - Description (multi-language)
     - Thumbnail upload
     - Duration (default 30 days)
     - Premium toggle
     - Points/XP configuration
   - Save as draft or publish

3. **Edit Course** (`/admin/courses/[courseId]`)
   - Course metadata editor
   - 30-day lesson builder
   - Course preview
   - Publish/unpublish toggle

4. **Lesson Manager** (`/admin/courses/[courseId]/lessons`)
   - 30-day grid view
   - Drag-and-drop reordering
   - Quick edit for each lesson
   - Bulk actions

#### Lesson Editor Features
- **Rich Text Editor** (TipTap recommended)
  - HTML/markdown support
  - Image upload
  - Video embedding
  - Code blocks
  - Lists, headings, formatting

- **Email Template Editor**
  - Subject line template
  - Body template (HTML)
  - Preview mode
  - Variable substitution ({{playerName}}, {{dayNumber}}, etc.)

- **Assessment Configuration**
  - Select game (QUIZZZ, WHACKPOP, Madoku)
  - Configure assessment settings
  - Set minimum score for pass
  - Learning objectives

- **Unlock Conditions**
  - Require previous lesson
  - Require minimum day
  - Require course start

#### Implementation Steps
1. Create admin course routes
2. Install TipTap for rich text editing
3. Build course metadata form
4. Build 30-day lesson builder UI
5. Integrate TipTap editor
6. Add email template editor
7. Add assessment game selector
8. Implement drag-and-drop reordering
9. Add course preview functionality
10. Add publish/unpublish workflow

**Estimated Time**: 1.5 weeks  
**Actual Time**: Completed 2025-01-17

**✅ Completed Deliverables**:
- Admin course management pages (list, create, edit)
- 30-day lesson builder with TipTap rich text editor
- Course preview and publish/unpublish workflow
- Assessment game selection and linking
- Email template editor

---

### 2.2 Student Course Dashboard ✅ COMPLETE

#### Student Routes to Create
1. **Course Catalog** (`/courses`)
   - Grid/list view of available courses
   - Course cards with:
     - Thumbnail
     - Name and description
     - Duration (30 days)
     - Enrollment count
     - Premium badge
   - Filter by category, difficulty
   - Search functionality

2. **Course Overview** (`/courses/[courseId]`)
   - Course details:
     - Full description
     - What you'll learn
     - Course structure (30-day preview)
     - Instructor info (if applicable)
   - Enrollment button
   - Progress preview (if enrolled)
   - Assessment preview

3. **My Courses** (`/my-courses`)
   - List of enrolled courses
   - Progress for each:
     - Current day
     - Completion percentage
     - Days completed
     - Points/XP earned
   - Continue learning CTA
   - Course completion badges

4. **Daily Lesson View** (`/courses/[courseId]/day/[dayNumber]`)
   - Lesson content (rendered HTML/markdown)
   - Day indicator (Day X of 30)
   - Progress bar
   - "Mark as Complete" button
   - Assessment launcher (if configured)
   - Previous/Next lesson navigation
   - Email link ("View in email")
   - Lesson resources (if any)

#### Course Progress Dashboard
- **30-Day Timeline**
  - Visual representation of course
  - Completed days highlighted
  - Current day indicator
  - Locked days (future)
  - Click to navigate to lesson

- **Progress Stats**
  - Days completed / 30
  - Completion percentage
  - Points earned
  - XP earned
  - Assessment scores
  - Streak (consecutive days)

- **Assessment Results**
  - List of completed assessments
  - Score for each
  - Performance insights
  - Recommendations

#### Implementation Steps
1. Create student course routes
2. Build course catalog page
3. Build course overview page
4. Build enrollment API endpoint
5. Build my courses page
6. Build course progress dashboard
7. Build 30-day timeline component
8. Build daily lesson viewer
9. Integrate assessment launcher
10. Add progress tracking

**Estimated Time**: 1.5 weeks  
**Actual Time**: Completed 2025-01-17

**✅ Completed Deliverables**:
- Course catalog and enrollment
- Student course dashboard (`/my-courses`)
- Daily lesson viewer with completion tracking
- Assessment game integration
- Progress visualization

---

## 🎯 Phase 3: Email Automation (Weeks 5-6) ✅ COMPLETE

### Priority: HIGH  
**Timeline**: 2 weeks  
**Status**: ✅ COMPLETE (2025-01-17)

---

### 3.1 Daily Email Scheduler

#### Cron Job Implementation
- **Route**: `/api/cron/send-daily-lessons`
- **Schedule**: Daily at 8:00 AM (user timezone)
- **Vercel Cron**: Configure in `vercel.json`

#### Email Sending Logic
1. Find all active course progress records
2. For each student:
   - Check if today's lesson email needs to be sent
   - Check email preferences
   - Get lesson for current day
   - Send lesson email
   - Track email delivery
3. Handle missed days (catch-up emails)
4. Error handling and retry logic

#### Implementation Steps
1. Create cron job route
2. Implement email scheduler logic
3. Add timezone support
4. Add email delivery tracking
5. Add catch-up email logic
6. Configure Vercel cron
7. Test email delivery
8. Add error handling and logging

**Estimated Time**: 1 week  
**Actual Time**: Completed 2025-01-17

**✅ Completed Deliverables**:
- Daily lesson email cron job (`/api/cron/send-daily-lessons`)
- Timezone-aware email scheduling
- Email delivery tracking
- Catch-up email logic
- Vercel cron configuration

---

### 3.2 Email Preferences & Management ✅ COMPLETE

#### Email Preferences UI
- **Route**: `/settings/email`
- **Features**:
  - Toggle lesson emails on/off
  - Select email frequency (daily, weekly, never)
  - Set preferred email time (hour selector)
  - Timezone selector
  - Email delivery history
  - Unsubscribe link

#### Unsubscribe Handling
- **Route**: `/api/email/unsubscribe`
- One-click unsubscribe from email
- Respects email preferences
- Updates Player model

#### Implementation Steps
1. Create email settings page
2. Add email preferences form
3. Add timezone selector
4. Add email delivery history
5. Create unsubscribe API endpoint
6. Add unsubscribe link to emails
7. Test unsubscribe flow

**Estimated Time**: 1 week  
**Actual Time**: Completed 2025-01-17

**✅ Completed Deliverables**:
- Email preferences in Player model
- Email settings page (`/settings/email`)
- Unsubscribe functionality
- Email delivery history
- Timezone selector

---

## 🎯 Phase 4: Assessment Integration (Weeks 7-8)

### Priority: MEDIUM  
**Timeline**: 2 weeks  
**Status**: 🚧 READY TO START

### Priority: MEDIUM  
**Timeline**: 2 weeks

---

### 4.1 Game-to-Assessment Bridge

#### Assessment Launcher
- Launch game session from lesson
- Link game session to course progress
- Track assessment completion
- Store results in AssessmentResult

#### Game Session Extension
- Modify `/api/game-sessions/complete`
- Check if session is part of course assessment
- Link to CourseProgress if applicable
- Create AssessmentResult record
- Award course-specific points/XP

#### Assessment Results Processing
- Analyze game session results
- Generate insights based on performance
- Provide recommendations
- Update course progress

#### Implementation Steps
1. Create assessment launcher function
2. Modify game session complete API
3. Add assessment linking logic
4. Create assessment results processor
5. Add insights generation
6. Add recommendations engine
7. Test assessment flow

**Estimated Time**: 1.5 weeks

---

### 4.2 Assessment Analytics Dashboard

#### Admin Analytics
- **Route**: `/admin/courses/[courseId]/analytics`
- **Features**:
  - Student performance across assessments
  - Learning objective mastery
  - Weak areas identification
  - Course completion rates
  - Assessment difficulty analysis
  - Engagement metrics

#### Student View
- Assessment results in course dashboard
- Performance on each assessment
- Progress over time
- Strengths and weaknesses
- Personalized recommendations

#### Implementation Steps
1. Create admin analytics route
2. Build analytics dashboard
3. Add performance charts
4. Add insights visualization
5. Add student results view
6. Add recommendations display

**Estimated Time**: 0.5 weeks

---

## 🎯 Phase 5: Gamification Integration (Weeks 9-10)

### Priority: MEDIUM  
**Timeline**: 2 weeks

---

### 5.1 Course-Specific Achievements

#### Achievement Types
- "First Lesson Complete"
- "Week 1 Complete" (7 lessons)
- "Halfway Hero" (15 lessons)
- "Course Master" (30 lessons complete)
- "Perfect Assessment Score"
- "Consistent Learner" (no missed days)

#### Achievement Engine Extension
- Check course-specific achievements
- Award on lesson completion
- Award on assessment completion
- Award on course completion

#### Implementation Steps
1. Extend Achievement model
2. Create course-specific achievements
3. Update achievement engine
4. Add achievement triggers
5. Test achievement unlocking

**Estimated Time**: 1 week

---

### 5.2 Course Leaderboards

#### Leaderboard Types
- Course completion speed
- Assessment scores
- Total points earned from course
- Consistency (no missed days)
- Perfect assessment scores

#### Leaderboard Integration
- Calculate course-specific rankings
- Update on lesson completion
- Update on assessment completion
- Course completion leaderboard

#### Implementation Steps
1. Extend leaderboard calculator
2. Add course leaderboard types
3. Create leaderboard calculation logic
4. Build course leaderboard UI
5. Add leaderboard to course dashboard

**Estimated Time**: 1 week

---

## 🎯 Phase 6: Polish & Launch (Weeks 11-12)

### Priority: HIGH  
**Timeline**: 2 weeks

---

### 6.1 UI/UX Polish

#### Improvements
- Course card designs
- Lesson viewer improvements
- Progress visualization enhancements
- Mobile responsiveness
- Email template design improvements
- Assessment results visualization
- Loading states
- Error handling UI

#### Implementation Steps
1. Design course cards
2. Improve lesson viewer
3. Enhance progress visualization
4. Optimize mobile experience
5. Improve email templates
6. Add loading states
7. Add error handling

**Estimated Time**: 1 week

---

### 6.2 Documentation & Testing

#### Documentation
- Course creation guide
- Student onboarding flow
- Email delivery documentation
- Assessment integration guide
- API documentation updates

#### Testing
- Email delivery testing
- Assessment integration testing
- End-to-end course completion testing
- Performance testing
- Load testing
- Security testing

#### Implementation Steps
1. Write documentation
2. Create test courses
3. Test email delivery
4. Test assessment flow
5. End-to-end testing
6. Performance optimization
7. Security audit

**Estimated Time**: 1 week

---

## 📊 Success Metrics

### Phase 2 Success Criteria
- ✅ Admin can create a 30-day course
- ✅ Admin can add lessons with rich content
- ✅ Admin can configure email templates
- ✅ Admin can link assessments to lessons
- ✅ Students can enroll in courses
- ✅ Students can view daily lessons
- ✅ Students can complete lessons
- ✅ Students can launch assessments

### Phase 3 Success Criteria
- ✅ Daily lesson emails sent automatically
- ✅ Timezone-aware email delivery
- ✅ Email preferences respected
- ✅ Unsubscribe functionality works

### Phase 4 Success Criteria
- ✅ Assessments launch from lessons
- ✅ Assessment results linked to courses
- ✅ Insights generated from results
- ✅ Recommendations provided

### Phase 5 Success Criteria
- ✅ Course achievements unlock correctly
- ✅ Course leaderboards calculate correctly
- ✅ Gamification integrated with courses

### Phase 6 Success Criteria
- ✅ All features polished and tested
- ✅ Documentation complete
- ✅ Performance optimized
- ✅ Ready for production launch

---

## 🛠️ Technical Requirements

### New Dependencies for Phase 2
```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-link": "^2.x",
  "react-beautiful-dnd": "^13.x" // For drag-and-drop
}
```

### New Dependencies for Phase 3
```json
{
  "node-cron": "^3.x" // For cron scheduling (if not using Vercel cron)
}
```

---

## 📝 Implementation Notes

### Course Builder Philosophy
- Similar to Game Builder architecture
- Flexible content support (HTML, markdown, images, videos)
- 30-day structure enforced but flexible
- Seamless game → assessment flow

### Email Delivery Philosophy
- Email-first: Lessons primarily delivered via email
- Platform access: All lessons accessible in platform
- Timezone aware: Respect student timezone
- Catch-up support: Handle missed days gracefully

### Gamification Philosophy
- Retain everything: All existing gamification remains
- Course enhancements: Add course-specific achievements, leaderboards
- Points integration: Course activities award points
- Streak integration: Course completion maintains streaks

---

**Maintained By**: Narimato  
**Next Review**: Phase 2 completion  
**Status**: Ready for Phase 2 implementation
