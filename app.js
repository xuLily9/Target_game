const STORAGE_KEY = "construction-logistics-target-value-v1";

const PROJECT = {
  totalDemand: 100,
  days: 5,
  requiredDailyCapacity: 20,
  budgetLimit: 200,
  scoreTargets: {
    productivity: 70,
    safety: 70,
    effort: 70,
  },
  weights: {
    productivity: 0.3,
    safety: 0.4,
    effort: 0.3,
  },
};

const STRATEGIES = {
  human: {
    id: "human",
    name: "Human-Led",
    cost: 20,
    productivity: -5,
    safety: -5,
    effort: -15,
    fitLabel: "Human-Led",
  },
  collaborative: {
    id: "collaborative",
    name: "Collaborative",
    cost: 30,
    productivity: 10,
    safety: 10,
    effort: 15,
    fitLabel: "Collaborative",
  },
  robot: {
    id: "robot",
    name: "Robot-Led",
    cost: 40,
    productivity: 20,
    safety: 15,
    effort: 10,
    fitLabel: "Robot-Led",
  },
};

const RESOURCES = {
  skilledWorkers: {
    id: "skilledWorkers",
    group: "human",
    label: "Skilled Worker",
    pluralLabel: "Skilled Workers",
    shortLabel: "Skilled",
    icon: "SW",
    cost: 20,
    capacity: 2,
    supportLoad: 0,
    productivity: 1,
    safety: 1,
    effort: 0,
    note: "Experienced in operating equipment and complex construction tasks.",
  },
  generalWorkers: {
    id: "generalWorkers",
    group: "human",
    label: "General Worker",
    pluralLabel: "General Workers",
    shortLabel: "General",
    icon: "GW",
    cost: 10,
    capacity: 1,
    supportLoad: 0,
    productivity: 0,
    safety: 0,
    effort: 0,
    note: "Supports material handling, loading/unloading, and site activities.",
  },
  operators: {
    id: "operators",
    group: "human",
    label: "Operator",
    pluralLabel: "Operators",
    shortLabel: "Operators",
    icon: "OP",
    cost: 15,
    capacity: 1.5,
    supportLoad: 0,
    productivity: 1,
    safety: 2,
    effort: 0,
    note: "Operates machinery and oversees robotic equipment on site.",
  },
  deliveryRobots: {
    id: "deliveryRobots",
    group: "robot",
    label: "Delivery Robot",
    pluralLabel: "Delivery Robots",
    shortLabel: "Delivery",
    icon: "DR",
    cost: 30,
    capacity: 3,
    supportLoad: 0.5,
    productivity: 5,
    safety: 5,
    effort: 8,
    note: "Designed for efficient transport of materials in structured environments.",
  },
  quadrupedRobots: {
    id: "quadrupedRobots",
    group: "robot",
    label: "Quadruped Robot",
    pluralLabel: "Quadruped Robots",
    shortLabel: "Quadruped",
    icon: "QR",
    cost: 50,
    capacity: 5,
    supportLoad: 1,
    productivity: 10,
    safety: 10,
    effort: 12,
    note: "Built for rough terrain and complex sites where mobility matters most.",
  },
  fleets: {
    id: "fleets",
    group: "robot",
    label: "Multi-Robot Fleet",
    pluralLabel: "Multi-Robot Fleets",
    shortLabel: "Fleets",
    icon: "MF",
    cost: 80,
    capacity: 8,
    supportLoad: 3,
    productivity: 18,
    safety: 8,
    effort: 18,
    note: "A coordinated fleet system delivering high efficiency at large scale.",
  },
};

const HUMAN_RESOURCE_IDS = ["skilledWorkers", "generalWorkers", "operators"];
const ROBOT_RESOURCE_IDS = ["deliveryRobots", "quadrupedRobots", "fleets"];
const RESOURCE_LIMITS = {
  human: 20,
  robot: 12,
};

