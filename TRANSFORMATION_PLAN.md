# Amanoba Transformation Plan: Game Platform → 30-Day Learning Platform

**Created**: 2025-01-14T12:00:00.000Z  
**Status**: Planning Phase  
**Timeline**: 12 weeks (3 months)

---

## 🎯 Transformation Overview

### Current State
- **Platform Type**: Multi-game platform (QUIZZZ, WHACKPOP, Madoku)
- **Primary Focus**: Entertainment and competition
- **User Type**: Players/Gamers
- **Core Loop**: Play games → Earn points → Unlock achievements → Compete on leaderboards

### Target State
- **Platform Type**: 30-day learning platform
- **Primary Focus**: Structured education with gamification
- **User Type**: Students/Learners
- **Core Loop**: Enroll in course → Receive daily lesson emails → Complete lessons → Take assessments (games) → Track progress → Earn rewards

---

## 🔄 What Changes

### 1. Games → Assessments
**Current**: Games are standalone entertainment  
**New**: Games become interactive assessments to understand students

- **QUIZZZ**: Knowledge assessment quizzes
- **WHACKPOP**: Reaction time and focus assessment
- **Madoku**: Problem-solving and strategic thinking assessment

**Implementation**:
- Add `isAssessment: boolean` flag to Game model
- Add `assessmentConfig` object to Game model
- Create AssessmentResult model to track game results in course context
- Link game sessions to course progress

### 2. New Course System
**Current**: No structured learning paths  
**New**: 30-day courses with daily lessons

**Components**:
- **Course Model**: Defines a 30-day course
- **Lesson Model**: Individual daily lesson (30 lessons per course)
- **CourseProgress Model**: Tracks student progress through course
- **Course Builder**: Admin interface to create courses (similar to game creation)

### 3. Email Integration
**Current**: No email functionality  
**New**: Daily lesson delivery via email

**Features**:
- Email service integration (Resend or SendGrid)
- Daily lesson emails sent at 8 AM (student timezone)
- Email templates for lessons, welcome, completion, reminders
- Email preferences in user settings
- Unsubscribe functionality

### 4. Student Dashboard
**Current**: Game dashboard  
**New**: Learning dashboard

**Features**:
- Course enrollment
- Daily lesson viewer
- Progress tracking (30-day timeline)
- Assessment results
- Course completion status

---

## ✅ What Stays the Same

### Retained Systems (No Changes)
1. **Authentication**: Facebook OAuth and anonymous login remain
2. **Rewards System**: Points, rewards, redemption all unchanged
3. **Achievements**: All existing achievements remain, new course-specific ones added
4. **XP & Leveling**: 50-level system unchanged
5. **Streaks**: Win streaks and login streaks unchanged
6. **Leaderboards**: Existing leaderboards remain, course-specific ones added
7. **Daily Challenges**: Continue to work as before
8. **Quests**: Multi-step quest system unchanged
9. **Progressive Disclosure**: Gamification gating unchanged
10. **Analytics**: Existing analytics remain, course analytics added

### Backward Compatibility
- Games remain playable outside of courses (entertainment mode)
- All existing player data preserved
- Gradual rollout: courses are opt-in feature
- No breaking changes to existing APIs

---

## 📋 Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
**Goal**: Create data models and email infrastructure

**Tasks**:
1. Create Course, Lesson, CourseProgress models
2. Integrate email service (Resend/SendGrid)
3. Create email templates
4. Extend Game model for assessments
5. Create AssessmentResult model

**Deliverables**:
- ✅ 5 new database models
- ✅ Email service module
- ✅ 4 email templates
- ✅ Database seed script for sample course

---

### Phase 2: Course Builder (Weeks 3-4)
**Goal**: Admin tools to create courses

**Tasks**:
1. Admin course management pages
2. 30-day lesson builder interface
3. Rich text editor for lesson content
4. Course preview functionality
5. Publish/unpublish workflow

**Deliverables**:
- ✅ Admin course builder UI
- ✅ Lesson content editor
- ✅ Course management system

---

### Phase 3: Student Experience (Weeks 5-6)
**Goal**: Student-facing course interface

**Tasks**:
1. Course listing and enrollment
2. Student course dashboard
3. Daily lesson viewer
4. Assessment game integration
5. Progress tracking UI

**Deliverables**:
- ✅ Student course pages
- ✅ Lesson viewer
- ✅ Progress dashboard

---

### Phase 4: Email Automation (Weeks 7-8)
**Goal**: Automated daily lesson delivery

**Tasks**:
1. Daily email cron job
2. Timezone-aware scheduling
3. Email delivery tracking
4. Email preferences UI
5. Unsubscribe handling

**Deliverables**:
- ✅ Automated email system
- ✅ Email preferences
- ✅ Delivery tracking

