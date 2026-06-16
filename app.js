const STORAGE_KEY = "construction-logistics-round-1-v2";

const PROJECT = {
  totalDemand: 100,
  days: 5,
  requiredDailyCapacity: 20,
  budgetLimit: 200,
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
    label: "General Workers",
    cardTitle: "General Worker",
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
    cost: 30,
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
    cost: 50,
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
    cost: 80,
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
};

const ROUND2_STRATEGIES = [
  {
    id: "robot-led",
    label: "Robot-Led",
    description: "Maximise automation and robot capacity.",
    color: "purple",
    weights: { productivity: 0.4, safety: 0.3, effort: 0.3 },
    stars: { productivity: 3, safety: 2, effort: 2 },
  },
  {
    id: "collaborative",
    label: "Collaborative",
    description: "Balance humans and robots for safe and efficient delivery.",
    color: "blue",
    weights: { productivity: 0.3, safety: 0.4, effort: 0.3 },
    stars: { productivity: 2, safety: 3, effort: 2 },
  },
  {
    id: "human-led",
    label: "Human-Led",
    description: "Leverage human capability and reduce physical strain.",
    color: "green",
    weights: { productivity: 0.3, safety: 0.3, effort: 0.4 },
    stars: { productivity: 2, safety: 2, effort: 3 },
  },
];

const ROUND2_RESOURCES = [
  {
    id: "materialWorkers",
    group: "human",
    label: "Construction Material Workers",
    shortLabel: "Material Workers",
    description: "Manual transport capacity for site delivery.",
    cost: 10,
    capacity: 1,
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
    effects: { productivity: 18, safety: 8, effort: 18 },
    visual: "robot fleet",
    accent: "purple",
  },
];

const state = loadState();

const humanGridEl = document.getElementById("human-resource-grid");
const robotGridEl = document.getElementById("robot-resource-grid");
const selectionSummaryEl = document.getElementById("selection-summary");
const capacityCardEl = document.getElementById("capacity-card");
const costCardEl = document.getElementById("cost-card");
const supportCardEl = document.getElementById("support-card");
const confirmationMessageEl = document.getElementById("confirmation-message");
const resetButton = document.getElementById("reset-round");
const scenarioResetButton = document.getElementById("reset-scenario");
const confirmButton = document.getElementById("confirm-round");
const round2StrategyGridEl = document.getElementById("round2-strategy-grid");
const round2ResourceGridEl = document.getElementById("round2-resource-grid");
const round2ConstraintsEl = document.getElementById("round2-constraints");
const round2AlignmentEl = document.getElementById("round2-alignment");
const round2DashboardMetricsEl = document.getElementById("round2-dashboard-metrics");
const round2FinalValueEl = document.getElementById("round2-final-value");
const round2ConfirmationEl = document.getElementById("round2-confirmation");
const resetRound2Button = document.getElementById("reset-round2");
const confirmRound2Button = document.getElementById("confirm-round2");

resetButton.addEventListener("click", resetRound);
scenarioResetButton?.addEventListener("click", resetRound);
resetRound2Button?.addEventListener("click", resetRound2);

function resetRound() {
  state.quantities = createEmptyQuantities();
  state.confirmed = false;
  persistState();
  render();
}

confirmButton.addEventListener("click", () => {
  state.confirmed = true;
  persistState();
  render();
});

confirmRound2Button?.addEventListener("click", () => {
  state.round2.confirmed = true;
  persistState();
  render();
});

render();

function createEmptyQuantities() {
  return Object.fromEntries(RESOURCES.map((resource) => [resource.id, 0]));
}

function createEmptyRound2Quantities() {
  return Object.fromEntries(ROUND2_RESOURCES.map((resource) => [resource.id, 0]));
}

function createDefaultRound2State() {
  return {
    strategy: "robot-led",
    quantities: {
      ...createEmptyRound2Quantities(),
      supportWorkers: 4,
      deliveryRobots: 4,
      quadrupedRobots: 2,
    },
    confirmed: false,
  };
}

function loadState() {
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
}

function render() {
  const metrics = evaluateRound();
  renderResourceCards("human", humanGridEl, metrics);
  renderResourceCards("robot", robotGridEl, metrics);
  renderSummary(metrics);
  renderResultCards(metrics);
  renderConfirmation(metrics);
  renderRound2();
}

