# Public Information Officer Builder (Local-Only Web App)

A privacy-focused, offline web tool that generates Civil Air Patrol-themed Public Information Officer training scenarios from user parameters, with randomized objectives, injects, and scenario variables for variety across runs.

## Privacy & Local-Only Design
- Runs entirely locally in your browser.
- No network/API calls.
- No automatic persistence of prompts, user input, or generated scenarios.
- Scenario data remains in memory and can be cleared at any time; closing/reloading the tab clears runtime state.

## Included CAP Mission Themes
- Mission base operations
- Search and rescue
- Disaster relief
- Public affairs
- Cadet activity support

## Inputs Supported
- CAP mission focus
- Audience
- Duration
- Difficulty
- Objectives
- Setting
- Number of participants
- Constraints

## Output Package
- Scenario title
- Overview
- Training objectives
- Participant roles
- Timeline
- Scenario variables
- Injects/events
- Expected participant actions
- Facilitator notes
- Evaluation rubric
- After-action review questions

## Run Locally
Open `index.html` directly in your browser:

```bash
xdg-open index.html
```

Or use any local static file server if preferred.

## Export
- Markdown: direct download
- DOCX-compatible export: Word-readable `.doc` download
- PDF: browser print-to-PDF flow

A preview is always shown before export.