const DEFAULT_TEAMS = [
  {
    id: "team-a",
    label: "Team A",
    strategy: "human",
    resources: {
      skilledWorkers: 0,
      generalWorkers: 0,
      operators: 0,
      deliveryRobots: 0,
      quadrupedRobots: 0,
      fleets: 0,
    },
  },
  {
    id: "team-b",
    label: "Team B",
    strategy: "collaborative",
    resources: {
      skilledWorkers: 4,
      generalWorkers: 4,
      operators: 2,
      deliveryRobots: 2,
      quadrupedRobots: 1,
      fleets: 0,
    },
  },
  {
    id: "team-c",
    label: "Team C",
    strategy: "robot",
    resources: {
      skilledWorkers: 2,
      generalWorkers: 2,
      operators: 2,
      deliveryRobots: 1,
      quadrupedRobots: 1,
      fleets: 2,
    },
  },
];

const state = loadState();

const teamTabsEl = document.getElementById("team-tabs");
const activeTeamTitleEl = document.getElementById("active-team-title");
const strategyControlsEl = document.getElementById("strategy-controls");
const resourceControlsEl = document.getElementById("resource-controls");
const siteVisualEl = document.getElementById("site-visual");
const kpiGridEl = document.getElementById("kpi-grid");
const progressListEl = document.getElementById("progress-list");
const checksListEl = document.getElementById("checks-list");
const comparisonSummaryEl = document.getElementById("comparison-summary");
const resetAllButton = document.getElementById("reset-all");

resetAllButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  const fresh = createDefaultState();
  state.activeTeamId = fresh.activeTeamId;
  state.teams = fresh.teams;
  persistState();
  render();
});

render();

function createDefaultState() {
  return {
    activeTeamId: "team-a",
    teams: structuredClone(DEFAULT_TEAMS),
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved?.teams?.length) return createDefaultState();
    const defaults = createDefaultState();
    return {
      activeTeamId: saved.activeTeamId || defaults.activeTeamId,
      teams: defaults.teams.map((team) => {
        const savedTeam = saved.teams.find((item) => item.id === team.id) || {};
        return {
          ...team,
          ...savedTeam,
          resources: {
            ...team.resources,
            ...(savedTeam.resources || {}),
          },
        };
      }),
    };
  } catch {
    return createDefaultState();
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  const activeTeam = getActiveTeam();
  const activeMetrics = evaluateTeam(activeTeam);
  const allMetrics = state.teams.map((team) => ({ team, metrics: evaluateTeam(team) }));
  const winners = calculateWinners(allMetrics);

  renderTeamTabs(allMetrics, winners);
  renderControls(activeTeam);
  renderSiteVisual(activeTeam, activeMetrics);
  renderKpis(activeMetrics);
  renderProgress(activeMetrics);
  renderChecks(activeTeam, activeMetrics);
  renderComparison(allMetrics, winners);
}

function getActiveTeam() {
  return state.teams.find((team) => team.id === state.activeTeamId) || state.teams[0];
}

function renderTeamTabs(allMetrics, winners) {
  teamTabsEl.innerHTML = allMetrics
    .map(({ team, metrics }) => {
      const active = team.id === state.activeTeamId ? "active" : "";
      const winnerTags = [
        winners.round1?.team.id === team.id ? `<span class="winner-chip">Round 1 Winner</span>` : "",
        winners.round2?.team.id === team.id ? `<span class="winner-chip">Round 2 Winner</span>` : "",
      ].join("");
      return `
        <button class="team-tab ${active}" data-team-id="${team.id}" type="button">
          <span>${team.label}</span>
          <strong>${STRATEGIES[team.strategy].name}</strong>
          <small>${formatCredits(metrics.totalCost)} / ${formatNumber(metrics.netCapacity)} units/day</small>
          ${winnerTags}
        </button>
      `;
    })
    .join("");

  teamTabsEl.querySelectorAll("[data-team-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTeamId = button.dataset.teamId;
      persistState();
      render();
    });
  });
}