function renderResourceCards(group, container, metrics) {
  container.innerHTML = RESOURCES.filter((resource) => resource.group === group)
    .map((resource) => {
      const value = getQuantity(resource.id);
      const groupTotal = group === "human" ? metrics.humanCount : metrics.robotCount;
      const maxForResource = Math.max(0, getGroupLimit(group) - (groupTotal - value));
      const canIncrement = value < maxForResource;
      return `
        <article class="resource-card ${resource.group} ${resource.accent}">
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
              <button data-resource-id="${resource.id}" data-action="decrement" type="button" aria-label="Decrease ${resource.label}" ${value <= 0 ? "disabled" : ""}>-</button>
              <input data-resource-input="${resource.id}" type="number" min="0" max="${getGroupLimit(group)}" value="${value}" aria-label="${resource.label} quantity" />
              <button data-resource-id="${resource.id}" data-action="increment" type="button" aria-label="Increase ${resource.label}" ${canIncrement ? "" : "disabled"}>+</button>
            </div>
          </div>
          <div class="cost-row">
            <span>Cost</span>
            <strong>${resource.cost} Credits / ${resource.group === "human" ? "Worker" : resource.id === "multiRobotFleets" ? "Fleet" : "Robot"} / Day</strong>
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
  capacityCardEl.className = `result-card total-capacity ${metrics.capacityFeasible ? "pass" : "warning"}`;
  capacityCardEl.innerHTML = `
    <span class="result-icon gauge-icon" aria-hidden="true"></span>
    <div>
      <small>Total Expected Capacity</small>
      <strong>${formatNumber(metrics.totalCapacity)} Units / Day</strong>
      <p>Target: <b>20 Units / Day</b></p>
    </div>
  `;

  costCardEl.className = `result-card total-cost ${metrics.budgetFeasible ? "pass" : "fail"}`;
  costCardEl.innerHTML = `
    <span class="result-icon coin-icon" aria-hidden="true"></span>
    <div>
      <small>Estimated Total Cost</small>
      <strong>${formatNumber(metrics.totalCost)} Credits</strong>
      <p>Budget Limit: <b>200 Credits</b></p>
    </div>
  `;

  supportCardEl.className = `support-card ${metrics.supportFeasible ? "pass" : "fail"}`;
  supportCardEl.innerHTML = `
    <div>
      <small>Robot Support Check</small>
      <strong>${metrics.supportFeasible ? "PASS" : "FAIL"}</strong>
      <p>Robot Support Workers provide ${formatNumber(metrics.supportWorkerCapacity)} support units; robots require ${formatNumber(metrics.requiredSupport)}.</p>
    </div>
    <div>
      <small>Estimated Duration</small>
      <strong>${metrics.estimatedDuration ? `${formatNumber(metrics.estimatedDuration)} Days` : "-"}</strong>
      <p>Project limit: ${PROJECT.days} Days</p>
    </div>
  `;
}

function renderConfirmation(metrics) {
  if (!state.confirmed) {
    confirmationMessageEl.textContent = "";
    confirmationMessageEl.className = "confirmation-message";
    return;
  }

  confirmationMessageEl.className = `confirmation-message ${metrics.round1Feasible ? "pass" : "fail"}`;
  confirmationMessageEl.textContent = metrics.round1Feasible
    ? "Round 1 feasible: your plan meets capacity, budget, schedule, and support checks."
    : "Round 1 needs adjustment: check capacity, budget, schedule, or robot support workers.";
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
  const capacityFeasible = totalCapacity >= PROJECT.requiredDailyCapacity;
  const budgetFeasible = totalCost <= PROJECT.budgetLimit;
  const supportFeasible = requiredSupport <= supportWorkerCapacity || requiredSupport === 0;
  const scheduleFeasible = estimatedDuration > 0 && estimatedDuration <= PROJECT.days;

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
    budgetFeasible,
    supportFeasible,
    scheduleFeasible,
    round1Feasible: capacityFeasible && budgetFeasible && supportFeasible && scheduleFeasible,
  };
}

function resetRound2() {
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
  round2StrategyGridEl.innerHTML = ROUND2_STRATEGIES.map((strategy) => {
    const selected = state.round2.strategy === strategy.id;
    return `
      <article class="strategy-card ${strategy.color} ${selected ? "selected" : ""}" data-r2-strategy="${strategy.id}">
        <div class="strategy-check" aria-hidden="true">${selected ? "✓" : ""}</div>
        <div class="strategy-visual ${strategy.id}" aria-hidden="true"></div>
        <h4>${strategy.label}</h4>
        <p>${strategy.description}</p>
        <div class="strategy-scores">
          ${renderStrategyStars("Productivity", strategy.stars.productivity)}
          ${renderStrategyStars("Operational Safety", strategy.stars.safety)}
          ${renderStrategyStars("Manual Effort Reduction", strategy.stars.effort)}
        </div>
      </article>
    `;
  }).join("");

  round2StrategyGridEl.querySelectorAll("[data-r2-strategy]").forEach((card) => {
    card.addEventListener("click", () => {
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

function renderRound2Resources(metrics) {
  const groups = [
    {
      label: "Human Resources",
      helper: "Workers are separated into transport capacity and robot support.",
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
    const value = getRound2Quantity(resource.id);
    const isHuman = resource.group === "human";
    const humanTotalWithoutCurrent = metrics.humanCount - (isHuman ? value : 0);
    const maxForResource = isHuman ? Math.max(0, ROUND2_PROJECT.maxHumanWorkers - humanTotalWithoutCurrent) : 99;
    const canIncrement = value < maxForResource;

    return `
      <article class="r2-resource-card ${resource.accent}">
        <div class="r2-resource-visual ${resource.visual}" aria-hidden="true">
          ${renderVisualParts(resource.visual)}
        </div>
        <h4>${resource.label}</h4>
        <p>${resource.description}</p>
        ${renderRound2ResourceEffects(resource)}
        <div class="quantity-row">
          <span>Quantity</span>
          <div class="stepper r2-stepper">
            <button data-r2-resource-id="${resource.id}" data-action="decrement" type="button" aria-label="Decrease ${resource.label}" ${value <= 0 ? "disabled" : ""}>-</button>
            <input data-r2-resource-input="${resource.id}" type="number" min="0" max="${maxForResource}" value="${value}" aria-label="${resource.label} quantity" />
            <button data-r2-resource-id="${resource.id}" data-action="increment" type="button" aria-label="Increase ${resource.label}" ${canIncrement ? "" : "disabled"}>+</button>
          </div>
        </div>
        <div class="r2-cost">Cost: ${resource.cost} Credits / ${resource.group === "human" ? "Worker" : resource.id === "multiRobotFleets" ? "Fleet" : "Robot"} / Day</div>
      </article>
    `;
}

function renderRound2ResourceEffects(resource) {
  if (!resource.effects) {
    const contribution = resource.supportCapacity ? `${resource.supportCapacity} support unit` : `${resource.capacity} load / day`;
    return `<div class="r2-effects"><span>${contribution}</span></div>`;
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
    renderDashboardMetric("Productivity", `${formatNumber(metrics.productivity)} /100`, "Weighted Score", metrics.productivityFeasible, metrics.productivity, 70, "purple"),
    renderDashboardMetric("Operational Safety", `${formatNumber(metrics.safety)} /100`, "Weighted Score", metrics.safetyFeasible, metrics.safety, 70, "blue"),
    renderDashboardMetric("Manual Effort Reduction", `${formatNumber(metrics.effort)} /100`, "Weighted Score", metrics.effortFeasible, metrics.effort, 70, "green"),
    renderDashboardMetric("Total Cost", `${formatNumber(metrics.totalCost)} Credits`, `Budget Usage: ${formatNumber(metrics.budgetUsage)}%`, metrics.budgetFeasible, metrics.totalCost, ROUND2_PROJECT.budgetLimit, "orange"),
  ].join("");
}

function renderDashboardMetric(label, value, helper, passed, current, target, color) {
  const denominator = label === "Total Cost" ? target : 100;
  const marker = label === "Net Daily Capacity" ? target : label === "Total Cost" ? target : 70;
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
    ["Capacity", `≥ ${ROUND2_PROJECT.requiredDailyCapacity} Loads/Day`, formatNumber(metrics.netDailyCapacity), metrics.capacityFeasible],
    ["Support", `≥ ${formatNumber(metrics.requiredSupport)} Support`, formatNumber(metrics.supportWorkerCapacity), metrics.supportFeasible],
    ["Budget", `≤ ${ROUND2_PROJECT.budgetLimit} Credits`, formatNumber(metrics.totalCost), metrics.budgetFeasible],
    ["Productivity", "≥ 70", formatNumber(metrics.productivity), metrics.productivityFeasible],
    ["Operational Safety", "≥ 70", formatNumber(metrics.safety), metrics.safetyFeasible],
    ["Manual Effort Reduction", "≥ 70", formatNumber(metrics.effort), metrics.effortFeasible],
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
  round2AlignmentEl.className = `alignment-card ${metrics.aligned ? "pass" : "fail"}`;
  round2AlignmentEl.innerHTML = `
    <div class="alignment-icon" aria-hidden="true"></div>
    <div>
      <strong>${metrics.aligned ? "Good Alignment" : "Strategy Mismatch"}</strong>
      <p>Selected: ${metrics.selectedStrategy.label}. Operational mode: ${metrics.operationalMode.label}.</p>
    </div>
    <b>${metrics.aligned ? "100%" : "-10"}</b>
  `;
}

function renderRound2FinalValue(metrics) {
  round2FinalValueEl.className = `final-value-card ${metrics.eligible ? "pass" : "fail"}`;
  round2FinalValueEl.innerHTML = `
    <small>Strategy-Weighted Final Value</small>
    <strong>${formatNumber(metrics.finalValue)} <span>/100</span></strong>
    <p>${metrics.eligible ? "Good plan! You're on the right track." : "Adjust the failed checks to become eligible."}</p>
  `;
}

function renderRound2Confirmation(metrics) {
  if (!state.round2.confirmed) {
    round2ConfirmationEl.textContent = "";
    round2ConfirmationEl.className = "confirmation-message";
    return;
  }

  round2ConfirmationEl.className = `confirmation-message ${metrics.eligible ? "pass" : "fail"}`;
  round2ConfirmationEl.textContent = metrics.eligible
    ? `Round 2 feasible: final value ${formatNumber(metrics.finalValue)} with ${metrics.operationalMode.label} operations.`
    : "Round 2 needs adjustment: check support workers, budget, capacity, and performance thresholds.";
}

function evaluateRound2() {
  const humanResources = ROUND2_RESOURCES.filter((resource) => resource.group === "human");
  const robotResources = ROUND2_RESOURCES.filter((resource) => resource.group === "robot");
  const selectedStrategy = ROUND2_STRATEGIES.find((strategy) => strategy.id === state.round2.strategy) || ROUND2_STRATEGIES[0];
  const humanCount = sum(humanResources, (resource) => getRound2Quantity(resource.id));
  const robotCount = sum(robotResources, (resource) => getRound2Quantity(resource.id));
  const humanCapacity = sum(humanResources, (resource) => getRound2Quantity(resource.id) * resource.capacity);
  const robotCapacity = sum(robotResources, (resource) => getRound2Quantity(resource.id) * resource.capacity);
  const netDailyCapacity = humanCapacity + robotCapacity;
  const totalCost = sum(ROUND2_RESOURCES, (resource) => getRound2Quantity(resource.id) * resource.cost);
  const requiredSupport = sum(robotResources, (resource) => getRound2Quantity(resource.id) * (resource.supportLoad || 0));
  const supportWorkerCapacity = getRound2Quantity("supportWorkers");
  const productivity = Math.min(100, 50 + sum(robotResources, (resource) => getRound2Quantity(resource.id) * resource.effects.productivity));
  const safety = Math.min(100, 50 + sum(robotResources, (resource) => getRound2Quantity(resource.id) * resource.effects.safety));
  const effort = Math.min(100, 50 + sum(robotResources, (resource) => getRound2Quantity(resource.id) * resource.effects.effort));
  const robotCapacityShare = netDailyCapacity > 0 ? robotCapacity / netDailyCapacity : 0;
  const operationalMode = getOperationalMode(robotCapacityShare);
  const aligned = selectedStrategy.id === operationalMode.id;
  const weightedScore =
    productivity * selectedStrategy.weights.productivity +
    safety * selectedStrategy.weights.safety +
    effort * selectedStrategy.weights.effort;
  const finalValue = Math.max(0, weightedScore - (aligned ? 0 : 10));
  const capacityFeasible = netDailyCapacity >= ROUND2_PROJECT.requiredDailyCapacity;
  const budgetFeasible = totalCost <= ROUND2_PROJECT.budgetLimit;
  const supportFeasible = requiredSupport <= supportWorkerCapacity || requiredSupport === 0;
  const productivityFeasible = productivity >= 70;
  const safetyFeasible = safety >= 70;
  const effortFeasible = effort >= 70;
  const eligible = capacityFeasible && budgetFeasible && supportFeasible && productivityFeasible && safetyFeasible && effortFeasible;

  return {
    humanCount,
    robotCount,
    humanCapacity,
    robotCapacity,
    netDailyCapacity,
    totalCost,
    requiredSupport,
    supportWorkerCapacity,
    productivity,
    safety,
    effort,
    selectedStrategy,
    operationalMode,
    aligned,
    weightedScore,
    finalValue,
    budgetUsage: ROUND2_PROJECT.budgetLimit > 0 ? (totalCost / ROUND2_PROJECT.budgetLimit) * 100 : 0,
    capacityFeasible,
    budgetFeasible,
    supportFeasible,
    productivityFeasible,
    safetyFeasible,
    effortFeasible,
    eligible,
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
