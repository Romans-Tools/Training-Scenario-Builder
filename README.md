# Training Scenario Builder (Local-Only)

A privacy-focused, offline CLI tool to generate structured training scenarios from user parameters.

## Privacy & Local-Only Design
- Runs entirely on your local machine.
- No network calls.
- Does not save prompts, scenario content, or user input unless you explicitly export.
- Keeps working data in memory and clears it on process exit.

## Inputs Supported
- Training type (templates included):
  - emergency services
  - public affairs
  - leadership
  - communications
  - tabletop
- Audience
- Duration
- Difficulty
- Objectives
- Setting
- Number of participants
- Constraints

## Output Package Includes
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

## Usage
```bash
python3 scenario_builder.py
```

You will be shown a preview before export.

## Export Formats
- Markdown (`.md`) built-in
- PDF (`.pdf`) via `reportlab`
- DOCX (`.docx`) via `python-docx`

Install optional export dependencies:
```bash
pip install -r requirements.txt
```

If optional libraries are missing, the tool remains fully functional for generation and Markdown export.