function renderControls(team) {
  const metrics = evaluateTeam(team);
  const humanCount = getResourceCount(team, HUMAN_RESOURCE_IDS);
  const robotCount = getResourceCount(team, ROBOT_RESOURCE_IDS);
  const humanCapacity = getCapacityForIds(team, HUMAN_RESOURCE_IDS);
  const robotCapacity = getCapacityForIds(team, ROBOT_RESOURCE_IDS);

  activeTeamTitleEl.textContent = `${team.label} Round 1 Decision Sheet`;
  strategyControlsEl.innerHTML = `
    <div class="round-one-topline">
      <div class="round-badge"><span>Round</span><strong>1</strong></div>
      <div>
        <h3>Round 1 - Make Your Decisions</h3>
        <p>Plan your resources to meet the daily capacity target within budget.</p>
      </div>
      <div class="round-stat capacity">
        <span class="round-stat-icon gauge-symbol" aria-hidden="true"></span>
        <div><span>Capacity Target</span><strong>20 Units / Day</strong><small>Total capacity you need to achieve</small></div>
      </div>
      <div class="round-stat budget">
        <span class="round-stat-icon credit-symbol" aria-hidden="true"></span>
        <div><span>Budget Limit</span><strong>200 Credits</strong><small>Total budget for this round</small></div>
      </div>
      <div class="mission-progress">
        <span>Mission Progress</span>
        <div><strong>1</strong><i></i><em>2</em></div>
        <small>Round 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Round 2</small>
      </div>
    </div>

    <div class="round-tabs" aria-label="Decision categories">
      <button class="active" type="button"><span class="tab-person" aria-hidden="true"></span> Human Workers</button>
      <button type="button"><span class="tab-equipment" aria-hidden="true"></span> Equipment</button>
      <button type="button"><span class="tab-support" aria-hidden="true"></span> Site Support</button>
    </div>
  `;

  resourceControlsEl.innerHTML = `
    <div class="round-selection-layout">
      <div class="allocation-panel">
        <div class="allocation-heading">
          <span class="section-number">1</span>
          <div>
            <h3>Allocate Your Resources</h3>
            <p>Choose the right mix of human workers and robots to achieve the target capacity.</p>
          </div>
        </div>

        <section class="resource-section human-section">
          <div class="resource-section-head">
            <div><span class="section-icon person-icon" aria-hidden="true"></span><h4>Human Workers</h4></div>
            <strong>Max Available: ${RESOURCE_LIMITS.human} Workers</strong>
          </div>
          <div class="round-card-grid">
            ${HUMAN_RESOURCE_IDS.map((resourceId) => renderRoundResourceCard(team, resourceId)).join("")}
          </div>
        </section>

        <section class="resource-section robot-section">
          <div class="resource-section-head">
            <div><span class="section-icon robot-icon" aria-hidden="true"></span><h4>Robots</h4></div>
            <strong>Max Available: ${RESOURCE_LIMITS.robot} Robots / Fleet</strong>
          </div>
          <div class="round-card-grid">
            ${ROBOT_RESOURCE_IDS.map((resourceId) => renderRoundResourceCard(team, resourceId)).join("")}
          </div>
        </section>

        <div class="round-tip">
          <strong>Tip</strong>
          <span>Consider the site conditions and material demand to choose the best mix of resources.</span>
        </div>
      </div>

      <aside class="selection-summary">
        <h3><span class="summary-icon" aria-hidden="true"></span>Your Selection Summary</h3>

        <div class="summary-block human">
          <h4>Human Workers</h4>
          ${HUMAN_RESOURCE_IDS.map((resourceId) => renderSummaryRow(team, resourceId)).join("")}
          <div class="summary-total"><span>Total Human Capacity</span><strong>${formatNumber(humanCapacity)} Units / Day</strong></div>
        </div>

        <div class="summary-block robot">
          <h4>Robots / Fleets</h4>
          ${ROBOT_RESOURCE_IDS.map((resourceId) => renderSummaryRow(team, resourceId)).join("")}
          <div class="summary-total"><span>Total Robot Capacity</span><strong>${formatNumber(robotCapacity)} Units / Day</strong></div>
        </div>

        <div class="summary-metric">
          <span class="summary-gauge" aria-hidden="true"></span>
          <div><span>Total Expected Capacity</span><strong>${formatNumber(metrics.netCapacity)} Units / Day</strong><small>Target: ${PROJECT.requiredDailyCapacity} Units / Day</small></div>
        </div>

        <div class="summary-metric cost">
          <span class="summary-credit" aria-hidden="true"></span>
          <div><span>Estimated Total Cost</span><strong>${formatCredits(metrics.totalCost)}</strong><small>Budget Limit: ${formatCredits(PROJECT.budgetLimit)}</small></div>
        </div>

        <div class="summary-note">
          <strong>Note</strong>
          <span>Actual results will be calculated in the Results Dashboard based on your strategy and site conditions.</span>
        </div>

        <div class="summary-actions">
          <button class="summary-reset" data-round-reset type="button">Reset</button>
          <a class="summary-confirm" href="#kpi-grid">Confirm &amp; Calculate <span>Proceed to Round 1 Results</span></a>
        </div>
      </aside>
    </div>
  `;

  resourceControlsEl.querySelectorAll("[data-resource-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const resourceId = button.dataset.resourceId;
      const delta = button.dataset.action === "increment" ? 1 : -1;
      team.resources[resourceId] = clampResourceQuantity(team, resourceId, getResourceValue(team, resourceId) + delta);
      persistState();
      render();
    });
  });

  resourceControlsEl.querySelectorAll("[data-resource-input]").forEach((input) => {
    input.addEventListener("input", () => {
      team.resources[input.dataset.resourceInput] = clampResourceQuantity(team, input.dataset.resourceInput, Number(input.value));
      persistState();
      render();
    });
  });

  const resetButton = resourceControlsEl.querySelector("[data-round-reset]");
  resetButton?.addEventListener("click", () => {
    Object.keys(team.resources).forEach((resourceId) => {
      team.resources[resourceId] = 0;
    });
    persistState();
    render();
  });
}

