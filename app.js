const STORAGE_KEY = "hrc-strategy-playtest-config-v1";
const TEAM_STORAGE_KEY = "construction-site-team-v1";
const BACKEND_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"; // TODO: paste your Google Apps Script Web App URL here
const budgetLimit = 80;
const maxVariants = 3;
const SIMULATION_TICK_MS = 140;

const taskDefinitions = [
  { id: "collecting", name: "Material Sourcing", note: "Gather construction materials and prefabricated elements." },
  { id: "moving", name: "Transporting", note: "Move components to the work zone efficiently and safely." },
  { id: "positioning", name: "Aligning", note: "Align parts before fastening and inspection." },
  { id: "mounting", name: "Securing", note: "Secure assemblies and finish structure connections." },
];

const defaultConfig = {
  taskLabels: {
    collecting: { name: "Material Sourcing", note: "Gather construction materials and prefabricated elements." },
    moving: { name: "Transporting", note: "Move components to the work zone efficiently and safely." },
    positioning: { name: "Aligning", note: "Align parts before fastening and inspection." },
    mounting: { name: "Securing", note: "Secure assemblies and finish structure connections." },
  },
  uiText: {
    modePlay: "Workshop Mode",
    modeSetup: "Setup Mode",
    step1: "Round 1",
    step2: "Round 2",
    step3: "Summary",
    chooseStrategy: "Choose Team",
    availableCrew: "Available Crew",
    coverEveryTask: "Cover Every Task",
    reviewOutcome: "Review Outcome",
    crewView: "Crew View",
    variants: "Team Assessments",
    saveAndCompare: "Save and Compare Team Plans",
    saveCurrentVariant: "Save Current Team",
    resetSetup: "Reset Layout",
    runSimulation: "Run Site Flow",
    resetFlow: "Reset Flow",
    incoming: "Incoming",
    completed: "Completed",
    noCrew: "No crew",
    noBlocks: "No blocks",
    dragCrewHere: "Drag crew here",
    crewAssigned: "crew assigned.",
    station: "Zone",
    socketsRule1: "Task sockets accept one crew unit",
    socketsRule2: "Multi-task robots span adjacent zones",
    socketsRule3: "Human-only coverage requires Skilled Foreman",
    weighting: "Weighting",
    formula: "Formula",
    efficiency: "Productivity",
    safety: "Safety",
    manualReduction: "Effort Reduction",
    manualWorkReduced: "Manual Work Reduced",
    budget: "Budget",
    strategy: "Team",
    score: "Score",
    predictedFinalScore: "Predicted Score",
    weightedPerformance: "Weighted Performance",
    strategyFitBonus: "Strategy Fit",
    budgetPenalty: "Budget Penalty",
    robotCount: "Robots",
    base: "Base",
    cost: "Cost",
    qty: "Qty",
    edit: "Edit",
    fitHumans: "Human Share",
    fitRobots: "Robot Share",
    finalRewardFormula: "Scoring Formula",
    saveSetup: "Save Setup",
    resetConfig: "Reset Config",
    generalistSupport: "Crew Support",
    on: "On",
    off: "Off",
    addGeneralist: "Add Support",
    removeSupport: "Remove Support",
    clear: "Clear",
    setupPanelTitle: "Configure the construction scenario",
    targetCapacity: "Capacity Target",
    operationalSafety: "Operational Safety",
    manualEffort: "Manual Effort",
    oversight: "Human Oversight",
    pass: "Pass",
    fail: "Fail",
    round1: "Round 1 Checks",
    round2: "Round 2 Checks",
    robotShare: "Robot Capacity Share",
    budgetStatus: "Budget Status",
  },
  weights: {
    efficiency: 0.3,
    safety: 0.4,
    manualReduction: 0.3,
  },
  rewardFormula:
    "Math.max(0, Math.round(performanceScore + strategyBonus - budgetPenalty))",
  workerCatalog: {
    generalist_human: {
      id: "generalist_human",
      name: "Site Assistant",
      type: "Human",
      cost: 8,
      mode: "single",
      allowedTasks: taskDefinitions.map((task) => task.id),
      efficiency: { collecting: 62, moving: 56, positioning: 58, mounting: 60 },
      safety: { collecting: 82, moving: 78, positioning: 76, mounting: 77 },
      manualReduction: { collecting: 4, moving: 3, positioning: 2, mounting: 2 },
      canSoloTask: false,
    },
    skilled_human: {
      id: "skilled_human",
      name: "Skilled Foreman",
      type: "Human",
      cost: 13,
      mode: "single",
      allowedTasks: taskDefinitions.map((task) => task.id),
      efficiency: { collecting: 58, moving: 55, positioning: 74, mounting: 89 },
      safety: { collecting: 84, moving: 80, positioning: 84, mounting: 88 },
      manualReduction: { collecting: 5, moving: 4, positioning: 6, mounting: 7 },
      canSoloTask: true,
    },
    robot_collect: {
      id: "robot_collect",
      name: "Material Handler",
      type: "Robot",
      cost: 12,
      mode: "single",
      allowedTasks: ["collecting"],
      efficiency: { collecting: 84, moving: 0, positioning: 0, mounting: 0 },
      safety: { collecting: 66, moving: 0, positioning: 0, mounting: 0 },
      manualReduction: { collecting: 18, moving: 0, positioning: 0, mounting: 0 },
      canSoloTask: true,
    },
    robot_move: {
      id: "robot_move",
      name: "Transport Drone",
      type: "Robot",
      cost: 14,
      mode: "single",
      allowedTasks: ["moving"],
      efficiency: { collecting: 0, moving: 88, positioning: 0, mounting: 0 },
      safety: { collecting: 0, moving: 64, positioning: 0, mounting: 0 },
      manualReduction: { collecting: 0, moving: 26, positioning: 0, mounting: 0 },
      canSoloTask: true,
    },
    robot_position: {
      id: "robot_position",
      name: "Alignment Drone",
      type: "Robot",
      cost: 18,
      mode: "single",
      allowedTasks: ["positioning"],
      efficiency: { collecting: 0, moving: 0, positioning: 90, mounting: 0 },
      safety: { collecting: 0, moving: 0, positioning: 68, mounting: 0 },
      manualReduction: { collecting: 0, moving: 0, positioning: 24, mounting: 0 },
      canSoloTask: true,
    },
    robot_mount: {
      id: "robot_mount",
      name: "Assembly Drone",
      type: "Robot",
      cost: 17,
      mode: "single",
      allowedTasks: ["mounting"],
      efficiency: { collecting: 0, moving: 0, positioning: 0, mounting: 81 },
      safety: { collecting: 0, moving: 0, positioning: 0, mounting: 60 },
      manualReduction: { collecting: 0, moving: 0, positioning: 0, mounting: 22 },
      canSoloTask: true,
    },
    robot_pair_cm: {
      id: "robot_pair_cm",
      name: "Collect+Move Cobot",
      type: "Robot",
      cost: 20,
      mode: "fixed",
      coverage: ["collecting", "moving"],
      efficiency: { collecting: 78, moving: 82, positioning: 0, mounting: 0 },
      safety: { collecting: 65, moving: 66, positioning: 0, mounting: 0 },
      manualReduction: { collecting: 16, moving: 22, positioning: 0, mounting: 0 },
      canSoloTask: true,
    },
    robot_pair_mp: {
      id: "robot_pair_mp",
      name: "Move+Position Cobot",
      type: "Robot",
      cost: 24,
      mode: "fixed",
      coverage: ["moving", "positioning"],
      efficiency: { collecting: 0, moving: 76, positioning: 86, mounting: 0 },
      safety: { collecting: 0, moving: 63, positioning: 68, mounting: 0 },
      manualReduction: { collecting: 0, moving: 18, positioning: 24, mounting: 0 },
      canSoloTask: true,
    },
    robot_pair_pm: {
      id: "robot_pair_pm",
      name: "Position+Mount Cobot",
      type: "Robot",
      cost: 25,
      mode: "fixed",
      coverage: ["positioning", "mounting"],
      efficiency: { collecting: 0, moving: 0, positioning: 82, mounting: 78 },
      safety: { collecting: 0, moving: 0, positioning: 66, mounting: 61 },
      manualReduction: { collecting: 0, moving: 0, positioning: 18, mounting: 20 },
      canSoloTask: true,
    },
    robot_triple_cmp: {
      id: "robot_triple_cmp",
      name: "Prep-Line Robot",
      type: "Robot",
      cost: 31,
      mode: "fixed",
      coverage: ["collecting", "moving", "positioning"],
      efficiency: { collecting: 76, moving: 80, positioning: 84, mounting: 0 },
      safety: { collecting: 64, moving: 65, positioning: 67, mounting: 0 },
      manualReduction: { collecting: 18, moving: 20, positioning: 22, mounting: 0 },
      canSoloTask: true,
    },
    robot_triple_mpm: {
      id: "robot_triple_mpm",
      name: "Finish-Line Robot",
      type: "Robot",
      cost: 34,
      mode: "fixed",
      coverage: ["moving", "positioning", "mounting"],
      efficiency: { collecting: 0, moving: 74, positioning: 82, mounting: 76 },
      safety: { collecting: 0, moving: 62, positioning: 67, mounting: 60 },
      manualReduction: { collecting: 0, moving: 18, positioning: 22, mounting: 20 },
      canSoloTask: true,
    },
    robot_quad: {
      id: "robot_quad",
      name: "Full-Line Robot",
      type: "Robot",
      cost: 42,
      mode: "fixed",
      coverage: ["collecting", "moving", "positioning", "mounting"],
      efficiency: { collecting: 74, moving: 78, positioning: 82, mounting: 75 },
      safety: { collecting: 63, moving: 64, positioning: 66, mounting: 59 },
      manualReduction: { collecting: 20, moving: 24, positioning: 24, mounting: 22 },
      canSoloTask: true,
    },
  },
  strategies: [
    {
      id: "team-a",
      name: "Team A: Human-Led",
      baseCost: 6,
      profile: { efficiency: 62, safety: 84, manual: 40 },
      narrative: "Human-led site control with selective robotic assistance for low-risk tasks.",
      quantities: {
        generalist_human: "unlimited",
        skilled_human: "unlimited",
        robot_collect: 1,
        robot_move: 1,
        robot_position: 1,
        robot_mount: 1,
        robot_pair_cm: 1,
        robot_pair_mp: 1,
        robot_pair_pm: 1,
        robot_triple_cmp: 0,
        robot_triple_mpm: 0,
        robot_quad: 0,
      },
      fitTargets: { humans: 0.65, robots: 0.35 },
      fitRange: { min: 0, max: 0.35 },
      targets: { capacity: 4, productivity: 66, safety: 76, manual: 40 },
    },
    {
      id: "team-b",
      name: "Team B: Collaborative",
      baseCost: 14,
      profile: { efficiency: 76, safety: 82, manual: 68 },
      narrative: "Balanced human-robot collaboration with shared load handling and oversight.",
      quantities: {
        generalist_human: 2,
        skilled_human: 2,
        robot_collect: 1,
        robot_move: 1,
        robot_position: 1,
        robot_mount: 1,
        robot_pair_cm: 1,
        robot_pair_mp: 1,
        robot_pair_pm: 1,
        robot_triple_cmp: 1,
        robot_triple_mpm: 1,
        robot_quad: 1,
      },
      fitTargets: { humans: 0.45, robots: 0.55 },
      fitRange: { min: 0.35, max: 0.75 },
      targets: { capacity: 4, productivity: 74, safety: 80, manual: 56 },
    },
    {
      id: "team-c",
      name: "Team C: Robot-Led",
      baseCost: 24,
      profile: { efficiency: 88, safety: 76, manual: 86 },
      narrative: "Robot-led workflow maximizing automation while keeping human oversight in key roles.",
      quantities: {
        generalist_human: 2,
        skilled_human: 0,
        robot_collect: "unlimited",
        robot_move: "unlimited",
        robot_position: "unlimited",
        robot_mount: "unlimited",
        robot_pair_cm: "unlimited",
        robot_pair_mp: "unlimited",
        robot_pair_pm: "unlimited",
        robot_triple_cmp: "unlimited",
        robot_triple_mpm: "unlimited",
        robot_quad: "unlimited",
      },
      fitTargets: { humans: 0.15, robots: 0.85 },
      fitRange: { min: 0.75, max: 1 },
      targets: { capacity: 4, productivity: 82, safety: 74, manual: 80 },
    },
  ],
};

