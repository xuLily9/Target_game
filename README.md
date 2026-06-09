# Construction Site of the Future

Static browser-based workshop game for the **Human-Robot Collaboration Design Challenge**.

The prototype is now a construction material logistics Target Value Design game. Teams plan how to move materials from temporary storage to work zones on a high-rise construction project using workers, basic robots, advanced robots, and autonomous robot fleets.

Live demo:
[Open The Web Prototype](https://qiming0303.github.io/HRC_game/)

## Scenario

- Total project demand: `100 units`
- Required completion time: `5 days`
- Required daily capacity: `20 units/day`
- Budget limit: `200 credits`

## Resources

| Resource | Cost | Daily Capacity | Human Support |
| --- | ---: | ---: | ---: |
| Construction Worker | 10 | 1 | 0 |
| Basic Robot | 20 | 3 | 0.5 worker-day |
| Advanced Robot | 35 | 5 | 1 worker-day |
| Autonomous Robot Fleet | 60 | 8 | 3 worker-days |

Workers can either support robots or provide manual transport capacity. The game calculates support load, remaining manual capacity, robot capacity, net daily capacity, total cost, strategy fit, and target value scores.

## Rounds

### Round 1: Cost-Driven Design

Teams must pass:

- Human Support Check
- Capacity Check
- Budget Visibility

The Round 1 winner is the lowest-cost feasible solution.

### Round 2: Target Value Design

Teams maximize value while passing:

- Budget <= 200
- Capacity >= 20 units/day
- Productivity >= 70
- Operational Safety >= 70
- Manual Physical Effort Reduction >= 70
- Human Support Feasible
- HRC Strategy Fit

The Round 2 winner is the highest Value Score among eligible teams. Ties go to the lower-cost solution.

## Files

- `index.html`: dashboard structure
- `styles.css`: responsive simulation dashboard styling
- `app.js`: shared formulas, local state, KPI rendering, and team comparison
- `team.html`: local team setup page

## Run Locally

This is a static web prototype. Run any simple local server:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

The app has no backend and is compatible with GitHub Pages.