function renderRoundResourceCard(team, resourceId) {
  const resource = RESOURCES[resourceId];
  const value = getResourceValue(team, resourceId);
  return `
    <article class="round-resource-card ${resource.group} ${resource.id}">
      <div class="resource-check" aria-hidden="true"></div>
      <div class="resource-portrait ${resource.id}" aria-hidden="true"></div>
      <div class="resource-card-copy">
        <h5>${resource.label}</h5>
        <p>${resource.note}</p>
        <div class="capacity-chip"><span class="${resource.group === "robot" ? "robot-icon" : "person-icon"}" aria-hidden="true"></span><small>Capacity Contribution</small><strong>${formatNumber(resource.capacity)} ${resource.capacity === 1 ? "Unit" : "Units"} / Day</strong></div>
      </div>
      <div class="round-card-footer">
        <label for="${resource.id}-input">Select Number</label>
        <div class="stepper round-stepper" aria-label="${resource.label}">
          <button class="icon-button" data-resource-id="${resource.id}" data-action="decrement" type="button" aria-label="Decrease ${resource.label}">-</button>
          <input id="${resource.id}-input" data-resource-input="${resource.id}" type="number" min="0" max="30" value="${value}" />
          <button class="icon-button" data-resource-id="${resource.id}" data-action="increment" type="button" aria-label="Increase ${resource.label}">+</button>
        </div>
        <span>Cost<br />${resource.cost} Credits / ${resource.group === "robot" && resource.id === "fleets" ? "Fleet" : resource.group === "robot" ? "Robot" : resource.label.includes("Operator") ? "Operator" : "Worker"} / Day</span>
      </div>
    </article>
  `;
}

function renderSummaryRow(team, resourceId) {
  const resource = RESOURCES[resourceId];
  const value = getResourceValue(team, resourceId);
  const capacity = value * resource.capacity;
  return `
    <div class="summary-row">
      <span class="${resource.group === "robot" ? "robot-icon" : "person-icon"}" aria-hidden="true"></span>
      <strong>${resource.pluralLabel}</strong>
      <b>${value}</b>
      <em>x ${formatNumber(resource.capacity)}</em>
      <i>=</i>
      <b>${formatNumber(capacity)}</b>
    </div>
  `;
}