const state = {
  mode: "play",
  config: loadConfig(),
  setupDraft: null,
  selectedStrategyId: "team-b",
  placements: {},
  simulation: buildSimulationState(),
  simulationTimer: null,
  variants: [],
  selectedVariantId: null,
  teamInfo: loadTeamInfo(),
  backendResult: null,
  submissionStatus: null,
  isSubmitting: false,
};

function isTeamReady(teamInfo) {
  return Boolean(teamInfo?.teamName && teamInfo?.architectureLead && teamInfo?.robotEngineer && teamInfo?.costManager);
}

const topbarStatsEl = document.getElementById("topbar-stats");
const modeToggleEl = document.getElementById("mode-toggle");
const setupPanelEl = document.getElementById("setup-panel");
const setupEditorEl = document.getElementById("setup-editor");
const strategyListEl = document.getElementById("strategy-list");
const taskBoardEl = document.getElementById("task-board");
const outcomePanelEl = document.getElementById("outcome-panel");
const workerPoolEl = document.getElementById("worker-pool");
const variantListEl = document.getElementById("variant-list");
const simulationBoardEl = document.getElementById("simulation-board");
const saveVariantButton = document.getElementById("save-variant");
const resetSetupButton = document.getElementById("reset-setup");
const saveSetupButton = document.getElementById("save-setup");
const resetSetupConfigButton = document.getElementById("reset-setup-config");
const runSimulationButton = document.getElementById("run-simulation");
const resetSimulationButton = document.getElementById("reset-simulation");
const saveDraftButton = document.getElementById("save-draft");
const submitFinalButton = document.getElementById("submit-final");
const workspaceEl = document.querySelector(".workspace");
const teamPanelEl = document.getElementById("team-panel");

saveVariantButton.addEventListener("click", saveVariant);
resetSetupButton.addEventListener("click", resetPlaySetup);
saveSetupButton.addEventListener("click", saveSetupConfig);
resetSetupConfigButton.addEventListener("click", resetSetupConfig);
runSimulationButton.addEventListener("click", startSimulation);
resetSimulationButton.addEventListener("click", resetSimulation);
saveDraftButton?.addEventListener("click", () => submitTeamData("Draft"));
submitFinalButton?.addEventListener("click", () => submitTeamData("Final"));

if (!isTeamReady(state.teamInfo) && !window.location.pathname.endsWith("team.html")) {
  window.location.href = "./team.html";
}

resetPlaySetup();

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultConfig);
    return mergeConfig(structuredClone(defaultConfig), JSON.parse(raw));
  } catch {
    return structuredClone(defaultConfig);
  }
}

function loadTeamInfo() {
  try {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    if (!raw) return buildEmptyTeamInfo();
    return { ...buildEmptyTeamInfo(), ...JSON.parse(raw) };
  } catch {
    return buildEmptyTeamInfo();
  }
}

function buildEmptyTeamInfo() {
  return {
    sessionId: "",
    teamName: "",
    architectureLead: "",
    robotEngineer: "",
    costManager: "",
    participants: "",
    teamId: "",
    finalSubmitted: false,
  };
}

function saveTeamInfo(teamInfo) {
  state.teamInfo = { ...state.teamInfo, ...teamInfo };
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(state.teamInfo));
}

