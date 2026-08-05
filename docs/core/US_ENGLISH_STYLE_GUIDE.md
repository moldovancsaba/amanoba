# US English Style Guide

**What**: Reference guide for consistent US English spelling and usage  
**Why**: Support wider audiences and maintain professional consistency  
**Status**: ✅ Active (enforced 2026-08-05)

---

## Overview

Amanoba uses **US English** (American English) for all:
- User-facing content (UI, courses, emails)
- Documentation (developer docs, READMEs)
- Code comments
- API messages and error texts
- Marketing materials

**Reason**: US English is more widely understood globally and is the dominant standard in the international tech industry.

---

## Common US vs British Spelling Differences

### -ize vs -ise endings

| ❌ British | ✅ US English |
|-----------|--------------|
| organise | organize |
| recognise | recognize |
| realise | realize |
| standardise | standardize |
| optimise | optimize |
| customise | customize |
| visualise | visualize |
| synchronise | synchronize |
| prioritise | prioritize |
| categorise | categorize |
| minimise | minimize |
| maximise | maximize |
| analyse | analyze |

### -our vs -or endings

| ❌ British | ✅ US English |
|-----------|--------------|
| colour | color |
| favour | favor |
| behaviour | behavior |
| neighbour | neighbor |
| honour | honor |
| labour | labor |
| flavour | flavor |

### -re vs -er endings

| ❌ British | ✅ US English |
|-----------|--------------|
| centre | center |
| metre | meter |
| fibre | fiber |
| theatre | theater |

### -ence vs -ense

| ❌ British | ✅ US English |
|-----------|--------------|
| defence | defense |
| licence (noun) | license (noun & verb) |
| offence | offense |
| pretence | pretense |

### Other Common Differences

| ❌ British | ✅ US English |
|-----------|--------------|
| grey | gray |
| programme | program |
| catalogue | catalog |
| dialogue | dialog (in UI/tech) |
| travelled | traveled |
| modelling | modeling |
| labelling | labeling |
| cancelled | canceled* |

\* **Note**: "cancelled" with double-L is acceptable in US English and commonly used. Both forms are allowed in Amanoba code.

---

## Exceptions

### Technical Terms

Some technical terms maintain their original spelling regardless of region:

- **"enum"** not "enumerate" (programming term)
- **"color-tokens"** in CSS/design systems
- **"center-align"** in layout contexts

### Proper Nouns and Brands

Always use the official spelling:

- **"Vercel"** (company name)
- **"GitHub"** (not "Github")
- **"TypeScript"** (not "Typescript")
- **"MongoDB"** (not "Mongo DB")
- **"Organisation" in company names** (e.g., "World Health Organisation" if that's their official name)

### Non-English Content

When content is in other languages (Hungarian, Spanish, etc.), use the correct spelling for that language:

```typescript
// English (US)
const message = "Please organize your files";

// Hungarian
const uzenet = "Kérjük, organisztálja a fájljait"; // Uses Hungarian spelling
```

---

## Automated Checking

### Script: fix-british-to-us-english.sh

**Location**: `/workspace/scripts/fix-british-to-us-english.sh`

**Usage**:
```bash
bash scripts/fix-british-to-us-english.sh
```

**What it does**:
- Scans all `.ts`, `.tsx`, `.js`, `.jsx`, `.md`, `.json` files
- Replaces British spellings with US equivalents
- Excludes `node_modules`, `.next`, `.git`, `package-lock.json`
- Reports number of changes made

**When to run**:
- After adding new content or documentation
- When importing external content
- Quarterly as a maintenance check
- Before major releases

### ESLint Integration (Future)

Consider adding ESLint rules for US English enforcement:

```json
{
  "rules": {
    "spellcheck/spell-checker": ["warn", {
      "skipWords": [
        "analyze", "organize", "realize", "color", "center", "license"
      ],
      "minLength": 4
    }]
  }
}
```

---

## Writing Guidelines

### For Developers

**Code Comments**:
```typescript
// ✅ Good (US English)
// Analyze user behavior and optimize performance
function analyzeAndOptimize() {
  // Center the modal on screen
  return { color: 'gray', textAlign: 'center' };
}

// ❌ Bad (British English)
// Analyse user behaviour and optimise performance
function analyseAndOptimise() {
  // Centre the modal on screen
  return { colour: 'grey', textAlign: 'centre' };
}
```

**Variable Names**:
```typescript
// ✅ US English
const colorPalette = ['red', 'blue', 'gray'];
const analyzeResults = () => { /* ... */ };
const isOrganized = true;

// ❌ British English
const colourPalette = ['red', 'blue', 'grey'];
const analyseResults = () => { /* ... */ };
const isOrganised = true;
```

### For Content Creators

**Course Content**:
```markdown
✅ Correct (US English):
# Lesson 1: Organize Your Learning

Learn how to analyze your goals and optimize your study habits. 
We'll help you recognize patterns in your behavior and realize your potential.

❌ Incorrect (British English):
# Lesson 1: Organise Your Learning

Learn how to analyse your goals and optimise your study habits.
We'll help you recognise patterns in your behaviour and realise your potential.
```

**UI Text**:
```typescript
// ✅ US English
const messages = {
  organizeFolders: "Organize your folders",
  colorScheme: "Choose a color scheme",
  centerText: "Center the text",
  analyze: "Analyze results",
};

// ❌ British English
const messages = {
  organizeFolders: "Organise your folders",
  colorScheme: "Choose a colour scheme",
  centerText: "Centre the text",
  analyze: "Analyse results",
};
```

### For Documentation

**README, Guides, Handovers**:
- Use US spellings consistently
- Technical terms: US convention
- Examples: US spellings
- URLs/slugs: Use hyphens, US spellings

```markdown
✅ Example (US English):
## How to Organize Your Code

To optimize performance, analyze the data and customize the settings.
Use the color picker to select your favorite color.

❌ Example (British English):
## How to Organise Your Code

To optimise performance, analyse the data and customise the settings.
Use the colour picker to select your favourite colour.
```

---

## Quick Reference Table

### Most Common Terms in Amanoba

| Context | ❌ British | ✅ US English |
|---------|-----------|--------------|
| **User actions** | organise files | organize files |
| **AI/ML** | analyse data | analyze data |
| **Design** | colour scheme | color scheme |
| **UI Layout** | centre element | center element |
| **Settings** | customise app | customize app |
| **Performance** | optimise speed | optimize speed |
| **Features** | prioritise tasks | prioritize tasks |
| **Data** | categorise items | categorize items |
| **User behavior** | recognise patterns | recognize patterns |
| **Goals** | realise potential | realize potential |

---

## Review Checklist

Before committing new content, check:

- [ ] All -ise endings changed to -ize
- [ ] All -our endings changed to -or
- [ ] All -re endings changed to -er (centre → center)
- [ ] "grey" changed to "gray"
- [ ] "licence" (noun) changed to "license"
- [ ] "defence" changed to "defense"
- [ ] Code comments use US English
- [ ] UI strings use US English
- [ ] Documentation uses US English
- [ ] Variable names use US spellings
- [ ] No British spellings in user-facing content

---

## Tools & Resources

### Automated Tools

1. **Conversion Script**: `scripts/fix-british-to-us-english.sh`
2. **Grep Search**: `rg "organise|colour|centre" --type ts`
3. **Git Hooks** (future): Pre-commit hook to check spellings

### Manual Review

1. **Online Tools**:
   - Grammarly (set to US English)
   - Hemingway Editor
   - LanguageTool (US English mode)

2. **Browser Extensions**:
   - Grammarly extension (US English)
   - LanguageTool extension

3. **IDE Plugins**:
   - VS Code: "Code Spell Checker" (set to US English)
   - VS Code: "Grammarly" (set to US English)

### Reference Resources

- **Merriam-Webster** (US dictionary): https://www.merriam-webster.com/
- **AP Stylebook** (US journalism standard)
- **Chicago Manual of Style** (US academic/business standard)
- **Microsoft Writing Style Guide** (tech industry US standard)

---

## Migration History

**2026-08-05**: Converted entire codebase from mixed British/US to consistent US English
- Files affected: 35+ files
- Types: Code, documentation, UI content
- Script created: `fix-british-to-us-english.sh`
- Changes:
  - organization (not organisation)
  - recognize (not recognise)
  - realize (not realise)
  - analyze (not analyse)
  - color (not colour)
  - center (not centre)
  - license (not licence)
  - gray (not grey)

---

## Enforcement

### New Content

All new content must use US English:
- ✅ Enforced: PR reviews check spelling
- ✅ Automated: Conversion script in CI (future)
- ✅ Documentation: This guide as reference

### Existing Content

Legacy content is gradually updated:
- 🔄 On-demand: When editing files
- 🔄 Bulk updates: Quarterly maintenance
- 🔄 Course content: During content refresh

### Violations

If British spelling is found:
1. **Non-blocking**: Won't prevent merge
2. **Flagged**: Noted in PR review
3. **Fixed**: Either immediately or in follow-up PR

---

## FAQ

**Q: What about "cancelled" with two L's?**  
A: Both "canceled" and "cancelled" are acceptable in US English. We allow "cancelled" as it's common in programming (e.g., `status: 'cancelled'`).

**Q: What if I'm not sure about a spelling?**  
A: Check Merriam-Webster (US dictionary). If unsure, use the -ize/-or/-er endings.

**Q: What about quoted text from external sources?**  
A: Preserve original spelling in direct quotes, but use US English in your own text.

**Q: Do we convert historical documents?**  
A: Archive documents (under `docs/_archive/`) can retain their original spelling. Active documents should be updated.

**Q: What about course content in other languages?**  
A: Use proper spelling for that language. This guide applies only to English content.

**Q: Can I use British English in personal comments?**  
A: Code comments should use US English for consistency. Personal notes/TODOs can be informal but prefer US English.

---

**Last Updated**: 2026-08-05  
**Maintained By**: Development Team  
**Related**: `CODING_STANDARDS.md`, `CONTENT_CREATION_WORKFLOW.md`
