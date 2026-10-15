# 🏀⚾ Sports Reference Trade Visualizer

A Chrome Extension (Manifest V3) engineered for **Basketball-Reference** and **Baseball-Reference**.  
It transforms verbose, convoluted, multi-paragraph sports transaction text into **intuitive, clean, single-edge visual trade flow diagrams and interactive career timelines**.

---

## 📸 Live Demo & Presets

This project includes a standalone demo playground that runs without needing the Chrome extension installed:
* **Interactive Demo**: [`demo.html`](file:///c:/UX/AI/ExtensionforTransaction/demo.html)
* **Built-in Presets**:
  1. 🏀 **Josh Green (2024 6-Team Mega Trade)**: Involves DAL, CHO, DEN, MIN, GSW, and PHI in a complex multi-team exchange.
  2. 🏀 **Kevin Durant (2026 7-Team Blockbuster)**: Involves PHO, HOU, MIN, GSW, ATL, BRK, and LAL with expanded ring geometry and two-line draft pick notes.
  3. 🏀 **Josh Green (2026 4-Team Trade)**
  4. 🏀 **Otto Porter Jr. (2019 Classic 2-Team Trade: WAS ⮂ CHI)**
  5. ⚾ **Juan Soto (2022 Blockbuster Nationals ➔ Padres)**
  6. 🏀 **Karl-Anthony Towns (2024 3-Team Trade: MIN / NYK / CHO)**

---

## ✨ Key Features & Engineering Highlights

### 1. Modern Flat Light Design System
* **Clean & Distraction-Free**: Built with a sleek, high-contrast light palette (`#ffffff`, `#f8fafc`, `#e2e8f0`, `#475569`). Free of dark mode, unnecessary neon glows, and heavy faux-3D skeuomorphism.
* **Native English Presentation**: Player names, team abbreviations, draft pick classifications, and contract terms adhere strictly to official Sports Reference formats.
* **Official Headshot Integration**: Automatically links to player headshot CDNs (`https://www.basketball-reference.com/req/202610080/images/headshots/${playerId}.jpg`) with seamless initial-badge fallbacks.

### 2. Single-Edge Multi-Transfer Trade Flow
* **Exactly One Connection Line per Team Pair**: Regardless of how many assets or players are exchanged between two teams, all transfers are unified into a single clean connection line, completely eliminating spaghetti diagrams.
* **Precision Geometric Arrowhead Trimming**:
  - **Arrowhead Tips**: Rest flush against the circular team node boundary ($r = 27\text{px}$).
  - **Line Endpoints**: Terminate precisely at the polygon base of the arrowhead ($r = 27 + 12 = 39\text{px}$).
  - **Zero Line Overshoot**: Eliminates lines sticking out past arrowheads or penetrating node circles.
* **Explicit Directional Semantics**:
  - **Double-Headed Arrow (`◄──►`)**: Indicates mutual asset exchange between both franchises (highlighted with an orange accent badge).
  - **Single-Headed Arrow (`──►`)**: Indicates a one-way asset dispatch.

### 3. Side-Offset Cards & Viewport Boundary Clamping
* **Unobstructed Arrow Lines**: Information cards are offset away from the arrow chords so lines and arrowheads remain 100% visible:
  - **Perimeter Edges**: Offset outward along the normal vector into margin space ($78 \sim 88\text{px}$).
  - **Interior Diagonals**: Shifted along the chord length ($t = 0.36$ and $t = 0.64$) to keep the geometrical center open and uncluttered.
  - **2-Team Horizontal Chords**: Offset upwards ($Y - 68\text{px}$) into open headroom.
* **Multi-Layer Collision Avoidance**:
  - **Node Repulsion**: Guarantees a minimum clearance ($\ge \text{nodeRadius} + \frac{\text{cardSize}}{2} + 18\text{px}$) from all circular team nodes.
  - **Pairwise Relaxation**: Nearby cards automatically repel each other to eliminate overlaps.
* **Strict Viewport Bounds Clamping**:
  - Dynamically calculates canvas dimensions (up to $1360 \times 1240\text{px}$ for 7+ teams) with generous top margin ($centerY = 650\text{px}$).
  - Clamps all card coordinates strictly within visible SVG bounds:
    $$\text{cardX} \in \left[\frac{W}{2} + 18,\; \text{svgWidth} - \frac{W}{2} - 18\right]$$
    $$\text{cardY} \in \left[\frac{H}{2} + 18,\; \text{svgHeight} - \frac{H}{2} - 18\right]$$
  - Prevents top clipping or overflow under any screen resolution.

### 4. Two-Line Draft Pick Formatting
* For draft picks that include the drafted player note (e.g. `a 2026 2nd round draft pick ( Tyler Bilodeau was later selected )`):
  - **Line 1 (Main)**: `2026 2nd Rd Pick`
  - **Line 2 (Sub-note)**: `(Tyler Bilodeau was later selected)` in subtle gray `0.68rem` typography.
* Preserves player headshots and clickable player profile links while reducing badge width from 350px+ down to 140~170px.

### 5. Career Transactions Timeline
* Chronologically lists all career transactions:
  - 🎯 **Draft**: Draft year, round, and pick position.
  - ✍️ **Contract Extensions & Signings**: Multi-year contracts, extensions, and free agent acquisitions.
  - 🔄 **Trades**: Interactive visual flows and team ledger breakdowns.
  - 🚌 **Assigned / Recalled**: Minor league / NBA G-League moves.
  - 🏷️ **Waivers & Free Agency**: Releases, waivers, and free agency milestones.
* Quick category filter chips (`All`, `Trades`, `Signings`, `G-League / Minors`).

---

## 📂 Project Architecture

```
c:\UX\AI\ExtensionforTransaction\
├── manifest.json       # Chrome Extension Manifest V3 configuration
├── content.js          # Content script: DOM observer, page detector & visualizer injector
├── parser.js           # Text parser: regex clause decomposition, asset categorization & routing
├── visualizer.js       # SVG rendering engine: geometry layout, arrowheads, side-offset & timeline
├── team-colors.js      # Comprehensive NBA (30 teams) & MLB (30 teams) color dictionary
├── styles.css          # Flat light design tokens, typography, and responsive micro-animations
├── demo.html           # Standalone interactive demo playground (6 blockbuster presets)
├── popup.html          # Browser action toolbar popup
├── popup.css           # Toolbar popup styles
├── popup.js            # Toolbar popup interactive preview script
└── README.md           # Project documentation
```

---

## 🛠️ Installation Guide (Google Chrome)

1. Open **Google Chrome** and navigate to:
   ```text
   chrome://extensions/
   ```
2. Toggle ON **Developer mode** in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the project directory:
   ```text
   C:\UX\AI\ExtensionforTransaction
   ```
5. Done! Visit any player profile on Basketball-Reference (e.g. [Josh Green Transactions](https://www.basketball-reference.com/players/g/greenjo02.html#all_transactions)) or Baseball-Reference to experience the visualizer automatically mounted above the transaction table.

---

## ⚙️ Core Technical Algorithms

### 1. Pairwise Single-Edge Grouping (`parser.js` & `visualizer.js`)
```javascript
// Unique pair key based on sorted team names
const pairKey = [tx.from.name, tx.to.name].sort().join(":::");

// Collect bidirectional assets
// toTeam1: assets moving to team 1 (from team 2)
// toTeam2: assets moving to team 2 (from team 1)
```

### 2. Geometric Line Trimming & Arrowhead Math (`visualizer.js`)
```javascript
// Arrow tip placed exactly at circle border (r = 26 + 1 = 27)
const tip1x = c1.x + (nodeRadius + 1) * Math.cos(a1);
const tip1y = c1.y + (nodeRadius + 1) * Math.sin(a1);

// Line ends precisely at arrowhead base (r = 26 + 12 + 1 = 39)
const lineStartRadius = hasArrow1 ? (nodeRadius + arrowLength + 1) : (nodeRadius + 1);
const p1x = c1.x + lineStartRadius * Math.cos(a1);
const p1y = c1.y + lineStartRadius * Math.sin(a1);
```

### 3. Sub-note Parenthesis Splitting (`visualizer.js`)
```javascript
const parenMatch = rawText.match(/^(.*?)\s*(\([^\)]*\))\s*$/);
if (parenMatch) {
  mainHtml = parenMatch[1].trim(); // e.g. "2026 2nd Rd Pick"
  subHtml = parenMatch[2].trim();  // e.g. "(Tyler Bilodeau was later selected)"
}
```

---

## 📄 License & Maintainability
Designed for sports statistics enthusiasts. Modular architecture allows easy extension to other sports reference sites like WNBA, Pro-Football, or Hockey Reference.
