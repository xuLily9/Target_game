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

| Resource | Credits | Daily Capacity | Human Support |
| --- | ---: | ---: | ---: |
| Construction Worker | 10 | 1 | 0 |
| Basic Robot | 20 | 3 | 0.5 worker-day |
| Advanced Robot | 35 | 5 | 1 worker-day |
| Autonomous Robot Fleet | 60 | 8 | 3 worker-days |

Credits are one-time resource points for the selected round, not daily operating costs. Workers can either support robots or provide manual transport capacity. The game calculates support load, remaining manual capacity, robot capacity, net daily capacity, total credits, strategy fit, and target value scores.

## Rounds

### Round 1: Cost-Driven Design

Teams must pass these hard submission requirements:

- Robot Support Check
- Total Capacity > 0 units/day
- Schedule Check: Estimated Duration <= 5 days

Round 1 resource availability:

- Max 20 human workers total, including skilled workers, construction material workers, and robot support workers
- Max 12 robot/fleet units total, including delivery robots, quadruped robots, and multi-robot fleets

Budget overruns are allowed, but they show as a failed budget check and add a penalty. Schedule overruns are not valid Round 1 submissions and cannot be submitted.

- Budget Penalty = `max(0, Credits - 200) x 2`
- Final Score Points = `Credits + Budget Penalty`

The Round 1 winner is the valid submitted solution with the lowest Final Score Points. Ties go to the lower-credit solution.

### Round 2: Target Value Design

Teams maximize a penalty-adjusted Human-Robot Collaboration value score.

Base Performance Score:

- Skilled workers, material workers, support workers, and robots all contribute to Productivity, Operational Safety, and Manual Physical Effort Reduction.
- The three performance dimensions are weighted by the selected HRC strategy.

Design Penalties:

- Strategy Mismatch Penalty = `10` if the selected strategy does not match the actual resource pattern
- Performance Weakness Penalty = `0.75 x total points below 70 across the three performance dimensions`
- Schedule Overrun Penalty = `5 x max(0, Estimated Duration - 5)`
- Budget Overrun Penalty = `0.2 x max(0, Credits - 200)`
- Final Value Score = `max(0, Base Performance Score - Total Design Penalty)`

The Round 2 time penalty is intentionally lighter than Round 1 because Round 2 focuses on HRC performance value. Robot Support Check is a hard submission rule: teams cannot submit Round 2 if robot support demand exceeds available support workers. The robot/fleet limit is enforced by the resource selector. The Round 2 winner is the highest eligible Final Value Score. Ties go to the lower-credit solution.

## Files

- `index.html`: dashboard structure
- `styles.css`: responsive simulation dashboard styling
- `app.js`: shared formulas, local state, KPI rendering, and team comparison
- `team.html`: local team setup page
- `database-config.js`: optional Supabase connection settings for multi-device workshops
- `database.js`: browser database adapter with local fallback

## Run Locally

This is a static web prototype. Run any simple local server:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

Without database settings, the app uses browser local storage and is compatible with GitHub Pages.

## Multi-Device Database Setup

For multiple teams on different computers, create a Supabase project and run this SQL:

```sql
create table if not exists public.workshop_teams (
  team_id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.workshop_teams enable row level security;

create policy "Workshop teams can be read"
on public.workshop_teams for select
using (true);

create policy "Workshop teams can be created"
on public.workshop_teams for insert
with check (true);

create policy "Workshop teams can be updated"
on public.workshop_teams for update
using (true)
with check (true);
```

Then edit `database-config.js`:

```js
window.HRC_DATABASE_CONFIG = {
  provider: "supabase",
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabasePublishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
  supabaseAnonKey: "",
  tableName: "workshop_teams",
  pollIntervalMs: 2500,
};
```

After this, all team setup, drafts, final submissions, and summary boards sync through the shared database.
