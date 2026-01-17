# Amanoba - Elso kurzus letrehozas checklist

Version: 1.0
Last updated: 2026-01-17

This guide is based on the current Amanoba codebase. It mirrors the real model names,
API routes, and admin UI screens.

## 0) Elofeltetelek

- Admin felulet elerese: /{locale}/admin
- MongoDB kapcsolat beallitva (MONGODB_URI)
- Email kuldeshez: RESEND_API_KEY, EMAIL_FROM, EMAIL_REPLY_TO, NEXT_PUBLIC_APP_URL
- Napi emailekhez: CRON_SECRET + Vercel cron (POST /api/cron/send-daily-lessons)

## 1) Kurzus letrehozasa (Course)

UI: /{locale}/admin/courses/new
API: POST /api/admin/courses

Kotelezo mezok:
- courseId (csupa nagybetu, szam, alahuzas; pl. AI_30_NAP)
- name
- description

Fontos beallitasok:
- language: hu / en (alapertelmezett: hu)
- durationDays: alapertelmezetten 30
- isActive: letrehozas utan draft (false)
- pointsConfig + xpConfig
- requiresPremium: opcionlis

Megjegyzes:
- A Course model nem tarolja a leckeket tombben. A leckek a Lesson kolekcioban vannak.
- Admin API jelenleg brandId-t general, ha nincs megadva. Ha brand alapu szures lesz,
  erdemes brandId-t kuldeni vagy az API-t javitani.

## 2) 30 lecke letrehozasa (Lesson)

UI: /{locale}/admin/courses/{courseId}
API: POST /api/admin/courses/{courseId}/lessons

Minden naphoz 1 lecke (dayNumber 1-30).
Kotelezo mezok:
- lessonId (egyedi)
- dayNumber (1-30)
- title
- content
- emailSubject
- emailBody

Opcionlis mezok:
- assessmentGameId (ha van ertekelesi jatek)
- pointsReward / xpReward (alapertelmezett a Course config)
- language (alapertelmezett a Course language)
- translations (i18n)
- metadata (pl. promptTemplate, task, tags)

Javasolt ID minta:
- courseId: AI_30_NAP
- lessonId: AI_30_NAP_DAY_01

## 3) Publikacio (Draft -> Published)

UI: /{locale}/admin/courses/{courseId}

- Kapcsold Published allapotba (isActive = true)
- Ezutan jelenik meg a publikus kurzus listaban: /{locale}/courses

## 4) Teszt es enroll

- Nyisd meg a kurzus oldalat: /{locale}/courses/{courseId}
- Enroll: POST /api/courses/{courseId}/enroll
- Napi lecke nezese: GET /api/courses/{courseId}/day/1
- UI lecke oldal: /{locale}/courses/{courseId}/day/1

## 5) Email kuldes teszt

Dev mod:
- GET /api/cron/send-daily-lessons (csak dev)

Prod mod:
- POST /api/cron/send-daily-lessons
  Header: Authorization: Bearer <CRON_SECRET>

A lecke email az aktualis dayNumber alapjan megy ki.

## 6) Ismert eltetesek (fontos)

- A CourseProgress schema mezoi: completedDays, status, lastAccessedAt, emailSentDays.
  A jelenlegi enroll/lesson route-ok viszont lessonsCompleted, isCompleted, lastActivityAt
  mezoket hasznalnak. Ezt erdemes javitani, kulonben a haladas es emailek nem lesznek
  konzisztensen kezelve.

## 7) Tartalom import (opcionalis)

- A 30 napos tartalmat tarolhatjatok Markdown/JSON formaban es seedelhetitek
  a Lesson API-val vagy egy script-tel.
- UI-bol is feltoltheto, de 30 lecke kezzel idos.