function generateTeamId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `team-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function normalizeParticipants(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
}

function mergeConfig(base, saved) {
  return {
    ...base,
    ...saved,
    taskLabels: Object.fromEntries(
      Object.entries(base.taskLabels).map(([taskId, taskMeta]) => [
        taskId,
        { ...taskMeta, ...(saved.taskLabels?.[taskId] || {}) },
      ])
    ),
    uiText: { ...base.uiText, ...(saved.uiText || {}) },
    weights: { ...base.weights, ...(saved.weights || {}) },
    workerCatalog: Object.fromEntries(
      Object.entries(base.workerCatalog).map(([workerId, worker]) => [
        workerId,
        { ...worker, ...(saved.workerCatalog?.[workerId] || {}) },
      ])
    ),
    strategies: base.strategies.map((strategy) => {
      const savedStrategy = (saved.strategies || []).find((item) => item.id === strategy.id) || {};
      return {
        ...strategy,
        ...savedStrategy,
        profile: { ...strategy.profile, ...(savedStrategy.profile || {}) },
        fitTargets: { ...strategy.fitTargets, ...(savedStrategy.fitTargets || {}) },
        quantities: { ...strategy.quantities, ...(savedStrategy.quantities || {}) },
      };
    }),
  };
}

function persistConfig() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
}

function getWorkerCatalog() {
  return state.config.workerCatalog;
}

function getTaskMeta(taskId, sourceConfig = state.config) {
  const fallback = taskDefinitions.find((task) => task.id === taskId) || { id: taskId, name: taskId, note: "" };
  return sourceConfig.taskLabels?.[taskId] || { name: fallback.name, note: fallback.note };
}

function t(key, sourceConfig = state.config) {
  return sourceConfig.uiText?.[key] ?? defaultConfig.uiText[key] ?? key;
}

function getSelectedStrategy() {
  return state.config.strategies.find((strategy) => strategy.id === state.selectedStrategyId);
}

function buildSimulationState() {
  return {
    running: false,
    pending: Array.from({ length: 9 }, (_, index) => ({ id: `block-${index + 1}` })),
    stages: Object.fromEntries(
      taskDefinitions.map((task) => [task.id, { queue: [], active: null, remaining: 0, parked: [] }])
    ),
    completed: [],
  };
}

function stopSimulationTimer() {
  if (state.simulationTimer) {
    clearInterval(state.simulationTimer);
    state.simulationTimer = null;
  }
}

function resetSimulationStateOnly() {
  stopSimulationTimer();
  state.simulation = buildSimulationState();
}

function resetPlaySetup() {
  stopSimulationTimer();
  state.placements = {};
  taskDefinitions.forEach((task) => {
    state.placements[task.id] = [];
  });
  state.simulation = buildSimulationState();
  state.selectedVariantId = null;
  render();
}

function render() {
  renderModeToggle();
  renderStaticText();
  renderTeamPanel();
  const strategy = getSelectedStrategy();
  const metrics = evaluateSetup(strategy, state.placements);
  renderTopbar(strategy);
  renderModeVisibility();
  if (state.mode === "setup") {
    if (!state.setupDraft) state.setupDraft = structuredClone(state.config);
    renderSetupWorkspace();
    return;
  }
  renderStrategies(strategy);
  renderSimulationBoard(metrics);
  renderTaskBoard(metrics);
  renderOutcomePanel(strategy, metrics);
  renderWorkerPool(strategy);
  renderVariants();
}

function renderStaticText() {
  const mappings = {
    "setup-panel-title": "setupPanelTitle",
    "step1-kicker": "step1",
    "step1-title": "chooseStrategy",
    "crew-kicker": "crewView",
    "crew-title": "availableCrew",
    "step2-kicker": "step2",
    "step2-title": "coverEveryTask",
    "legend-1": "socketsRule1",
    "legend-2": "socketsRule2",
    "legend-3": "socketsRule3",
    "variants-kicker": "variants",
    "variants-title": "saveAndCompare",
    "step3-kicker": "step3",
    "step3-title": "reviewOutcome",
  };
  Object.entries(mappings).forEach(([id, key]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = t(key);
  });
  if (saveVariantButton) saveVariantButton.textContent = t("saveCurrentVariant");
  if (resetSetupButton) resetSetupButton.textContent = t("resetSetup");
  if (runSimulationButton) runSimulationButton.textContent = t("runSimulation");
  if (resetSimulationButton) resetSimulationButton.textContent = t("resetFlow");
  if (saveSetupButton) saveSetupButton.textContent = t("saveSetup");
  if (resetSetupConfigButton) resetSetupConfigButton.textContent = t("resetConfig");
}

function renderModeToggle() {
  modeToggleEl.innerHTML = `
    <button class="button ${state.mode === "play" ? "primary" : "ghost"}" data-mode="play" type="button">${t("modePlay")}</button>
    <button class="button ${state.mode === "setup" ? "primary" : "ghost"}" data-mode="setup" type="button">${t("modeSetup")}</button>
  `;
  modeToggleEl.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      if (state.mode === "setup") state.setupDraft = structuredClone(state.config);
      render();
    });
  });
}

function renderModeVisibility() {
  if (state.mode === "setup") {
    setupPanelEl.classList.remove("hidden");
    workspaceEl.classList.add("hidden");
  } else {
    setupPanelEl.classList.add("hidden");
    workspaceEl.classList.remove("hidden");
  }
}

function getSubmissionCounts() {
  const workerCatalog = getWorkerCatalog();
  const assignmentMap = new Map();
  taskDefinitions.forEach((task) => {
    state.placements[task.id].forEach((placement) => {
      if (!assignmentMap.has(placement.assignmentId)) assignmentMap.set(placement.assignmentId, placement.workerId);
    });
  });
  const counts = { workers: 0, basicRobots: 0, advancedRobots: 0, multiRobotSystems: 0 };
  assignmentMap.forEach((workerId) => {
    const worker = workerCatalog[workerId];
    if (!worker) return;
    if (worker.type === "Human") {
      counts.workers += 1;
      return;
    }
    const coverage = getWorkerPreviewTasks(worker).length;
    if (coverage === 1) counts.basicRobots += 1;
    else if (coverage === 2) counts.advancedRobots += 1;
    else if (coverage >= 3) counts.multiRobotSystems += 1;
  });
  return counts;
}

function renderTeamPanel() {
  if (!teamPanelEl) return;
  const sessionInput = document.getElementById("team-session-id");
  const teamNameInput = document.getElementById("team-name");
  const participantsInput = document.getElementById("team-participants");
  const teamIdInput = document.getElementById("team-id");
  const feedbackEl = document.getElementById("team-feedback");

  if (sessionInput) sessionInput.value = state.teamInfo.sessionId || "";
  if (teamNameInput) teamNameInput.value = state.teamInfo.teamName || "";
  if (participantsInput) participantsInput.value = state.teamInfo.participants || "";
  if (teamIdInput) teamIdInput.value = state.teamInfo.teamId || "";

  const counts = getSubmissionCounts();
  const summaryText = `Plan summary: ${counts.workers} human worker${counts.workers === 1 ? "" : "s"}, ${counts.basicRobots} basic robot${counts.basicRobots === 1 ? "" : "s"}, ${counts.advancedRobots} advanced robot${counts.advancedRobots === 1 ? "" : "s"}, ${counts.multiRobotSystems} multi-robot system${counts.multiRobotSystems === 1 ? "" : "s"}.`;
  let statusText = "Save a draft or submit final decision to get official results from the backend.";
  if (state.submissionStatus) {
    statusText = `${state.submissionStatus.type} response: ${state.submissionStatus.message}`;
    if (state.submissionStatus.time) statusText += ` (${state.submissionStatus.time})`;
  }
  if (state.teamInfo.finalSubmitted) statusText = "Final decision has been submitted. You can still save additional drafts if needed.";
  if (feedbackEl) {
    feedbackEl.innerHTML = `
      <div class="team-summary">${summaryText}</div>
      <div class="team-status-message">${statusText}</div>
    `;
  }

  const draftButton = document.getElementById("save-draft");
  const finalButton = document.getElementById("submit-final");
  if (draftButton) draftButton.disabled = state.isSubmitting;
  if (finalButton) finalButton.disabled = state.isSubmitting || !state.teamInfo.sessionId || !state.teamInfo.teamName || !state.teamInfo.participants || state.teamInfo.finalSubmitted;
}

function collectTeamInfoFromForm() {
  const sessionInput = document.getElementById("team-session-id");
  const teamNameInput = document.getElementById("team-name");
  const participantsInput = document.getElementById("team-participants");

  return {
    sessionId: sessionInput?.value.trim() || "",
    teamName: teamNameInput?.value.trim() || "",
    participants: normalizeParticipants(participantsInput?.value || ""),
    teamId: state.teamInfo.teamId || generateTeamId(),
    finalSubmitted: state.teamInfo.finalSubmitted || false,
  };
}

function validateTeamInfo() {
  const info = collectTeamInfoFromForm();
  if (!info.sessionId) throw new Error("Session ID is required.");
  if (!info.teamName) throw new Error("Team name is required.");
  if (!info.participants) throw new Error("Participant names are required.");
  return info;
}

function getSubmissionPayload(submissionType) {
  const teamInfo = validateTeamInfo();
  const strategy = getSelectedStrategy();
  const counts = getSubmissionCounts();
  return {
    sessionId: teamInfo.sessionId,
    teamId: teamInfo.teamId,
    teamName: teamInfo.teamName,
    participants: teamInfo.participants,
    strategy: strategy.name,
    workers: counts.workers,
    basicRobots: counts.basicRobots,
    advancedRobots: counts.advancedRobots,
    multiRobotSystems: counts.multiRobotSystems,
    submissionType,
  };
}

async function submitTeamData(submissionType) {
  try {
    state.isSubmitting = true;
    renderTeamPanel();
    const teamInfo = validateTeamInfo();
    saveTeamInfo(teamInfo);
    const payload = getSubmissionPayload(submissionType);

    if (!BACKEND_URL || BACKEND_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE")) {
      throw new Error("Backend URL is not configured. Please paste your Google Apps Script Web App URL into app.js.");
    }

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Backend request failed with status ${response.status}`);
    }

    const result = await response.json();
    if (!result.ok) {
      throw new Error(result.message || "Backend rejected the submission.");
    }

    saveTeamInfo({ teamId: result.teamId || teamInfo.teamId, finalSubmitted: submissionType === "Final" });
    state.backendResult = result;
    state.submissionStatus = { type: submissionType, message: result.message || "Saved", time: result.savedAt || new Date().toISOString() };
  } catch (error) {
    state.submissionStatus = { type: "Error", message: error.message || "Unable to save draft.", time: new Date().toISOString() };
  } finally {
    state.isSubmitting = false;
    render();
  }
}

function renderSetupWorkspace() {
  const strategy = state.setupDraft.strategies.find((item) => item.id === state.selectedStrategyId) || state.setupDraft.strategies[0];
  renderSetupStrategies(strategy);
  renderSetupWorkerPool(strategy);
  renderSetupBoardHint();
  renderSetupOutcomePanel(strategy);
  variantListEl.innerHTML = `<div class="empty-state">Setup Mode edits the same layout as Play Mode. Save setup to update the playable version.</div>`;
  simulationBoardEl.innerHTML = "";
}

function renderTopbar(strategy) {
  topbarStatsEl.innerHTML = "";
  const values = [
    { label: "Team", value: state.teamInfo.teamName || "Not set" },
    { label: "Architecture Lead", value: state.teamInfo.architectureLead || "Not set" },
    { label: "Robot Engineer", value: state.teamInfo.robotEngineer || "Not set" },
    { label: "Cost Manager", value: state.teamInfo.costManager || "Not set" },
  ];
  values.forEach((item) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `<div class="metric-label">${item.label}</div><span class="stat-value">${item.value}</span>`;
    topbarStatsEl.appendChild(card);
  });
}

