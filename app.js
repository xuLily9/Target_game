const STORAGE_KEY = "construction-logistics-round-1-v4";
const WORKSHOP_TEAMS_KEY = "construction-workshop-teams-v4";
const ACTIVE_TEAM_ID_KEY = "construction-workshop-active-team-id-v4";
const SESSION_TEAM_ID_KEY = "construction-workshop-session-team-id-v4";

const PROJECT = {
  totalDemand: 100,
  days: 5,
  requiredDailyCapacity: 20,
  budgetLimit: 200,
  budgetPenaltyMultiplier: 2,
  schedulePenaltyPerDay: 25,
  maxHumanWorkers: 20,
  maxRobots: 12,
};

const RESOURCES = [
  {
    id: "skilledWorkers",
    group: "human",
    label: "Skilled Workers",
    cardTitle: "Skilled Worker",
    description: "Experienced in operating equipment and complex construction tasks.",
    cost: 20,
    capacity: 2,
    capacityLabel: "2 Units / Day",
    visual: "worker skilled",
    accent: "blue",
  },
  {
    id: "generalWorkers",
    group: "human",
    label: "Construction Material Workers",
    cardTitle: "Construction Material Worker",
    description: "Supports material handling, loading, unloading, and site activities.",
    cost: 10,
    capacity: 1,
    capacityLabel: "1 Unit / Day",
    visual: "worker general",
    accent: "blue",
  },
  {
    id: "supportWorkers",
    group: "human",
    label: "Robot Support Workers",
    cardTitle: "Robot Support Worker",
    description: "Dedicated support for robot operation; does not add direct material transport capacity.",
    cost: 10,
    capacity: 0,
    capacityLabel: "1 Support Unit / Day",
    contributionLabel: "Support Contribution",
    supportCapacity: 1,
    visual: "worker operator",
    accent: "blue",
  },
  {
    id: "deliveryRobots",
    group: "robot",
    label: "Delivery Robots",
    cardTitle: "Delivery Robot",
    description: "Designed for efficient transport of materials in structured environments.",
    cost: 20,
    capacity: 3,
    capacityLabel: "3 Units / Day",
    supportLoad: 0.5,
    supportLabel: "0.5 support workers per robot",
    visual: "robot delivery",
    accent: "green",
  },
  {
    id: "quadrupedRobots",
    group: "robot",
    label: "Quadruped Robots",
    cardTitle: "Quadruped Robot",
    description: "Built for rough terrain and complex sites where mobility matters most.",
    cost: 35,
    capacity: 5,
    capacityLabel: "5 Units / Day",
    supportLoad: 1,
    supportLabel: "1 support worker per robot",
    visual: "robot quadruped",
    accent: "cyan",
  },
  {
    id: "multiRobotFleets",
    group: "robot",
    label: "Multi-Robot Fleets",
    cardTitle: "Multi-Robot Fleet",
    description: "A coordinated fleet system delivering high efficiency at large scale.",
    cost: 60,
    capacity: 8,
    capacityLabel: "8 Units / Day",
    supportLoad: 3,
    supportLabel: "3 support workers per fleet",
    visual: "robot fleet",
    accent: "purple",
  },
];

const ROUND2_PROJECT = {
  totalDemand: 100,
  requiredDailyCapacity: 20,
  budgetLimit: 200,
  maxHumanWorkers: 20,
  maxRobots: 12,
  performanceTarget: 70,
  strategyMismatchPenalty: 10,
  performanceGapPenaltyMultiplier: 0.5,
  days: 5,
  schedulePenaltyPerDay: 5,
  budgetOverrunPenaltyMultiplier: 0.2,
};

const ROUND2_STRATEGIES = [
  {
    id: "robot-led",
    label: "Robot-Led",
    description: "Maximise automation and robot capacity.",
    color: "purple",
    weights: { productivity: 0.5, safety: 0.25, effort: 0.25 },
    stars: { productivity: 4, safety: 2, effort: 2 },
  },
  {
    id: "collaborative",
    label: "Collaborative",
    description: "Balance humans and robots for safe and efficient delivery.",
    color: "blue",
    weights: { productivity: 0.25, safety: 0.5, effort: 0.25 },
    stars: { productivity: 2, safety: 4, effort: 2 },
  },
  {
    id: "human-led",
    label: "Human-Led",
    description: "Leverage human capability and reduce physical strain.",
    color: "green",
    weights: { productivity: 0.25, safety: 0.25, effort: 0.5 },
    stars: { productivity: 2, safety: 2, effort: 4 },
  },
];

const ROUND2_RESOURCES = [
  {
    id: "skilledWorkers",
    group: "human",
    label: "Skilled Workers",
    shortLabel: "Skilled Workers",
    description: "Experienced workers who improve manual delivery quality and site coordination.",
    cost: 20,
    capacity: 2,
    effects: { productivity: 3, safety: 4, effort: 4 },
    visual: "worker skilled",
    accent: "blue",
  },
  {
    id: "materialWorkers",
    group: "human",
    label: "Construction Material Workers",
    shortLabel: "Material Workers",
    description: "Manual transport capacity for site delivery.",
    cost: 10,
    capacity: 1,
    effects: { productivity: 1, safety: 1, effort: 2 },
    visual: "worker general",
    accent: "blue",
  },
  {
    id: "supportWorkers",
    group: "human",
    label: "Robot Support Workers",
    shortLabel: "Robot Support",
    description: "Dedicated support for robot operations.",
    cost: 10,
    capacity: 0,
    supportCapacity: 1,
    effects: { productivity: 0, safety: 2, effort: 1 },
    visual: "worker operator",
    accent: "cyan",
  },
  {
    id: "deliveryRobots",
    group: "robot",
    label: "Delivery Robots",
    shortLabel: "Delivery Robots",
    description: "0.5 support workers per robot.",
    cost: 20,
    capacity: 3,
    supportLoad: 0.5,
    effects: { productivity: 5, safety: 5, effort: 8 },
    visual: "robot delivery",
    accent: "green",
  },
  {
    id: "quadrupedRobots",
    group: "robot",
    label: "Quadruped Robots",
    shortLabel: "Quadruped Robots",
    description: "1 support worker per robot.",
    cost: 35,
    capacity: 5,
    supportLoad: 1,
    effects: { productivity: 10, safety: 10, effort: 12 },
    visual: "robot quadruped",
    accent: "blue",
  },
  {
    id: "multiRobotFleets",
    group: "robot",
    label: "Multi-Robot Fleets",
    shortLabel: "Multi-Robot Fleets",
    description: "3 support workers per fleet.",
    cost: 60,
    capacity: 8,
    supportLoad: 3,
    effects: { productivity: 16, safety: 7, effort: 16 },
    visual: "robot fleet",
    accent: "purple",
  },
];

const VISUAL_IMAGE_SOURCES = {
  "worker skilled": "./assets/worker-skilled.svg",
  "worker general": "./assets/worker-general.svg",
  "worker operator": "./assets/worker-support.svg",
  "robot delivery": "./assets/robot-delivery.svg",
  "robot quadruped": "./assets/robot-quadruped.svg",
  "robot fleet": "./assets/robot-fleet.svg",
};

let teamsCache = loadJson(WORKSHOP_TEAMS_KEY, []);
let state = loadState();
let lastTeamsSnapshot = JSON.stringify(teamsCache);

const humanGridEl = document.getElementById("human-resource-grid");
const robotGridEl = document.getElementById("robot-resource-grid");
const selectionSummaryEl = document.getElementById("selection-summary");
const capacityCardEl = document.getElementById("capacity-card");
const costCardEl = document.getElementById("cost-card");
const supportCardEl = document.getElementById("support-card");
const finalScoreCardEl = document.getElementById("final-score-card");
const confirmationMessageEl = document.getElementById("confirmation-message");
const resetButton = document.getElementById("reset-round");
const scenarioResetButton = document.getElementById("reset-scenario");
const confirmButton = document.getElementById("confirm-round");
const activeTeamCardEl = document.getElementById("active-team-card");
const startPlanningLink = document.getElementById("start-planning");
const workshopTeamBannerEl = document.getElementById("workshop-team-banner");
const round1SummaryBoardEl = document.getElementById("round1-summary-board");
const round2StrategyGridEl = document.getElementById("round2-strategy-grid");
const round2ResourceGridEl = document.getElementById("round2-resource-grid");
const round2ConstraintsEl = document.getElementById("round2-constraints");
const round2AlignmentEl = document.getElementById("round2-alignment");
const round2DashboardMetricsEl = document.getElementById("round2-dashboard-metrics");
const round2FinalValueEl = document.getElementById("round2-final-value");
const round2ConfirmationEl = document.getElementById("round2-confirmation");
const resetRound2Button = document.getElementById("reset-round2");
const confirmRound2Button = document.getElementById("confirm-round2");
const round2SummaryBoardEl = document.getElementById("round2-summary-board");

