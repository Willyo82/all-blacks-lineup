(() => {
  const squads = window.ALL_BLACKS_SQUADS || [];
  const photoRoot = window.ALL_BLACKS_SQUAD_PHOTO_ROOT || "assets/players/";
  const units = [
    { id: "front-row", name: "Front row", numbers: "Jerseys 1, 2, 3", description: "Props and hookers", accent: "#d9ff43" },
    { id: "locks", name: "Locks", numbers: "Jerseys 4, 5", description: "Second-row forwards", accent: "#72e8a0" },
    { id: "loose-forwards", name: "Loose forwards", numbers: "Jerseys 6–8", description: "Flankers and No. 8s", accent: "#ffbf47" },
    { id: "inside-backs", name: "Inside backs", numbers: "Jerseys 9, 10", description: "Halfbacks and first five-eighths", accent: "#ba9cff" },
    { id: "midfield", name: "Midfield", numbers: "Jerseys 12, 13", description: "Second five-eighths and centres", accent: "#ff7dcc" },
    { id: "outside-backs", name: "Outside backs", numbers: "Jerseys 11, 14, 15", description: "Wings and fullbacks", accent: "#60d9ff" }
  ];

  const squadSelect = document.getElementById("squad-select");
  const releasedSquad = document.getElementById("released-squad");
  const upcomingSquad = document.getElementById("upcoming-squad");
  const unitFilters = document.getElementById("unit-filters");
  const unitSections = document.getElementById("unit-sections");
  const changePanel = document.getElementById("change-panel");
  const flashTimers = new WeakMap();

  function previousSquadFor(squad) {
    return squads.find(candidate => candidate.id === squad.compareTo) || null;
  }

  function initials(name) {
    return name.split(/\s+/).map(part => part[0]).slice(0, 2).join("");
  }

  function playerCard(player, movement) {
    const movementLabel = movement === "new" ? "New for this squad" : movement === "retained" ? "Retained" : "Current squad";
    return `<article class="player-card ${movement}" data-unit="${player.unit}" data-movement="${movement}" role="button" tabindex="0" aria-label="Select ${player.name}">
      <div class="portrait-wrap">
        <img class="portrait" src="${photoRoot}${player.id}.png" alt="${player.name}" />
        <span class="portrait-fallback" aria-hidden="true">${initials(player.name)}</span>
        ${player.captain ? '<span class="captain-badge">C</span>' : ""}
      </div>
      <div class="player-copy">
        <span class="movement-label">${movementLabel}</span>
        <h3>${player.name}</h3>
        <p>${player.role}</p>
        <strong>#${player.number}</strong>
      </div>
    </article>`;
  }

  function removedCard(player) {
    return `<div class="removed-player">
      <img src="${photoRoot}${player.id}.png" alt="${player.name}" />
      <div><strong>${player.name}</strong><span>${player.role} · #${player.number}</span></div>
      <b>Not selected</b>
    </div>`;
  }

  function flashCard(card) {
    window.clearTimeout(flashTimers.get(card));
    card.classList.remove("click-flash");
    void card.offsetWidth;
    card.classList.add("click-flash");
    flashTimers.set(card, window.setTimeout(() => card.classList.remove("click-flash"), 940));
  }

  function activateCards() {
    document.querySelectorAll(".player-card").forEach(card => {
      card.addEventListener("click", () => flashCard(card));
      card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          flashCard(card);
        }
      });
    });

    document.querySelectorAll(".portrait").forEach(image => {
      image.addEventListener("error", () => image.closest(".portrait-wrap")?.classList.add("image-missing"));
    });
  }

  function configureUnitFilters() {
    const buttons = [...unitFilters.querySelectorAll("[data-unit-filter]")];
    const sections = [...unitSections.querySelectorAll(".unit-section")];
    let activeUnit = null;

    buttons.forEach(button => {
      button.onclick = () => {
        activeUnit = activeUnit === button.dataset.unitFilter ? null : button.dataset.unitFilter;
        unitFilters.classList.toggle("is-filtering", Boolean(activeUnit));
        buttons.forEach(item => item.setAttribute("aria-pressed", String(item.dataset.unitFilter === activeUnit)));
        sections.forEach(section => {
          const match = !activeUnit || section.dataset.unit === activeUnit;
          section.classList.toggle("is-dimmed", !match);
          section.classList.toggle("is-highlighted", Boolean(activeUnit) && match);
        });
        if (activeUnit) document.querySelector(`[data-unit-section="${activeUnit}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      };
    });
  }

  function renderChangePanel(squad, previousSquad, additions, removed, retainedCount) {
    if (!previousSquad) {
      changePanel.innerHTML = `<div><span class="eyebrow">Comparison baseline</span><h2>Current 2026 squad</h2><p>This is the 38-player starting point. When the South Africa touring squad is entered, changes will be calculated automatically.</p></div>
        <div class="change-stats"><span><b>${squad.players.length}</b> current</span><span class="added"><b>0</b> added</span><span class="removed"><b>0</b> removed</span></div>`;
      return;
    }

    changePanel.innerHTML = `<div><span class="eyebrow">Changes from ${previousSquad.shortLabel}</span><h2>${additions.length} added · ${removed.length} not selected</h2><p>${retainedCount} players remain from the previous squad. New touring selections use a green marker.</p></div>
      <div class="change-stats"><span><b>${squad.players.length}</b> selected</span><span class="added"><b>${additions.length}</b> added</span><span class="removed"><b>${removed.length}</b> removed</span></div>
      ${removed.length ? `<div class="removed-list"><h3>Not selected from the previous squad</h3>${removed.map(removedCard).join("")}</div>` : ""}`;
  }

  function renderReleasedSquad(squad) {
    const previousSquad = previousSquadFor(squad);
    const previousIds = new Set((previousSquad?.players || []).map(player => player.id));
    const currentIds = new Set(squad.players.map(player => player.id));
    const additions = previousSquad ? squad.players.filter(player => !previousIds.has(player.id)) : [];
    const removed = previousSquad ? previousSquad.players.filter(player => !currentIds.has(player.id)) : [];
    const retainedCount = squad.players.length - additions.length;

    document.getElementById("page-title").textContent = squad.label;
    document.getElementById("page-subtitle").textContent = previousSquad
      ? `Touring squad compared automatically with the ${previousSquad.label.toLowerCase()}.`
      : "The current All Blacks squad arranged by playing unit, ready to compare with the South Africa touring squad.";
    document.getElementById("squad-total").textContent = squad.players.length;
    document.getElementById("squad-status").textContent = previousSquad ? `${additions.length} additions · ${removed.length} removed` : "Comparison baseline";

    unitFilters.innerHTML = units.map(unit => {
      const count = squad.players.filter(player => player.unit === unit.id).length;
      return `<button class="unit-filter" type="button" data-unit-filter="${unit.id}" aria-pressed="false" style="--unit-accent:${unit.accent}"><i></i><span><b>${count}</b>${unit.name}</span><small>${unit.numbers}</small></button>`;
    }).join("");

    unitSections.innerHTML = units.map(unit => {
      const players = squad.players.filter(player => player.unit === unit.id);
      return `<section class="unit-section" data-unit="${unit.id}" data-unit-section="${unit.id}" style="--unit-accent:${unit.accent}">
        <header class="unit-heading"><div><span class="unit-number">${unit.numbers}</span><h2>${unit.name}</h2><p>${unit.description}</p></div><strong>${players.length}<small>players</small></strong></header>
        <div class="player-grid">${players.map(player => playerCard(player, previousSquad ? (previousIds.has(player.id) ? "retained" : "new") : "baseline")).join("")}</div>
      </section>`;
    }).join("");

    renderChangePanel(squad, previousSquad, additions, removed, retainedCount);
    configureUnitFilters();
    activateCards();
  }

  function applySquad(squad) {
    const released = squad.status === "released" && Array.isArray(squad.players);
    squadSelect.value = squad.id;
    releasedSquad.hidden = !released;
    upcomingSquad.hidden = released;

    if (released) {
      renderReleasedSquad(squad);
    } else {
      const previousSquad = previousSquadFor(squad);
      document.getElementById("page-title").textContent = squad.label;
      document.getElementById("page-subtitle").textContent = "The touring group will appear here as soon as the official squad is supplied.";
      document.getElementById("squad-total").textContent = "—";
      document.getElementById("squad-status").textContent = "Not released";
      document.getElementById("upcoming-title").textContent = squad.label;
      document.getElementById("upcoming-copy").textContent = previousSquad
        ? `The ${previousSquad.players.length}-player ${previousSquad.label.toLowerCase()} remains the comparison baseline. New selections and players not retained will be highlighted automatically.`
        : "Squad details have not been released.";
    }

    const url = new URL(window.location.href);
    url.searchParams.set("squad", squad.id);
    window.history.replaceState({}, "", url);
    document.title = `${squad.label} — All Blacks squad tracker`;
  }

  squadSelect.innerHTML = squads.map(squad => `<option value="${squad.id}">${squad.label}${squad.status === "upcoming" ? " — not released" : ""}</option>`).join("");
  squadSelect.addEventListener("change", () => applySquad(squads.find(squad => squad.id === squadSelect.value) || squads[0]));
  const requestedSquad = new URLSearchParams(window.location.search).get("squad");
  applySquad(squads.find(squad => squad.id === requestedSquad) || squads[0]);
})();