function renderSetupEditor() {
  const draft = state.setupDraft;
  const workerList = Object.values(draft.workerCatalog);
  const strategyList = draft.strategies;

  setupEditorEl.innerHTML = `
    <section class="setup-block">
      <h3>Weights And Reward</h3>
      <div class="setup-grid setup-grid-weights">
        <label>Efficiency Weight<input data-setup-path="weights.efficiency" value="${draft.weights.efficiency}" /></label>
        <label>Safety Weight<input data-setup-path="weights.safety" value="${draft.weights.safety}" /></label>
        <label>Manual Weight<input data-setup-path="weights.manualReduction" value="${draft.weights.manualReduction}" /></label>
      </div>
      <label class="formula-field">
        Final Reward Formula
        <textarea data-setup-path="rewardFormula" rows="3">${draft.rewardFormula}</textarea>
      </label>
      <p class="microcopy">Formula variables: performanceScore, strategyBonus, budgetPenalty, efficiency, safety, manualReduction, humanCount, robotCount, coveredTasks, totalCost, budgetLimit.</p>
    </section>

    <section class="setup-block">
      <h3>Worker Values</h3>
      <div class="setup-worker-list">
        ${workerList
          .map(
            (worker) => `
              <article class="setup-worker-card">
                <div class="setup-worker-head">
                  <strong>${worker.name}</strong>
                  <span class="tag">${worker.type}</span>
                </div>
                <div class="setup-grid">
                  <label>Cost<input data-setup-path="workerCatalog.${worker.id}.cost" value="${worker.cost}" /></label>
                  ${taskDefinitions
                    .map(
                      (task) => `
                        <label>${task.name} Eff<input data-setup-path="workerCatalog.${worker.id}.efficiency.${task.id}" value="${worker.efficiency[task.id]}" /></label>
                        <label>${task.name} Safe<input data-setup-path="workerCatalog.${worker.id}.safety.${task.id}" value="${worker.safety[task.id]}" /></label>
                        <label>${task.name} Manual<input data-setup-path="workerCatalog.${worker.id}.manualReduction.${task.id}" value="${worker.manualReduction[task.id]}" /></label>
                      `
                    )
                    .join("")}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="setup-block">
      <h3>Strategy Crew Setup</h3>
      <div class="setup-strategy-list">
        ${strategyList
          .map(
            (strategy) => `
              <article class="setup-strategy-card">
                <div class="setup-worker-head">
                  <strong>${strategy.name}</strong>
                  <span class="tag">Base ${strategy.baseCost}</span>
                </div>
                <div class="setup-grid setup-grid-weights">
                  <label>Base Cost<input data-setup-path="strategies.${strategy.id}.baseCost" value="${strategy.baseCost}" /></label>
                  <label>Profile Eff<input data-setup-path="strategies.${strategy.id}.profile.efficiency" value="${strategy.profile.efficiency}" /></label>
                  <label>Profile Safe<input data-setup-path="strategies.${strategy.id}.profile.safety" value="${strategy.profile.safety}" /></label>
                  <label>Profile Manual<input data-setup-path="strategies.${strategy.id}.profile.manual" value="${strategy.profile.manual}" /></label>
                  <label>Fit Humans<input data-setup-path="strategies.${strategy.id}.fitTargets.humans" value="${strategy.fitTargets.humans}" /></label>
                  <label>Fit Robots<input data-setup-path="strategies.${strategy.id}.fitTargets.robots" value="${strategy.fitTargets.robots}" /></label>
                </div>
                <div class="setup-quantity-list">
                  ${workerList
                    .map((worker) => {
                      const quantity = strategy.quantities[worker.id] ?? 0;
                      return `
                        <div class="quantity-row">
                          <span>${worker.name}</span>
                          <div class="quantity-controls">
                            <button class="icon-button setup-quantity" data-strategy-id="${strategy.id}" data-worker-id="${worker.id}" data-action="decrement" type="button">−</button>
                            <span class="quantity-value">${formatQuantity(quantity)}</span>
                            <button class="icon-button setup-quantity" data-strategy-id="${strategy.id}" data-worker-id="${worker.id}" data-action="increment" type="button">+</button>
                            <button class="button ghost setup-quantity" data-strategy-id="${strategy.id}" data-worker-id="${worker.id}" data-action="toggle-unlimited" type="button">∞</button>
                          </div>
                        </div>
                      `;
                    })
                    .join("")}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;

  setupEditorEl.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => updateSetupDraftField(field.dataset.setupPath, field.value));
  });
  setupEditorEl.querySelectorAll(".setup-quantity").forEach((button) => {
    button.addEventListener("click", () => updateSetupQuantity(button.dataset.strategyId, button.dataset.workerId, button.dataset.action));
  });
}

function renderSetupStrategies(selectedStrategy) {
  strategyListEl.innerHTML = "";
  state.setupDraft.strategies.forEach((strategy) => {
    const card = document.createElement("div");
    card.className = `strategy-card setup-card ${selectedStrategy.id === strategy.id ? "active" : ""}`;
    card.innerHTML = `
      <div class="strategy-title">
        <label class="setup-name-field">Name <input data-setup-strategy-name="${strategy.id}" value="${strategy.name}" /></label>
        <button class="button ghost select-strategy" data-strategy-id="${strategy.id}" type="button">${t("edit", state.setupDraft)}</button>
      </div>
      <div class="setup-inline-fields">
        <label>${t("base", state.setupDraft)} <input data-setup-strategy="${strategy.id}" data-field="baseCost" value="${strategy.baseCost}" /></label>
        <label>${t("efficiency", state.setupDraft)} <input data-setup-strategy="${strategy.id}" data-field="profile.efficiency" value="${strategy.profile.efficiency}" /></label>
        <label>${t("safety", state.setupDraft)} <input data-setup-strategy="${strategy.id}" data-field="profile.safety" value="${strategy.profile.safety}" /></label>
        <label>${t("manualReduction", state.setupDraft)} <input data-setup-strategy="${strategy.id}" data-field="profile.manual" value="${strategy.profile.manual}" /></label>
      </div>
      <div class="bars">
        ${renderBar(t("efficiency", state.setupDraft), strategy.profile.efficiency)}
        ${renderBar(t("safety", state.setupDraft), strategy.profile.safety)}
        ${renderBar(t("manualReduction", state.setupDraft), strategy.profile.manual)}
      </div>
    `;
    strategyListEl.appendChild(card);
  });

  strategyListEl.querySelectorAll(".select-strategy").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedStrategyId = button.dataset.strategyId;
      renderSetupWorkspace();
    });
  });
  strategyListEl.querySelectorAll("[data-setup-strategy]").forEach((input) => {
    input.addEventListener("input", () => {
      const strategy = state.setupDraft.strategies.find((item) => item.id === input.dataset.setupStrategy);
      setNestedValue(strategy, input.dataset.field, Number(input.value));
      renderSetupStrategies(state.setupDraft.strategies.find((item) => item.id === state.selectedStrategyId));
    });
  });
  strategyListEl.querySelectorAll("[data-setup-strategy-name]").forEach((input) => {
    input.addEventListener("input", () => {
      const strategy = state.setupDraft.strategies.find((item) => item.id === input.dataset.setupStrategyName);
      strategy.name = input.value;
    });
  });
}

function renderSetupWorkerPool(selectedStrategy) {
  const workerCatalog = state.setupDraft.workerCatalog;
  workerPoolEl.innerHTML = "";
  Object.values(workerCatalog).forEach((worker) => {
    const workerValues = summarizeWorkerValues(worker);
    const quantity = selectedStrategy.quantities[worker.id] ?? 0;
    const card = document.createElement("article");
    card.className = "worker-card setup-card";
    card.innerHTML = `
      <div class="setup-card-top">
        <label class="worker-name setup-name-field"><span>Name</span><input data-setup-worker-name="${worker.id}" value="${worker.name}" /></label>
        <label class="setup-tag-input">${t("cost", state.setupDraft)} <input data-setup-worker="${worker.id}" data-field="cost" value="${worker.cost}" /></label>
      </div>
      <div class="mini-bars">
        ${renderMiniBar(t("efficiency", state.setupDraft), workerValues.efficiency)}
        ${renderMiniBar(t("safety", state.setupDraft), workerValues.safety)}
        ${renderMiniBar(t("manualReduction", state.setupDraft), workerValues.manualReduction)}
      </div>
      <div class="setup-card-values">
        <label>${t("efficiency", state.setupDraft)} <input data-setup-worker="${worker.id}" data-field="aggregate.efficiency" value="${workerValues.efficiency}" /></label>
        <label>${t("safety", state.setupDraft)} <input data-setup-worker="${worker.id}" data-field="aggregate.safety" value="${workerValues.safety}" /></label>
        <label>${t("manualReduction", state.setupDraft)} <input data-setup-worker="${worker.id}" data-field="aggregate.manualReduction" value="${workerValues.manualReduction}" /></label>
      </div>
      <div class="setup-quantity-row">
        <label class="setup-badge-input">${t("qty", state.setupDraft)} <input data-setup-quantity="${worker.id}" value="${formatQuantity(quantity)}" /></label>
      </div>
    `;
    workerPoolEl.appendChild(card);
  });

  workerPoolEl.querySelectorAll("[data-setup-worker]").forEach((input) => {
    input.addEventListener("input", () => updateSetupWorkerValue(input.dataset.setupWorker, input.dataset.field, input.value));
  });
  workerPoolEl.querySelectorAll("[data-setup-worker-name]").forEach((input) => {
    input.addEventListener("input", () => {
      state.setupDraft.workerCatalog[input.dataset.setupWorkerName].name = input.value;
    });
  });
  workerPoolEl.querySelectorAll("[data-setup-quantity]").forEach((input) => {
    input.addEventListener("input", () => updateSetupWorkerQuantity(selectedStrategy.id, input.dataset.setupQuantity, input.value));
  });
}

function renderSetupBoardHint() {
  const taskEditors = taskDefinitions
    .map((task) => {
      const meta = getTaskMeta(task.id, state.setupDraft);
      return `
        <div class="task-card setup-card">
          <div class="setup-inline-fields">
            <label>Name <input data-setup-task="${task.id}" data-field="name" value="${meta.name}" /></label>
            <label>Note <input data-setup-task="${task.id}" data-field="note" value="${meta.note}" /></label>
          </div>
        </div>
      `;
    })
    .join("");
  taskBoardEl.innerHTML = `
    ${taskEditors}
  `;
  taskBoardEl.querySelectorAll("[data-setup-task]").forEach((input) => {
    input.addEventListener("input", () => {
      const taskMeta = state.setupDraft.taskLabels[input.dataset.setupTask];
      taskMeta[input.dataset.field] = input.value;
    });
  });
}

function renderSetupOutcomePanel(selectedStrategy) {
  outcomePanelEl.innerHTML = `
    <div class="score-card">
      <div class="panel-kicker">Setup Config</div>
      <div class="setup-inline-fields">
        <label>${t("fitHumans", state.setupDraft)} <input id="setup-fit-humans" value="${selectedStrategy.fitTargets.humans}" /></label>
        <label>${t("fitRobots", state.setupDraft)} <input id="setup-fit-robots" value="${selectedStrategy.fitTargets.robots}" /></label>
        <label>${t("efficiency", state.setupDraft)} Weight <input id="setup-weight-eff" value="${state.setupDraft.weights.efficiency}" /></label>
        <label>${t("safety", state.setupDraft)} Weight <input id="setup-weight-safe" value="${state.setupDraft.weights.safety}" /></label>
        <label>${t("manualReduction", state.setupDraft)} Weight <input id="setup-weight-manual" value="${state.setupDraft.weights.manualReduction}" /></label>
      </div>
    </div>
    <label class="formula-field">
      ${t("finalRewardFormula", state.setupDraft)}
      <textarea id="setup-reward-formula" rows="6">${state.setupDraft.rewardFormula}</textarea>
    </label>
    <div class="setup-block">
      <h3>Shared Text</h3>
      <div class="setup-grid">
        ${renderSharedTextFields()}
      </div>
    </div>
    <div class="compare-actions" style="margin-top: 12px">
      <button id="save-setup-inline" class="button primary" type="button">${t("saveSetup", state.setupDraft)}</button>
      <button id="reset-setup-inline" class="button ghost" type="button">${t("resetConfig", state.setupDraft)}</button>
    </div>
  `;

  document.getElementById("setup-fit-humans").addEventListener("input", (event) => {
    selectedStrategy.fitTargets.humans = Number(event.target.value);
  });
  document.getElementById("setup-fit-robots").addEventListener("input", (event) => {
    selectedStrategy.fitTargets.robots = Number(event.target.value);
  });
  document.getElementById("setup-weight-eff").addEventListener("input", (event) => {
    state.setupDraft.weights.efficiency = Number(event.target.value);
  });
  document.getElementById("setup-weight-safe").addEventListener("input", (event) => {
    state.setupDraft.weights.safety = Number(event.target.value);
  });
  document.getElementById("setup-weight-manual").addEventListener("input", (event) => {
    state.setupDraft.weights.manualReduction = Number(event.target.value);
  });
  document.getElementById("setup-reward-formula").addEventListener("input", (event) => {
    state.setupDraft.rewardFormula = event.target.value;
  });
  outcomePanelEl.querySelectorAll("[data-setup-text]").forEach((input) => {
    input.addEventListener("input", () => {
      state.setupDraft.uiText[input.dataset.setupText] = input.value;
    });
  });
  document.getElementById("save-setup-inline").addEventListener("click", saveSetupConfig);
  document.getElementById("reset-setup-inline").addEventListener("click", () => {
    state.setupDraft = structuredClone(defaultConfig);
    renderSetupWorkspace();
  });
}

function renderSharedTextFields() {
  const keys = [
    "modePlay",
    "modeSetup",
    "chooseStrategy",
    "availableCrew",
    "coverEveryTask",
    "reviewOutcome",
    "saveCurrentVariant",
    "resetSetup",
    "runSimulation",
    "resetFlow",
    "incoming",
    "completed",
    "socketsRule1",
    "socketsRule2",
    "socketsRule3",
    "efficiency",
    "safety",
    "manualReduction",
    "manualWorkReduced",
    "budget",
    "strategy",
    "score",
    "predictedFinalScore",
    "weightedPerformance",
    "strategyFitBonus",
    "budgetPenalty",
    "robotCount",
    "cost",
    "qty",
    "generalistSupport",
    "addGeneralist",
    "removeSupport",
    "clear",
  ];
  return keys
    .map(
      (key) => `
        <label>${key}
          <input data-setup-text="${key}" value="${state.setupDraft.uiText[key] ?? ""}" />
        </label>
      `
    )
    .join("");
}

function updateSetupDraftField(path, rawValue) {
  const parts = path.split(".");
  let target = state.setupDraft;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    if (part === "strategies") {
      target = target.strategies.find((item) => item.id === parts[index + 1]);
      index += 1;
      continue;
    }
    target = target[part];
  }
  target[parts.at(-1)] = parts.at(-1) === "rewardFormula" ? rawValue : Number(rawValue);
}

function updateSetupQuantity(strategyId, workerId, action) {
  const strategy = state.setupDraft.strategies.find((item) => item.id === strategyId);
  const current = strategy.quantities[workerId] ?? 0;
  if (action === "toggle-unlimited") {
    strategy.quantities[workerId] = current === "unlimited" ? 0 : "unlimited";
  } else if (current !== "unlimited") {
    strategy.quantities[workerId] = action === "increment" ? current + 1 : current - 1;
  }
  renderSetupEditor();
}

function setNestedValue(target, path, value) {
  const parts = path.split(".");
  let current = target;
  for (let index = 0; index < parts.length - 1; index += 1) current = current[parts[index]];
  current[parts.at(-1)] = value;
}

function updateSetupWorkerValue(workerId, field, rawValue) {
  const worker = state.setupDraft.workerCatalog[workerId];
  const numericValue = Number(rawValue);
  if (field === "cost") {
    worker.cost = numericValue;
  } else if (field.startsWith("aggregate.")) {
    const key = field.split(".")[1];
    getWorkerPreviewTasks(worker).forEach((taskId) => {
      worker[key][taskId] = numericValue;
    });
  }
  renderSetupWorkerPool(state.setupDraft.strategies.find((item) => item.id === state.selectedStrategyId));
}

function updateSetupWorkerQuantity(strategyId, workerId, rawValue) {
  const strategy = state.setupDraft.strategies.find((item) => item.id === strategyId);
  strategy.quantities[workerId] = rawValue.trim() === "∞" ? "unlimited" : Number(rawValue);
}

function saveSetupConfig() {
  try {
    validateRewardFormula(state.setupDraft.rewardFormula);
    state.config = structuredClone(state.setupDraft);
    persistConfig();
    state.mode = "play";
    state.setupDraft = null;
    resetPlaySetup();
  } catch (error) {
    alert(`Setup could not be saved: ${error.message}`);
  }
}

function resetSetupConfig() {
  state.setupDraft = structuredClone(defaultConfig);
  renderSetupEditor();
}

function startSimulation() {
  stopSimulationTimer();
  const metrics = evaluateSetup(getSelectedStrategy(), state.placements);
  state.simulation.running = true;
  state.simulationTimer = setInterval(() => stepSimulation(metrics.taskDynamics), SIMULATION_TICK_MS);
  render();
}

function resetSimulation() {
  resetSimulationStateOnly();
  render();
}

function stepSimulation(taskDynamics) {
  const stageIds = taskDefinitions.map((task) => task.id);
  const staffedStageIds = stageIds.filter((stageId) => taskDynamics[stageId]);

  for (let index = stageIds.length - 1; index >= 0; index -= 1) {
    const stageId = stageIds[index];
    const stage = state.simulation.stages[stageId];
    if (!stage.active) continue;

    stage.remaining -= SIMULATION_TICK_MS;
    if (stage.remaining > 0) continue;

    const nextStageId = stageIds[index + 1];
    if (!nextStageId) {
      state.simulation.completed.push(stage.active);
      stage.active = null;
      stage.remaining = 0;
      continue;
    }

    if (!taskDynamics[nextStageId]) {
      stage.parked.push(stage.active);
      stage.active = null;
      stage.remaining = 0;
      continue;
    }

    const nextStage = state.simulation.stages[nextStageId];
    nextStage.queue.push(stage.active);
    stage.active = null;
    stage.remaining = 0;
  }

  for (const stageId of staffedStageIds) {
    const stage = state.simulation.stages[stageId];
    if (!stage.active && stage.queue.length) {
      stage.active = stage.queue.shift();
      stage.remaining = taskDynamics[stageId]?.duration ?? 1800;
    }
  }

  const firstStageId = staffedStageIds[0];
  if (firstStageId) {
    const firstStage = state.simulation.stages[firstStageId];
    if (!firstStage.active && !firstStage.queue.length && state.simulation.pending.length) {
      firstStage.active = state.simulation.pending.shift();
      firstStage.remaining = taskDynamics[firstStageId]?.duration ?? 1800;
    } else if (firstStage.queue.length < 2 && state.simulation.pending.length) {
      firstStage.queue.push(state.simulation.pending.shift());
    }
  }

  const allDone =
    !state.simulation.pending.length &&
    stageIds.every((stageId) => !state.simulation.stages[stageId].active && !state.simulation.stages[stageId].queue.length);

  if (allDone) stopSimulationTimer();
  render();
}

function validateRewardFormula(formula) {
  const runner = new Function(
    "performanceScore",
    "strategyBonus",
    "budgetPenalty",
    "efficiency",
    "safety",
    "manualReduction",
    "humanCount",
    "robotCount",
    "coveredTasks",
    "totalCost",
    "budgetLimit",
    `return ${formula};`
  );
  runner(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, budgetLimit);
}

function renderStrategies(selectedStrategy) {
  strategyListEl.innerHTML = "";
  state.config.strategies.forEach((strategy) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `strategy-card ${selectedStrategy.id === strategy.id ? "active" : ""}`;
    card.addEventListener("click", () => {
      state.selectedStrategyId = strategy.id;
      resetPlaySetup();
    });

    const rosterSummary = summarizeRoster(strategy.quantities);
    card.innerHTML = `
      <div class="strategy-title">
        <strong>${strategy.name}</strong>
        <span class="tag">Base ${strategy.baseCost}</span>
      </div>
      <div class="microcopy">${strategy.narrative}</div>
      <div class="metrics-row" style="margin-top: 12px">
        <span class="metric-pill">${rosterSummary.humans} humans</span>
        <span class="metric-pill">${rosterSummary.robots} robots</span>
      </div>
      <div class="bars">
        ${renderBar("Efficiency", strategy.profile.efficiency)}
        ${renderBar("Safety", strategy.profile.safety)}
        ${renderBar("Manual", strategy.profile.manual)}
      </div>
    `;
    strategyListEl.appendChild(card);
  });
}

function renderTaskBoard(metrics) {
  const workerCatalog = getWorkerCatalog();
  taskBoardEl.innerHTML = "";
  taskDefinitions.forEach((task) => {
    const taskMeta = getTaskMeta(task.id);
    const taskAssignments = state.placements[task.id];
    const warnings = metrics.taskWarnings[task.id];
    const uniqueTaskAssignments = getUniqueAssignmentsForTask(task.id, state.placements);
    const dropHint = uniqueTaskAssignments.length ? `${uniqueTaskAssignments.length} ${t("crewAssigned")}` : t("dragCrewHere");

    const card = document.createElement("div");
    card.className = `task-card socket ${warnings.length ? "warning" : ""}`;
    card.dataset.taskId = task.id;
    card.innerHTML = `
      <div class="task-title">
        <div class="task-title-group">
          <strong class="task-name-with-tooltip">
            ${taskMeta.name}
            <span class="task-tooltip">${taskMeta.note}</span>
          </strong>
        </div>
        <span class="tag">${t("station")} ${taskDefinitions.findIndex((item) => item.id === task.id) + 1}</span>
      </div>
      <div class="drop-zone ${taskAssignments.length ? "filled" : ""}">
        ${
          taskAssignments.length
            ? `
              <div class="assignment-stack">
                ${uniqueTaskAssignments
                  .map((placement) => {
                    const assignment = getAssignmentDisplay(placement.assignmentId, placement.workerId, placement.coveredTasks);
                    const worker = workerCatalog[assignment.workerId];
                    return `
                      <div class="assignment-chip">
                        <strong>${worker.name}</strong>
                        <span class="worker-type">${worker.type} • ${assignment.coveredTasks.length} task${assignment.coveredTasks.length > 1 ? "s" : ""}</span>
                        <span class="microcopy">Covers: ${assignment.coveredTasks.map(labelizeTask).join(" + ")}</span>
                        ${
                          worker.type === "Robot"
                            ? `
                              <div class="support-row">
                                <span class="microcopy">${t("generalistSupport")}: ${placement.supportGeneralist ? t("on") : t("off")}</span>
                                <button class="button ghost support-toggle" data-assignment-id="${assignment.assignmentId}" data-action="${placement.supportGeneralist ? "remove" : "add"}" type="button">
                                  ${placement.supportGeneralist ? t("removeSupport") : t("addGeneralist")}
                                </button>
                              </div>
                            `
                            : ""
                        }
                        <button class="button ghost clear-assignment" data-assignment-id="${assignment.assignmentId}" type="button">${t("clear")}</button>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            `
            : `<div class="drop-copy">${dropHint}<br /><span class="microcopy">${taskMeta.name.toUpperCase()}</span></div>`
        }
        <div class="socket-tooltip">Robot coverage preferred; human-only coverage requires Skilled Foreman.</div>
      </div>
      <div class="microcopy">Extra crew boosts efficiency most, with weaker effects on safety and manual work.</div>
      ${warnings.length ? `<div class="warning-list">${warnings.map((warning) => `<div class="warning-pill">${warning}</div>`).join("")}</div>` : ""}
    `;
    taskBoardEl.appendChild(card);
  });

  taskBoardEl.querySelectorAll(".socket").forEach((socket) => {
    socket.addEventListener("dragover", (event) => {
      event.preventDefault();
      socket.classList.add("dragover");
    });
    socket.addEventListener("dragleave", () => socket.classList.remove("dragover"));
    socket.addEventListener("drop", (event) => {
      event.preventDefault();
      socket.classList.remove("dragover");
      const workerId = event.dataTransfer.getData("text/plain");
      if (workerId) placeCrew(workerId, socket.dataset.taskId);
    });
  });
  taskBoardEl.querySelectorAll(".clear-assignment").forEach((button) => {
    button.addEventListener("click", () => clearAssignment(button.dataset.assignmentId));
  });
  taskBoardEl.querySelectorAll(".support-toggle").forEach((button) => {
    button.addEventListener("click", () => toggleGeneralistSupport(button.dataset.assignmentId, button.dataset.action === "add"));
  });
}

function renderSimulationBoard(metrics) {
  const stageCards = taskDefinitions
    .map((task) => {
      const taskMeta = getTaskMeta(task.id);
      const stage = state.simulation.stages[task.id];
      const dynamic = metrics.taskDynamics[task.id];
      const waitingBlocks = [...stage.queue, ...stage.parked];
      return `
        <div class="sim-stage ${stage.active ? "busy" : ""} ${dynamic ? "" : "inactive"}">
          <div class="sim-stage-head">
            <strong>${taskMeta.name}</strong>
            <span class="tag">${dynamic ? `${Math.round(dynamic.duration)}ms` : "off"}</span>
          </div>
          <div class="sim-stage-meta">
            <span>${dynamic ? `${t("efficiency")} ${dynamic.efficiency}` : t("noCrew")}</span>
            <span>${dynamic ? `Crew ${dynamic.crewCount}` : ""}</span>
          </div>
          <div class="sim-stage-processor">
            ${stage.active ? `<div class="sim-block active"></div>` : `<div class="sim-square-placeholder"></div>`}
          </div>
          <div class="sim-stage-buffer">
            ${
              waitingBlocks.length
                ? waitingBlocks.map(() => `<div class="sim-block"></div>`).join("")
                : `<div class="sim-placeholder">${t("noBlocks")}</div>`
            }
          </div>
        </div>
      `;
    })
    .join("");

  simulationBoardEl.innerHTML = `
    <div class="sim-source">
      <div class="sim-column-head">
        <strong>${t("incoming")}</strong>
        <span class="tag">${state.simulation.pending.length}</span>
      </div>
      <div class="sim-strip">
        ${state.simulation.pending.map(() => `<div class="sim-block"></div>`).join("")}
      </div>
    </div>
    ${stageCards}
    <div class="sim-target">
      <div class="sim-column-head">
        <strong>${t("completed")}</strong>
        <span class="tag">${state.simulation.completed.length}/9</span>
      </div>
      <div class="sim-grid">
        ${Array.from({ length: 9 }, (_, index) => {
          const block = state.simulation.completed[index];
          return block ? `<div class="sim-block done"></div>` : `<div class="sim-grid-slot"></div>`;
        }).join("")}
      </div>
    </div>
  `;
}

function renderOutcomePanel(strategy, metrics) {
  const result = state.backendResult;
  if (!result) {
    outcomePanelEl.innerHTML = `
      <div class="score-card">
        <div class="panel-kicker">Official Results</div>
        <div class="stat-value">Awaiting backend submission</div>
        <div class="score-line"><span>Please save or submit your team plan to retrieve results.</span></div>
      </div>
      <div class="team-summary">Selected strategy: ${strategy.name}</div>
      <div class="team-summary">Submit your plan to see official results from the Google Sheet backend.</div>
    `;
    return;
  }

  const row = result.resultData || {};
  outcomePanelEl.innerHTML = `
    <div class="score-card">
      <div class="panel-kicker">Official Team Results</div>
      <div class="stat-line"><strong>${result.message}</strong></div>
      <div class="score-line"><span>Saved at</span><strong>${result.savedAt || "n/a"}</strong></div>
    </div>
    <div class="stat-grid">
      <div class="stat-card"><div class="metric-label">Strategy</div><span class="stat-value">${row.strategy || strategy.name}</span></div>
      <div class="stat-card"><div class="metric-label">Workers</div><span class="stat-value">${row.workers ?? "-"}</span></div>
      <div class="stat-card"><div class="metric-label">Basic Robots</div><span class="stat-value">${row.basicRobots ?? "-"}</span></div>
      <div class="stat-card"><div class="metric-label">Advanced Robots</div><span class="stat-value">${row.advancedRobots ?? "-"}</span></div>
      <div class="stat-card"><div class="metric-label">Multi-Robot Systems</div><span class="stat-value">${row.multiRobotSystems ?? "-"}</span></div>
      <div class="stat-card"><div class="metric-label">Capacity</div><span class="stat-value">${row.capacity ?? "-"}</span></div>
    </div>
    <div class="stat-grid">
      <div class="stat-card"><div class="metric-label">Robot Share</div><span class="stat-value">${row.robotCapacityShare ?? "-"}</span></div>
      <div class="stat-card"><div class="metric-label">Strategy Fit</div><span class="stat-value">${row.hrcStrategyFit ?? "-"}</span></div>
      <div class="stat-card"><div class="metric-label">Productivity</div><span class="stat-value">${row.productivity ?? "-"}</span></div>
      <div class="stat-card"><div class="metric-label">Safety</div><span class="stat-value">${row.operationalSafety ?? "-"}</span></div>
      <div class="stat-card"><div class="metric-label">Effort Reduction</div><span class="stat-value">${row.manualPhysicalEffortReduction ?? "-"}</span></div>
      <div class="stat-card"><div class="metric-label">Status</div><span class="stat-value">${row.finalStatus ?? "-"}</span></div>
    </div>
  `;
}

function renderWorkerPool(strategy) {
  const workerCatalog = getWorkerCatalog();
  workerPoolEl.innerHTML = "";
  Object.values(workerCatalog).forEach((worker) => {
    const remaining = getRemainingCount(strategy, worker.id, state.placements);
    const unavailable = remaining !== "unlimited" && remaining <= 0;
    const workerValues = summarizeWorkerValues(worker);
    const card = document.createElement("article");
    card.className = `worker-card draggable-card ${unavailable ? "assigned" : ""}`;
    card.draggable = !unavailable;
    card.dataset.workerId = worker.id;
    card.innerHTML = `
      <span class="worker-cost-tag">${worker.cost}</span>
      <div class="worker-name"><strong>${worker.name}</strong></div>
      <div class="mini-bars">
        ${renderMiniBar(t("efficiency"), workerValues.efficiency)}
        ${renderMiniBar(t("safety"), workerValues.safety)}
        ${renderMiniBar(t("manualReduction"), workerValues.manualReduction)}
      </div>
      <span class="worker-quantity-badge">${formatQuantity(remaining)}</span>
    `;
    if (!unavailable) {
      card.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", worker.id);
        event.dataTransfer.effectAllowed = "move";
        card.classList.add("dragging");
      });
      card.addEventListener("dragend", () => card.classList.remove("dragging"));
    }
    workerPoolEl.appendChild(card);
  });
}