resetButton.addEventListener("click", resetRound);
scenarioResetButton?.addEventListener("click", resetRound);
resetRound2Button?.addEventListener("click", resetRound2);

function resetRound() {
  if (!getActiveTeam()) {
    render();
    return;
  }
  if (isRound1Locked()) {
    state.confirmed = true;
    render();
    return;
  }
  state.quantities = createEmptyQuantities();
  state.confirmed = false;
  persistState();
  render();
}

confirmButton.addEventListener("click", () => {
  const activeTeam = getActiveTeam();
  if (!activeTeam) {
    confirmationMessageEl.className = "confirmation-message fail";
    confirmationMessageEl.textContent = "Please create or select a numeric Team ID before submitting Round 1.";
    return;
  }
  if (isRound1Locked()) {
    render();
    return;
  }
  const metrics = evaluateRound();
  if (!metrics.supportFeasible) {
    confirmationMessageEl.className = "confirmation-message fail";
    confirmationMessageEl.textContent = "Robot Support Check failed. Add enough support workers to support your current robot plan before final submission.";
    return;
  }
  if (!metrics.capacityFeasible) {
    confirmationMessageEl.className = "confirmation-message fail";
    confirmationMessageEl.textContent = "Total Capacity must be greater than 0 Units / Day before final submission.";
    return;
  }
  state.confirmed = true;
  saveRound1Submission(metrics);
  persistState();
  render();
});

confirmRound2Button?.addEventListener("click", () => {
  const activeTeam = getActiveTeam();
  if (!activeTeam) {
    round2ConfirmationEl.className = "confirmation-message fail";
    round2ConfirmationEl.textContent = "Please create or select a numeric Team ID before submitting Round 2.";
    return;
  }
  if (!activeTeam.round1Submission) {
    round2ConfirmationEl.className = "confirmation-message fail";
    round2ConfirmationEl.textContent = "Submit Round 1 first, then Round 2 will unlock.";
    return;
  }
  if (isRound2Locked()) {
    render();
    return;
  }
  if (!state.round2.strategy) {
    round2ConfirmationEl.className = "confirmation-message fail";
    round2ConfirmationEl.textContent = "Please select an HRC strategy before submitting Round 2.";
    return;
  }
  const metrics = evaluateRound2();
  state.round2.confirmed = true;
  saveRound2Submission(metrics);
  persistState();
  render();
});

startApp();

function createEmptyQuantities() {
  return Object.fromEntries(RESOURCES.map((resource) => [resource.id, 0]));
}

function createEmptyRound2Quantities() {
  return Object.fromEntries(ROUND2_RESOURCES.map((resource) => [resource.id, 0]));
}

function createDefaultRound2State() {
  return {
    strategy: "",
    quantities: createEmptyRound2Quantities(),
    confirmed: false,
  };
}

function loadState() {
  const activeTeam = getActiveTeam();
  if (activeTeam) {
    const round1Source = activeTeam.round1Submission || activeTeam.round1Draft || {};
    const round2Source = activeTeam.round2Submission || activeTeam.round2Draft || {};
    return {
      quantities: {
        ...createEmptyQuantities(),
        ...(round1Source.quantities || {}),
      },
      confirmed: Boolean(activeTeam.round1Submission),
      round2: {
        ...createDefaultRound2State(),
        ...round2Source,
        quantities: {
          ...createEmptyRound2Quantities(),
          ...(round2Source.quantities || {}),
        },
        confirmed: Boolean(activeTeam.round2Submission),
      },
    };
  }

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const savedQuantities = { ...(saved?.quantities || {}) };
    if (savedQuantities.operators && !savedQuantities.supportWorkers) {
      savedQuantities.supportWorkers = savedQuantities.operators;
    }
    delete savedQuantities.operators;

    return {
      quantities: {
        ...createEmptyQuantities(),
        ...savedQuantities,
      },
      confirmed: Boolean(saved?.confirmed),
      round2: {
        ...createDefaultRound2State(),
        ...(saved?.round2 || {}),
        quantities: {
          ...createEmptyRound2Quantities(),
          ...(saved?.round2?.quantities || createDefaultRound2State().quantities),
        },
        confirmed: Boolean(saved?.round2?.confirmed),
      },
    };
  } catch {
    return {
      quantities: createEmptyQuantities(),
      confirmed: false,
      round2: createDefaultRound2State(),
    };
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  persistActiveTeamDrafts();
}

function loadTeams() {
  return teamsCache;
}

function saveTeams(teams) {
  teamsCache = [...teams].sort((a, b) => Number(a.teamId) - Number(b.teamId));
  lastTeamsSnapshot = JSON.stringify(teamsCache);
  localStorage.setItem(WORKSHOP_TEAMS_KEY, lastTeamsSnapshot);
}

function saveTeamToDatabase(team) {
  if (!window.WorkshopDatabase?.isEnabled()) return;
  window.WorkshopDatabase.upsertTeam(team).catch((error) => {
    console.warn(error);
  });
}

function applyRemoteTeams(teams) {
  const nextTeams = [...teams].sort((a, b) => Number(a.teamId) - Number(b.teamId));
  const snapshot = JSON.stringify(nextTeams);
  if (snapshot === lastTeamsSnapshot) return false;
  teamsCache = nextTeams;
  lastTeamsSnapshot = snapshot;
  localStorage.setItem(WORKSHOP_TEAMS_KEY, snapshot);
  state = loadState();
  return true;
}