function renderSiteVisual(team, metrics) {
  const speedClass = metrics.netCapacity >= PROJECT.requiredDailyCapacity ? "flow-fast" : metrics.netCapacity > 0 ? "flow-slow" : "flow-paused";
  siteVisualEl.innerHTML = `
    <div class="site-map ${speedClass}">
      <div class="storage-zone">
        <span>Temporary Storage</span>
        <div class="material-stack">
          ${Array.from({ length: 9 }, () => `<i></i>`).join("")}
        </div>
      </div>

      <div class="flow-lane" aria-hidden="true">
        ${Array.from({ length: Math.max(3, Math.min(12, Math.round(metrics.netCapacity / 2))) }, (_, index) => `<b style="--dot:${index}"></b>`).join("")}
      </div>

      <div class="work-zones">
        <span>Work Zones</span>
        <div class="zone-grid">
          <i>Core</i>
          <i>Facade</i>
          <i>MEP</i>
          <i>Fit-Out</i>
        </div>
      </div>
    </div>

    <div class="fleet-yard">
      ${renderCrewIcons("workers", team.resources.workers)}
      ${renderCrewIcons("basicRobots", team.resources.basicRobots)}
      ${renderCrewIcons("advancedRobots", team.resources.advancedRobots)}
      ${renderCrewIcons("fleets", team.resources.fleets)}
    </div>
  `;
}

function renderCrewIcons(resourceId, count) {
  const resource = RESOURCES[resourceId];
  const visibleCount = Math.min(count, 12);
  const extra = count > visibleCount ? `<span class="extra-count">+${count - visibleCount}</span>` : "";
  return `
    <div class="crew-icon-group ${resourceId}">
      <div class="crew-icon-title">${resource.shortLabel}</div>
      <div class="crew-icons">
        ${Array.from({ length: visibleCount }, () => `<span>${resource.icon}</span>`).join("")}
        ${extra}
      </div>
    </div>
  `;
}

function renderKpis(metrics) {
  const kpis = [
    { label: "Total Cost", value: formatCredits(metrics.totalCost), status: metrics.totalCost <= PROJECT.budgetLimit ? "pass" : "fail" },
    { label: "Net Daily Capacity", value: `${formatNumber(metrics.netCapacity)} units/day`, status: metrics.capacityFeasible ? "pass" : "fail" },
    { label: "Robot Support Load", value: `${formatNumber(metrics.robotSupportLoad)} worker-days`, status: metrics.humanSupportFeasible ? "pass" : "fail" },
    { label: "Robot Capacity Share", value: formatPercent(metrics.robotShare), status: metrics.strategyFit ? "pass" : "warning" },
    { label: "Productivity", value: formatNumber(metrics.productivity), status: metrics.productivity >= PROJECT.scoreTargets.productivity ? "pass" : "fail" },
    { label: "Operational Safety", value: formatNumber(metrics.safety), status: metrics.safety >= PROJECT.scoreTargets.safety ? "pass" : "fail" },
    { label: "Manual Effort Reduction", value: formatNumber(metrics.effort), status: metrics.effort >= PROJECT.scoreTargets.effort ? "pass" : "fail" },
    { label: "Value Score", value: formatNumber(metrics.valueScore), status: metrics.round2Eligible ? "pass" : "warning" },
  ];

  kpiGridEl.innerHTML = kpis
    .map(
      (kpi) => `
        <article class="kpi-card ${kpi.status}">
          <span>${kpi.label}</span>
          <strong>${kpi.value}</strong>
        </article>
      `
    )
    .join("");
}