function renderVariants() {
  variantListEl.innerHTML = "";
  if (!state.variants.length) {
    variantListEl.innerHTML = `<div class="empty-state">Save a setup to compare strategy, score, and crew composition.</div>`;
    return;
  }
  state.variants.forEach((variant) => {
    const card = document.createElement("article");
    card.className = `variant-card ${variant.id === state.selectedVariantId ? "selected" : ""}`;
    card.innerHTML = `
      <div class="variant-title">
        <strong>${variant.name}</strong>
        <span class="tag">${variant.metrics.finalScore}</span>
      </div>
      <div class="variant-summary">
        <span class="metric-pill">${variant.strategyName}</span>
        <span class="metric-pill">Cost ${variant.metrics.totalCost}</span>
        <span class="metric-pill">Robots ${variant.metrics.robotCount}</span>
      </div>
      <div class="microcopy">Humans ${variant.metrics.humanCount} • Covered tasks ${variant.metrics.coveredTasks}/4</div>
      <div class="compare-actions" style="margin-top: 12px">
        <button class="button ghost" data-action="load" data-id="${variant.id}" type="button">Load</button>
        <button class="button ghost" data-action="delete" data-id="${variant.id}" type="button">Delete</button>
      </div>
    `;
    variantListEl.appendChild(card);
  });
  variantListEl.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "load") loadVariant(button.dataset.id);
      if (button.dataset.action === "delete") deleteVariant(button.dataset.id);
    });
  });
}