async function startApp() {
  if (!window.WorkshopDatabase?.isEnabled()) {
    render();
    return;
  }

  try {
    const remoteTeams = await window.WorkshopDatabase.loadTeams();
    applyRemoteTeams(remoteTeams);
  } catch (error) {
    console.warn(error);
  }

  render();

  window.WorkshopDatabase.startPolling(
    (remoteTeams) => {
      if (applyRemoteTeams(remoteTeams)) render();
    },
    (error) => console.warn(error)
  );
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getActiveTeamId() {
  const urlTeamId = getUrlTeamId();
  if (urlTeamId) {
    try {
      sessionStorage.setItem(SESSION_TEAM_ID_KEY, urlTeamId);
    } catch {
      // Ignore storage failures; URL still identifies the team for this page.
    }
    return urlTeamId;
  }

  try {
    const sessionTeamId = sessionStorage.getItem(SESSION_TEAM_ID_KEY);
    if (sessionTeamId) return sessionTeamId;
  } catch {
    // Fall back to the last selected team below.
  }

  return localStorage.getItem(ACTIVE_TEAM_ID_KEY) || "";
}

function getUrlTeamId() {
  if (typeof window === "undefined") return "";
  try {
    const params = new URLSearchParams(window.location.search);
    const teamId = params.get("team");
    return teamId && /^\d+$/.test(teamId) ? teamId : "";
  } catch {
    return "";
  }
}

function getActiveTeam() {
  const activeTeamId = getActiveTeamId();
  if (!activeTeamId) return null;
  return loadTeams().find((team) => String(team.teamId) === String(activeTeamId)) || null;
}

function updateActiveTeam(updater) {
  const activeTeamId = getActiveTeamId();
  if (!activeTeamId) return null;
  const teams = loadTeams();
  const index = teams.findIndex((team) => String(team.teamId) === String(activeTeamId));
  if (index === -1) return null;
  const nextTeam = updater({ ...teams[index] });
  teams[index] = {
    ...nextTeam,
    updatedAt: new Date().toISOString(),
  };
  saveTeams(teams);
  saveTeamToDatabase(teams[index]);
  return teams[index];
}

function persistActiveTeamDrafts() {
  const activeTeam = getActiveTeam();
  if (!activeTeam) return;
  updateActiveTeam((team) => {
    if (!team.round1Submission) {
      team.round1Draft = {
        quantities: { ...state.quantities },
        updatedAt: new Date().toISOString(),
      };
    }
    if (!team.round2Submission) {
      team.round2Draft = {
        strategy: state.round2.strategy,
        quantities: { ...state.round2.quantities },
        updatedAt: new Date().toISOString(),
      };
    }
    return team;
  });
}

function saveRound1Submission(metrics) {
  updateActiveTeam((team) => ({
    ...team,
    round1Draft: {
      quantities: { ...state.quantities },
      updatedAt: new Date().toISOString(),
    },
    round1Submission: {
      quantities: { ...state.quantities },
      metrics: snapshotRound1Metrics(metrics),
      submittedAt: new Date().toISOString(),
    },
  }));
}

function saveRound2Submission(metrics) {
  updateActiveTeam((team) => ({
    ...team,
    round2Draft: {
      strategy: state.round2.strategy,
      quantities: { ...state.round2.quantities },
      updatedAt: new Date().toISOString(),
    },
    round2Submission: {
      strategy: state.round2.strategy,
      quantities: { ...state.round2.quantities },
      metrics: snapshotRound2Metrics(metrics),
      submittedAt: new Date().toISOString(),
    },
  }));
}

function isRound1Locked() {
  return Boolean(getActiveTeam()?.round1Submission);
}

function isRound2Locked() {
  return Boolean(getActiveTeam()?.round2Submission);
}

function isRound2Unlocked() {
  return Boolean(getActiveTeam()?.round1Submission);
}

function getTeamLabel(team) {
  return `Team ${team.teamId}`;
}

function render() {
  const metrics = evaluateRound();
  renderTeamStatus();
  renderResourceCards("human", humanGridEl, metrics);
  renderResourceCards("robot", robotGridEl, metrics);
  renderSummary(metrics);
  renderResultCards(metrics);
  renderConfirmation(metrics);
  renderRound1SummaryBoard();
  renderRound2();
  renderRound2SummaryBoard();
}

function renderTeamStatus() {
  const activeTeam = getActiveTeam();
  if (startPlanningLink) {
    startPlanningLink.href = activeTeam ? getTeamGameUrl(activeTeam.teamId, "planning-workspace") : "./team.html";
    startPlanningLink.textContent = activeTeam ? "Start Round 1" : "Team Setup";
  }

  if (activeTeamCardEl) {
    activeTeamCardEl.innerHTML = activeTeam
      ? `<span>Active Team</span><strong>${getTeamLabel(activeTeam)}</strong><small>${getSubmissionStatusText(activeTeam)}</small>`
      : `<span>Team Setup Required</span><strong>No active team</strong><small>Create or select a numeric Team ID before planning.</small>`;
  }

  if (!workshopTeamBannerEl) return;
  workshopTeamBannerEl.className = `workshop-team-banner ${activeTeam ? "" : "warning"}`;
  workshopTeamBannerEl.innerHTML = activeTeam
    ? `
      <div>
        <span>Current Workshop Team</span>
        <strong>${getTeamLabel(activeTeam)}</strong>
        <small>${activeTeam.participants || "No participants listed"}</small>
      </div>
      <a href="./team.html">Switch / Create Team</a>
    `
    : `
      <div>
        <span>Team Setup Required</span>
        <strong>Create a numeric Team ID first</strong>
        <small>Submissions are saved per team and locked after final submission.</small>
      </div>
      <a href="./team.html">Team Setup</a>
    `;
}

function getSubmissionStatusText(team) {
  if (team.round2Submission) return "Round 1 + Round 2 submitted and locked";
  if (team.round1Submission) return "Round 1 submitted; Round 2 is open";
  return "Ready for Round 1";
}

function getTeamGameUrl(teamId, hash = "planning-workspace") {
  return `./index.html?team=${encodeURIComponent(teamId)}#${hash}`;
}

function renderResourceCards(group, container, metrics) {
  const locked = !getActiveTeam() || isRound1Locked();
  container.innerHTML = RESOURCES.filter((resource) => resource.group === group)
    .map((resource) => {
      const value = getQuantity(resource.id);
      const groupTotal = group === "human" ? metrics.humanCount : metrics.robotCount;
      const maxForResource = Math.max(0, getGroupLimit(group) - (groupTotal - value));
      const canIncrement = !locked && value < maxForResource;
      return `
        <article class="resource-card ${resource.group} ${resource.accent} ${locked ? "locked" : ""}">
          <div class="select-box ${value > 0 ? "checked" : ""}" aria-hidden="true"></div>
          <div class="resource-main">
            <div class="resource-visual ${resource.visual}" aria-hidden="true">
              ${renderVisualParts(resource.visual)}
            </div>
            <div class="resource-copy">
              <h4>${resource.cardTitle}</h4>
              <p>${resource.description}</p>
              <div class="capacity-pill">
                <span class="mini-icon ${resource.group === "human" ? "human-icon" : "robot-icon"}" aria-hidden="true"></span>
                <span><small>${resource.contributionLabel || "Capacity Contribution"}</small>${resource.capacityLabel}</span>
              </div>
              ${resource.supportLabel ? `<div class="support-rule">Support required: ${resource.supportLabel}</div>` : ""}
            </div>
          </div>
          <div class="quantity-row">
            <span>Select Number</span>
            <div class="stepper">
              <button data-resource-id="${resource.id}" data-action="decrement" type="button" aria-label="Decrease ${resource.label}" ${locked || value <= 0 ? "disabled" : ""}>-</button>
              <input data-resource-input="${resource.id}" type="number" min="0" max="${getGroupLimit(group)}" value="${value}" aria-label="${resource.label} quantity" ${locked ? "disabled" : ""} />
              <button data-resource-id="${resource.id}" data-action="increment" type="button" aria-label="Increase ${resource.label}" ${canIncrement ? "" : "disabled"}>+</button>
            </div>
          </div>
          <div class="cost-row">
            <span>Credits</span>
            <strong>${resource.cost} Credits / ${resource.group === "human" ? "Worker" : resource.id === "multiRobotFleets" ? "Fleet" : "Robot"}</strong>
          </div>
        </article>
      `;
    })
    .join("");

  container.querySelectorAll("[data-resource-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const resourceId = button.dataset.resourceId;
      const resource = getResource(resourceId);
      const delta = button.dataset.action === "increment" ? 1 : -1;
      setQuantity(resourceId, getQuantity(resourceId) + delta, resource.group);
    });
  });

  container.querySelectorAll("[data-resource-input]").forEach((input) => {
    input.addEventListener("input", () => {
      const resource = getResource(input.dataset.resourceInput);
      setQuantity(resource.id, Number(input.value), resource.group);
    });
  });
}

function renderVisualParts(visual) {
  if (VISUAL_IMAGE_SOURCES[visual]) {
    return `<img class="resource-image" src="${VISUAL_IMAGE_SOURCES[visual]}" alt="" />`;
  }

  if (visual.startsWith("worker")) {
    return `
      <span class="helmet"></span>
      <span class="head"></span>
      <span class="body"></span>
      <span class="vest"></span>
      <span class="arm left"></span>
      <span class="arm right"></span>
    `;
  }

  if (visual.includes("quadruped")) {
    return `
      <span class="bot-body"></span>
      <span class="bot-head"></span>
      <span class="leg l1"></span>
      <span class="leg l2"></span>
      <span class="leg l3"></span>
      <span class="leg l4"></span>
    `;
  }

  if (visual.includes("fleet")) {
    return `
      <span class="fleet-unit one"></span>
      <span class="fleet-unit two"></span>
      <span class="fleet-unit three"></span>
      <span class="rotor r1"></span>
      <span class="rotor r2"></span>
    `;
  }

  return `
    <span class="cart-top"></span>
    <span class="cart-body"></span>
    <span class="wheel left"></span>
    <span class="wheel right"></span>
  `;
}

function renderSummary(metrics) {
  const humanRows = RESOURCES.filter((resource) => resource.group === "human").map((resource) => renderSummaryRow(resource, getQuantity(resource.id)));
  const robotRows = RESOURCES.filter((resource) => resource.group === "robot").map((resource) => renderSummaryRow(resource, getQuantity(resource.id)));

  selectionSummaryEl.innerHTML = `
    <section class="summary-block human-block">
      <h3><span class="mini-icon human-icon" aria-hidden="true"></span>Human Workers</h3>
      <div class="summary-table">${humanRows.join("")}</div>
      <div class="summary-total">
        <span>Total Human Transport Capacity</span>
        <strong>${formatNumber(metrics.humanCapacity)} Units / Day</strong>
      </div>
    </section>

    <section class="summary-block robot-block">
      <h3><span class="mini-icon robot-icon" aria-hidden="true"></span>Robots / Fleets</h3>
      <div class="summary-table">${robotRows.join("")}</div>
      <div class="summary-total">
        <span>Total Robot Capacity</span>
        <strong>${formatNumber(metrics.robotCapacity)} Units / Day</strong>
      </div>
    </section>
  `;
}

