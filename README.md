# HRC Strategy Game Prototype

This repository contains a browser-based prototype for exploring `Human-Robot Collaboration (HRC)` strategies for a wall assembly job.

Live demo:
[Open The Web Prototype](https://qiming0303.github.io/HRC_game/)

The tool lets players:

- choose a high-level strategy
- configure available humans and robots
- assign crews to four assembly tasks
- compare tradeoffs between `efficiency`, `safety`, and `reduced manual work`
- experiment with budget pressure
- watch a simple block-flow simulation of the assembly pipeline

It is designed as a lightweight decision-support and playtest platform rather than a full production simulator.

## What The Prototype Does

The current prototype supports two main modes:

- `Play Mode`
  Use the platform as a player would. Choose a strategy, assign workers, compare variants, and run the task-flow simulation.

- `Setup Mode`
  Edit the numbers behind the experience. Change strategy values, worker values, crew quantities, score weights, and the final reward formula.

Changes saved in `Setup Mode` immediately update `Play Mode`.

## Core Structure

The wall assembly job is split into four tasks:

1. `Collecting`
2. `Moving`
3. `Positioning`
4. `Mounting`

Players can assign:

- `Human Generalist`
- `Skilled Installer`
- single-task robots
- two-task combined robots
- three-task combined robots
- one four-task robot

Robots can optionally receive `Generalist` support to improve safety.

Multiple crew members can be assigned to the same task:

- this mainly boosts `efficiency`
- it can slightly affect other target values
- it increases cost

## Files

- [index.html](/Users/qimsun/Documents/Workshop_HRC_Strategy_Game_Playtest/index.html)
  App structure and page layout

- [styles.css](/Users/qimsun/Documents/Workshop_HRC_Strategy_Game_Playtest/styles.css)
  Visual design, layout, simulation styling, and setup-mode styling

- [app.js](/Users/qimsun/Documents/Workshop_HRC_Strategy_Game_Playtest/app.js)
  Data model, scoring logic, drag-and-drop behavior, setup editing, and simulation logic

## How To Run

This is a static web prototype. You can run it with any simple local server.

Example:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Open Online

Once GitHub Pages finishes deploying, the prototype can be opened here:

[https://qiming0303.github.io/HRC_game/](https://qiming0303.github.io/HRC_game/)

If the page does not open yet, enable `GitHub Pages` in the repository settings:

1. Open `Settings`
2. Open `Pages`
3. Set `Source` to `GitHub Actions`
4. Wait for the deploy workflow to finish

## How To Use Play Mode

### 1. Choose A Strategy

At the top of the page, pick one of the three strategies:

- `Human-led`
- `Collaborative`
- `Robotic-led`

Each strategy changes:

- base cost
- profile values
- available crew quantities
- expected human/robot balance

### 2. Review The Worker Pool

Under the strategy cards, the worker pool shows:

- worker name
- worker cost
- three value bars
- available quantity

Worker quantities depend on the selected strategy.

### 3. Assign Workers In Step 2

Drag workers into the four task sockets.

Important rules:

- at least one robot should be part of the setup
- multi-task robots span adjacent tasks automatically
- if a task is covered only by humans, it must include a `Skilled Installer`
- robot assignments can receive optional `Generalist` support for safety improvement

### 4. Stack Multiple Crew

You can assign more than one crew member to the same task.

This is useful for testing tradeoffs such as:

- higher throughput from additional labor
- extra cost from larger crews
- different safety behavior when tasks become crowded

### 5. Review The Outcome Panel

The floating panel on the right shows the predicted result:

- efficiency
- safety
- reduced manual work
- budget impact
- strategy fit
- final score

### 6. Run The Simulation

At the bottom of Step 2, click `Run Simulation`.

The simulation shows square blocks moving through the task pipeline:

- left side: incoming blocks
- middle: four stations
- right side: completed 3x3 block grid

Simulation speed depends on station setup:

- more efficient stations move blocks faster
- more crew can speed up a station
- if a later station is missing, blocks stop at the last staffed stage
- if one station is faster than the next, downstream accumulation can happen

### 7. Save Variants

Use the variant section to store and compare different crew setups.

## How To Use Setup Mode

Switch to `Setup Mode` from the top bar.

Setup Mode uses the same overall layout as Play Mode, but the numbers are editable.

### Strategy Editing

You can change:

- base cost
- profile values
- fit targets

### Worker Editing

Each worker card can be edited for:

- cost
- efficiency value
- safety value
- manual-reduction value
- quantity for the currently selected strategy

### Formula Editing

The floating panel in Setup Mode includes editable fields for:

- score weights
- final reward formula

The formula is a JavaScript-style expression.

Available variables include:

- `performanceScore`
- `strategyBonus`
- `budgetPenalty`
- `efficiency`
- `safety`
- `manualReduction`
- `humanCount`
- `robotCount`
- `coveredTasks`
- `totalCost`
- `budgetLimit`

Example:

```js
Math.max(0, Math.round(performanceScore + strategyBonus - budgetPenalty))
```

When you click `Save Setup`, the updated configuration is saved locally in the browser and immediately applied to Play Mode.

## Data Persistence

Setup changes are stored in browser local storage.

That means:

- configuration changes persist across refreshes in the same browser
- configuration is local to that browser/device unless exported manually

## Current Design Intent

This prototype is intentionally positioned between:

- a `serious game`
- a `decision-support interface`
- a `playtest sandbox`

It is useful for:

- discussing HRC strategy tradeoffs
- testing whether rules feel understandable
- exploring how crew availability changes decisions
- presenting HRC setup ideas to collaborators

## Limitations

Current limitations include:

- static front-end only, no backend or user accounts
- simulation is simplified and not a physics-based model
- setup persistence is browser-local only
- no import/export workflow for configurations yet
- no automated tests yet

## Suggested Next Steps

Likely useful next improvements:

- export/import setup configurations as JSON
- smoother animated simulation transitions
- editable formulas for multi-crew efficiency and safety effects
- clearer visual cues for support humans and multi-task robots
- scenario presets for different budgets or wall assembly conditions