function placeCrew(workerId, targetTaskId) {
  const strategy = getSelectedStrategy();
  const remaining = getRemainingCount(strategy, workerId, state.placements);
  if (remaining !== "unlimited" && remaining <= 0) return;
  const worker = getWorkerCatalog()[workerId];
  const coverageTasks = resolveCoverageTasks(worker, targetTaskId);
  if (!coverageTasks.length) return;
  const assignmentId = crypto.randomUUID();
  coverageTasks.forEach((taskId) => {
    state.placements[taskId].push({ assignmentId, workerId: worker.id, coveredTasks: coverageTasks, supportGeneralist: false });
  });
  resetSimulationStateOnly();
  state.selectedVariantId = null;
  render();
}

function clearAssignment(assignmentId) {
  resetSimulationStateOnly();
  taskDefinitions.forEach((task) => {
    state.placements[task.id] = state.placements[task.id].filter((placement) => placement.assignmentId !== assignmentId);
  });
  state.selectedVariantId = null;
  render();
}

function toggleGeneralistSupport(assignmentId, enabled) {
  const strategy = getSelectedStrategy();
  const targetPlacement = getPlacementByAssignmentId(assignmentId, state.placements);
  if (!targetPlacement) return;
  const generalistRemaining = getRemainingCount(strategy, "generalist_human", state.placements);
  if (enabled && generalistRemaining !== "unlimited" && generalistRemaining <= 0) return;
  if (getWorkerCatalog()[targetPlacement.workerId].type !== "Robot") return;
  taskDefinitions.forEach((task) => {
    state.placements[task.id].forEach((placement) => {
      if (placement.assignmentId === assignmentId) placement.supportGeneralist = enabled;
    });
  });
  resetSimulationStateOnly();
  state.selectedVariantId = null;
  render();
}