---

### Phase 5: Assessment Integration (Weeks 9-10)
**Goal**: Connect games to course assessments

**Tasks**:
1. Assessment launcher
2. Game session → course linking
3. Assessment results processing
4. Performance insights
5. Assessment analytics

**Deliverables**:
- ✅ Assessment integration
- ✅ Results processing
- ✅ Analytics dashboard

---

### Phase 6: Polish & Launch (Weeks 11-12)
**Goal**: Final polish and testing

**Tasks**:
1. UI/UX improvements
2. Mobile responsiveness
3. Documentation
4. End-to-end testing
5. Performance optimization

**Deliverables**:
- ✅ Polished UI
- ✅ Complete documentation
- ✅ Tested system
- ✅ Production-ready platform

---

## 🗄️ Database Schema Changes

### New Collections
1. **courses**: Course definitions
2. **lessons**: Lesson content (30 per course)
3. **course_progress**: Student progress tracking
4. **assessment_results**: Game results in course context

### Modified Collections
1. **games**: Add `isAssessment` and `assessmentConfig` fields
2. **players**: Add `emailPreferences` object

### Unchanged Collections
- All other collections remain unchanged

---

## 📧 Email System Architecture

### Email Service Provider
**Recommended**: Resend (modern, developer-friendly)  
**Alternative**: SendGrid (enterprise-grade)

### Email Types
1. **Lesson Email**: Daily lesson content
2. **Welcome Email**: Course enrollment confirmation
3. **Completion Email**: Course completion celebration
4. **Reminder Email**: Daily lesson reminder

### Email Delivery
- **Schedule**: Daily at 8:00 AM (student timezone)
- **Method**: Cron job (`/api/cron/send-daily-lessons`)
- **Queue**: Async processing via job queue
- **Tracking**: Email delivery status in CourseProgress

---

## 🎮 Game-to-Assessment Mapping

### QUIZZZ → Knowledge Assessment
- **Measures**: Subject knowledge, retention
- **Use Case**: After lesson to test understanding
- **Results**: Score, accuracy, category breakdown

### WHACKPOP → Focus Assessment
- **Measures**: Reaction time, focus, attention span
- **Use Case**: Cognitive assessment
- **Results**: Hits, misses, reaction time, consistency

### Madoku → Problem-Solving Assessment
- **Measures**: Strategic thinking, problem-solving
- **Use Case**: Higher-order thinking assessment
- **Results**: Score, difficulty level, strategy quality

---

## 🔐 Security Considerations

### Email Security
- Email validation and sanitization
- Unsubscribe links in all emails
- Rate limiting on email sending
- SPF/DKIM/DMARC configuration

### Course Access
- Enrollment validation
- Lesson unlock conditions
- Assessment result integrity
- Progress tracking security

---

## 📊 Success Metrics

### Learning Metrics
- Course enrollment rate
- Lesson completion rate
- Course completion rate (30-day)
- Email open rate
- Assessment participation rate

### Engagement Metrics
- Daily active learners
- Average lessons completed
- Points earned from courses
- Course-specific achievements unlocked

### Retention Metrics
- D7 retention (students active after 7 days)
- D30 retention (course completion)
- Course abandonment rate

---

## 🚀 Quick Start for Development

### 1. Install New Dependencies
```bash
npm install resend @tiptap/react @tiptap/starter-kit
```

### 2. Set Environment Variables
```bash
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@amanoba.com
EMAIL_FROM_NAME=Amanoba Learning
```

### 3. Create Database Models
Follow Phase 1 tasks to create Course, Lesson, CourseProgress models.

### 4. Seed Sample Course
```bash
npm run seed:sample-course
```

### 5. Test Email Service
```bash
npm run test:email
```

---

## 📝 Next Steps

1. **Review Roadmap**: See `ROADMAP.md` for detailed implementation plan
2. **Start Phase 1**: Create data models and email infrastructure
3. **Set Up Email Service**: Get Resend API key and configure
4. **Create Sample Course**: Build first 30-day course for testing
5. **Iterate**: Build, test, and refine based on feedback

---

## 🤝 Migration Strategy

### For Existing Players
- **No Action Required**: All existing data preserved
- **Opt-In**: Courses are optional feature
- **Games Still Work**: Can play games without courses
- **Gradual Rollout**: Courses available alongside games

### For New Students
- **Onboarding**: Option to enroll in course during signup
- **First Course**: Recommended course for new students
- **Assessment**: Initial assessment to understand student level

---

## 📞 Support & Questions

For questions about the transformation:
- Review `ROADMAP.md` for detailed implementation plan
- Check `ARCHITECTURE.md` for system architecture
- See `README.md` for platform overview

---

**Maintained By**: Narimato  
**Status**: Planning Complete — Ready for Implementation
