#!/bin/bash

# Fix British to US English Spelling
# 
# What: Converts British English spellings to US English throughout the codebase
# Why: Maintain consistent US English for wider audience support
# 
# Usage: bash scripts/fix-british-to-us-english.sh

echo "🇺🇸 Converting British English to US English..."
echo ""

# Counter for changes
CHANGES=0

# Function to replace in files (excluding node_modules, .next, .git)
replace_in_files() {
  local british="$1"
  local american="$2"
  local file_pattern="$3"
  
  echo "📝 Fixing: $british → $american"
  
  # Find and replace (case-sensitive)
  if command -v rg &> /dev/null; then
    # Use ripgrep if available (faster)
    FILES=$(rg -l "$british" --type-add 'source:*.{ts,tsx,js,jsx,md,json}' -tsource --glob '!node_modules' --glob '!.next' --glob '!.git' --glob '!package-lock.json' 2>/dev/null || true)
    if [ -n "$FILES" ]; then
      echo "$FILES" | while read -r file; do
        if [ -f "$file" ]; then
          sed -i "s/$british/$american/g" "$file" 2>/dev/null && CHANGES=$((CHANGES + 1))
        fi
      done
    fi
  else
    # Fallback to find + grep
    find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.json" \) \
      ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/.git/*" ! -name "package-lock.json" \
      -exec grep -l "$british" {} \; 2>/dev/null | while read -r file; do
        sed -i "s/$british/$american/g" "$file" 2>/dev/null && CHANGES=$((CHANGES + 1))
      done
  fi
}

# British → US English conversions
# -ise → -ize endings
replace_in_files "organise" "organize"
replace_in_files "Organise" "Organize"
replace_in_files "organised" "organized"
replace_in_files "Organised" "Organized"
replace_in_files "organising" "organizing"
replace_in_files "Organising" "Organizing"
replace_in_files "organisation" "organization"
replace_in_files "Organisation" "Organization"

replace_in_files "recognise" "recognize"
replace_in_files "Recognise" "Recognize"
replace_in_files "recognised" "recognized"
replace_in_files "Recognised" "Recognized"
replace_in_files "recognising" "recognizing"

replace_in_files "realise" "realize"
replace_in_files "Realise" "Realize"
replace_in_files "realised" "realized"
replace_in_files "Realised" "Realized"
replace_in_files "realising" "realizing"

replace_in_files "standardise" "standardize"
replace_in_files "Standardise" "Standardize"
replace_in_files "standardised" "standardized"
replace_in_files "standardising" "standardizing"

replace_in_files "optimise" "optimize"
replace_in_files "Optimise" "Optimize"
replace_in_files "optimised" "optimized"
replace_in_files "optimising" "optimizing"

replace_in_files "customise" "customize"
replace_in_files "Customise" "Customize"
replace_in_files "customised" "customized"
replace_in_files "customising" "customizing"

replace_in_files "visualise" "visualize"
replace_in_files "Visualise" "Visualize"
replace_in_files "visualised" "visualized"
replace_in_files "visualising" "visualizing"

replace_in_files "synchronise" "synchronize"
replace_in_files "Synchronise" "Synchronize"
replace_in_files "synchronised" "synchronized"
replace_in_files "synchronising" "synchronizing"

replace_in_files "prioritise" "prioritize"
replace_in_files "Prioritise" "Prioritize"
replace_in_files "prioritised" "prioritized"
replace_in_files "prioritising" "prioritizing"

replace_in_files "categorise" "categorize"
replace_in_files "Categorise" "Categorize"
replace_in_files "categorised" "categorized"
replace_in_files "categorising" "categorizing"

replace_in_files "minimise" "minimize"
replace_in_files "Minimise" "Minimize"
replace_in_files "minimised" "minimized"
replace_in_files "minimising" "minimizing"

replace_in_files "maximise" "maximize"
replace_in_files "Maximise" "Maximize"
replace_in_files "maximised" "maximized"
replace_in_files "maximising" "maximizing"

replace_in_files "analyse" "analyze"
replace_in_files "Analyse" "Analyze"
replace_in_files "analysed" "analyzed"
replace_in_files "analysing" "analyzing"
replace_in_files "analyser" "analyzer"

# -our → -or endings
replace_in_files "colour" "color"
replace_in_files "Colour" "Color"
replace_in_files "coloured" "colored"
replace_in_files "colouring" "coloring"

replace_in_files "favour" "favor"
replace_in_files "Favour" "Favor"
replace_in_files "favoured" "favored"
replace_in_files "favouring" "favoring"
replace_in_files "favourite" "favorite"
replace_in_files "Favourite" "Favorite"

replace_in_files "behaviour" "behavior"
replace_in_files "Behaviour" "Behavior"
replace_in_files "behavioural" "behavioral"

# -re → -er endings
replace_in_files "centre" "center"
replace_in_files "Centre" "Center"
replace_in_files "centred" "centered"
replace_in_files "centring" "centering"

replace_in_files "metre" "meter"
replace_in_files "Metre" "Meter"
replace_in_files "metres" "meters"

# -ence → -ense
replace_in_files "defence" "defense"
replace_in_files "Defence" "Defense"
replace_in_files "licence" "license"
replace_in_files "Licence" "License"

# Other common differences
replace_in_files "grey" "gray"
replace_in_files "Grey" "Gray"

echo ""
echo "✅ Conversion complete!"
echo "📊 Modified approximately $CHANGES file instances"
echo ""
echo "⚠️  Note: Review git diff before committing"
echo "   Some technical terms or proper nouns may need reverting"