function renderSummaryRow(resource, quantity) {
  const unitValue = resource.supportCapacity || resource.capacity;
  const subtotal = quantity * unitValue;
  const unitLabel = resource.supportCapacity ? "support" : "capacity";
  return `
    <div class="summary-row">
      <span>${resource.label}</span>
      <strong>${quantity}</strong>
      <em>x</em>
      <b>${formatNumber(unitValue)}</b>
      <em>=</em>
      <strong>${formatNumber(subtotal)}</strong>
      <small>${unitLabel}</small>
    </div>
  `;
}

function renderResultCards(metrics) {
  capacityCardEl.className = `result-card total-capacity ${metrics.targetCapacityFeasible ? "pass" : "warning"}`;
  capacityCardEl.innerHTML = `
    <span class="result-icon gauge-icon" aria-hidden="true"></span>
    <div>
      <small>Total Expected Capacity</small>
      <strong>${formatNumber(metrics.totalCapacity)} Units / Day</strong>
      <p>Submission minimum: <b class="${metrics.capacityFeasible ? "minimum-pass" : "minimum-fail"}">&gt; 0 Units / Day</b> | Target: <b class="capacity-target-value">20 Units / Day</b></p>
    </div>
  `;

  costCardEl.className = `result-card total-cost ${metrics.budgetFeasible ? "pass" : "fail"}`;
  costCardEl.innerHTML = `
    <span class="result-icon coin-icon" aria-hidden="true"></span>
    <div>
      <small>Total Credits</small>
      <strong>${formatNumber(metrics.totalCost)} Credits</strong>
      <p>Budget Limit: <b>200 Credits</b> | Penalty: <b>${formatNumber(metrics.budgetPenalty)}</b></p>
    </div>
  `;

  supportCardEl.className = `support-card ${metrics.supportFeasible ? "pass" : "fail"}`;
  supportCardEl.innerHTML = `
    <div>
      <small>Robot Support Check</small>
      <strong>${metrics.supportFeasible ? "PASS" : "FAIL"}</strong>
      <p>Robot Support Workers provide ${formatNumber(metrics.supportWorkerCapacity)} support units; robots require ${formatNumber(metrics.requiredSupport)}.</p>
    </div>
    <div class="duration-check ${metrics.scheduleFeasible ? "pass" : "fail"}">
      <small>Estimated Duration</small>
      <strong>${metrics.estimatedDuration ? `${formatNumber(metrics.estimatedDuration)} Days` : "-"}</strong>
      <p>Project limit: ${PROJECT.days} Days | Penalty: ${formatNumber(metrics.schedulePenalty)}</p>
    </div>
  `;

  const totalPenalty = metrics.budgetPenalty + metrics.schedulePenalty;
  const scoreStatus = !metrics.round1Submittable ? "fail" : totalPenalty > 0 ? "warning" : "pass";
  finalScoreCardEl.className = `result-card final-score-card ${scoreStatus}`;
  finalScoreCardEl.innerHTML = `
    <span class="result-icon score-icon" aria-hidden="true"></span>
    <div>
      <small>Final Score</small>
      <strong>${formatNumber(metrics.finalScore)} Points</strong>
      <p>${formatNumber(metrics.totalCost)} credits + ${formatNumber(metrics.budgetPenalty)} budget penalty + ${formatNumber(metrics.schedulePenalty)} schedule penalty</p>
    </div>
  `;
}

function renderConfirmation(metrics) {
  const activeTeam = getActiveTeam();
  const locked = !activeTeam || isRound1Locked();
  if (resetButton) resetButton.disabled = locked;
  if (confirmButton) {
    confirmButton.disabled = locked;
    const labelEl = confirmButton.querySelector("span");
    if (labelEl) {
      labelEl.innerHTML = !activeTeam
        ? `Team Setup Required<small>Create/select a Team ID first</small>`
        : locked
        ? `Round 1 Submitted<small>Final submission locked</small>`
        : `Confirm &amp; Calculate<small>Submit Round 1 final plan</small>`;
    }
  }

  if (!state.confirmed) {
    confirmationMessageEl.textContent = "";
    confirmationMessageEl.className = "confirmation-message";
    return;
  }

  confirmationMessageEl.className = `confirmation-message ${metrics.round1Submittable ? "pass" : "fail"}`;
  confirmationMessageEl.textContent = locked
    ? metrics.round1Submittable
      ? `Round 1 final submission is locked. Final score: ${formatNumber(metrics.finalScore)} points. Summary unlocks after every team submits Round 1.`
      : "Round 1 final submission is recorded, but this plan is not a valid submission."
    : metrics.round1Submittable
      ? `Round 1 submitted successfully. Final score: ${formatNumber(metrics.finalScore)} points. Your final plan is now locked.`
      : "Round 1 is not ready for final submission.";
}

function renderRound1SummaryBoard() {
  if (!round1SummaryBoardEl) return;
  const teams = loadTeams();
  const submittedTeams = teams.filter((team) => team.round1Submission);
  if (!areAllTeamsSubmitted(teams, "round1Submission")) {
    round1SummaryBoardEl.innerHTML = renderLockedSubmissionBoard({
      roundLabel: "Round 1",
      title: "Round 1 Summary Locked",
      helper: "The summary board will reveal all choices and the winner after every created team submits Round 1.",
      submittedCount: submittedTeams.length,
      totalCount: teams.length,
    });
    return;
  }

  const winner = getRound1Winner(submittedTeams);
  round1SummaryBoardEl.innerHTML = renderSubmissionBoard({
    roundLabel: "Round 1",
    title: "Round 1 Submission Summary",
    helper: "Lowest final score wins. Final score points = credits + budget penalty + schedule penalty.",
    submittedTeams,
    winner,
    columns: ["Team", "Selection", "Capacity", "Support", "Credits", "Penalty", "Final Score (Points)", "Result"],
    rowRenderer: renderRound1SummaryRow,
  });
}

function renderRound2SummaryBoard() {
  if (!round2SummaryBoardEl) return;
  const teams = loadTeams();
  const submittedTeams = teams.filter((team) => team.round2Submission);
  if (!areAllTeamsSubmitted(teams, "round2Submission")) {
    round2SummaryBoardEl.innerHTML = renderLockedSubmissionBoard({
      roundLabel: "Round 2",
      title: "Round 2 Summary Locked",
      helper: "The final value board will reveal all choices and the winner after every created team submits Round 2.",
      submittedCount: submittedTeams.length,
      totalCount: teams.length,
    });
    return;
  }

  const winner = getRound2Winner(submittedTeams);
  round2SummaryBoardEl.innerHTML = renderSubmissionBoard({
    roundLabel: "Round 2",
    title: "Round 2 Final Submission Summary",
    helper: "Highest eligible penalty-adjusted final value wins; lower credits break ties.",
    submittedTeams,
    winner,
    columns: ["Team", "Strategy", "Selection", "Performance", "Penalty", "Final Value", "Credits", "Eligible", "Result"],
    rowRenderer: renderRound2SummaryRow,
  });
}

function areAllTeamsSubmitted(teams, submissionKey) {
  return teams.length > 0 && teams.every((team) => Boolean(team[submissionKey]));
}

function renderLockedSubmissionBoard({ roundLabel, title, helper, submittedCount, totalCount }) {
  const progress = totalCount > 0 ? `${submittedCount} / ${totalCount}` : "0 / 0";
  const percent = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0;
  return `
    <div class="submission-board-header">
      <div>
        <span>${roundLabel}</span>
        <h2>${title}</h2>
        <p>${helper}</p>
      </div>
      <strong>${progress} Submitted</strong>
    </div>
    <div class="summary-lock-card">
      <div>
        <small>Hidden Until Complete</small>
        <strong>Choices and winner are not visible yet.</strong>
        <p>Create the full team roster first, then each team submits once. This prevents early teams from seeing other teams' plans.</p>
      </div>
      <div class="summary-lock-meter" aria-label="${percent}% submitted">
        <span style="width:${percent}%"></span>
      </div>
    </div>
  `;
}

