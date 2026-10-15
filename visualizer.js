/**
 * Visualizer Component for Sports Reference Transactions (Flat Light Mode, English Only)
 * Single Edge per Team Pair with Guaranteed Double/Single Arrowheads & Overflow-Proof Cards
 */

const TransactionVisualizer = (function () {
  function getHeadshotUrl(playerId) {
    if (!playerId) return "";
    return `https://www.basketball-reference.com/req/202610080/images/headshots/${playerId}.jpg`;
  }

  function renderPlayerAvatar(asset, size = 18) {
    const pId = asset.playerId || "";
    const name = asset.name || "";
    const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

    if (pId) {
      const url = getHeadshotUrl(pId);
      return `
        <span class="stv-avatar-wrap" style="width:${size}px; height:${size}px;">
          <img src="${url}"
               class="stv-headshot-img"
               alt="${name}"
               loading="lazy"
               onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-flex';" />
          <span class="stv-avatar-initials" style="display:none; font-size:${Math.max(8, size * 0.42)}px;">${initials}</span>
        </span>
      `;
    }

    return `<span class="stv-avatar-initials" style="width:${size}px; height:${size}px; font-size:${Math.max(8, size * 0.42)}px;">${initials || "P"}</span>`;
  }

  function renderAssetBadge(asset) {
    let icon = "👤";
    let typeClass = "stv-asset-player";
    let avatarHtml = "";

    // Show headshot if player OR if pick has an identified drafted player
    if (asset.type === "player") {
      avatarHtml = renderPlayerAvatar(asset, 18);
    } else if (asset.type === "pick") {
      if (asset.playerId) {
        avatarHtml = renderPlayerAvatar(asset, 18);
      } else {
        icon = "🎟️";
      }
      typeClass = "stv-asset-pick";
    } else if (asset.type === "cash") {
      icon = "💵";
      typeClass = "stv-asset-cash";
    } else if (asset.type === "exception") {
      icon = "⚖️";
      typeClass = "stv-asset-exception";
    }

    const currentBadge = asset.isCurrentPlayer
      ? `<span class="stv-curr-tag">Current</span>`
      : "";

    // Source text: preserve inner HTML links if available (e.g. drafted player link)
    let rawText = (asset.raw || asset.name || "").replace(/\.\s*$/, "").trim();

    // Check for parenthesized sub-note, e.g. "a 2026 2nd round draft pick ( Tyler Bilodeau was later selected )"
    let mainHtml = rawText;
    let subHtml = "";

    const parenMatch = rawText.match(/^(.*?)\s*(\([^\)]*\))\s*$/);
    if (parenMatch) {
      mainHtml = parenMatch[1].trim();
      // Clean leading/trailing inner spaces inside parentheses: "( Tyler ... )" -> "(Tyler ...)"
      subHtml = parenMatch[2].replace(/\(\s+/, "(").replace(/\s+\)/, ")").trim();
    }

    // Format pick display name
    if (asset.type === "pick" || /draft pick|round/i.test(mainHtml)) {
      mainHtml = mainHtml
        .replace(/^a\s+/i, "")
        .replace(/\bround draft pick\b/i, "Rd Pick")
        .replace(/\bround pick\b/i, "Rd Pick");
    }

    // If mainHtml has no link but asset.href is specified (and no subHtml player link), link it
    if (!/<a\b/i.test(mainHtml) && asset.href && !subHtml) {
      mainHtml = `<a href="${asset.href}" class="stv-asset-link">${mainHtml}</a>`;
    }

    let nameContent = "";
    if (subHtml) {
      nameContent = `
        <span class="stv-asset-main">${mainHtml}</span>
        <span class="stv-asset-sub">${subHtml}</span>
      `;
    } else {
      nameContent = `<span class="stv-asset-main">${mainHtml}</span>`;
    }

    const iconBadge = avatarHtml || `<span class="stv-asset-icon">${icon}</span>`;

    return `
      <span class="stv-asset-item ${typeClass} ${asset.isCurrentPlayer ? 'stv-is-current' : ''}" title="${asset.name || ''}">
        ${iconBadge}
        <span class="stv-asset-name">${nameContent}</span>
        ${currentBadge}
      </span>
    `;
  }

  function renderTradeCards(trade) {
    if (!trade.teamLedger) return "";

    const teams = Object.values(trade.teamLedger);
    const gridCols = teams.length <= 2 ? "stv-grid-2" : teams.length <= 4 ? "stv-grid-3" : "stv-grid-many";

    let cardsHtml = "";
    teams.forEach((tData) => {
      const meta = typeof getTeamMeta === "function" ? getTeamMeta(tData.team.code, tData.team.name) : {
        primary: "#1e293b",
        secondary: "#f1f5f9",
        text: "#ffffff"
      };

      // OUT items
      let outHtml = "";
      if (tData.out.length === 0) {
        outHtml = `<div class="stv-empty-list">No outgoing assets</div>`;
      } else {
        outHtml = tData.out
          .map((a) => {
            const destCode = a.toTeam && a.toTeam.code ? a.toTeam.code : (a.to || "");
            const destBadge = destCode ? `<span class="stv-dir-tag to">➔ ${destCode}</span>` : "";
            return `
              <div class="stv-asset-row">
                ${renderAssetBadge(a)}
                ${destBadge}
              </div>
            `;
          })
          .join("");
      }

      // IN items
      let inHtml = "";
      if (tData.in.length === 0) {
        inHtml = `<div class="stv-empty-list">No incoming assets</div>`;
      } else {
        inHtml = tData.in
          .map((a) => {
            const srcCode = a.fromTeam && a.fromTeam.code ? a.fromTeam.code : (a.from || "");
            const srcBadge = srcCode ? `<span class="stv-dir-tag from">⬅ ${srcCode}</span>` : "";
            return `
              <div class="stv-asset-row">
                ${renderAssetBadge(a)}
                ${srcBadge}
              </div>
            `;
          })
          .join("");
      }

      cardsHtml += `
        <div class="stv-team-card">
          <div class="stv-team-card-header" style="border-left: 4px solid ${meta.primary};">
            <div class="stv-team-meta">
              <span class="stv-team-code-pill" style="background:${meta.primary}; color:${meta.text};">${meta.code || tData.team.code || "TM"}</span>
              <span class="stv-team-name">${tData.team.name}</span>
            </div>
            <div class="stv-team-counts">
              <span class="stv-badge-in">+${tData.in.length} IN</span>
              <span class="stv-badge-out">-${tData.out.length} OUT</span>
            </div>
          </div>
          <div class="stv-team-card-body">
            <div class="stv-sub-ledger out">
              <div class="stv-sub-header">
                <span class="stv-dot out"></span>
                <span>OUT (Gave Up)</span>
              </div>
              <div class="stv-sub-list">${outHtml}</div>
            </div>
            <div class="stv-sub-ledger in">
              <div class="stv-sub-header">
                <span class="stv-dot in"></span>
                <span>IN (Acquired)</span>
              </div>
              <div class="stv-sub-list">${inHtml}</div>
            </div>
          </div>
        </div>
      `;
    });

    return `<div class="stv-cards-grid ${gridCols}">${cardsHtml}</div>`;
  }

  /**
   * Group transfers by unique pair of teams (exactly ONE edge per pair)
   */
  function groupTransfersByPair(transfers) {
    const pairMap = {};

    transfers.forEach((tx) => {
      if (!tx.from || !tx.to) return;
      const t1Name = tx.from.name;
      const t2Name = tx.to.name;
      const sortedKeys = [t1Name, t2Name].sort();
      const pairKey = sortedKeys.join(":::");

      if (!pairMap[pairKey]) {
        pairMap[pairKey] = {
          pairKey,
          team1: tx.from.name === sortedKeys[0] ? tx.from : tx.to,
          team2: tx.from.name === sortedKeys[1] ? tx.from : tx.to,
          toTeam1: [], // assets going to team1 (from team2)
          toTeam2: []  // assets going to team2 (from team1)
        };
      }

      if (tx.to.name === pairMap[pairKey].team1.name) {
        pairMap[pairKey].toTeam1.push(...tx.assets);
      } else {
        pairMap[pairKey].toTeam2.push(...tx.assets);
      }
    });

    return Object.values(pairMap);
  }

  /**
   * Helper to compute polygon points for an arrowhead
   */
  function getArrowheadPoints(tipX, tipY, angle, length = 13, width = 10) {
    const b1X = tipX - length * Math.cos(angle) + (width / 2) * Math.sin(angle);
    const b1Y = tipY - length * Math.sin(angle) - (width / 2) * Math.cos(angle);
    const b2X = tipX - length * Math.cos(angle) - (width / 2) * Math.sin(angle);
    const b2Y = tipY - length * Math.sin(angle) + (width / 2) * Math.cos(angle);
    return `${tipX.toFixed(1)},${tipY.toFixed(1)} ${b1X.toFixed(1)},${b1Y.toFixed(1)} ${b2X.toFixed(1)},${b2Y.toFixed(1)}`;
  }

  /**
   * Render Non-overlapping SVG Flow: Single Edge per Pair with Guaranteed Arrowheads & Side-Offset Cards
   */
  function renderTradeFlowSVG(trade, uniqueId = "stv-flow") {
    if (!trade.transfers || trade.transfers.length === 0) return "";

    const teams = trade.teams || [];
    const n = teams.length;
    if (n === 0) return "";

    const pairs = groupTransfersByPair(trade.transfers);

    const svgWidth = n <= 2 ? 880 : (n <= 4 ? 980 : (n <= 6 ? 1200 : 1360));
    const svgHeight = n <= 2 ? 280 : (n <= 4 ? 800 : (n <= 6 ? 1040 : 1240));
    const centerX = svgWidth / 2;
    // Shift centerY down for multi-team layouts to provide ample top headroom
    const centerY = n <= 2 ? 140 : (n <= 4 ? 410 : (n <= 6 ? 550 : 650));
    const radius = n <= 2 ? 240 : (n <= 4 ? 300 : (n <= 6 ? 380 : 430));
    const nodeRadius = 26;

    const nodeCoords = {};
    if (n === 2) {
      nodeCoords[teams[0].name] = { x: centerX - 240, y: centerY + 20, team: teams[0] };
      nodeCoords[teams[1].name] = { x: centerX + 240, y: centerY + 20, team: teams[1] };
    } else {
      teams.forEach((t, i) => {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        nodeCoords[t.name] = { x, y, team: t, index: i };
      });
    }

    let pathsHtml = "";
    let arrowheadsHtml = "";
    let labelsHtml = "";
    const cardsList = [];

    pairs.forEach((pair, idx) => {
      const c1 = nodeCoords[pair.team1.name];
      const c2 = nodeCoords[pair.team2.name];
      if (!c1 || !c2) return;

      const isBidirectional = pair.toTeam1.length > 0 && pair.toTeam2.length > 0;
      const isOneWayTo2 = pair.toTeam2.length > 0 && pair.toTeam1.length === 0;

      const allAssets = [...pair.toTeam1, ...pair.toTeam2];
      const hasCurrentPlayer = allAssets.some((a) => a.isCurrentPlayer);

      const strokeColor = hasCurrentPlayer ? "#ea580c" : "#475569";
      const strokeWidth = hasCurrentPlayer ? "3" : "2.2";

      // Calculate path midpoint and outward normal vector
      const midChordX = (c1.x + c2.x) / 2;
      const midChordY = (c1.y + c2.y) / 2;

      let uvx = 0;
      let uvy = 0;

      if (n > 2) {
        const vx = midChordX - centerX;
        const vy = midChordY - centerY;
        const distC = Math.sqrt(vx * vx + vy * vy);
        if (distC > 20) {
          uvx = vx / distC;
          uvy = vy / distC;
        } else {
          // Central chord (e.g. DAL to PHI in 6-team trade)
          const dx = c2.x - c1.x;
          const dy = c2.y - c1.y;
          const distD = Math.sqrt(dx * dx + dy * dy) || 1;
          uvx = -dy / distD;
          uvy = dx / distD;
        }
      }

      // Line apex: gentle curvature (8px outward)
      const lineCurvature = n > 2 ? 8 : 0;
      const midLineX = midChordX + uvx * lineCurvature;
      const midLineY = midChordY + uvy * lineCurvature;

      // Tangent angles entering/leaving nodes
      const a1 = Math.atan2(midLineY - c1.y, midLineX - c1.x);
      const a2 = Math.atan2(c2.y - midLineY, c2.x - midLineX);

      // Arrow dimensions
      const arrowLength = 12;
      const arrowWidth = 10;
      const hasArrow1 = isBidirectional || !isOneWayTo2;
      const hasArrow2 = isBidirectional || isOneWayTo2;

      // Exact arrow tip coordinates touching circle stroke (r = 27)
      const tip1x = c1.x + (nodeRadius + 1) * Math.cos(a1);
      const tip1y = c1.y + (nodeRadius + 1) * Math.sin(a1);

      const tip2x = c2.x - (nodeRadius + 1) * Math.cos(a2);
      const tip2y = c2.y - (nodeRadius + 1) * Math.sin(a2);

      // Path start & end coordinates:
      // Stops precisely at arrow base so no line sticks out past any arrowhead!
      const startDist = hasArrow1 ? (nodeRadius + 1 + arrowLength) : (nodeRadius + 1);
      const endDist = hasArrow2 ? (nodeRadius + 1 + arrowLength) : (nodeRadius + 1);

      const p1x = c1.x + startDist * Math.cos(a1);
      const p1y = c1.y + startDist * Math.sin(a1);

      const p2x = c2.x - endDist * Math.cos(a2);
      const p2y = c2.y - endDist * Math.sin(a2);

      // Draw path cleanly connecting arrow bases / perimeter
      pathsHtml += `
        <g class="stv-flow-edge-group" data-team1="${pair.team1.name}" data-team2="${pair.team2.name}">
          <path id="path-${uniqueId}-${idx}"
                class="stv-edge-path ${hasCurrentPlayer ? 'stv-curr-path' : ''}"
                d="M ${p1x.toFixed(1)} ${p1y.toFixed(1)} Q ${midLineX.toFixed(1)} ${midLineY.toFixed(1)} ${p2x.toFixed(1)} ${p2y.toFixed(1)}"
                stroke="${strokeColor}"
                stroke-width="${strokeWidth}"
                fill="none" />
        </g>
      `;

      // Render bold arrowheads touching node perimeters (tips at tip1, tip2)
      // Arrowhead into Team 2:
      if (hasArrow2) {
        const polyPts2 = getArrowheadPoints(tip2x, tip2y, a2, arrowLength, arrowWidth);
        arrowheadsHtml += `
          <polygon points="${polyPts2}" fill="${strokeColor}" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round" class="stv-flow-arrowhead" data-team1="${pair.team1.name}" data-team2="${pair.team2.name}" />
        `;
      }

      // Arrowhead into Team 1:
      if (hasArrow1) {
        const polyPts1 = getArrowheadPoints(tip1x, tip1y, a1 + Math.PI, arrowLength, arrowWidth);
        arrowheadsHtml += `
          <polygon points="${polyPts1}" fill="${strokeColor}" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round" class="stv-flow-arrowhead" data-team1="${pair.team1.name}" data-team2="${pair.team2.name}" />
        `;
      }

      // Direction Badge in Header of Card
      const t1Code = pair.team1.code || pair.team1.name;
      const t2Code = pair.team2.code || pair.team2.name;
      let headerBadgeText = "";
      if (isBidirectional) {
        headerBadgeText = `${t1Code} ◄──► ${t2Code}`;
      } else if (isOneWayTo2) {
        headerBadgeText = `${t1Code} ──► ${t2Code}`;
      } else {
        headerBadgeText = `${t2Code} ──► ${t1Code}`;
      }

      // Description Card Side-Offset (Offset to the side to keep arrow visible)
      const idxDiff = (c1.index !== undefined && c2.index !== undefined)
        ? Math.abs(c1.index - c2.index)
        : 1;
      const isPerimeter = idxDiff === 1 || idxDiff === (n - 1);

      let cardX = midChordX;
      let cardY = midChordY;

      // Render Card Rows
      let flowsRowsHtml = "";

      if (pair.toTeam2.length > 0) {
        const assetPills = pair.toTeam2.map(a => renderAssetBadge(a)).join("");
        flowsRowsHtml += `
          <div class="stv-card-flow-row">
            <span class="stv-dest-tag">➔ ${t2Code}</span>
            <div class="stv-dest-items">${assetPills}</div>
          </div>
        `;
      }

      if (pair.toTeam1.length > 0) {
        const assetPills = pair.toTeam1.map(a => renderAssetBadge(a)).join("");
        flowsRowsHtml += `
          <div class="stv-card-flow-row">
            <span class="stv-dest-tag">➔ ${t1Code}</span>
            <div class="stv-dest-items">${assetPills}</div>
          </div>
        `;
      }

      if (n <= 2) {
        // For 2 teams (WAS <-> CHI): card is offset above the horizontal line
        cardY = midChordY - 68;
      } else if (isPerimeter) {
        // Perimeter edges: offset OUTWARD into open space outside the polygon
        const sideOffset = n >= 7 ? 88 : (n >= 5 ? 78 : 66);
        cardX = midChordX + uvx * sideOffset;
        cardY = midChordY + uvy * sideOffset;
      } else {
        // Interior diagonals: shift along the chord (t=0.36 or 0.64) to clear the busy center intersection!
        const tParam = (idx % 2 === 0) ? 0.36 : 0.64;
        const ptX = c1.x * (1 - tParam) + c2.x * tParam;
        const ptY = c1.y * (1 - tParam) + c2.y * tParam;

        const dx = c2.x - c1.x;
        const dy = c2.y - c1.y;
        const distD = Math.sqrt(dx * dx + dy * dy) || 1;
        const perpX = -dy / distD;
        const perpY = dx / distD;

        // Perpendicular offset to the side of the line
        const sideMult = (idx % 2 === 0) ? 1 : -1;
        cardX = ptX + perpX * 38 * sideMult;
        cardY = ptY + perpY * 38 * sideMult;
      }

      const cardW = n === 2 ? 340 : (isBidirectional ? 225 : 195);
      const rowCount = (pair.toTeam1.length > 0 ? 1 : 0) + (pair.toTeam2.length > 0 ? 1 : 0);
      const cardH = Math.min(260, 32 + rowCount * 24 + allAssets.length * 28);

      cardsList.push({
        pair,
        cardX, cardY,
        cardW, cardH,
        headerBadgeText,
        isBidirectional,
        hasCurrentPlayer,
        flowsRowsHtml
      });
    });

    // Pairwise card-to-card relaxation loop to guarantee zero overlap
    for (let iter = 0; iter < 3; iter++) {
      for (let i = 0; i < cardsList.length; i++) {
        for (let j = i + 1; j < cardsList.length; j++) {
          const a = cardsList[i];
          const b = cardsList[j];
          const cdx = b.cardX - a.cardX;
          const cdy = b.cardY - a.cardY;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);
          const reqDist = (Math.max(a.cardW, a.cardH) + Math.max(b.cardW, b.cardH)) * 0.44;
          if (dist < reqDist && dist > 1) {
            const push = (reqDist - dist) / 2;
            b.cardX += (cdx / dist) * push;
            b.cardY += (cdy / dist) * push;
            a.cardX -= (cdx / dist) * push;
            a.cardY -= (cdy / dist) * push;
          }
        }
      }
      // Re-verify safety clearance from all team nodes
      cardsList.forEach((c) => {
        teams.forEach((t) => {
          const node = nodeCoords[t.name];
          if (!node) return;
          const dx = c.cardX - node.x;
          const dy = c.cardY - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minClearance = nodeRadius + Math.max(c.cardW, c.cardH) / 2 + 18;
          if (dist < minClearance) {
            const push = minClearance - (dist || 1);
            const pushX = dist > 1 ? (dx / dist) : (c.cardX >= centerX ? 1 : -1);
            const pushY = dist > 1 ? (dy / dist) : (c.cardY >= centerY ? 1 : -1);
            c.cardX += pushX * push;
            c.cardY += pushY * push;
          }
        });
      });
    }

    // Safety boundary clamping: ensure no card can ever exceed the SVG viewport edges
    const pad = 18;
    cardsList.forEach((c) => {
      c.cardX = Math.max(c.cardW / 2 + pad, Math.min(svgWidth - c.cardW / 2 - pad, c.cardX));
      c.cardY = Math.max(c.cardH / 2 + pad, Math.min(svgHeight - c.cardH / 2 - pad, c.cardY));
    });

    cardsList.forEach((c) => {
      labelsHtml += `
        <foreignObject x="${(c.cardX - c.cardW / 2).toFixed(1)}"
                       y="${(c.cardY - c.cardH / 2).toFixed(1)}"
                       width="${c.cardW}"
                       height="${c.cardH}"
                       class="stv-flow-fo"
                       overflow="visible"
                       style="overflow: visible;"
                       data-team1="${c.pair.team1.name}"
                       data-team2="${c.pair.team2.name}">
          <div class="stv-pair-edge-card ${c.hasCurrentPlayer ? 'stv-curr-pair-card' : ''}">
            <div class="stv-card-header">
              <span class="stv-card-teams-badge ${c.isBidirectional ? 'bidirectional' : ''}">${c.headerBadgeText}</span>
            </div>
            ${c.flowsRowsHtml}
          </div>
        </foreignObject>
      `;
    });

    // Generate team circular nodes
    let nodesHtml = "";
    teams.forEach((t) => {
      const coord = nodeCoords[t.name];
      const meta = typeof getTeamMeta === "function" ? getTeamMeta(t.code, t.name) : {
        primary: "#2563eb",
        secondary: "#f1f5f9",
        text: "#ffffff"
      };

      nodesHtml += `
        <g class="stv-flow-node-group" data-team="${t.name}" transform="translate(${coord.x.toFixed(1)}, ${coord.y.toFixed(1)})">
          <circle r="${nodeRadius}" class="stv-node-circle" fill="#ffffff" stroke="${meta.primary}" stroke-width="3" />
          <text dy="4" text-anchor="middle" class="stv-node-code" fill="${meta.primary}" font-weight="700" font-size="12">${t.code || meta.code || "TM"}</text>
          <text dy="38" text-anchor="middle" class="stv-node-name" fill="#1e293b" font-weight="600" font-size="11">${t.name.split(" ").slice(-1)[0]}</text>
          <title>${t.name}</title>
        </g>
      `;
    });

    // Team Filter Chips
    let teamPillsHtml = `<button class="stv-team-filter-pill active" data-team="all">All Teams</button>`;
    teams.forEach((t) => {
      teamPillsHtml += `<button class="stv-team-filter-pill" data-team="${t.name}">${t.code || t.name}</button>`;
    });

    return `
      <div class="stv-flow-container" id="flow-wrap-${uniqueId}">
        <div class="stv-flow-top-bar">
          <span class="stv-flow-title">Visual Trade Flow (${pairs.length} Exchange Channels)</span>
          <div class="stv-team-filter-pills">${teamPillsHtml}</div>
        </div>
        <div class="stv-svg-scroll">
          <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="stv-flow-svg">
            <g class="stv-flow-edges">${pathsHtml}</g>
            <g class="stv-flow-labels">${labelsHtml}</g>
            <g class="stv-flow-arrowheads">${arrowheadsHtml}</g>
            <g class="stv-flow-nodes">${nodesHtml}</g>
          </svg>
        </div>
        <div class="stv-flow-hint">💡 Double-headed arrows (◄──►) indicate mutual exchanges; single-headed arrows (──►) indicate one-way transfers</div>
      </div>
    `;
  }

  function renderTimelineApp(entries, currentPlayerName = "Player", currentPlayerId = "") {
    const tradeCount = entries.filter((e) => e.isTrade).length;

    let itemsHtml = "";
    entries.forEach((entry, idx) => {
      let tradeDetailsHtml = "";
      if (entry.isTrade) {
        tradeDetailsHtml = `
          <div class="stv-trade-content-box">
            <!-- Flow Diagram: 1 Edge per Team Pair with Guaranteed Double/Single Arrows -->
            ${renderTradeFlowSVG(entry, "trade-" + idx)}

            <!-- Team IN / OUT Ledger Cards -->
            <div class="stv-ledger-block">
              <div class="stv-block-label">Team Breakdown (Gave Up / Received)</div>
              ${renderTradeCards(entry)}
            </div>
          </div>
        `;
      }

      const teamTag = entry.team
        ? `<span class="stv-tm-tag">${entry.team.name}</span>`
        : "";

      itemsHtml += `
        <div class="stv-tl-item type-${entry.type}" data-type="${entry.type}">
          <div class="stv-tl-node">
            <span class="stv-tl-dot ${entry.isTrade ? 'trade-dot' : ''}"></span>
          </div>
          <div class="stv-tl-body">
            <div class="stv-tl-header">
              <span class="stv-tl-date">${entry.date || "Date"}</span>
              <span class="stv-tl-type-badge ${entry.type}">${entry.label}</span>
              ${teamTag}
            </div>
            <div class="stv-tl-desc">${entry.contentHtml || entry.rawHtml}</div>
            ${tradeDetailsHtml}
          </div>
        </div>
      `;
    });

    const headshotUrl = currentPlayerId ? getHeadshotUrl(currentPlayerId) : "";
    const headerAvatar = headshotUrl
      ? `<img src="${headshotUrl}" class="stv-header-avatar" alt="${currentPlayerName}" onerror="this.style.display='none'" />`
      : "";

    return `
      <div id="stv-extension-root" class="stv-flat-root">
        <div class="stv-header-bar">
          <div class="stv-hdr-left">
            ${headerAvatar}
            <div>
              <h2 class="stv-hdr-title">${currentPlayerName} — Career Transactions</h2>
              <div class="stv-hdr-stats">
                <span>${entries.length} Total Transactions</span>
                <span class="stv-sep">•</span>
                <span class="stv-stat-trade">${tradeCount} Trades</span>
              </div>
            </div>
          </div>
          
          <div class="stv-filter-chips">
            <button class="stv-fchip active" data-filter="all">All (${entries.length})</button>
            <button class="stv-fchip" data-filter="trade">Trades (${tradeCount})</button>
            <button class="stv-fchip" data-filter="signing">Signings</button>
            <button class="stv-fchip" data-filter="assigned">G-League / Minors</button>
          </div>
        </div>

        <div class="stv-timeline-feed">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  function bindEvents(rootElement) {
    if (!rootElement) return;

    // Timeline Category Filters
    rootElement.querySelectorAll(".stv-fchip").forEach((btn) => {
      btn.addEventListener("click", () => {
        rootElement.querySelectorAll(".stv-fchip").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");
        const items = rootElement.querySelectorAll(".stv-tl-item");

        items.forEach((item) => {
          const type = item.getAttribute("data-type");
          if (filter === "all") {
            item.style.display = "flex";
          } else if (filter === "trade") {
            item.style.display = type === "trade" ? "flex" : "none";
          } else if (filter === "signing") {
            item.style.display = type === "signing" || type === "extension" || type === "free_agency" ? "flex" : "none";
          } else if (filter === "assigned") {
            item.style.display = type === "assigned" || type === "recalled" ? "flex" : "none";
          }
        });
      });
    });

    // Team Filter in Trade Flow
    rootElement.querySelectorAll(".stv-flow-container").forEach((flowContainer) => {
      const pills = flowContainer.querySelectorAll(".stv-team-filter-pill");
      const edges = flowContainer.querySelectorAll(".stv-flow-edge-group");
      const arrowheads = flowContainer.querySelectorAll(".stv-flow-arrowhead");
      const labels = flowContainer.querySelectorAll(".stv-flow-fo");
      const nodes = flowContainer.querySelectorAll(".stv-flow-node-group");

      function focusTeam(selectedTeam) {
        if (selectedTeam === "all") {
          edges.forEach(e => e.classList.remove("dimmed", "highlighted"));
          arrowheads.forEach(a => a.classList.remove("dimmed", "highlighted"));
          labels.forEach(l => l.classList.remove("dimmed", "highlighted"));
          nodes.forEach(n => n.classList.remove("dimmed", "highlighted"));
          return;
        }

        nodes.forEach(n => {
          const t = n.getAttribute("data-team");
          if (t === selectedTeam) {
            n.classList.add("highlighted");
            n.classList.remove("dimmed");
          } else {
            n.classList.add("dimmed");
            n.classList.remove("highlighted");
          }
        });

        edges.forEach(e => {
          const t1 = e.getAttribute("data-team1");
          const t2 = e.getAttribute("data-team2");
          if (t1 === selectedTeam || t2 === selectedTeam) {
            e.classList.add("highlighted");
            e.classList.remove("dimmed");
          } else {
            e.classList.add("dimmed");
            e.classList.remove("highlighted");
          }
        });

        arrowheads.forEach(a => {
          const t1 = a.getAttribute("data-team1");
          const t2 = a.getAttribute("data-team2");
          if (t1 === selectedTeam || t2 === selectedTeam) {
            a.classList.add("highlighted");
            a.classList.remove("dimmed");
          } else {
            a.classList.add("dimmed");
            a.classList.remove("highlighted");
          }
        });

        labels.forEach(l => {
          const t1 = l.getAttribute("data-team1");
          const t2 = l.getAttribute("data-team2");
          if (t1 === selectedTeam || t2 === selectedTeam) {
            l.classList.add("highlighted");
            l.classList.remove("dimmed");
          } else {
            l.classList.add("dimmed");
            l.classList.remove("highlighted");
          }
        });
      }

      pills.forEach((p) => {
        p.addEventListener("click", () => {
          pills.forEach(b => b.classList.remove("active"));
          p.classList.add("active");
          const teamName = p.getAttribute("data-team");
          focusTeam(teamName);
        });
      });

      nodes.forEach((n) => {
        n.addEventListener("click", () => {
          const teamName = n.getAttribute("data-team");
          pills.forEach(p => {
            if (p.getAttribute("data-team") === teamName) {
              pills.forEach(b => b.classList.remove("active"));
              p.classList.add("active");
            }
          });
          focusTeam(teamName);
        });
      });
    });
  }

  return {
    renderTimelineApp,
    renderTradeCards,
    renderTradeFlowSVG,
    bindEvents
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = TransactionVisualizer;
}
