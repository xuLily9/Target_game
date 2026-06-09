# Construction Site of the Future

This repository contains a browser-based GitHub Pages prototype for the Construction Site of the Future game.

The current build includes a team creation workflow, frontend submission UI, and an admin view for published Google Sheet results.

## What Changed

- Added a **Create / Join Team** section with Session ID, Team Name, Participants, and auto-generated Team ID.
- Added **Save Draft** and **Submit Final Decision** buttons.
- Added a Google Apps Script backend file: `apps-script-backend.gs`.
- Added an admin page: `admin.html` to display results from a published Google Sheet CSV.
- Updated the UI and summary logic to rely on backend submissions rather than local final score calculations.

## Files

- `index.html`
  Main game page with team creation, strategy selection, crew assignment, and backend submission hooks.

- `styles.css`
  Visual styling for the game, team panel, and admin table.

- `app.js`
  Frontend state, team storage, backend submission flow, and game interface rendering.

- `admin.html`
  Admin dashboard that fetches a published Google Sheet CSV and renders submitted results.

- `apps-script-backend.gs`
  Google Apps Script backend for accepting POST submissions and appending them to `Submissions` and `Team Results` sheets.

## How To Run Locally

This is a static site and can be served from any local web server.

Example:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Backend Setup

1. Open the Google Sheets file and create a new Apps Script project.
2. Paste the contents of `apps-script-backend.gs` into the script editor.
3. Deploy the script as a Web App with access allowed for anyone, even anonymous.
4. Copy the Web App URL.
5. Paste the URL into `app.js` at the top in `BACKEND_URL`.

## Google Sheet Setup

The Apps Script backend will create the following sheets automatically if they do not exist:

- `Submissions`
- `Team Results`

### Submissions columns

- Timestamp
- Session ID
- Team ID
- Team Name
- Participants
- Strategy
- Workers
- Basic Robots
- Advanced Robots
- Multi-Robot Systems
- Submission Type

### Team Results columns

- Timestamp
- Session ID
- Team ID
- Team Name
- Strategy
- Workers
- Basic Robots
- Advanced Robots
- Multi-Robot Systems
- Total Cost
- Capacity
- Robot Capacity Share
- HRC Strategy Fit
- Productivity
- Operational Safety
- Manual Physical Effort Reduction
- Round 1 Eligible
- Round 2 Eligible
- Final Status

## Admin Page Setup

1. Publish your `Team Results` sheet as a CSV.
2. Paste the published CSV link into `admin.html` at `SHEET_CSV_URL`.
3. Open `admin.html` in the browser.

## How To Use The Game

1. Enter `Session ID`, `Team Name`, and `Participants`.
2. Save Draft to keep the team info locally and submit a draft to the backend.
3. Choose a strategy and assign crew in the game interface.
4. Submit Final Decision when your team plan is ready.
5. Review the admin page to see submitted data once the sheet is published.

## Notes

- The frontend no longer treats local score calculation as the official final result.
- Official results are intended to be returned from the backend and stored in Google Sheets.
- The backend currently writes raw inputs and placeholder result columns so sheet formulas can compute the official metrics.


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