function saveVariant() {
  const strategy = getSelectedStrategy();
  const metrics = evaluateSetup(strategy, state.placements);
  state.variants = [
    {
      id: crypto.randomUUID(),
      name: strategy.name,
      strategyId: strategy.id,
      strategyName: strategy.name,
      placements: structuredClone(state.placements),
      metrics,
    },
    ...state.variants,
  ].slice(0, maxVariants);
  state.selectedVariantId = state.variants[0].id;
  render();
}

function loadVariant(variantId) {
  const variant = state.variants.find((item) => item.id === variantId);
  if (!variant) return;
  state.selectedStrategyId = variant.strategyId;
  state.placements = structuredClone(variant.placements);
  resetSimulationStateOnly();
  state.selectedVariantId = variant.id;
  render();
}

function deleteVariant(variantId) {
  state.variants = state.variants.filter((item) => item.id !== variantId);
  if (state.selectedVariantId === variantId) state.selectedVariantId = null;
  render();
}

function evaluateSetup(strategy, placements) {
  const workerCatalog = getWorkerCatalog();
  const uniqueAssignments = new Map();
  taskDefinitions.forEach((task) => {
    placements[task.id].forEach((placement) => {
      if (!uniqueAssignments.has(placement.assignmentId)) uniqueAssignments.set(placement.assignmentId, placement.workerId);
    });
  });

  let totalWorkerCost = 0;
  let humanCount = 0;
  let robotCount = 0;
  let coveredTasks = 0;
  let efficiencySum = 0;
  let safetySum = 0;
  let manualReductionSum = 0;
  const warnings = [];
  const taskWarnings = {};
  const taskDynamics = {};

  taskDefinitions.forEach((task) => {
    taskWarnings[task.id] = [];
    const taskPlacements = getUniqueAssignmentsForTask(task.id, placements);
    if (!taskPlacements.length) return taskWarnings[task.id].push("This socket is empty.");

    coveredTasks += 1;
    const assignmentCount = taskPlacements.length;
    const taskEfficiencyBase = taskPlacements.reduce((sum, placement) => sum + workerCatalog[placement.workerId].efficiency[task.id], 0);
    const taskSafetyBase =
      taskPlacements.reduce((sum, placement) => {
        const worker = workerCatalog[placement.workerId];
        return sum + Math.min(100, worker.safety[task.id] + (placement.supportGeneralist && worker.type === "Robot" ? 12 : 0));
      }, 0) / assignmentCount;
    const taskManualBase =
      taskPlacements.reduce((sum, placement) => sum + workerCatalog[placement.workerId].manualReduction[task.id], 0) / assignmentCount;

    const efficiencyBoost = Math.max(0, assignmentCount - 1) * 8;
    const safetyPenalty = Math.max(0, assignmentCount - 1) * 3;
    const manualBoost = Math.max(0, assignmentCount - 1) * 2;

    const effectiveEfficiency = Math.min(100, taskEfficiencyBase / assignmentCount + efficiencyBoost);
    efficiencySum += effectiveEfficiency;
    safetySum += Math.max(0, Math.min(100, taskSafetyBase - safetyPenalty));
    manualReductionSum += Math.min(100, taskManualBase + manualBoost);
    taskDynamics[task.id] = computeTaskDynamic(assignmentCount, effectiveEfficiency, taskPlacements);

    const humanOnly = taskPlacements.every((placement) => workerCatalog[placement.workerId].type === "Human");
    const hasSkilledInstaller = taskPlacements.some((placement) => workerCatalog[placement.workerId].canSoloTask);
    if (humanOnly && !hasSkilledInstaller) {
      taskWarnings[task.id].push("Human-only coverage must use a skilled foreman.");
    }
    if (assignmentCount > 1) {
      taskWarnings[task.id].push("Multi-crew assignment raises efficiency, but costs more and slightly reduces safety.");
    }
  });

  uniqueAssignments.forEach((workerId) => {
    const worker = workerCatalog[workerId];
    totalWorkerCost += worker.cost;
    if (worker.type === "Human") humanCount += 1;
    else robotCount += 1;
  });

  const supportGeneralistCount = getSupportGeneralistCount(placements);
  totalWorkerCost += supportGeneralistCount * workerCatalog.generalist_human.cost;
  humanCount += supportGeneralistCount;

  const efficiency = coveredTasks ? Math.round(efficiencySum / taskDefinitions.length) : 0;
  const safety = coveredTasks ? Math.round(safetySum / taskDefinitions.length) : 0;
  const manualReduction = coveredTasks ? Math.round(manualReductionSum / taskDefinitions.length) : 0;
  const totalAssignments = uniqueAssignments.size;
  const totalWorkers = humanCount + robotCount;
  const robotShare = totalWorkers ? robotCount / totalWorkers : 0;
  const weights = state.config.weights;
  const performanceScore = roundOneDecimal(
    weights.efficiency * efficiency + weights.safety * safety + weights.manualReduction * manualReduction
  );
  const strategyBonus = calculateStrategyBonus(strategy, robotShare);
  const totalCost = strategy.baseCost + totalWorkerCost;
  const budgetPenalty = totalCost > budgetLimit ? (totalCost - budgetLimit) * 1.8 : 0;
  const finalScore = computeReward({
    performanceScore,
    strategyBonus,
    budgetPenalty,
    efficiency,
    safety,
    manualReduction,
    humanCount,
    robotCount,
    coveredTasks,
    totalCost,
    budgetLimit,
  });

  const round1Checks = [
    {
      id: "humanSupport",
      label: "Human support feasible",
      pass: robotCount === 0 || getSupportGeneralistCount(placements) > 0,
      detail: robotCount === 0 ? "No robots assigned; support not required." : getSupportGeneralistCount(placements) > 0 ? "Human oversight assigned to robot tasks." : "Add human oversight to robot tasks.",
    },
    {
      id: "capacityFeasible",
      label: "Capacity feasible",
      pass: coveredTasks === taskDefinitions.length,
      detail: coveredTasks === taskDefinitions.length ? "Every construction zone is covered." : `${taskDefinitions.length - coveredTasks} zone(s) still uncovered.`,
    },
    {
      id: "budgetVisible",
      label: "Budget visibility",
      pass: true,
      detail: `Total cost is ${totalCost}/${budgetLimit}.`,
    },
  ];

  const round2Checks = [
    {
      id: "capacityTarget",
      label: "Capacity >= target",
      pass: totalAssignments >= strategy.targets.capacity,
      detail: `Assignments ${totalAssignments}/${strategy.targets.capacity}`,
    },
    {
      id: "productivityTarget",
      label: "Productivity target",
      pass: efficiency >= strategy.targets.productivity,
      detail: `Productivity ${efficiency}/${strategy.targets.productivity}`,
    },
    {
      id: "safetyTarget",
      label: "Operational safety target",
      pass: safety >= strategy.targets.safety,
      detail: `Safety ${safety}/${strategy.targets.safety}`,
    },
    {
      id: "manualTarget",
      label: "Manual effort reduction target",
      pass: manualReduction >= strategy.targets.manual,
      detail: `Effort reduction ${manualReduction}/${strategy.targets.manual}`,
    },
    {
      id: "budgetCheck",
      label: "Budget check",
      pass: totalCost <= budgetLimit,
      detail: totalCost <= budgetLimit ? "Within budget." : `Over budget by ${totalCost - budgetLimit}.`,
    },
    {
      id: "strategyFit",
      label: "HRC strategy fit",
      pass: robotShare >= strategy.fitRange.min && robotShare <= strategy.fitRange.max,
      detail: `Robot share ${Math.round(robotShare * 100)}% (${Math.round(strategy.fitRange.min * 100)}%–${Math.round(strategy.fitRange.max * 100)}% target).`,
    },
  ];

  taskDefinitions.forEach((task) => {
    taskWarnings[task.id].forEach((warning) => warnings.push(`${labelizeTask(task.id)}: ${warning}`));
  });
  if (!robotCount) warnings.push("At least one robot must be part of the setup.");
  if (totalCost > budgetLimit) warnings.push(`Over budget by ${totalCost - budgetLimit}. Final score is penalized, but the setup can still play.`);
  if (coveredTasks === taskDefinitions.length && robotCount && !warnings.length) warnings.push("All construction zones are covered. You can start the site plan.");

  return {
    totalCost,
    efficiency,
    safety,
    manualReduction,
    performanceScore,
    strategyBonus,
    budgetPenalty,
    finalScore,
    humanCount,
    robotCount,
    coveredTasks,
    totalAssignments,
    robotShare,
    round1Checks,
    round2Checks,
    warnings,
    taskWarnings,
    taskDynamics,
  };
}

