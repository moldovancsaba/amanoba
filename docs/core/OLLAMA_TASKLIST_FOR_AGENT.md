# Ollama setup task list (for agent)

**Goal**: Prepare everything so the duplicate-fix script can use a local LLM via Ollama instead of OpenAI. Hand this list to your agent; they complete each item.

---

## 1. Install Ollama

- [ ] Install Ollama on the machine (https://ollama.com/download).
  - **macOS**: Download from ollama.com or `brew install ollama`.
  - **Linux**: `curl -fsSL https://ollama.com/install.sh | sh` or follow official install.
  - **Windows**: Download installer from ollama.com.
- [ ] Confirm install: run `ollama --version` and ensure it prints a version.

---

## 2. Start Ollama service

- [ ] Start the Ollama server (if not already running).
  - **macOS/Linux**: run `ollama serve` in a terminal (or start the Ollama app so the service runs).
  - **Windows**: Start the Ollama app from the Start menu (or run `ollama serve` in a terminal).
- [ ] Verify the API is reachable: `curl http://localhost:11434/api/tags` (or open http://localhost:11434 in a browser). Expect JSON (e.g. `{"models":[]}`) or a list of models.

---

## 3. Pull a model

- [ ] Pull a model suitable for chat + JSON output (recommended: one of the following).
  - **Recommended**: `ollama pull llama3.2` (good balance of speed and quality).
  - **Alternative**: `ollama pull mistral` or `ollama pull llama3.1`.
- [ ] Confirm the model is available: `ollama list` should list the pulled model.

---

## 4. (Optional) Test the chat API

- [ ] Optional: test that the chat endpoint works and returns JSON when asked.
  ```bash
  curl -s http://localhost:11434/api/chat -d '{
    "model": "llama3.2",
    "messages": [{"role": "user", "content": "Reply with only this JSON: {\"test\": true}"}],
    "format": "json",
    "stream": false
  }'
  ```
  Expect a JSON response with a `message.content` field containing something like `{"test": true}`.

---

## 5. Set environment for the fix script

- [ ] Ensure the project can use Ollama when running the fix script. Either:
  - **Option A**: Set env vars when running (no file change):
    - `OLLAMA_BASE_URL=http://localhost:11434` (optional; this is the default)
    - `OLLAMA_MODEL=llama3.2` (or the model you pulled in step 3)
  - **Option B**: Add to `.env.local` (if the project loads it):
    ```
    OLLAMA_BASE_URL=http://localhost:11434
    OLLAMA_MODEL=llama3.2
    ```
    Or force provider: `LLM_PROVIDER=ollama`

---

## 6. Run the fix script with Ollama

- [ ] From the project root, run the duplicate-fix script using Ollama (dry-run first, then apply if desired).
  ```bash
  # Dry-run (no DB changes)
  OLLAMA_MODEL=llama3.2 npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts

  # Apply changes (creates new questions, deletes duplicates, rewrites similar answers)
  OLLAMA_MODEL=llama3.2 npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts --apply
  ```
- [ ] If you used a different model in step 3, replace `llama3.2` with that model name (e.g. `OLLAMA_MODEL=mistral`).
- [ ] Confirm the script logs something like: `LLM: ollama — model: llama3.2`.

---

## 7. (Optional) Limit work for a first test

- [ ] Optional: run on a small subset to verify end-to-end before a full run.
  ```bash
  LIMIT_PAIRS=2 LIMIT_GROUPS=2 OLLAMA_MODEL=llama3.2 npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts --apply
  ```

---

## Summary for agent

| # | Task | Command / action |
|---|------|-------------------|
| 1 | Install Ollama | See https://ollama.com/download; then `ollama --version` |
| 2 | Start Ollama | `ollama serve` (or start Ollama app); verify `curl http://localhost:11434/api/tags` |
| 3 | Pull model | `ollama pull llama3.2` (or mistral / llama3.1); then `ollama list` |
| 4 | (Optional) Test API | `curl` to `http://localhost:11434/api/chat` with `format: "json"` |
| 5 | Set env | `OLLAMA_MODEL=llama3.2` (and optionally `OLLAMA_BASE_URL`, `LLM_PROVIDER=ollama`) |
| 6 | Run fix script | `OLLAMA_MODEL=llama3.2 npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts [--apply]` |
| 7 | (Optional) Test small | Add `LIMIT_PAIRS=2 LIMIT_GROUPS=2` for a short run |

**Prerequisites**: Node/npx and project deps installed (`npm install`), `.env.local` with DB and app config (no OpenAI key needed when using Ollama). Report must exist: `docs/audit-duplicate-questions-report.json` (generate with `npx tsx --env-file=.env.local scripts/audit-duplicate-questions-by-lesson.ts` and optional `COURSE_ID=...`).

---

## ✅ Setup Complete!

All Ollama tasks have been successfully completed:

1. **✅ Ollama Installation**: Version 0.15.2 installed and verified
2. **✅ Service Running**: Ollama API accessible at localhost:11434
3. **✅ Models Available**: Multiple models pulled (llama3.1:8b, llama3.2:3b, qwen2.5:7b, etc.)
4. **✅ API Testing**: Chat endpoint working with JSON format
5. **✅ Environment Setup**: Ollama configuration added to `.env.local`
6. **✅ Script Integration**: Fix script successfully runs with Ollama
7. **✅ JSON Parsing Fixed**: Script now properly handles Ollama's streaming JSON responses

**Current Configuration:**
- Model: `llama3.1:8b` (recommended for quality)
- Base URL: `http://localhost:11434`
- Provider: `ollama`

**Script Usage:**
```bash
# Dry run (recommended first)
OLLAMA_MODEL=llama3.1:8b npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts

# Apply changes
OLLAMA_MODEL=llama3.1:8b npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts --apply

# Small test run
LIMIT_PAIRS=2 LIMIT_GROUPS=2 OLLAMA_MODEL=llama3.1:8b npx tsx --env-file=.env.local scripts/fix-duplicates-from-report.ts --apply
```

**Technical Fixes Applied:**
- Fixed Ollama streaming JSON response parsing
- Added fallback for incomplete option generation
- Improved prompts for better 4-option compliance
