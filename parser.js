/**
 * Sports Reference Transaction Parser Engine (English, Lightweight)
 * Handles Basketball-Reference and Baseball-Reference transactions
 */

const TransactionParser = (function () {
  function stripHtml(html) {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  function extractPlayerId(urlOrHtml) {
    if (!urlOrHtml) return "";
    const m = urlOrHtml.match(/\/players\/[a-z]\/([a-z0-9]+)\.(?:html|shtml)/i);
    return m ? m[1].toLowerCase() : "";
  }

  function parseTeamLink(linkHtml) {
    if (!linkHtml) return null;
    const name = stripHtml(linkHtml);
    const hrefM = linkHtml.match(/href=["']([^"']+)["']/i);
    const codeM = linkHtml.match(/data-attr-(?:to|from)=["']([^"']+)["']/i);
    let code = codeM ? codeM[1].toUpperCase() : "";

    if (!code && hrefM) {
      const m = hrefM[1].match(/\/teams\/([A-Z0-9]+)\//i);
      if (m) code = m[1].toUpperCase();
    }

    return {
      name,
      code,
      href: hrefM ? hrefM[1] : "",
      rawHtml: linkHtml
    };
  }

  function parseAssets(assetStr, currentPlayerName = "", currentPlayerId = "", includeCurrentPlayer = false) {
    const assets = [];

    if (includeCurrentPlayer && currentPlayerName) {
      assets.push({
        name: currentPlayerName,
        isCurrentPlayer: true,
        type: "player",
        playerId: currentPlayerId,
        raw: currentPlayerName,
        href: currentPlayerId ? `/players/${currentPlayerId[0]}/${currentPlayerId}.html` : ""
      });
    }

    if (!assetStr) return assets;

    let text = assetStr.trim().replace(/^(?:with|for)\s+/i, "");

    const links = [];
    const tokenized = text.replace(/<a\b[^>]*>.*?<\/a>/gi, (match) => {
      links.push(match);
      return `___LINK_TOKEN_${links.length - 1}___`;
    });

    const rawItems = tokenized.split(/,\s*and\s+|\s+and\s+|,\s*/i);

    rawItems.forEach((item) => {
      let restored = item.trim();
      if (!restored) return;

      links.forEach((link, idx) => {
        restored = restored.replace(`___LINK_TOKEN_${idx}___`, link);
      });

      restored = restored.replace(/\.\s*$/, "").trim();
      const cleanName = stripHtml(restored);
      if (!cleanName) return;

      const hrefM = restored.match(/href=["']([^"']+)["']/i);
      const isPick = /draft pick|round/i.test(restored);
      const isPlayer = !isPick && /players\/|register\/player/i.test(restored);
      const isCash = /cash/i.test(restored);
      const isException = /exception/i.test(restored);

      let assetType = "other";
      if (isPick) assetType = "pick";
      else if (isPlayer) assetType = "player";
      else if (isCash) assetType = "cash";
      else if (isException) assetType = "exception";

      const pId = extractPlayerId(restored);
      const isCurrent = (currentPlayerName && cleanName.toLowerCase() === currentPlayerName.toLowerCase()) ||
                        (currentPlayerId && pId && pId === currentPlayerId);

      assets.push({
        name: cleanName,
        raw: restored,
        href: hrefM ? hrefM[1] : "",
        playerId: pId || (isCurrent ? currentPlayerId : ""),
        type: assetType,
        isCurrentPlayer: isCurrent
      });
    });

    return assets;
  }

  function parseEntry(entryHtml, currentPlayerName = "", currentPlayerId = "") {
    // 1. Extract Date
    const dateM = entryHtml.match(/<strong>(.*?)<\/strong>/i);
    let date = "";
    let content = entryHtml;

    if (dateM) {
      date = dateM[1].replace(/[:：]$/, "").trim();
      content = entryHtml.substring(entryHtml.indexOf(dateM[0]) + dateM[0].length).replace(/^[:\s]+/, "");
    } else {
      const plainDateM = content.match(/^([A-Za-z]+\s+\d{1,2},\s+\d{4})[:：]?/);
      if (plainDateM) {
        date = plainDateM[1];
        content = content.substring(plainDateM[0].length).trim();
      }
    }

    const isTrade = /\b(trade|traded)\b/i.test(content);

    if (!isTrade) {
      let type = "other";
      let label = "Transaction";

      if (/drafted/i.test(content)) {
        type = "draft";
        label = "Draft";
      } else if (/signed a contract extension|contract extension/i.test(content)) {
        type = "extension";
        label = "Contract Extension";
      } else if (/signed/i.test(content)) {
        type = "signing";
        label = "Signing";
      } else if (/assigned/i.test(content)) {
        type = "assigned";
        label = "Assigned";
      } else if (/recalled/i.test(content)) {
        type = "recalled";
        label = "Recalled";
      } else if (/free agency/i.test(content)) {
        type = "free_agency";
        label = "Free Agency";
      } else if (/waived|waiver/i.test(content)) {
        type = "waiver";
        label = "Waivers";
      }

      const teamM = content.match(/<a\b[^>]*\/teams\/[^>]*>.*?<\/a>/i);
      const team = teamM ? parseTeamLink(teamM[0]) : null;

      return {
        date,
        type,
        label,
        isTrade: false,
        rawHtml: entryHtml,
        contentHtml: content,
        contentText: stripHtml(content),
        team
      };
    }

    // --- TRADE PARSER ---
    const transfers = [];
    const teamsMap = {};

    function addTeam(tObj) {
      if (!tObj || !tObj.name) return null;
      const key = tObj.name.trim();
      if (!teamsMap[key]) {
        teamsMap[key] = {
          name: key,
          code: tObj.code || (typeof getTeamMeta === "function" ? getTeamMeta("", key).code : key.substring(0, 3).toUpperCase()),
          href: tObj.href || ""
        };
      }
      return teamsMap[key];
    }

    // Pattern A: Two-team trade
    const twoTeamM = content.match(/traded by (?:the )?(<a\b[^>]*>.*?<\/a>)(.*?)\s+to (?:the )?(<a\b[^>]*>.*?<\/a>)\s+for\s+(.*)/i);

    if (twoTeamM) {
      const fromTeam = addTeam(parseTeamLink(twoTeamM[1]));
      const withClause = twoTeamM[2];
      const toTeam = addTeam(parseTeamLink(twoTeamM[3]));
      const forClause = twoTeamM[4];

      const outAssets = parseAssets(withClause, currentPlayerName, currentPlayerId, true);
      transfers.push({
        from: fromTeam,
        to: toTeam,
        assets: outAssets
      });

      const inAssets = parseAssets(forClause, currentPlayerName, currentPlayerId, false);
      transfers.push({
        from: toTeam,
        to: fromTeam,
        assets: inAssets
      });
    } else {
      // Pattern B: Multi-clause / Multi-team trades
      const clauses = content.split(";");

      clauses.forEach((clause, idx) => {
        const c = clause.trim();
        if (!c) return;

        const firstM = c.match(/(?:(?:part of a \d+-team trade,?\s*)?traded by (?:the )?(<a\b[^>]*>.*?<\/a>))(.*?)\s+to (?:the )?(<a\b[^>]*>.*?<\/a>)/i);
        const stdM = c.match(/(?:and\s+)?(?:the\s+)?(<a\b[^>]*>.*?<\/a>)\s+traded\s+(.*?)\s+to (?:the )?(<a\b[^>]*>.*?<\/a>)/i);

        if (firstM && idx === 0) {
          const fromTeam = addTeam(parseTeamLink(firstM[1]));
          const withClause = firstM[2];
          const toTeam = addTeam(parseTeamLink(firstM[3]));
          const assets = parseAssets(withClause, currentPlayerName, currentPlayerId, true);
          transfers.push({ from: fromTeam, to: toTeam, assets });
        } else if (stdM) {
          const fromTeam = addTeam(parseTeamLink(stdM[1]));
          const assetStr = stdM[2];
          const toTeam = addTeam(parseTeamLink(stdM[3]));
          const assets = parseAssets(assetStr, currentPlayerName, currentPlayerId, false);
          transfers.push({ from: fromTeam, to: toTeam, assets });
        }
      });
    }

    // Build Team-by-Team Ledger
    const teamLedger = {};
    Object.values(teamsMap).forEach((team) => {
      teamLedger[team.name] = {
        team,
        out: [],
        in: []
      };
    });

    transfers.forEach((tx) => {
      const fName = tx.from ? tx.from.name : "";
      const tName = tx.to ? tx.to.name : "";

      if (fName && teamLedger[fName]) {
        tx.assets.forEach((a) => {
          teamLedger[fName].out.push({
            ...a,
            toTeam: tx.to
          });
        });
      }

      if (tName && teamLedger[tName]) {
        tx.assets.forEach((a) => {
          teamLedger[tName].in.push({
            ...a,
            fromTeam: tx.from
          });
        });
      }
    });

    const teamCount = Object.keys(teamsMap).length;
    const isValidTrade = teamCount >= 2 && transfers.length > 0;
    const tradeLabel = teamCount > 2 ? `${teamCount}-Team Trade` : "Trade";

    return {
      date,
      type: isValidTrade ? "trade" : "other",
      label: isValidTrade ? tradeLabel : "Transaction",
      isTrade: isValidTrade,
      teams: Object.values(teamsMap),
      transfers,
      teamLedger,
      rawHtml: entryHtml,
      contentHtml: content,
      contentText: stripHtml(content)
    };
  }

  function parseTransactionsSection(containerHtml, currentPlayerName = "", currentPlayerId = "") {
    const entries = [];
    const matches = containerHtml.match(/<p\b[^>]*>.*?<\/p>/gis) || [];

    matches.forEach((p) => {
      if (/class=["']note["']/i.test(p) || /retrosheet/i.test(p)) return;
      const parsed = parseEntry(p, currentPlayerName, currentPlayerId);
      if (parsed) entries.push(parsed);
    });

    return entries;
  }

  return {
    parseEntry,
    parseTransactionsSection,
    extractPlayerId,
    stripHtml
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = TransactionParser;
}
