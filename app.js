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

resetButton.addEventListener("click", resetRound);
scenarioResetButton?.addEventListener("click", resetRound);

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

render();

function createEmptyQuantities() {
  return Object.fromEntries(RESOURCES.map((resource) => [resource.id, 0]));
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
    };
  } catch {
    return {
      quantities: createEmptyQuantities(),
      confirmed: false,
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