function computeReward(context) {
  try {
    const runner = new Function(...Object.keys(context), `return ${state.config.rewardFormula};`);
    const result = runner(...Object.values(context));
    return Number.isFinite(result) ? result : 0;
  } catch {
    return 0;
  }
}

function calculateStrategyBonus(strategy, robotShare) {
  const { min, max } = strategy.fitRange;
  if (robotShare >= min && robotShare <= max) return 12;
  const gap = Math.min(Math.abs(robotShare - min), Math.abs(robotShare - max));
  if (gap <= 0.1) return 4;
  return -6;
}

function summarizeRoster(quantities) {
  return Object.entries(quantities).reduce(
    (summary, [workerId, quantity]) => {
      if (quantity === 0) return summary;
      const count = quantity === "unlimited" ? 4 : quantity;
      if (getWorkerCatalog()[workerId].type === "Human") summary.humans += count;
      else summary.robots += count;
      return summary;
    },
    { humans: 0, robots: 0 }
  );
}

function getAssignmentDisplay(assignmentId, workerId, coveredTasks) {
  return { assignmentId, workerId, coveredTasks };
}

function computeTaskDynamic(assignmentCount, effectiveEfficiency, taskPlacements) {
  const supportCount = taskPlacements.filter((placement) => placement.supportGeneralist).length;
  const power = Math.max(1, effectiveEfficiency + assignmentCount * 10 + supportCount * 4);
  return {
    efficiency: Math.round(effectiveEfficiency),
    crewCount: assignmentCount,
    power,
    duration: Math.max(180, 1500 - power * 10),
  };
}

function getUniqueAssignmentsForTask(taskId, placements) {
  const seen = new Set();
  return placements[taskId].filter((placement) => {
    if (seen.has(placement.assignmentId)) return false;
    seen.add(placement.assignmentId);
    return true;
  });
}

function getPlacementByAssignmentId(assignmentId, placements) {
  for (const task of taskDefinitions) {
    const found = placements[task.id].find((placement) => placement.assignmentId === assignmentId);
    if (found) return found;
  }
  return null;
}

function resolveCoverageTasks(worker, targetTaskId) {
  if (worker.mode === "single") return worker.allowedTasks.includes(targetTaskId) ? [targetTaskId] : [];
  return worker.coverage.includes(targetTaskId) ? worker.coverage : [];
}

function getWorkerPreviewTasks(worker) {
  return worker.mode === "single" ? worker.allowedTasks : worker.coverage;
}

function getAssignedCountByWorker(workerId, placements) {
  const assignmentIds = new Set();
  taskDefinitions.forEach((task) => {
    placements[task.id].forEach((placement) => {
      if (placement.workerId === workerId) assignmentIds.add(placement.assignmentId);
    });
  });
  return assignmentIds.size;
}

function getSupportGeneralistCount(placements) {
  const assignmentIds = new Set();
  taskDefinitions.forEach((task) => {
    placements[task.id].forEach((placement) => {
      if (placement.supportGeneralist) assignmentIds.add(placement.assignmentId);
    });
  });
  return assignmentIds.size;
}

function getRemainingCount(strategy, workerId, placements) {
  const quantity = strategy.quantities[workerId] ?? 0;
  if (quantity === "unlimited") return "unlimited";
  const supportCount = workerId === "generalist_human" ? getSupportGeneralistCount(placements) : 0;
  return quantity - getAssignedCountByWorker(workerId, placements) - supportCount;
}

function formatQuantity(quantity) {
  return quantity === "unlimited" ? "∞" : quantity;
}

function summarizeWorkerValues(worker) {
  const previewTasks = getWorkerPreviewTasks(worker);
  const taskCount = previewTasks.length || 1;
  return {
    efficiency: Math.round(previewTasks.reduce((sum, taskId) => sum + worker.efficiency[taskId], 0) / taskCount),
    safety: Math.round(previewTasks.reduce((sum, taskId) => sum + worker.safety[taskId], 0) / taskCount),
    manualReduction: Math.round(previewTasks.reduce((sum, taskId) => sum + worker.manualReduction[taskId], 0) / taskCount),
  };
}

function renderBar(label, value) {
  const numericValue = Number(value) || 0;
  const magnitude = clampMiniBarMagnitude(numericValue);
  const directionClass = numericValue < 0 ? "negative" : "positive";
  return `
    <div class="bar">
      <span>${label}</span>
      <div class="mini-bar-track">
        <div class="mini-bar-zero"></div>
        <div class="mini-bar-fill ${directionClass}" style="${getMiniBarStyle(numericValue, magnitude)}"></div>
      </div>
      <strong>${numericValue}</strong>
    </div>
  `;
}

function renderMiniBar(label, value) {
  const numericValue = Number(value) || 0;
  const magnitude = clampMiniBarMagnitude(numericValue);
  const directionClass = numericValue < 0 ? "negative" : "positive";
  return `
    <div class="mini-bar">
      <span class="microcopy">${label}</span>
      <div class="mini-bar-track">
        <div class="mini-bar-zero"></div>
        <div class="mini-bar-fill ${directionClass}" style="${getMiniBarStyle(numericValue, magnitude)}"></div>
      </div>
    </div>
  `;
}

function clampMiniBarMagnitude(value) {
  return Math.max(0, Math.min(100, Math.abs(Number(value) || 0)));
}

function getMiniBarStyle(value, magnitude) {
  if (value < 0) {
    return `left:${50 - magnitude / 2}%; width:${magnitude / 2}%`;
  }
  return `left:50%; width:${magnitude / 2}%`;
}

function labelizeTask(taskId) {
  return getTaskMeta(taskId).name || taskId;
}

function roundOneDecimal(value) {
  return Math.round(value * 10) / 10;
}
