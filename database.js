(function () {
  const config = window.HRC_DATABASE_CONFIG || {};
  const provider = config.provider || "";
  const tableName = config.tableName || "workshop_teams";
  const pollIntervalMs = Number(config.pollIntervalMs) || 2500;

  function isEnabled() {
    return Boolean(provider === "supabase" && config.supabaseUrl && getApiKey());
  }

  function getApiKey() {
    return config.supabasePublishableKey || config.supabaseAnonKey || "";
  }

  function getBaseUrl() {
    return `${String(config.supabaseUrl).replace(/\/$/, "")}/rest/v1/${encodeURIComponent(tableName)}`;
  }

  function getHeaders(extra = {}) {
    const apiKey = getApiKey();
    return {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...extra,
    };
  }

  function normalizeTeamRow(row) {
    const payload = row && typeof row.payload === "object" ? row.payload : row;
    return {
      ...payload,
      teamId: String(payload.teamId || row.team_id || ""),
    };
  }

  async function loadTeams() {
    if (!isEnabled()) return [];
    const response = await fetch(`${getBaseUrl()}?select=team_id,payload,updated_at&order=team_id.asc`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Database load failed: ${response.status}`);
    }
    const rows = await response.json();
    return rows.map(normalizeTeamRow).filter((team) => team.teamId);
  }

  async function upsertTeam(team) {
    if (!isEnabled() || !team || !team.teamId) return null;
    const row = {
      team_id: String(team.teamId),
      payload: team,
      updated_at: new Date().toISOString(),
    };
    const response = await fetch(`${getBaseUrl()}?on_conflict=team_id`, {
      method: "POST",
      headers: getHeaders({ Prefer: "resolution=merge-duplicates" }),
      body: JSON.stringify(row),
    });
    if (!response.ok) {
      throw new Error(`Database save failed: ${response.status}`);
    }
    return team;
  }

  function startPolling(onTeamsLoaded, onError) {
    if (!isEnabled()) return null;
    let active = true;

    async function tick() {
      try {
        const teams = await loadTeams();
        if (active) onTeamsLoaded(teams);
      } catch (error) {
        if (active && onError) onError(error);
      }
    }

    tick();
    const timer = window.setInterval(tick, pollIntervalMs);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }

  window.WorkshopDatabase = {
    isEnabled,
    loadTeams,
    upsertTeam,
    startPolling,
  };
})();
