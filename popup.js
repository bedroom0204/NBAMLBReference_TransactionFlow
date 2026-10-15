/**
 * Popup Script (Flat Light Mode, English Only)
 */

const PRESETS = {
  josh: {
    player: "Josh Green",
    id: "greenjo02",
    text: `July 6, 2024: As part of a 6-team trade, traded by the <a data-attr-from="DAL" href="/teams/DAL/2025.html">Dallas Mavericks</a> to the <a data-attr-to="CHO" href="/teams/CHO/2025.html">Charlotte Hornets</a>; the <a data-attr-from="CHO" href="/teams/CHO/2025.html">Charlotte Hornets</a> traded a 2025 2nd round draft pick (<a href="/players/b/broomjo01.html">Johni Broome</a> was later selected) to the <a data-attr-to="DAL" href="/teams/DAL/2025.html">Dallas Mavericks</a>; the <a data-attr-from="CHO" href="/teams/CHO/2025.html">Charlotte Hornets</a> traded cash to the <a data-attr-to="DEN" href="/teams/DEN/2025.html">Denver Nuggets</a>; the <a data-attr-from="DAL" href="/teams/DAL/2025.html">Dallas Mavericks</a> traded a 2031 2nd round draft pick to the <a data-attr-to="PHI" href="/teams/PHI/2025.html">Philadelphia 76ers</a>; the <a data-attr-from="DEN" href="/teams/DEN/2025.html">Denver Nuggets</a> traded <a href="/players/j/jacksre01.html">Reggie Jackson</a>, a 2029 2nd round draft pick and a 2030 2nd round draft pick to the <a data-attr-to="CHO" href="/teams/CHO/2025.html">Charlotte Hornets</a>; the <a data-attr-from="DEN" href="/teams/DEN/2025.html">Denver Nuggets</a> traded a 2025 2nd round draft pick (<a href="/players/t/tooheal01.html">Alex Toohey</a> was later selected) to the <a data-attr-to="MIN" href="/teams/MIN/2025.html">Minnesota Timberwolves</a>; the <a data-attr-from="GSW" href="/teams/GSW/2025.html">Golden State Warriors</a> traded <a href="/players/t/thompkl01.html">Klay Thompson</a> to the <a data-attr-to="DAL" href="/teams/DAL/2025.html">Dallas Mavericks</a>; the <a data-attr-from="GSW" href="/teams/GSW/2025.html">Golden State Warriors</a> traded cash and a 2031 2nd round draft pick to the <a data-attr-to="MIN" href="/teams/MIN/2025.html">Minnesota Timberwolves</a>; the <a data-attr-from="MIN" href="/teams/MIN/2025.html">Minnesota Timberwolves</a> traded <a href="/players/a/anderky01.html">Kyle Anderson</a> to the <a data-attr-to="GSW" href="/teams/GSW/2025.html">Golden State Warriors</a>; and the <a data-attr-from="PHI" href="/teams/PHI/2025.html">Philadelphia 76ers</a> traded <a href="/players/h/hieldbu01.html">Buddy Hield</a> to the <a data-attr-to="GSW" href="/teams/GSW/2025.html">Golden State Warriors</a>.`
  },
  soto: {
    player: "Juan Soto",
    id: "sotoju01",
    text: `August 2, 2022: Traded by the <a href="/teams/WSN/2022.shtml">Washington Nationals</a> with <a href="/players/b/belljo02.shtml">Josh Bell</a> to the <a href="/teams/SDP/2022.shtml">San Diego Padres</a> for <a href="/register/player.fcgi?id=susana000jar">Jarlin Susana</a> (minors), <a href="/players/a/abramcj01.shtml">CJ Abrams</a>, <a href="/players/g/gorema01.shtml">MacKenzie Gore</a>, <a href="/players/h/hassero02.shtml">Robert Hassell III</a>, <a href="/players/v/voitlu01.shtml">Luke Voit</a> and <a href="/players/w/woodja03.shtml">James Wood</a>.`
  },
  kat: {
    player: "Karl-Anthony Towns",
    id: "townska01",
    text: `October 2, 2024: As part of a 3-team trade, traded by the <a data-attr-from="MIN" href="/teams/MIN/2025.html">Minnesota Timberwolves</a> to the <a data-attr-to="NYK" href="/teams/NYK/2025.html">New York Knicks</a>; the <a data-attr-from="NYK" href="/teams/NYK/2025.html">New York Knicks</a> traded <a href="/players/d/dapoudu01.html">Pacôme Dadiet</a>, cash and a 2025 2nd round draft pick to the <a data-attr-to="CHO" href="/teams/CHO/2025.html">Charlotte Hornets</a>; the <a data-attr-from="NYK" href="/teams/NYK/2025.html">New York Knicks</a> traded <a href="/players/d/divinja01.html">Donte DiVincenzo</a>, <a href="/players/r/randlju01.html">Julius Randle</a>, <a href="/players/b/bateske01.html">Keita Bates-Diop</a> and a 2025 1st round draft pick to the <a data-attr-to="MIN" href="/teams/MIN/2025.html">Minnesota Timberwolves</a>; and the <a data-attr-from="CHO" href="/teams/CHO/2025.html">Charlotte Hornets</a> traded <a href="/players/n/nnikije01.html">James Nnaji</a> to the <a data-attr-to="NYK" href="/teams/NYK/2025.html">New York Knicks</a>.`
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const playerInput = document.getElementById("input-player-name");
  const idInput = document.getElementById("input-player-id");
  const txInput = document.getElementById("input-tx-text");
  const parseBtn = document.getElementById("btn-parse-run");
  const clearBtn = document.getElementById("btn-clear-input");
  const previewArea = document.getElementById("preview-area");

  function runVisualization() {
    const playerName = playerInput.value.trim() || "Player";
    const playerId = idInput.value.trim().toLowerCase();
    const text = txInput.value.trim();

    if (!text) {
      previewArea.innerHTML = `<div class="empty-state"><p>Please enter or paste transaction text.</p></div>`;
      return;
    }

    const htmlToParse = text.startsWith("<p") ? text : `<p>${text}</p>`;
    const entries = TransactionParser.parseTransactionsSection(htmlToParse, playerName, playerId);

    if (entries.length === 0) {
      previewArea.innerHTML = `<div class="empty-state"><p>No transactions could be parsed from the text.</p></div>`;
      return;
    }

    previewArea.innerHTML = TransactionVisualizer.renderTimelineApp(entries, playerName, playerId);
    TransactionVisualizer.bindEvents(previewArea);
  }

  document.getElementById("btn-preset-josh").addEventListener("click", () => {
    playerInput.value = PRESETS.josh.player;
    idInput.value = PRESETS.josh.id;
    txInput.value = PRESETS.josh.text;
    runVisualization();
  });

  document.getElementById("btn-preset-soto").addEventListener("click", () => {
    playerInput.value = PRESETS.soto.player;
    idInput.value = PRESETS.soto.id;
    txInput.value = PRESETS.soto.text;
    runVisualization();
  });

  document.getElementById("btn-preset-kat").addEventListener("click", () => {
    playerInput.value = PRESETS.kat.player;
    idInput.value = PRESETS.kat.id;
    txInput.value = PRESETS.kat.text;
    runVisualization();
  });

  parseBtn.addEventListener("click", runVisualization);

  clearBtn.addEventListener("click", () => {
    txInput.value = "";
    previewArea.innerHTML = `<div class="empty-state"><p>Cleared. Select a preset or paste text above.</p></div>`;
  });

  // Default load Josh Green
  playerInput.value = PRESETS.josh.player;
  idInput.value = PRESETS.josh.id;
  txInput.value = PRESETS.josh.text;
  runVisualization();
});
