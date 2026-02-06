# Course package template

Use **sample.json** in this folder as the template to create new courses and import them via the UI.

## Create a new course

1. **Copy the template**
   - Copy `docs/course/sample.json` to a new file (e.g. `my-new-course.json`).

2. **Edit the package**
   - Set a unique **courseId** and **name** (and description if you want).
   - Edit or add **lessons** (lessonId, dayNumber, title, content, emailSubject, emailBody, quizConfig, quizQuestions, etc.).
   - Keep **content** and **emailBody** in **Markdown** (see COURSE_PACKAGE_FORMAT.md).

3. **Import via the UI**
   - **Admin → Course Management → Import** (or **Import** from the course editor to merge into an existing course).
   - Choose your `.json` file. The app creates the course or merges into an existing one by courseId.

The same format is produced by **Export** on a course. You can also start from an exported course file: copy it, change **courseId** and **name** (and content as needed), then import to create a new course.

Full field reference: **docs/COURSE_PACKAGE_FORMAT.md**.
