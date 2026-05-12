# Training Scenario Builder (Local-Only Web App)

A privacy-focused, offline web tool that generates structured training scenarios from user parameters.

## Privacy & Local-Only Design
- Runs entirely locally in your browser.
- No network/API calls.
- No automatic persistence of prompts, user input, or generated scenarios.
- Scenario data remains in memory and can be cleared at any time; closing/reloading the tab clears runtime state.

## Included Templates
- Emergency services
- Public affairs
- Leadership
- Communications
- Tabletop

## Inputs Supported
- Training type
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
