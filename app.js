(() => {
  "use strict";

  const matches = window.ALL_BLACKS_MATCHES || [];
  const photoRoot = window.ALL_BLACKS_PHOTO_ROOT || "assets/players/";
  const positionLayout = [
    { n: 1, p: "Loosehead Prop", x: 88, y: 18 },
    { n: 2, p: "Hooker", x: 88, y: 50 },
    { n: 3, p: "Tighthead Prop", x: 88, y: 82 },
    { n: 4, p: "Lock", x: 78, y: 34 },
    { n: 5, p: "Lock", x: 78, y: 66 },
    { n: 6, p: "Blindside Flanker", x: 65, y: 18 },
    { n: 7, p: "Openside Flanker", x: 65, y: 82 },
    { n: 8, p: "Number Eight", x: 65, y: 50 },
    { n: 9, p: "Halfback", x: 53, y: 34 },
    { n: 10, p: "First Five-Eighth", x: 53, y: 66 },
    { n: 11, p: "Left Wing", x: 18, y: 18 },
    { n: 12, p: "Second Five-Eighth", x: 29, y: 34 },
    { n: 13, p: "Centre", x: 29, y: 66 },
    { n: 14, p: "Right Wing", x: 18, y: 82 },
    { n: 15, p: "Fullback", x: 12, y: 50 }
  ];

  const positionByNumber = new Map(positionLayout.map(position => [position.n, position]));
  const matchSelect = document.getElementById("match-select");
  const releasedLineup = document.getElementById("released-lineup");
  const unreleasedPanel = document.getElementById("unreleased-panel");
  const availabilityStrip = document.getElementById("availability-strip");
  const availabilityPlayers = document.getElementById("availability-players");
  const field = document.getElementById("field");
  const benchContainer = document.getElementById("bench");
  const startingJump = document.getElementById("starting-jump");
  const benchJump = document.getElementById("bench-jump");
  const flashTimers = new WeakMap();
  const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "your device timezone";
  const dateFormatter = new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric" });
  const kickoffFormatter = new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" });

  document.getElementById("fixture-timezone").textContent = `Kick-off times shown in ${deviceTimeZone.replaceAll("_", " ")}.`;

  function fixtureDate(match) {
    return dateFormatter.format(new Date(match.kickoff));
  }

  function fixtureKickoff(match) {
    return kickoffFormatter.format(new Date(match.kickoff));
  }

  function getPreviousReleasedMatch(match) {
    return matches
      .filter(candidate => candidate.lineup && new Date(candidate.kickoff) < new Date(match.kickoff))
      .sort((a, b) => new Date(b.kickoff) - new Date(a.kickoff))[0] || null;
  }

  function injuryFor(match, playerId) {
    return (match.unavailable || []).find(player => player.id === playerId) || null;
  }

  function playerMeta(player) {
    const capText = player.debut && player.caps === 0 ? "Debutant" : `${player.caps ?? "—"} caps`;
    return `${capText}${player.captain ? " · Captain" : ""}`;
  }

  function currentStarterState(player, previousById, previousMatch) {
    const previousPlayer = previousById.get(player.id);
    if (!previousPlayer) {
      const previousInjury = injuryFor(previousMatch, player.id);
      return { state: "new", status: previousInjury ? `Returned from injury · ${previousInjury.detail}` : "New to this week’s XV" };
    }
    if (previousPlayer.n === player.n) return { state: "retained", status: "Retained · same jersey" };
    if (previousPlayer.n > 15) return { state: "promoted", status: `Promoted from bench · #${previousPlayer.n}` };
    const previousPosition = positionByNumber.get(previousPlayer.n)?.p || "another position";
    return { state: "moved", status: `Moved from ${previousPosition.toLowerCase()} · #${previousPlayer.n}` };
  }

  function currentBenchState(player, previousById, previousMatch) {
    const previousPlayer = previousById.get(player.id);
    if (!previousPlayer) {
      const previousInjury = injuryFor(previousMatch, player.id);
      return { state: "new", status: previousInjury ? `Returned from injury · ${previousInjury.detail}` : "New to this week’s bench", benchFilter: "new-bench" };
    }
    if (previousPlayer.n <= 15) return { state: "new", status: `Moved from Starting XV · #${previousPlayer.n}`, benchFilter: "new-bench" };
    if (previousPlayer.n === player.n) return { state: "retained", status: "Retained · same jersey", benchFilter: "retained-bench" };
    return { state: "shifted", status: `Retained on bench · from #${previousPlayer.n}`, benchFilter: "retained-bench" };
  }

  function previousMovement(previousPlayer, currentById) {
    if (!previousPlayer) return null;
    const currentPlayer = currentById.get(previousPlayer.id);
    if (!currentPlayer) return "out";
    if (previousPlayer.n <= 15 && currentPlayer.n > 15) return "bench";
    if (previousPlayer.n > 15 && currentPlayer.n <= 15) return "start";
    return null;
  }

  function buildComparison(match, previousMatch) {
    const previousLineup = previousMatch?.lineup || [];
    const previousByNumber = new Map(previousLineup.map(player => [player.n, player]));
    const previousById = new Map(previousLineup.map(player => [player.id, player]));
    const currentById = new Map(match.lineup.map(player => [player.id, player]));

    const starters = match.lineup.filter(player => player.n <= 15).map(player => {
      const layout = positionByNumber.get(player.n);
      const previousPlayer = previousByNumber.get(player.n);
      const movement = previousMovement(previousPlayer, currentById);
      const injury = previousPlayer ? injuryFor(match, previousPlayer.id) : null;
      const currentState = previousMatch ? currentStarterState(player, previousById, previousMatch) : { state: "new", status: "First tracked lineup" };
      return {
        ...player,
        ...layout,
        ...currentState,
        prev: previousPlayer?.name || "No previous tracked match",
        prevMovement: movement,
        injury: injury?.detail || null
      };
    });

    const bench = match.lineup.filter(player => player.n > 15).map(player => {
      const previousPlayer = previousByNumber.get(player.n);
      const movement = previousMovement(previousPlayer, currentById);
      const injury = previousPlayer ? injuryFor(match, previousPlayer.id) : null;
      const currentState = previousMatch ? currentBenchState(player, previousById, previousMatch) : { state: "new", status: "First tracked lineup", benchFilter: "new-bench" };
      return {
        ...player,
        ...currentState,
        prev: previousPlayer?.name || "No previous tracked match",
        prevMovement: movement,
        injury: injury?.detail || null,
        group: player.n <= 20 ? "Forward" : "Back"
      };
    });

    return { starters, bench };
  }

  function jersey(number) {
    const numberSize = number >= 10 ? 29 : 36;
    return `<div class="jersey" aria-hidden="true"><svg viewBox="0 0 100 120"><path d="M25 10 8 27l12 20 8-7v68h44V40l8 7 12-20-17-17-16 10H41L25 10Z" fill="#f7f7f4" stroke="#111" stroke-width="3"/><path d="M42 20c2 9 14 9 16 0" fill="none" stroke="#111" stroke-width="3"/><text x="50" y="77" text-anchor="middle" font-family="Arial" font-size="${numberSize}" font-weight="900" fill="#090909">${number}</text></svg></div>`;
  }

  function previousStatus(player) {
    const badges = [];
    if (player.prevMovement === "out") badges.push('<span class="previous-movement-icon out" role="img" aria-label="Dropped out of the matchday 23" title="Dropped out of the matchday 23">↓</span>');
    if (player.prevMovement === "bench") badges.push('<span class="previous-movement-icon bench" role="img" aria-label="Dropped from the Starting XV to the bench" title="Dropped from the Starting XV to the bench">↓</span>');
    if (player.prevMovement === "start") badges.push('<span class="previous-movement-icon start" role="img" aria-label="Promoted from the bench to the Starting XV" title="Promoted from the bench to the Starting XV">↑</span>');
    if (player.injury) badges.push(`<span class="injury-icon" role="img" aria-label="Confirmed injury: ${player.injury}" title="Confirmed injury: ${player.injury}">✚</span>`);
    return `<div class="previous-line"><span class="previous-player">${player.prev}</span>${badges.length ? `<span class="previous-badges">${badges.join("")}</span>` : ""}</div>${player.injury ? `<small class="injury-note">${player.injury}</small>` : ""}`;
  }

  function flashPlayer(card) {
    window.clearTimeout(flashTimers.get(card));
    card.classList.remove("click-flash");
    void card.offsetWidth;
    card.classList.add("click-flash");
    flashTimers.set(card, window.setTimeout(() => card.classList.remove("click-flash"), 940));
  }

  function activatePlayerCards() {
    document.querySelectorAll(".position-card, .bench-row").forEach(card => {
      card.addEventListener("click", () => flashPlayer(card));
      card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          flashPlayer(card);
        }
      });
    });
  }

  function configureStarterFilters(starters) {
    const summary = document.getElementById("summary-filters");
    const buttons = [...summary.querySelectorAll("[data-filter]")];
    const previousStatusFilters = document.getElementById("previous-status-filters");
    const previousFilterButtons = [...previousStatusFilters.querySelectorAll("[data-previous-filter]")];
    const cards = [...document.querySelectorAll(".position-card")];
    const status = document.getElementById("filter-status");
    let activeFilter = null;
    let activePreviousCard = null;
    let activePreviousFilter = null;

    function matchesPreviousFilter(card, filter) {
      if (filter === "promoted") return card.dataset.state === "promoted";
      if (filter === "injured") return card.dataset.previousInjured === "true";
      return card.dataset.previousMovement === filter;
    }

    function applyStarterHighlight(message) {
      summary.classList.toggle("is-filtering", Boolean(activeFilter));
      previousStatusFilters.classList.toggle("is-filtering", Boolean(activePreviousFilter));
      buttons.forEach(item => item.setAttribute("aria-pressed", String(item.dataset.filter === activeFilter)));
      previousFilterButtons.forEach(item => item.setAttribute("aria-pressed", String(item.dataset.previousFilter === activePreviousFilter)));
      cards.forEach(card => {
        const previousPlayer = card.querySelector(".previous-player");
        const matchesFilter = activePreviousCard
          ? card === activePreviousCard
          : activePreviousFilter
            ? matchesPreviousFilter(card, activePreviousFilter)
            : !activeFilter || card.dataset.state === activeFilter;
        card.classList.toggle("is-dimmed", !matchesFilter);
        card.classList.toggle("is-highlighted", Boolean(activeFilter || activePreviousCard || activePreviousFilter) && matchesFilter);
        previousPlayer?.setAttribute("aria-pressed", String(card === activePreviousCard));
      });
      status.textContent = message || "All Starting XV players are visible.";
    }

    buttons.forEach(button => {
      const count = starters.filter(player => player.state === button.dataset.filter).length;
      button.querySelector(".starter-filter-count").textContent = count;
      button.disabled = count === 0;
      button.setAttribute("aria-disabled", String(count === 0));
      button.setAttribute("aria-pressed", "false");
      button.onclick = () => {
        activePreviousCard = null;
        activePreviousFilter = null;
        activeFilter = activeFilter === button.dataset.filter ? null : button.dataset.filter;
        applyStarterHighlight(activeFilter ? `${button.textContent.replace(/\s+/g, " ").trim()} highlighted. Other Starting XV players are dimmed.` : null);
      };
    });

    previousFilterButtons.forEach(button => {
      const filter = button.dataset.previousFilter;
      const count = cards.filter(card => matchesPreviousFilter(card, filter)).length;
      button.disabled = count === 0;
      button.setAttribute("aria-disabled", String(count === 0));
      button.setAttribute("aria-pressed", "false");
      button.onclick = () => {
        if (button.disabled) return;
        activeFilter = null;
        activePreviousCard = null;
        activePreviousFilter = activePreviousFilter === filter ? null : filter;
        applyStarterHighlight(activePreviousFilter
          ? `${button.textContent.replace(/\s+/g, " ").trim()} highlighted. Other Starting XV players are dimmed.`
          : null);
      };
    });

    cards.forEach(card => {
      const previousPlayer = card.querySelector(".previous-player");
      if (!previousPlayer) return;
      previousPlayer.setAttribute("role", "button");
      previousPlayer.setAttribute("tabindex", "0");
      previousPlayer.setAttribute("aria-pressed", "false");
      previousPlayer.setAttribute("aria-label", `Highlight last week player ${previousPlayer.textContent.trim()}`);

      const togglePreviousPlayer = event => {
        event.preventDefault();
        event.stopPropagation();
        activeFilter = null;
        activePreviousFilter = null;
        activePreviousCard = activePreviousCard === card ? null : card;
        flashPlayer(card);
        applyStarterHighlight(activePreviousCard
          ? `${previousPlayer.textContent.trim()} from last week is highlighted. Other Starting XV players are dimmed.`
          : null);
      };

      previousPlayer.onclick = togglePreviousPlayer;
      previousPlayer.onkeydown = event => {
        if (event.key === "Enter" || event.key === " ") togglePreviousPlayer(event);
      };
    });
  }

  function configureBenchFilters(bench) {
    const panel = document.getElementById("bench-filters");
    const buttons = [...panel.querySelectorAll("[data-bench-filter]")];
    const rows = [...document.querySelectorAll(".bench-row")];
    const status = document.getElementById("bench-filter-status");
    let activeFilter = null;

    buttons.forEach(button => {
      const filter = button.dataset.benchFilter;
      const count = rows.filter(row => row.dataset.benchFilters.split(" ").includes(filter)).length;
      button.querySelector(".bench-filter-count").textContent = count;
      button.disabled = count === 0;
      button.setAttribute("aria-disabled", String(count === 0));
      button.setAttribute("aria-pressed", "false");
      button.onclick = () => {
        if (button.disabled) return;
        activeFilter = activeFilter === filter ? null : filter;
        panel.classList.toggle("is-filtering", Boolean(activeFilter));
        buttons.forEach(item => item.setAttribute("aria-pressed", String(item.dataset.benchFilter === activeFilter)));
        rows.forEach(row => {
          const matchesFilter = !activeFilter || row.dataset.benchFilters.split(" ").includes(activeFilter);
          row.classList.toggle("is-dimmed", !matchesFilter);
          row.classList.toggle("is-highlighted", Boolean(activeFilter) && matchesFilter);
        });
        status.textContent = activeFilter ? `${button.textContent.replace(/\s+/g, " ").trim()} highlighted. Other bench rows are dimmed.` : "All bench rows are visible.";
      };
    });
  }

  function renderLineup(match) {
    const previousMatch = getPreviousReleasedMatch(match);
    const { starters, bench } = buildComparison(match, previousMatch);
    field.querySelectorAll(".position-card").forEach(card => card.remove());
    field.insertAdjacentHTML("beforeend", starters.map(player => `
      <article class="position-card ${player.state}" data-state="${player.state}" data-previous-movement="${player.prevMovement || ""}" data-previous-injured="${Boolean(player.injury)}" role="button" tabindex="0" aria-label="Select ${player.name}, jersey ${player.n}" style="left:${player.x}%;top:${player.y}%">
        <div class="position-kicker"><span>#${player.n}</span><span>${player.p}</span></div>
        <div class="comparison">
          <div class="previous"><span class="previous-label">${previousMatch ? previousMatch.opponent : "Previous"}</span>${previousStatus(player)}</div>
          ${jersey(player.n)}
          <div class="current-player">
            <div class="face-frame"><img class="face" src="${photoRoot}${player.id}.png" alt="${player.name}" /></div>
            <div class="current-copy"><strong>${player.name}</strong><span class="status">${player.status}</span><small class="selection-meta">${playerMeta(player)}</small></div>
          </div>
        </div>
      </article>`).join(""));

    benchContainer.innerHTML = bench.map(player => {
      const filters = [player.benchFilter, player.prevMovement === "start" ? "promoted-start" : "", player.prevMovement === "out" ? "dropped-out" : "", player.injury ? "injured" : ""].filter(Boolean).join(" ");
      return `<div class="bench-row ${player.state}" data-bench-filters="${filters}" role="button" tabindex="0" aria-label="Select ${player.name}, bench jersey ${player.n}">
        <div class="bench-number">${player.n}<small>Bench</small></div>
        <div class="bench-previous">${previousStatus(player)}</div>
        <div class="bench-arrow">→</div>
        <div class="bench-current">
          <div class="face-frame"><img class="face" src="${photoRoot}${player.id}.png" alt="${player.name}" /></div>
          <div><strong>${player.name}</strong><span>${player.status}</span><small class="selection-meta">${playerMeta(player)}</small></div>
        </div>
      </div>`;
    }).join("");

    const forwardCount = bench.filter(player => player.group === "Forward").length;
    const backCount = bench.filter(player => player.group === "Back").length;
    const newBenchCount = bench.filter(player => player.benchFilter === "new-bench").length;
    const retainedBenchCount = bench.length - newBenchCount;
    document.getElementById("bench-forward-count").textContent = forwardCount;
    document.getElementById("bench-back-count").textContent = backCount;
    document.getElementById("bench-summary-copy").textContent = `${newBenchCount} new faces join this bench; ${retainedBenchCount} remain from ${previousMatch?.opponent || "the previous tracked match"}.`;
    document.getElementById("previous-bench-label").textContent = `${previousMatch?.opponent || "Previous"} bench`;
    document.getElementById("current-bench-label").textContent = `${match.opponent} bench`;

    configureStarterFilters(starters);
    configureBenchFilters(bench);
    activatePlayerCards();
  }

  function populateFixtureSelector() {
    matchSelect.innerHTML = "";
    const competitionGroups = new Map();
    matches.forEach(match => {
      if (!competitionGroups.has(match.competition)) competitionGroups.set(match.competition, []);
      competitionGroups.get(match.competition).push(match);
    });
    competitionGroups.forEach((groupMatches, competition) => {
      const group = document.createElement("optgroup");
      group.label = competition;
      groupMatches.forEach(match => {
        const option = document.createElement("option");
        const statusText = match.status === "completed" ? " — completed" : match.status === "released" ? " — team released" : "";
        option.value = match.id;
        option.textContent = `${fixtureDate(match)} — ${match.team1} vs ${match.team2}${statusText}`;
        group.appendChild(option);
      });
      matchSelect.appendChild(group);
    });
  }

  function applyFixture(match, updateUrl = true) {
    const hasLineup = Array.isArray(match.lineup) && match.lineup.length === 23;
    const previousMatch = hasLineup ? getPreviousReleasedMatch(match) : null;
    matchSelect.value = match.id;
    releasedLineup.hidden = !hasLineup;
    unreleasedPanel.hidden = hasLineup;
    startingJump.hidden = !hasLineup;
    benchJump.hidden = !hasLineup;
    availabilityStrip.hidden = !hasLineup || !(match.unavailable || []).length;

    if (hasLineup) {
      renderLineup(match);
      const comparisonTitle = previousMatch ? `${previousMatch.opponent} → ${match.opponent}` : `All Blacks vs ${match.opponent}`;
      document.getElementById("page-title").textContent = comparisonTitle;
      document.getElementById("page-subtitle").textContent = previousMatch
        ? `${match.status === "completed" ? "Completed" : "Announced"} matchday 23 for ${match.venue}, automatically compared with the previous released team against ${previousMatch.opponent}.`
        : `The first released matchday 23 in this tracker. Movement comparisons begin with the next released fixture.`;

      if (match.status === "completed" && match.score) {
        document.getElementById("match-label-1").textContent = "Result";
        document.getElementById("match-value-1").textContent = `All Blacks ${match.score.allBlacks}–${match.score.opponent} ${match.opponent}`;
      } else {
        document.getElementById("match-label-1").textContent = "Previous";
        document.getElementById("match-value-1").textContent = previousMatch ? `${fixtureDate(previousMatch)} · ${previousMatch.opponent}` : "No previous tracked match";
      }
      document.getElementById("match-label-2").textContent = match.status === "completed" ? "Match" : "Selected";
      document.getElementById("match-value-2").textContent = `${fixtureDate(match)} · ${match.opponent} · ${match.venue}`;
      document.getElementById("match-label-3").textContent = "Kick-off";
      document.getElementById("match-value-3").textContent = `${fixtureKickoff(match)} · ${match.status === "completed" ? "Completed" : "Team released"}`;
      availabilityPlayers.textContent = (match.unavailable || []).map(player => `${player.name} — ${player.detail}`).join(" · ");
      document.title = `All Blacks v ${match.opponent} — Matchday 23`;
      document.getElementById("footer-status-copy").textContent = `Portraits are official All Blacks profile images served with this site. Selection movement is calculated automatically from ${previousMatch?.opponent || "the first tracked match"} to ${match.opponent}.`;
      document.getElementById("footer-source-links").innerHTML = `Sources: <a href="${match.sourceUrl}">official ${match.opponent} team announcement</a> · <a href="https://www.allblacks.com/team/all-blacks/fixtures">official fixtures</a> · <a href="https://www.allblacks.com/team/all-blacks/squad">current squad</a>`;
    } else {
      document.getElementById("page-title").textContent = `${match.team1} vs ${match.team2}`;
      document.getElementById("page-subtitle").textContent = `${match.competition}. Select another match at any time; this page will show the comparison when the official team is available.`;
      document.getElementById("match-label-1").textContent = "Status";
      document.getElementById("match-value-1").textContent = "Upcoming · Team not released";
      document.getElementById("match-label-2").textContent = "Kick-off";
      document.getElementById("match-value-2").textContent = fixtureKickoff(match);
      document.getElementById("match-label-3").textContent = "Venue";
      document.getElementById("match-value-3").textContent = match.venue;
      document.getElementById("unreleased-competition").textContent = match.competition;
      document.getElementById("unreleased-teams").textContent = `${match.team1} vs ${match.team2}`;
      document.getElementById("unreleased-venue").textContent = match.venue;
      document.title = `${match.team1} v ${match.team2} — Team not released`;
    }

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("match", match.id);
      window.history.replaceState({}, "", url);
    }
  }

  populateFixtureSelector();
  startingJump.addEventListener("click", () => {
    startingJump.classList.remove("is-jumping");
    void startingJump.offsetWidth;
    startingJump.classList.add("is-jumping");
    const fieldBottom = field.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top: Math.max(0, fieldBottom - window.innerHeight), behavior: "smooth" });
    window.setTimeout(() => startingJump.classList.remove("is-jumping"), 720);
  });
  benchJump.addEventListener("click", () => {
    benchJump.classList.remove("is-jumping");
    void benchJump.offsetWidth;
    benchJump.classList.add("is-jumping");
    benchContainer.scrollIntoView({ behavior: "smooth", block: "end" });
    window.setTimeout(() => benchJump.classList.remove("is-jumping"), 720);
  });
  matchSelect.addEventListener("change", () => applyFixture(matches.find(match => match.id === matchSelect.value) || matches[0]));
  const requestedMatch = new URLSearchParams(window.location.search).get("match");
  const initialMatch = matches.find(match => match.id === requestedMatch) || [...matches].reverse().find(match => match.lineup) || matches[0];
  applyFixture(initialMatch, Boolean(requestedMatch));
})();