function renderProgress(metrics) {
  const items = [
    { label: "Capacity Progress", value: metrics.netCapacity, target: PROJECT.requiredDailyCapacity, suffix: "units/day", intent: "higher" },
    { label: "Budget Progress", value: metrics.totalCost, target: PROJECT.budgetLimit, suffix: "credits", intent: "lower" },
    { label: "Productivity Target", value: metrics.productivity, target: PROJECT.scoreTargets.productivity, suffix: "score", intent: "higher" },
    { label: "Safety Target", value: metrics.safety, target: PROJECT.scoreTargets.safety, suffix: "score", intent: "higher" },
    { label: "Effort Reduction Target", value: metrics.effort, target: PROJECT.scoreTargets.effort, suffix: "score", intent: "higher" },
  ];

  progressListEl.innerHTML = items
    .map((item) => {
      const ratio = item.target > 0 ? item.value / item.target : 0;
      const clamped = Math.max(0, Math.min(100, ratio * 100));
      const overLimit = item.intent === "lower" && item.value > item.target;
      const belowTarget = item.intent === "higher" && item.value < item.target;
      return `
        <div class="progress-row ${overLimit || belowTarget ? "at-risk" : "ok"}">
          <div class="progress-label">
            <span>${item.label}</span>
            <strong>${formatNumber(item.value)} / ${item.target} ${item.suffix}</strong>
          </div>
          <div class="progress-track">
            <span style="width:${clamped}%"></span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderChecks(team, metrics) {
  const actualFit = getRobotShareBehavior(metrics.robotShare);
  const selectedStrategy = STRATEGIES[team.strategy];
  const mismatch = actualFit !== selectedStrategy.fitLabel;
  const round1Checks = [
    {
      label: "Human Support Check",
      state: metrics.humanSupportFeasible ? "pass" : "fail",
      detail: `${formatNumber(metrics.manualCapacityLeft)} manual worker capacity left after ${formatNumber(metrics.robotSupportLoad)} support load.`,
    },
    {
      label: "Capacity Check",
      state: metrics.capacityFeasible ? "pass" : "fail",
      detail: `${formatNumber(metrics.netCapacity)} units/day against ${PROJECT.requiredDailyCapacity}.`,
    },
    {
      label: "Budget Visibility",
      state: metrics.totalCost <= PROJECT.budgetLimit ? "pass" : "warning",
      detail: `${formatCredits(metrics.totalCost)} against ${formatCredits(PROJECT.budgetLimit)}. Round 1 winner is lowest feasible cost.`,
    },
  ];

  const round2Checks = [
    { label: "Budget <= 200", state: metrics.totalCost <= PROJECT.budgetLimit ? "pass" : "fail", detail: formatCredits(metrics.totalCost) },
    { label: "Capacity >= 20", state: metrics.capacityFeasible ? "pass" : "fail", detail: `${formatNumber(metrics.netCapacity)} units/day` },
    { label: "Productivity >= 70", state: metrics.productivity >= 70 ? "pass" : "fail", detail: formatNumber(metrics.productivity) },
    { label: "Operational Safety >= 70", state: metrics.safety >= 70 ? "pass" : "fail", detail: formatNumber(metrics.safety) },
    { label: "Effort Reduction >= 70", state: metrics.effort >= 70 ? "pass" : "fail", detail: formatNumber(metrics.effort) },
    { label: "Human Support Feasible", state: metrics.humanSupportFeasible ? "pass" : "fail", detail: `${formatNumber(metrics.robotSupportLoad)} support load` },
    { label: "HRC Strategy Fit", state: metrics.strategyFit ? "pass" : "fail", detail: `${selectedStrategy.name} selected, ${formatPercent(metrics.robotShare)} robot share` },
  ];

  checksListEl.innerHTML = `
    <div class="fit-card ${mismatch ? "warning" : "pass"}">
      <div>
        <span class="panel-kicker">HRC Strategy Fit Visual</span>
        <strong>${selectedStrategy.name}</strong>
        <p>Actual robot capacity share: ${formatPercent(metrics.robotShare)}</p>
      </div>
      <div class="share-meter">
        <span style="left:${Math.max(0, Math.min(100, metrics.robotShare * 100))}%"></span>
      </div>
      ${mismatch ? `<p class="strategy-warning">Strategy Mismatch: your resource mix behaves like ${actualFit}.</p>` : `<p class="strategy-ok">Selected strategy matches the resource behavior.</p>`}
    </div>

    <div class="check-columns">
      <div>
        <h3>Round 1: Cost-Driven Design</h3>
        ${round1Checks.map(renderCheckRow).join("")}
      </div>
      <div>
        <h3>Round 2: Target Value Design</h3>
        ${round2Checks.map(renderCheckRow).join("")}
      </div>
    </div>
  `;
}

function renderCheckRow(check) {
  return `
    <article class="check-row ${check.state}">
      <div>
        <strong>${check.label}</strong>
        <p>${check.detail}</p>
      </div>
      <span class="badge ${check.state}">${check.state.toUpperCase()}</span>
    </article>
  `;
}

function renderComparison(allMetrics, winners) {
  comparisonSummaryEl.innerHTML = `
    <div class="winner-strip">
      <div><span>Round 1 Winner</span><strong>${winners.round1 ? winners.round1.team.label : "No feasible team"}</strong></div>
      <div><span>Round 2 Winner</span><strong>${winners.round2 ? winners.round2.team.label : "No eligible team"}</strong></div>
      <div><span>Round 2 Rule</span><strong>Highest eligible value score, then lower cost</strong></div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Round 1 Feasible?</th>
            <th>Round 1 Cost</th>
            <th>Round 2 Eligible?</th>
            <th>Cost</th>
            <th>Capacity</th>
            <th>Robot Share</th>
            <th>Productivity</th>
            <th>Safety</th>
            <th>Effort Reduction</th>
            <th>Value Score</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          ${allMetrics
            .map(({ team, metrics }) => {
              const winnerText = [
                winners.round1?.team.id === team.id ? "Round 1" : "",
                winners.round2?.team.id === team.id ? "Round 2" : "",
              ]
                .filter(Boolean)
                .join(" + ");
              return `
                <tr class="${team.id === state.activeTeamId ? "selected" : ""}">
                  <td><strong>${team.label}</strong><br /><span>${STRATEGIES[team.strategy].name}</span></td>
                  <td>${badge(metrics.round1Feasible ? "PASS" : "FAIL", metrics.round1Feasible ? "pass" : "fail")}</td>
                  <td>${formatCredits(metrics.totalCost)}</td>
                  <td>${badge(metrics.round2Eligible ? "PASS" : "FAIL", metrics.round2Eligible ? "pass" : "fail")}</td>
                  <td>${formatCredits(metrics.totalCost)}</td>
                  <td>${formatNumber(metrics.netCapacity)}</td>
                  <td>${formatPercent(metrics.robotShare)}</td>
                  <td>${formatNumber(metrics.productivity)}</td>
                  <td>${formatNumber(metrics.safety)}</td>
                  <td>${formatNumber(metrics.effort)}</td>
                  <td>${formatNumber(metrics.valueScore)}</td>
                  <td>${winnerText || "-"}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function evaluateTeam(team) {
  const strategy = STRATEGIES[team.strategy];
  const workers = getResourceValue(team, "workers");
  const basicRobots = getResourceValue(team, "basicRobots");
  const advancedRobots = getResourceValue(team, "advancedRobots");
  const fleets = getResourceValue(team, "fleets");

  const robotSupportLoad =
    basicRobots * RESOURCES.basicRobots.supportLoad +
    advancedRobots * RESOURCES.advancedRobots.supportLoad +
    fleets * RESOURCES.fleets.supportLoad;
  const manualCapacityLeft = workers - robotSupportLoad;
  const robotCapacity =
    basicRobots * RESOURCES.basicRobots.capacity +
    advancedRobots * RESOURCES.advancedRobots.capacity +
    fleets * RESOURCES.fleets.capacity;
  const netCapacity = robotCapacity + manualCapacityLeft;
  const safeNetCapacity = Math.max(0, netCapacity);
  const robotShare = safeNetCapacity > 0 ? robotCapacity / safeNetCapacity : 0;
  const humanSupportFeasible = manualCapacityLeft >= 0;
  const capacityFeasible = netCapacity >= PROJECT.requiredDailyCapacity;

  const totalCost =
    strategy.cost +
    workers * RESOURCES.workers.cost +
    basicRobots * RESOURCES.basicRobots.cost +
    advancedRobots * RESOURCES.advancedRobots.cost +
    fleets * RESOURCES.fleets.cost;

  const productivity =
    50 +
    strategy.productivity +
    basicRobots * RESOURCES.basicRobots.productivity +
    advancedRobots * RESOURCES.advancedRobots.productivity +
    fleets * RESOURCES.fleets.productivity;
  const safety =
    50 +
    strategy.safety +
    basicRobots * RESOURCES.basicRobots.safety +
    advancedRobots * RESOURCES.advancedRobots.safety +
    fleets * RESOURCES.fleets.safety;
  const effort =
    50 +
    strategy.effort +
    basicRobots * RESOURCES.basicRobots.effort +
    advancedRobots * RESOURCES.advancedRobots.effort +
    fleets * RESOURCES.fleets.effort;

  const valueScore = roundOneDecimal(
    PROJECT.weights.productivity * productivity +
      PROJECT.weights.safety * safety +
      PROJECT.weights.effort * effort
  );

  const strategyFit = isStrategyFit(strategy.id, robotShare);
  const round1Feasible = humanSupportFeasible && capacityFeasible;
  const round2Eligible =
    totalCost <= PROJECT.budgetLimit &&
    capacityFeasible &&
    productivity >= PROJECT.scoreTargets.productivity &&
    safety >= PROJECT.scoreTargets.safety &&
    effort >= PROJECT.scoreTargets.effort &&
    humanSupportFeasible &&
    strategyFit;

  return {
    robotSupportLoad,
    manualCapacityLeft,
    robotCapacity,
    netCapacity,
    robotShare,
    humanSupportFeasible,
    capacityFeasible,
    totalCost,
    productivity,
    safety,
    effort,
    valueScore,
    strategyFit,
    round1Feasible,
    round2Eligible,
  };
}

function calculateWinners(allMetrics) {
  const round1Candidates = allMetrics
    .filter(({ metrics }) => metrics.round1Feasible)
    .sort((a, b) => a.metrics.totalCost - b.metrics.totalCost || b.metrics.netCapacity - a.metrics.netCapacity);

  const round2Candidates = allMetrics
    .filter(({ metrics }) => metrics.round2Eligible)
    .sort((a, b) => b.metrics.valueScore - a.metrics.valueScore || a.metrics.totalCost - b.metrics.totalCost);

  return {
    round1: round1Candidates[0] || null,
    round2: round2Candidates[0] || null,
  };
}

function isStrategyFit(strategyId, robotShare) {
  if (strategyId === "human") return robotShare <= 0.35;
  if (strategyId === "collaborative") return robotShare > 0.35 && robotShare < 0.75;
  return robotShare >= 0.75;
}

function getRobotShareBehavior(robotShare) {
  if (robotShare <= 0.35) return "Human-Led";
  if (robotShare < 0.75) return "Collaborative";
  return "Robot-Led";
}

function getResourceValue(team, resourceId) {
  const value = Number(team.resources?.[resourceId]);
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function clampQuantity(value) {
  return Math.max(0, Math.min(30, Number.isFinite(value) ? Math.round(value) : 0));
}

function formatCredits(value) {
  return `${formatNumber(value)} credits`;
}

function formatNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "0";
  return Number.isInteger(numeric) ? `${numeric}` : numeric.toFixed(1);
}

function formatPercent(value) {
  const numeric = Number.isFinite(value) ? value : 0;
  return `${Math.round(numeric * 100)}%`;
}

function signed(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function roundOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

function badge(text, stateName) {
  return `<span class="badge ${stateName}">${text}</span>`;
}
