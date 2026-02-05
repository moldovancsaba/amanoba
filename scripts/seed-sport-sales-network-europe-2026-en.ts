import { readFileSync } from "fs";
import { join } from "path";
import { buildCanonicalContentLoader, buildMarkdownLessonLoader } from "../../src/course-content";
import { buildEmailBody } from "../../src/email";
import { escapeHtml } from "../../src/html-utils";
import { Lesson } from "../../src/types";

const COURSE_ID = "SPORT_SALES_NETWORK_EUROPE_2026";
const COURSE_TITLE = "Build a Sport Sales Network in Europe 2026";

const lessons = buildMarkdownLessonLoader({
  courseId: COURSE_ID,
  markdownFolder: join(__dirname, "../../docs/lessons/amanoba_sport_sales_network_europe_2026"),
  markdownFilePattern: "*.md",
});

const canonicalContentLoader = buildCanonicalContentLoader({
  courseId: COURSE_ID,
  canonicalJsonPath: join(__dirname, "../../docs/canonical/amanoba_sport_sales_network_europe_2026_canonical.json"),
});

function buildEmailBody(lesson: Lesson): string {
  return `
    <h1>Sport Sales Network Europe 2026 — Day ${lesson.dayNumber}</h1>
    <p>${escapeHtml(lesson.canonicalTitle)}</p>
    <p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/${lesson.dayNumber}">Open the lesson →</a></p>
  `;
}

async function seed() {
  const allLessons = await lessons.loadAll();
  const canonicalContent = await canonicalContentLoader.load();

  for (const lesson of allLessons) {
    const canonical = canonicalContent.find(c => c.dayNumber === lesson.dayNumber);
    if (!canonical) {
      console.warn(`No canonical content found for day ${lesson.dayNumber}`);
      continue;
    }

    const emailBody = buildEmailBody(lesson);
    // Here, implement logic to seed the lesson, email, and canonical content into the system.
    // This might include database inserts or API calls.
  }
}

seed().catch(console.error);
