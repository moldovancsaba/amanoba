# Amanoba Dictionary

Course - The full learning product a student enrolls in.

Lesson / Day - One learning unit inside a course.

Quiz - Short lesson-level question set used to check understanding.

Final Exam - The certification exam at the end of a course.

Certificate - The proof issued after the learner passes the required course and exam rules.

Certification - The whole certificate system, including eligibility, final exam, template, and certificate issuing.

Course Flow - The full student journey from course page to lessons, quizzes, final exam, certificate, and sharing.

Public Course Page - The course landing page visible before or without enrollment.

Public Lesson View - A read-only lesson page used for public discovery and SEO.

Enrolled Lesson Page - The lesson page used by signed-in enrolled students.

Course Progress - The student's saved completion state for lessons, quizzes, and the course.

Assessment Results - The stored record showing which lesson quizzes a student passed.

Attempt - One active or finished final exam session.

Question Pool - The available set of questions used to build a quiz or final exam.

Answer Option - One selectable answer in a quiz or exam.

Correct Answer - The answer that should be accepted as right.

Distractor - A wrong but plausible answer option.

Certificate Template - The visual design used when creating a certificate.

Template ID - The stored name of the certificate template, such as `default_v1`.

Credential Title - The certificate label or type shown on the certificate.

Course Audit - A check that finds structural course problems before students hit them.

Course-Flow Audit - The automated check that verifies lessons, quizzes, exams, and certificates work together.

Blocker - A serious problem that can break the student journey.

Warning - A non-breaking issue that should still be fixed.

Production - The live website students use.

Deployment - A published version of the app on Vercel.

Build - The process that prepares the app for deployment.

GitHub Checks - Automated tests that run after code is pushed.

Quality Gates - The main GitHub check covering tests, linting, type-checking, and build safety.

Docs Check - The GitHub check that verifies generated documentation and links are correct.

UI Foundation Check - The check that verifies design-system and UI rules.

Working Tree - The local file state showing whether there are uncommitted changes.

Commit - A saved package of code or documentation changes.

Push - Sending commits from the local machine to GitHub.

Runtime Logs - Live production logs showing errors and requests.

Root Cause - The real underlying reason a bug happens.

Patch - A focused code change that fixes a specific issue.

Seed Script - A script that creates or updates course data in the database.

Backfill - A one-time database update to repair existing records.

Live Data - The current production database data.

Course Source - The file or script used to recreate or update a course.

Local Check - A verification run on the development machine before pushing.

Smoke Test - A quick check that a core page or API works.

Public URL - A link that can be opened on the live website.

Final Exam Answer API - The backend function that receives and grades one exam answer.

Final Exam Start API - The backend function that creates a new exam attempt.

Final Exam Submit API - The backend function that finalizes an exam attempt.

Certificate Status API - The backend function that tells whether a learner can receive or view a certificate.

Certificate Image API - The backend function that renders the certificate image.

Map-Like Field - A database field that may appear as a Map or plain object depending on how Mongo returns it.

Idempotent - Safe to run more than once without creating duplicate or broken results.

Regression - A bug where something that worked before breaks again.

Production Verification - Checking the live website after deployment to confirm the fix works.

Course Automation - The system that creates, audits, repairs, or maintains courses automatically.

Content Fix Automation - The automation that finds bad lessons, bad quizzes, missing sources, and course structure issues.

Oldest Modified Course - The course selected first because it has gone the longest without updates.

Project Board - The GitHub task board where automation-created issues are organized.

CONTENT fix Column - The project-board column where course content repair tasks should go.
