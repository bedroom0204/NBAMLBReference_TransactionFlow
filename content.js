/**
 * Sports Reference Transaction Visualizer Content Script (Flat Light, Timeline Only)
 */

(function () {
  console.log("[Sports Trade Visualizer] Content script initialized.");

  let isInitialized = false;

  function getPlayerInfo() {
    // Extract player ID from URL: e.g. /players/g/greenjo02.html -> greenjo02
    let playerId = "";
    const pathMatch = window.location.pathname.match(/\/players\/[a-z]\/([a-z0-9]+)\.(?:html|shtml)/i);
    if (pathMatch) {
      playerId = pathMatch[1].toLowerCase();
    }

    // Extract player name from h1
    let playerName = "";
    const h1 = document.querySelector("#meta h1") || document.querySelector("h1");
    if (h1) {
      const span = h1.querySelector("span");
      const text = span ? span.innerText : h1.innerText;
      playerName = text.replace(/\s+/g, " ").trim();
    }
    if (!playerName) {
      const title = document.title || "";
      playerName = title.split("Stats")[0].replace(/[|\-–].*$/, "").trim() || "Player";
    }

    return { playerName, playerId };
  }

  function findTransactionsSection() {
    let el = document.getElementById("all_transactions");
    if (el) return { container: el, type: "nba" };

    el = document.getElementById("all_transactions_other");
    if (el) return { container: el, type: "mlb" };

    const headings = document.querySelectorAll("h2");
    for (const h of headings) {
      if (h.innerText.trim().toLowerCase() === "transactions") {
        const parent = h.closest(".section_wrapper") || h.parentElement;
        return { container: parent, type: "generic" };
      }
    }

    return null;
  }

  function getTransactionsHtml(container) {
    const div = container.querySelector("#div_transactions, #div_transactions_other, .section_content");
    if (div && div.innerHTML.trim().length > 50) {
      return div.innerHTML;
    }

    const iterator = document.createNodeIterator(container, NodeFilter.SHOW_COMMENT);
    let currentNode;
    while ((currentNode = iterator.nextNode())) {
      const text = currentNode.nodeValue || "";
      if (text.includes("div_transactions") || text.includes("transaction")) {
        return text;
      }
    }

    return container.innerHTML;
  }

  function initVisualizer() {
    if (isInitialized) return;

    const section = findTransactionsSection();
    if (!section || !section.container) {
      setTimeout(initVisualizer, 800);
      return;
    }

    const rawHtml = getTransactionsHtml(section.container);
    if (!rawHtml || rawHtml.length < 20) {
      setTimeout(initVisualizer, 1000);
      return;
    }

    const { playerName, playerId } = getPlayerInfo();
    const entries = TransactionParser.parseTransactionsSection(rawHtml, playerName, playerId);

    if (entries.length === 0) {
      console.log("[Sports Trade Visualizer] No transaction entries found.");
      return;
    }

    console.log(`[Sports Trade Visualizer] Rendered ${entries.length} timeline events for ${playerName} (${playerId})`);

    // Create mount point
    const visualizerHost = document.createElement("div");
    visualizerHost.id = "stv-mount-point";
    visualizerHost.innerHTML = TransactionVisualizer.renderTimelineApp(entries, playerName, playerId);

    // Insert visualizer right before or inside section container
    const heading = section.container.querySelector(".section_heading") || section.container.firstElementChild;
    if (heading && heading.nextSibling) {
      section.container.insertBefore(visualizerHost, heading.nextSibling);
    } else {
      section.container.prepend(visualizerHost);
    }

    TransactionVisualizer.bindEvents(visualizerHost);

    isInitialized = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVisualizer);
  } else {
    initVisualizer();
  }

  setTimeout(initVisualizer, 1500);
  setTimeout(initVisualizer, 3000);
})();
