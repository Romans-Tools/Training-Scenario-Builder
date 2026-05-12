const templates = {
  "mission base operations": {
    objectives: [
      "Establish Civil Air Patrol incident support workflows using ICS structure.",
      "Synchronize aircrew, ground team, and mission staff communications.",
      "Prioritize safety, accountability, and sortie readiness under time pressure."
    ],
    injects: [
      "Weather shifts force rapid sortie replanning and crew brief updates.",
      "An overdue aircraft report requires immediate mission base coordination.",
      "Fuel and vehicle availability constraints impact launch timelines."
    ]
  },
  "search and rescue": {
    objectives: [
      "Coordinate CAP air and ground assets for time-critical search coverage.",
      "Use standardized mission documentation and resource tracking.",
      "Integrate partner-agency updates into operational decisions."
    ],
    injects: [
      "ELT signal quality fluctuates and creates conflicting search vectors.",
      "A ground team requests medevac support from a remote trailhead.",
      "Airspace restrictions suddenly reduce available search sectors."
    ]
  },
  "disaster relief": {
    objectives: [
      "Plan CAP support for post-disaster assessment and logistics coordination.",
      "Manage tasking priorities from emergency management partners.",
      "Maintain mission continuity while protecting volunteer endurance."
    ],
    injects: [
      "A storm-damaged comm relay degrades mission base connectivity.",
      "A shelter location needs urgent aerial imagery verification.",
      "Competing task requests exceed available qualified crews."
    ]
  },
  "public affairs": {
    objectives: [
      "Deliver timely, accurate CAP mission updates to the public and media.",
      "Protect operational security while maintaining transparency and trust.",
      "Coordinate unified messaging with incident command and partner agencies."
    ],
    injects: [
      "A viral post misidentifies CAP activity as unauthorized flight operations.",
      "A local station requests a live briefing before facts are fully confirmed.",
      "Family members post conflicting details about missing-person status online."
    ]
  },
  "cadet activity support": {
    objectives: [
      "Apply CAP safety and supervision standards during high-visibility events.",
      "Coordinate logistics and communications across senior and cadet staff.",
      "Respond to emerging issues while preserving training objectives."
    ],
    injects: [
      "Transportation delays threaten the event start timeline.",
      "A heat advisory requires immediate risk-control adjustments.",
      "Parents and community members request simultaneous status updates."
    ]
  }
};

const variablePools = {
  operationalPeriods: ["morning", "afternoon", "evening", "overnight"],
  weatherStates: ["VFR with increasing winds", "IFR ceilings", "thunderstorm watch", "extreme heat advisory"],
  mediaPressure: ["low", "moderate", "high", "intense"],
  commsStatus: ["stable", "degraded repeater coverage", "intermittent data loss", "primary channel outage"],
  partnerCadence: ["hourly county EOC calls", "30-minute unified command sync", "ad hoc agency updates", "joint information center rhythm"]
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

function pickRandom(items, count = 1) {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function buildScenario(input) {
  const template = templates[input.trainingType] || templates["mission base operations"];
  const objectives = input.objectives.length ? input.objectives : pickRandom(template.objectives, 3);
  const roleCount = Math.min(Math.max(input.participants, 4), 10);
  const selectedInjects = pickRandom(template.injects, 3);
  const variables = {
    operationalPeriod: pickRandom(variablePools.operationalPeriods)[0],
    weather: pickRandom(variablePools.weatherStates)[0],
    mediaPressure: pickRandom(variablePools.mediaPressure)[0],
    comms: pickRandom(variablePools.commsStatus)[0],
    partnerCadence: pickRandom(variablePools.partnerCadence)[0]
  };

  const timeline = Array.from({ length: 6 }, (_, i) => {
    const hour = 9 + Math.floor((i * Math.max(10, Math.floor(input.duration / 5))) / 60);
    const minute = (i * Math.max(10, Math.floor(input.duration / 5))) % 60;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} - Phase ${i + 1}`;
  });

  return {
    title: `Public Information Officer Scenario: ${capitalize(input.difficulty)} ${input.setting} ${capitalize(input.trainingType)} Exercise`,
    overview: `A ${input.duration}-minute Civil Air Patrol ${input.trainingType} exercise for ${input.audience} in a ${input.setting} setting at ${input.difficulty} difficulty.`,
    trainingObjectives: objectives,
    participantRoles: Array.from({ length: roleCount }, (_, i) => `Role ${i + 1}: ${i === 0 ? "Public Information Officer" : "Mission Staff Participant"}`),
    timeline,
    scenarioVariables: [
      `Operational period: ${variables.operationalPeriod}.`,
      `Weather factor: ${variables.weather}.`,
      `Media pressure: ${variables.mediaPressure}.`,
      `Communications status: ${variables.comms}.`,
      `Partner coordination cadence: ${variables.partnerCadence}.`
    ],
    injectsEvents: selectedInjects.concat(input.constraints.slice(0, 2).map(c => `Constraint pressure: ${c}.`)),
    expectedActions: [
      "Establish PIO battle rhythm with mission base leadership in first phase.",
      "Draft and deliver synchronized internal and external updates.",
      "Track approvals and release authoritative messaging at set intervals.",
      "Document rumor-control actions, media queries, and disposition outcomes.",
      "Update the public narrative whenever operational facts materially change."
    ],
    facilitatorNotes: [
      "Introduce pressure through simultaneous operational and media demands.",
      "Evaluate factual accuracy, timeliness, and tone of each message product.",
      "Capture lessons on CAP brand protection and interagency coordination."
    ],
    evaluationRubric: [
      "Operational Awareness (1-5): mission understanding and fact validation.",
      "Public Messaging (1-5): clarity, consistency, and confidence.",
      "Coordination (1-5): alignment with IC, operations, and partners.",
      "Execution (1-5): deadlines met, products delivered, corrective actions."
    ],
    aarQuestions: [
      "Which information flows enabled timely public updates?",
      "Where did approval or coordination bottlenecks appear?",
      "How effectively were misinformation and rumor risks addressed?",
      "What PIO playbook updates should be made for future CAP responses?",
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
    section("Scenario Variables", s.scenarioVariables),
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