function renderSubmissionBoard({ roundLabel, title, helper, submittedTeams, winner, columns, rowRenderer }) {
  const rows = submittedTeams.length
    ? submittedTeams.map((team) => rowRenderer(team, winner)).join("")
    : `<tr><td colspan="${columns.length}">No ${roundLabel} submissions yet.</td></tr>`;

  return `
    <div class="submission-board-header">
      <div>
        <span>${roundLabel}</span>
        <h2>${title}</h2>
        <p>${helper}</p>
      </div>
      <strong>${winner ? `${getTeamLabel(winner)} Wins` : "Waiting for submissions"}</strong>
    </div>
    <div class="submission-table-wrap">
      <table class="submission-table">
        <thead>
          <tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderRound1SummaryRow(team, winner) {
  const submission = team.round1Submission;
  const metrics = submission.metrics;
  const isWinner = winner && String(winner.teamId) === String(team.teamId);
  const budgetPenalty = Number(metrics.budgetPenalty || 0);
  const schedulePenalty = Number(metrics.schedulePenalty || 0);
  const finalScore = Number.isFinite(metrics.finalScore) ? metrics.finalScore : metrics.totalCost + budgetPenalty + schedulePenalty;
  const validSubmission = isRound1SubmissionValid(metrics);
  return `
    <tr class="${isWinner ? "winner" : ""}">
      <td><strong>${getTeamLabel(team)}</strong></td>
      <td>${formatSelectionSummary(RESOURCES, submission.quantities)}</td>
      <td>${formatNumber(metrics.totalCapacity)} Units/Day</td>
      <td>${formatNumber(metrics.supportWorkerCapacity)} / ${formatNumber(metrics.requiredSupport)}</td>
      <td>${formatNumber(metrics.totalCost)} Credits</td>
      <td>${formatNumber(budgetPenalty + schedulePenalty)}</td>
      <td>${formatNumber(finalScore)}</td>
      <td>${isWinner ? "Winner" : validSubmission ? "Valid" : "Invalid"}</td>
    </tr>
  `;
}

function renderRound2SummaryRow(team, winner) {
  const submission = team.round2Submission;
  const metrics = submission.metrics;
  const isWinner = winner && String(winner.teamId) === String(team.teamId);
  return `
    <tr class="${isWinner ? "winner" : ""}">
      <td><strong>${getTeamLabel(team)}</strong></td>
      <td>${metrics.selectedStrategyLabel}</td>
      <td>${formatSelectionSummary(ROUND2_RESOURCES, submission.quantities)}</td>
      <td>${formatNumber(metrics.weightedScore)} / 100</td>
      <td>${formatNumber(metrics.totalPenalty || 0)}</td>
      <td>${formatNumber(metrics.finalValue)} / 100</td>
      <td>${formatNumber(metrics.totalCost)} Credits</td>
      <td><span class="${metrics.eligible ? "status-pass" : "status-fail"}">${metrics.eligible ? "YES" : "NO"}</span></td>
      <td>${isWinner ? "Winner" : metrics.eligible ? "Eligible" : "Not eligible"}</td>
    </tr>
  `;
}

function getRound1Winner(teams) {
  return teams
    .filter((team) => isRound1SubmissionValid(team.round1Submission.metrics))
    .sort((a, b) => getRound1FinalScore(a) - getRound1FinalScore(b) || Number(a.teamId) - Number(b.teamId))[0] || null;
}

function getRound1FinalScore(team) {
  const metrics = team.round1Submission.metrics;
  if (Number.isFinite(metrics.finalScore)) return metrics.finalScore;
  return metrics.totalCost + Number(metrics.budgetPenalty || 0) + Number(metrics.schedulePenalty || 0);
}

function isRound1SubmissionValid(metrics) {
  if (typeof metrics.round1Submittable === "boolean") return metrics.round1Submittable;
  return Boolean(metrics.supportFeasible && metrics.capacityFeasible);
}

function getRound2Winner(teams) {
  return teams
    .filter((team) => team.round2Submission.metrics.eligible)
    .sort((a, b) => getRound2TieBreakScore(b) - getRound2TieBreakScore(a) || Number(a.teamId) - Number(b.teamId))[0] || null;
}

function getRound2TieBreakScore(team) {
  const metrics = team.round2Submission.metrics;
  if (Number.isFinite(metrics.tieBreakScore)) return metrics.tieBreakScore;
  return metrics.finalValue + (ROUND2_PROJECT.budgetLimit - metrics.totalCost) / 10000;
}

function formatSelectionSummary(resources, quantities) {
  const selected = resources
    .map((resource) => {
      const quantity = Number(quantities?.[resource.id] || 0);
      return quantity > 0 ? `${resource.shortLabel || resource.label}: ${quantity}` : "";
    })
    .filter(Boolean);
  return selected.length ? selected.join(" | ") : "-";
}

function evaluateRound() {
  const humanResources = RESOURCES.filter((resource) => resource.group === "human");
  const robotResources = RESOURCES.filter((resource) => resource.group === "robot");

  const humanCount = sum(humanResources, (resource) => getQuantity(resource.id));
  const robotCount = sum(robotResources, (resource) => getQuantity(resource.id));
  const humanCapacity = sum(humanResources, (resource) => getQuantity(resource.id) * resource.capacity);
  const robotCapacity = sum(robotResources, (resource) => getQuantity(resource.id) * resource.capacity);
  const totalCapacity = humanCapacity + robotCapacity;
  const totalCost = sum(RESOURCES, (resource) => getQuantity(resource.id) * resource.cost);
  const requiredSupport = sum(robotResources, (resource) => getQuantity(resource.id) * (resource.supportLoad || 0));
  const supportWorkerCapacity = getQuantity("supportWorkers") * (getResource("supportWorkers").supportCapacity || 0);
  const estimatedDuration = totalCapacity > 0 ? PROJECT.totalDemand / totalCapacity : 0;
  const capacityFeasible = totalCapacity > 0;
  const targetCapacityFeasible = totalCapacity >= PROJECT.requiredDailyCapacity;
  const budgetFeasible = totalCost <= PROJECT.budgetLimit;
  const supportFeasible = requiredSupport <= supportWorkerCapacity || requiredSupport === 0;
  const scheduleFeasible = estimatedDuration > 0 && estimatedDuration <= PROJECT.days;
  const budgetOverrun = Math.max(0, totalCost - PROJECT.budgetLimit);
  const scheduleOverrun = Math.max(0, estimatedDuration - PROJECT.days);
  const budgetPenalty = budgetOverrun * PROJECT.budgetPenaltyMultiplier;
  const schedulePenalty = scheduleOverrun * PROJECT.schedulePenaltyPerDay;
  const finalScore = totalCost + budgetPenalty + schedulePenalty;
  const round1Submittable = supportFeasible && capacityFeasible;

  return {
    humanCount,
    robotCount,
    humanCapacity,
    robotCapacity,
    totalCapacity,
    totalCost,
    requiredSupport,
    supportWorkerCapacity,
    estimatedDuration,
    capacityFeasible,
    targetCapacityFeasible,
    budgetFeasible,
    supportFeasible,
    scheduleFeasible,
    budgetOverrun,
    scheduleOverrun,
    budgetPenalty,
    schedulePenalty,
    finalScore,
    round1Submittable,
    round1Feasible: round1Submittable,
  };
}

function resetRound2() {
  if (!isRound2Unlocked() || isRound2Locked()) {
    render();
    return;
  }
  state.round2 = createDefaultRound2State();
  persistState();
  render();
}

function renderRound2() {
  if (!round2StrategyGridEl || !round2ResourceGridEl) return;

  const metrics = evaluateRound2();
  renderRound2Strategies();
  renderRound2Resources(metrics);
  renderRound2Dashboard(metrics);
  renderRound2Constraints(metrics);
  renderRound2Alignment(metrics);
  renderRound2FinalValue(metrics);
  renderRound2Confirmation(metrics);
}

function renderRound2Strategies() {
  const locked = !isRound2Unlocked() || isRound2Locked();
  round2StrategyGridEl.innerHTML = ROUND2_STRATEGIES.map((strategy) => {
    const selected = state.round2.strategy === strategy.id;
    return `
      <article class="strategy-card ${strategy.color} ${selected ? "selected" : ""} ${locked ? "locked" : ""}" data-r2-strategy="${strategy.id}">
        <div class="strategy-check" aria-hidden="true">${selected ? "✓" : ""}</div>
        <div class="strategy-visual ${strategy.id}" aria-hidden="true"></div>
        <h4>${strategy.label}</h4>
        <p>${strategy.description}</p>
        <div class="strategy-scores">
          ${renderStrategyStars("Productivity", strategy.stars.productivity)}
          ${renderStrategyStars("Operational Safety", strategy.stars.safety)}
          ${renderStrategyStars("Manual Effort Reduction", strategy.stars.effort)}
        </div>
        ${renderStrategyWeights(strategy)}
      </article>
    `;
  }).join("");

  round2StrategyGridEl.querySelectorAll("[data-r2-strategy]").forEach((card) => {
    card.addEventListener("click", () => {
      if (locked) return;
      state.round2.strategy = card.dataset.r2Strategy;
      state.round2.confirmed = false;
      persistState();
      render();
    });
  });
}

function renderStrategyStars(label, count) {
  return `
    <span>
      <small>${label}</small>
      <b>${"★".repeat(count)}</b>
    </span>
  `;
}

function renderStrategyWeights(strategy) {
  return `
    <div class="strategy-weights" aria-label="${strategy.label} performance score weights">
      <span>Productivity ${Math.round(strategy.weights.productivity * 100)}%</span>
      <span>Safety ${Math.round(strategy.weights.safety * 100)}%</span>
      <span>Effort ${Math.round(strategy.weights.effort * 100)}%</span>
    </div>
  `;
}

function renderRound2Resources(metrics) {
  const groups = [
    {
      label: "Human Resources",
      helper: "Skilled, material, and support workers add capacity, support, and performance effects.",
      resources: ROUND2_RESOURCES.filter((resource) => resource.group === "human"),
    },
    {
      label: "Robots / Fleets",
      helper: "Robot choices add delivery capacity and performance effects.",
      resources: ROUND2_RESOURCES.filter((resource) => resource.group === "robot"),
    },
  ];

  round2ResourceGridEl.innerHTML = groups.map((group) => `
    <section class="r2-resource-group ${group.resources[0]?.group || ""}">
      <div class="r2-resource-group-heading">
        <h4>${group.label}</h4>
        <p>${group.helper}</p>
      </div>
      <div class="r2-resource-card-grid">
        ${group.resources.map((resource) => renderRound2ResourceCard(resource, metrics)).join("")}
      </div>
    </section>
  `).join("");

  round2ResourceGridEl.querySelectorAll("[data-r2-resource-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const resourceId = button.dataset.r2ResourceId;
      const delta = button.dataset.action === "increment" ? 1 : -1;
      setRound2Quantity(resourceId, getRound2Quantity(resourceId) + delta);
    });
  });

  round2ResourceGridEl.querySelectorAll("[data-r2-resource-input]").forEach((input) => {
    input.addEventListener("input", () => {
      setRound2Quantity(input.dataset.r2ResourceInput, Number(input.value));
    });
  });
}

function renderRound2ResourceCard(resource, metrics) {
    const locked = !isRound2Unlocked() || isRound2Locked();
    const value = getRound2Quantity(resource.id);
    const isHuman = resource.group === "human";
    const isRobot = resource.group === "robot";
    const humanTotalWithoutCurrent = metrics.humanCount - (isHuman ? value : 0);
    const robotTotalWithoutCurrent = metrics.robotCount - (isRobot ? value : 0);
    const maxForResource = isHuman
      ? Math.max(0, ROUND2_PROJECT.maxHumanWorkers - humanTotalWithoutCurrent)
      : Math.max(0, ROUND2_PROJECT.maxRobots - robotTotalWithoutCurrent);
    const canIncrement = !locked && value < maxForResource;

    return `
      <article class="r2-resource-card ${resource.accent} ${locked ? "locked" : ""}">
        <div class="r2-resource-visual ${resource.visual}" aria-hidden="true">
          ${renderVisualParts(resource.visual)}
        </div>
        <h4>${resource.label}</h4>
        <p>${resource.description}</p>
        ${renderRound2CapacityPill(resource)}
        ${renderRound2ResourceEffects(resource)}
        <div class="quantity-row">
          <span>Quantity</span>
          <div class="stepper r2-stepper">
            <button data-r2-resource-id="${resource.id}" data-action="decrement" type="button" aria-label="Decrease ${resource.label}" ${locked || value <= 0 ? "disabled" : ""}>-</button>
            <input data-r2-resource-input="${resource.id}" type="number" min="0" max="${maxForResource}" value="${value}" aria-label="${resource.label} quantity" ${locked ? "disabled" : ""} />
            <button data-r2-resource-id="${resource.id}" data-action="increment" type="button" aria-label="Increase ${resource.label}" ${canIncrement ? "" : "disabled"}>+</button>
          </div>
        </div>
        <div class="r2-cost">Credits: ${resource.cost} / ${resource.group === "human" ? "Worker" : resource.id === "multiRobotFleets" ? "Fleet" : "Robot"}</div>
      </article>
    `;
}

function renderRound2CapacityPill(resource) {
  const iconClass = resource.group === "human" ? "human-icon" : "robot-icon";
  const label = resource.supportCapacity ? "Support Contribution" : "Capacity Contribution";
  const value = resource.supportCapacity
    ? `${formatNumber(resource.supportCapacity)} Support Unit / Day`
    : `${formatNumber(resource.capacity)} Units / Day`;
  return `
    <div class="capacity-pill r2-capacity-pill">
      <span class="mini-icon ${iconClass}" aria-hidden="true"></span>
      <span><small>${label}</small>${value}</span>
    </div>
  `;
}

function renderRound2ResourceEffects(resource) {
  if (!resource.effects) {
    return `<div class="r2-effects empty" aria-hidden="true"></div>`;
  }

  return `
    <div class="r2-effects">
      <span>Productivity +${resource.effects.productivity}</span>
      <span>Safety +${resource.effects.safety}</span>
      <span>Effort +${resource.effects.effort}</span>
    </div>
  `;
}

function renderRound2Dashboard(metrics) {
  round2DashboardMetricsEl.innerHTML = [
    renderDashboardMetric("Net Daily Capacity", `${formatNumber(metrics.netDailyCapacity)} Loads / Day`, "Target expected delivery capacity", metrics.capacityFeasible, metrics.netDailyCapacity, ROUND2_PROJECT.requiredDailyCapacity, "blue"),
    renderDashboardMetric("Productivity", `${formatNumber(metrics.productivity)} /100`, "Performance target", metrics.productivityFeasible, metrics.productivity, ROUND2_PROJECT.performanceTarget, "purple"),
    renderDashboardMetric("Operational Safety", `${formatNumber(metrics.safety)} /100`, "Performance target", metrics.safetyFeasible, metrics.safety, ROUND2_PROJECT.performanceTarget, "blue"),
    renderDashboardMetric("Manual Effort Reduction", `${formatNumber(metrics.effort)} /100`, "Performance target", metrics.effortFeasible, metrics.effort, ROUND2_PROJECT.performanceTarget, "green"),
    renderDashboardMetric("Credits", `${formatNumber(metrics.totalCost)} Credits`, `Budget Usage: ${formatNumber(metrics.budgetUsage)}%`, metrics.budgetFeasible, metrics.totalCost, ROUND2_PROJECT.budgetLimit, "orange"),
  ].join("");
}

function renderDashboardMetric(label, value, helper, passed, current, target, color) {
  const denominator = label === "Credits" ? target : 100;
  const marker = label === "Net Daily Capacity" || label === "Credits" ? target : ROUND2_PROJECT.performanceTarget;
  const fillPercent = Math.min(100, denominator > 0 ? (current / denominator) * 100 : 0);
  const markerPercent = Math.min(100, denominator > 0 ? (marker / denominator) * 100 : 0);
  return `
    <article class="dashboard-metric ${color} ${passed ? "pass" : "fail"}">
      <div class="dashboard-metric-icon" aria-hidden="true"></div>
      <div class="dashboard-metric-body">
        <div class="dashboard-metric-heading">
          <span><strong>${label}</strong><small>${helper}</small></span>
          <b>${value}</b>
        </div>
        <div class="dashboard-bar">
          <span style="width:${fillPercent}%"></span>
          <i style="left:${markerPercent}%">${formatNumber(marker)}</i>
        </div>
      </div>
    </article>
  `;
}

function renderRound2Constraints(metrics) {
  const constraints = [
    ["Delivery Time", `≤ ${ROUND2_PROJECT.days} Days`, metrics.estimatedDuration ? `${formatNumber(metrics.estimatedDuration)} Days` : "-", metrics.capacityFeasible],
    ["Support", `≥ ${formatNumber(metrics.requiredSupport)} Support`, formatNumber(metrics.supportWorkerCapacity), metrics.supportFeasible],
    ["Budget Target", `Penalty above ${ROUND2_PROJECT.budgetLimit}`, formatNumber(metrics.totalCost), metrics.budgetFeasible],
    ["Productivity", `Target ${ROUND2_PROJECT.performanceTarget}`, formatNumber(metrics.productivity), metrics.productivityFeasible],
    ["Operational Safety", `Target ${ROUND2_PROJECT.performanceTarget}`, formatNumber(metrics.safety), metrics.safetyFeasible],
    ["Manual Effort Reduction", `Target ${ROUND2_PROJECT.performanceTarget}`, formatNumber(metrics.effort), metrics.effortFeasible],
  ];

  round2ConstraintsEl.innerHTML = constraints.map(([label, rule, value, passed]) => `
    <article class="constraint-card ${passed ? "pass" : "fail"}">
      <small>${label}</small>
      <span>${rule}</span>
      <strong>${value}</strong>
      <b>${passed ? "✓" : "!"}</b>
    </article>
  `).join("");
}

function renderRound2Alignment(metrics) {
  const robotSharePercent = metrics.netDailyCapacity > 0 ? metrics.robotCapacityShare * 100 : 0;
  round2AlignmentEl.className = `alignment-card ${metrics.aligned ? "pass" : "fail"}`;
  round2AlignmentEl.innerHTML = `
    <div class="alignment-icon" aria-hidden="true"></div>
    <div>
      <strong>${!state.round2.strategy ? "Select Strategy" : metrics.aligned ? "Good Alignment" : "Strategy Mismatch"}</strong>
      <p>Selected: ${metrics.selectedStrategy.label}. Operational mode: ${metrics.operationalMode.label}.</p>
      <p class="alignment-share">Robot Capacity Share: <b>${formatNumber(robotSharePercent)}%</b> <span>Operational mode is inferred from the balance of human and robot delivery capacity.</span></p>
    </div>
    <b>${!state.round2.strategy ? "--" : metrics.aligned ? "100%" : `-${formatNumber(metrics.strategyPenalty)}`}</b>
  `;
}

function renderRound2FinalValue(metrics) {
  const valueStatus = !state.round2.strategy || !metrics.supportFeasible || !metrics.robotLimitFeasible
    ? "fail"
    : metrics.totalPenalty > 0
      ? "warning"
      : "pass";
  round2FinalValueEl.className = `final-value-card ${valueStatus}`;
  round2FinalValueEl.innerHTML = `
    <small>Penalty-Adjusted Final Value</small>
    <strong>${formatNumber(metrics.finalValue)} <span>/100</span></strong>
    <p>${formatNumber(metrics.weightedScore)} performance score - ${formatNumber(metrics.strategyPenalty)} strategy penalty - ${formatNumber(metrics.performancePenalty)} performance penalty - ${formatNumber(metrics.schedulePenalty)} time penalty - ${formatNumber(metrics.budgetPenalty)} budget penalty</p>
    <div class="round2-score-breakdown">
      <span><small>Strategy</small><b>-${formatNumber(metrics.strategyPenalty)}</b></span>
      <span><small>Performance</small><b>-${formatNumber(metrics.performancePenalty)}</b></span>
      <span><small>Time</small><b>-${formatNumber(metrics.schedulePenalty)}</b></span>
      <span><small>Budget</small><b>-${formatNumber(metrics.budgetPenalty)}</b></span>
    </div>
  `;
}

function renderRound2Confirmation(metrics) {
  const unlocked = isRound2Unlocked();
  const locked = isRound2Locked();
  if (resetRound2Button) resetRound2Button.disabled = !unlocked || locked;
  if (confirmRound2Button) {
    confirmRound2Button.disabled = !unlocked || locked || !state.round2.strategy;
    const labelEl = confirmRound2Button.querySelector("span");
    if (labelEl) {
      labelEl.innerHTML = locked
        ? `Round 2 Submitted<small>Final submission locked</small>`
        : unlocked
          ? state.round2.strategy
            ? `Confirm &amp; Calculate<small>Submit Round 2 final plan</small>`
            : `Select Strategy<small>Choose a Round 2 strategy first</small>`
          : `Round 2 Locked<small>Submit Round 1 first</small>`;
    }
  }

  if (!unlocked) {
    round2ConfirmationEl.className = "confirmation-message fail";
    round2ConfirmationEl.textContent = "Round 2 unlocks after this team submits Round 1.";
    return;
  }

  if (!state.round2.confirmed) {
    round2ConfirmationEl.textContent = "";
    round2ConfirmationEl.className = "confirmation-message";
    return;
  }

  round2ConfirmationEl.className = `confirmation-message ${metrics.eligible ? "pass" : "fail"}`;
  round2ConfirmationEl.textContent = locked
    ? metrics.eligible
      ? `Round 2 final submission is locked: final value ${formatNumber(metrics.finalValue)} after ${formatNumber(metrics.totalPenalty)} penalty points. Summary unlocks after every team submits Round 2.`
      : "Round 2 final submission is recorded, but support or robot limit rules are not met."
    : metrics.eligible
      ? `Round 2 submitted successfully: final value ${formatNumber(metrics.finalValue)} after ${formatNumber(metrics.totalPenalty)} penalty points. Your final plan is now locked.`
      : "Round 2 submitted. Support or robot limit rules are not met, so it will appear as Not eligible in the summary.";
}

function evaluateRound2() {
  const humanResources = ROUND2_RESOURCES.filter((resource) => resource.group === "human");
  const robotResources = ROUND2_RESOURCES.filter((resource) => resource.group === "robot");
  const selectedStrategy = ROUND2_STRATEGIES.find((strategy) => strategy.id === state.round2.strategy) || null;
  const humanCount = sum(humanResources, (resource) => getRound2Quantity(resource.id));
  const robotCount = sum(robotResources, (resource) => getRound2Quantity(resource.id));
  const humanCapacity = sum(humanResources, (resource) => getRound2Quantity(resource.id) * resource.capacity);
  const robotCapacity = sum(robotResources, (resource) => getRound2Quantity(resource.id) * resource.capacity);
  const netDailyCapacity = humanCapacity + robotCapacity;
  const totalCost = sum(ROUND2_RESOURCES, (resource) => getRound2Quantity(resource.id) * resource.cost);
  const requiredSupport = sum(robotResources, (resource) => getRound2Quantity(resource.id) * (resource.supportLoad || 0));
  const supportWorkerCapacity = getRound2Quantity("supportWorkers");
  const performanceResources = ROUND2_RESOURCES.filter((resource) => resource.effects);
  const productivity = Math.min(100, 50 + sum(performanceResources, (resource) => getRound2Quantity(resource.id) * resource.effects.productivity));
  const safety = Math.min(100, 50 + sum(performanceResources, (resource) => getRound2Quantity(resource.id) * resource.effects.safety));
  const effort = Math.min(100, 50 + sum(performanceResources, (resource) => getRound2Quantity(resource.id) * resource.effects.effort));
  const estimatedDuration = netDailyCapacity > 0 ? ROUND2_PROJECT.totalDemand / netDailyCapacity : 0;
  const robotCapacityShare = netDailyCapacity > 0 ? robotCapacity / netDailyCapacity : 0;
  const operationalMode = getOperationalMode(robotCapacityShare);
  const aligned = Boolean(selectedStrategy) && selectedStrategy.id === operationalMode.id;
  const weightedScore = selectedStrategy
    ? productivity * selectedStrategy.weights.productivity +
      safety * selectedStrategy.weights.safety +
      effort * selectedStrategy.weights.effort
    : 0;
  const strategyPenalty = selectedStrategy && !aligned ? ROUND2_PROJECT.strategyMismatchPenalty : 0;
  const performanceShortfall =
    Math.max(0, ROUND2_PROJECT.performanceTarget - productivity) +
    Math.max(0, ROUND2_PROJECT.performanceTarget - safety) +
    Math.max(0, ROUND2_PROJECT.performanceTarget - effort);
  const performancePenalty = performanceShortfall * ROUND2_PROJECT.performanceGapPenaltyMultiplier;
  const scheduleOverrun = netDailyCapacity > 0 ? Math.max(0, estimatedDuration - ROUND2_PROJECT.days) : ROUND2_PROJECT.days;
  const schedulePenalty = scheduleOverrun * ROUND2_PROJECT.schedulePenaltyPerDay;
  const budgetOverrun = Math.max(0, totalCost - ROUND2_PROJECT.budgetLimit);
  const budgetPenalty = budgetOverrun * ROUND2_PROJECT.budgetOverrunPenaltyMultiplier;
  const totalPenalty = strategyPenalty + performancePenalty + schedulePenalty + budgetPenalty;
  const finalValue = Math.max(0, weightedScore - totalPenalty);
  const capacityFeasible = estimatedDuration > 0 && estimatedDuration <= ROUND2_PROJECT.days;
  const budgetFeasible = totalCost <= ROUND2_PROJECT.budgetLimit;
  const robotLimitFeasible = robotCount <= ROUND2_PROJECT.maxRobots;
  const supportFeasible = requiredSupport <= supportWorkerCapacity || requiredSupport === 0;
  const productivityFeasible = productivity >= ROUND2_PROJECT.performanceTarget;
  const safetyFeasible = safety >= ROUND2_PROJECT.performanceTarget;
  const effortFeasible = effort >= ROUND2_PROJECT.performanceTarget;
  const eligible = Boolean(selectedStrategy) && robotLimitFeasible && supportFeasible;

  return {
    humanCount,
    robotCount,
    humanCapacity,
    robotCapacity,
    netDailyCapacity,
    estimatedDuration,
    totalCost,
    requiredSupport,
    supportWorkerCapacity,
    productivity,
    safety,
    effort,
    selectedStrategy: selectedStrategy || { id: "", label: "No strategy selected" },
    operationalMode,
    robotCapacityShare,
    aligned,
    weightedScore,
    strategyPenalty,
    performanceShortfall,
    performancePenalty,
    scheduleOverrun,
    schedulePenalty,
    budgetOverrun,
    budgetPenalty,
    totalPenalty,
    finalValue,
    budgetUsage: ROUND2_PROJECT.budgetLimit > 0 ? (totalCost / ROUND2_PROJECT.budgetLimit) * 100 : 0,
    capacityFeasible,
    budgetFeasible,
    robotLimitFeasible,
    supportFeasible,
    productivityFeasible,
    safetyFeasible,
    effortFeasible,
    eligible,
  };
}

function snapshotRound1Metrics(metrics) {
  return {
    humanCount: metrics.humanCount,
    robotCount: metrics.robotCount,
    humanCapacity: metrics.humanCapacity,
    robotCapacity: metrics.robotCapacity,
    totalCapacity: metrics.totalCapacity,
    totalCost: metrics.totalCost,
    requiredSupport: metrics.requiredSupport,
    supportWorkerCapacity: metrics.supportWorkerCapacity,
    estimatedDuration: metrics.estimatedDuration,
    capacityFeasible: metrics.capacityFeasible,
    targetCapacityFeasible: metrics.targetCapacityFeasible,
    budgetFeasible: metrics.budgetFeasible,
    supportFeasible: metrics.supportFeasible,
    scheduleFeasible: metrics.scheduleFeasible,
    budgetOverrun: metrics.budgetOverrun,
    scheduleOverrun: metrics.scheduleOverrun,
    budgetPenalty: metrics.budgetPenalty,
    schedulePenalty: metrics.schedulePenalty,
    finalScore: metrics.finalScore,
    round1Submittable: metrics.round1Submittable,
    round1Feasible: metrics.round1Feasible,
  };
}

function snapshotRound2Metrics(metrics) {
  return {
    humanCount: metrics.humanCount,
    robotCount: metrics.robotCount,
    humanCapacity: metrics.humanCapacity,
    robotCapacity: metrics.robotCapacity,
    netDailyCapacity: metrics.netDailyCapacity,
    estimatedDuration: metrics.estimatedDuration,
    totalCost: metrics.totalCost,
    requiredSupport: metrics.requiredSupport,
    supportWorkerCapacity: metrics.supportWorkerCapacity,
    productivity: metrics.productivity,
    safety: metrics.safety,
    effort: metrics.effort,
    selectedStrategyId: metrics.selectedStrategy.id,
    selectedStrategyLabel: metrics.selectedStrategy.label,
    operationalModeId: metrics.operationalMode.id,
    operationalModeLabel: metrics.operationalMode.label,
    robotCapacityShare: metrics.robotCapacityShare,
    aligned: metrics.aligned,
    weightedScore: metrics.weightedScore,
    strategyPenalty: metrics.strategyPenalty,
    performanceShortfall: metrics.performanceShortfall,
    performancePenalty: metrics.performancePenalty,
    scheduleOverrun: metrics.scheduleOverrun,
    schedulePenalty: metrics.schedulePenalty,
    budgetOverrun: metrics.budgetOverrun,
    budgetPenalty: metrics.budgetPenalty,
    totalPenalty: metrics.totalPenalty,
    finalValue: metrics.finalValue,
    tieBreakScore: metrics.eligible ? metrics.finalValue + (ROUND2_PROJECT.budgetLimit - metrics.totalCost) / 10000 : 0,
    budgetUsage: metrics.budgetUsage,
    capacityFeasible: metrics.capacityFeasible,
    budgetFeasible: metrics.budgetFeasible,
    robotLimitFeasible: metrics.robotLimitFeasible,
    supportFeasible: metrics.supportFeasible,
    productivityFeasible: metrics.productivityFeasible,
    safetyFeasible: metrics.safetyFeasible,
    effortFeasible: metrics.effortFeasible,
    eligible: metrics.eligible,
  };
}

function getOperationalMode(robotCapacityShare) {
  if (robotCapacityShare < 0.35) {
    return ROUND2_STRATEGIES.find((strategy) => strategy.id === "human-led");
  }
  if (robotCapacityShare <= 0.75) {
    return ROUND2_STRATEGIES.find((strategy) => strategy.id === "collaborative");
  }
  return ROUND2_STRATEGIES.find((strategy) => strategy.id === "robot-led");
}

function setRound2Quantity(resourceId, rawValue) {
  if (!isRound2Unlocked() || isRound2Locked()) return;
  const resource = ROUND2_RESOURCES.find((item) => item.id === resourceId);
  if (!resource) return;

  const current = getRound2Quantity(resourceId);
  const value = Math.max(0, Math.round(Number.isFinite(rawValue) ? rawValue : 0));
  let nextValue = value;

  if (resource.group === "human") {
    const otherHumanTotal = ROUND2_RESOURCES.filter((item) => item.group === "human" && item.id !== resourceId).reduce(
      (total, item) => total + getRound2Quantity(item.id),
      0
    );
    nextValue = Math.min(value, Math.max(0, ROUND2_PROJECT.maxHumanWorkers - otherHumanTotal));
  } else if (resource.group === "robot") {
    const otherRobotTotal = ROUND2_RESOURCES.filter((item) => item.group === "robot" && item.id !== resourceId).reduce(
      (total, item) => total + getRound2Quantity(item.id),
      0
    );
    nextValue = Math.min(value, Math.max(0, ROUND2_PROJECT.maxRobots - otherRobotTotal));
  }

  state.round2.quantities[resourceId] = nextValue;
  state.round2.confirmed = false;

  if (current !== nextValue) {
    persistState();
    render();
  }
}

function getRound2Quantity(resourceId) {
  const value = Number(state.round2.quantities[resourceId]);
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function setQuantity(resourceId, rawValue, group) {
  if (!getActiveTeam() || isRound1Locked()) return;
  const current = getQuantity(resourceId);
  const value = Math.max(0, Math.round(Number.isFinite(rawValue) ? rawValue : 0));
  const groupTotalWithoutCurrent = RESOURCES.filter((resource) => resource.group === group && resource.id !== resourceId).reduce(
    (total, resource) => total + getQuantity(resource.id),
    0
  );
  const maxForResource = Math.max(0, getGroupLimit(group) - groupTotalWithoutCurrent);
  state.quantities[resourceId] = Math.min(value, maxForResource);
  state.confirmed = false;

  if (current !== state.quantities[resourceId]) {
    persistState();
    render();
  }
}

function getGroupLimit(group) {
  return group === "human" ? PROJECT.maxHumanWorkers : PROJECT.maxRobots;
}

function getResource(resourceId) {
  return RESOURCES.find((resource) => resource.id === resourceId);
}

function getQuantity(resourceId) {
  const value = Number(state.quantities[resourceId]);
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function sum(items, picker) {
  return items.reduce((total, item) => total + picker(item), 0);
}

function formatNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "0";
  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1);
}
