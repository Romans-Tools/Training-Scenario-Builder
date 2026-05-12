const templates = {
  "emergency services": {
    objectives: [
      "Demonstrate incident command structure activation.",
      "Coordinate interagency communication under pressure.",
      "Apply responder safety and triage priorities."
    ],
    injects: [
      "Conflicting radio traffic causes delayed dispatch updates.",
      "A secondary hazard emerges near the incident perimeter.",
      "A critical resource request exceeds current availability."
    ]
  },
  "public affairs": {
    objectives: [
      "Deliver clear, accurate, and timely public messaging.",
      "Counter misinformation while maintaining credibility.",
      "Coordinate messaging across partner organizations."
    ],
    injects: [
      "A viral social post alleges inaccurate casualty numbers.",
      "A reporter requests an immediate live interview.",
      "An internal memo is leaked and interpreted out of context."
    ]
  },
  leadership: {
    objectives: [
      "Make time-sensitive decisions with incomplete information.",
      "Align team actions to strategic intent.",
      "Balance risk, ethics, and mission outcomes."
    ],
    injects: [
      "Two senior staff provide conflicting recommendations.",
      "A high-impact decision must be made within 15 minutes.",
      "Team morale declines after a visible setback."
    ]
  },
  communications: {
    objectives: [
      "Use established communication protocols effectively.",
      "Maintain message discipline across channels.",
      "Escalate critical information through proper pathways."
    ],
    injects: [
      "Primary communication channel fails unexpectedly.",
      "A stakeholder receives contradictory instructions.",
      "A key update is delayed due to approval bottlenecks."
    ]
  },
  tabletop: {
    objectives: [
      "Validate plans, policies, and decision pathways.",
      "Identify coordination gaps and ambiguous responsibilities.",
      "Build shared understanding of response priorities."
    ],
    injects: [
      "An assumption in the written plan proves invalid.",
      "A partner agency cannot meet its planned timeline.",
      "A legal/policy constraint affects response options."
    ]
  }
};

let currentScenario = null;

const form = document.getElementById("scenario-form");
const previewEl = document.getElementById("preview");
const clearBtn = document.getElementById("clearBtn");
const exportMdBtn = document.getElementById("exportMd");
const exportDocxBtn = document.getElementById("exportDocx");
const exportPdfBtn = document.getElementById("exportPdf");

function parseCSV(value) {
  return value.split(",").map(v => v.trim()).filter(Boolean);
}

function buildScenario(input) {
  const template = templates[input.trainingType] || templates.tabletop;
  const objectives = input.objectives.length ? input.objectives : template.objectives;
  const roleCount = Math.min(Math.max(input.participants, 4), 10);

  const timeline = Array.from({ length: 5 }, (_, i) => {
    const hour = 9 + Math.floor((i * Math.max(10, Math.floor(input.duration / 5))) / 60);
    const minute = (i * Math.max(10, Math.floor(input.duration / 5))) % 60;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} - Phase ${i + 1}`;
  });

  return {
    title: `${capitalize(input.trainingType)} Scenario: ${capitalize(input.difficulty)} ${input.setting} Coordination Exercise`,
    overview: `A ${input.duration}-minute ${input.trainingType} exercise for ${input.audience} in a ${input.setting} setting at ${input.difficulty} difficulty.`,
    trainingObjectives: objectives,
    participantRoles: Array.from({ length: roleCount }, (_, i) => `Role ${i + 1}: ${i === 0 ? "Facilitator Liaison" : "Participant Lead"}`),
    timeline,
    injectsEvents: template.injects.concat(input.constraints.slice(0, 2).map(c => `Constraint pressure: ${c}.`)),
    expectedActions: [
      "Establish clear command/decision roles within first phase.",
      "Produce a shared action plan with owner and deadline for each task.",
      "Communicate status updates at defined intervals.",
      "Document assumptions, risks, and mitigation actions."
    ],
    facilitatorNotes: [
      "Escalate complexity only after participants demonstrate baseline coordination.",
      "Observe decision rationale, not only outcomes.",
      "Capture notable communication failures and recoveries for debrief."
    ],
    evaluationRubric: [
      "Command & Coordination (1-5): role clarity, alignment, control.",
      "Communication Quality (1-5): timeliness, accuracy, consistency.",
      "Decision-Making (1-5): risk balance, prioritization, adaptability.",
      "Execution (1-5): task completion, accountability, follow-through."
    ],
    aarQuestions: [
      "What signals were recognized early, late, or missed?",
      "Which decisions had the greatest downstream impact?",
      "Where did communication break down and why?",
      "What plan, policy, or training updates should be made?",
      "What should be sustained, improved, and stopped?"
    ]
  };
}

function section(title, items) {
  return `## ${title}\n${items.map(i => `- ${i}`).join("\n")}`;
}

function toMarkdown(s) {
  return [
    `# ${s.title}`,
    `## Overview\n${s.overview}`,
    section("Training Objectives", s.trainingObjectives),
    section("Participant Roles", s.participantRoles),
    section("Timeline", s.timeline),
    section("Injects/Events", s.injectsEvents),
    section("Expected Participant Actions", s.expectedActions),
    section("Facilitator Notes", s.facilitatorNotes),
    section("Evaluation Rubric", s.evaluationRubric),
    section("After-Action Review Questions", s.aarQuestions)
  ].join("\n\n");
}

function renderPreview(s) {
  previewEl.classList.remove("empty");
  previewEl.textContent = toMarkdown(s);
}

function download(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function enableExports(enabled) {
  [exportMdBtn, exportDocxBtn, exportPdfBtn].forEach(btn => (btn.disabled = !enabled));
}

function capitalize(v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = {
    trainingType: document.getElementById("trainingType").value,
    audience: document.getElementById("audience").value.trim(),
    duration: Number(document.getElementById("duration").value),
    difficulty: document.getElementById("difficulty").value,
    setting: document.getElementById("setting").value.trim(),
    participants: Number(document.getElementById("participants").value),
    objectives: parseCSV(document.getElementById("objectives").value),
    constraints: parseCSV(document.getElementById("constraints").value)
  };

  currentScenario = buildScenario(input);
  renderPreview(currentScenario);
  enableExports(true);
});

clearBtn.addEventListener("click", () => {
  currentScenario = null;
  previewEl.classList.add("empty");
  previewEl.textContent = "No scenario generated yet.";
  enableExports(false);
});

exportMdBtn.addEventListener("click", () => {
  if (!currentScenario) return;
  download("scenario.md", toMarkdown(currentScenario), "text/markdown;charset=utf-8");
});

exportDocxBtn.addEventListener("click", () => {
  if (!currentScenario) return;
  const content = "This export is provided as a Word-readable .doc file for offline use.\n\n" + toMarkdown(currentScenario);
  download("scenario.doc", content, "application/msword");
});

exportPdfBtn.addEventListener("click", () => {
  if (!currentScenario) return;
  const printable = window.open("", "_blank");
  printable.document.write(`<pre>${toMarkdown(currentScenario).replace(/</g, "&lt;")}</pre>`);
  printable.document.close();
  printable.focus();
  printable.print();
});

window.addEventListener("beforeunload", () => {
  currentScenario = null;
});
