/**
 * Team Colors & Branding Database for NBA & MLB
 */
const TEAM_DATABASE = {
  // NBA Teams
  "DAL": { name: "Dallas Mavericks", city: "Dallas", primary: "#00538C", secondary: "#002B5E", accent: "#B8C4CA", text: "#FFFFFF", league: "NBA" },
  "CHO": { name: "Charlotte Hornets", city: "Charlotte", primary: "#1D1160", secondary: "#00788C", accent: "#A1A1A4", text: "#FFFFFF", league: "NBA" },
  "CHA": { name: "Charlotte Hornets", city: "Charlotte", primary: "#1D1160", secondary: "#00788C", accent: "#A1A1A4", text: "#FFFFFF", league: "NBA" },
  "CHH": { name: "Charlotte Hornets", city: "Charlotte", primary: "#1D1160", secondary: "#00788C", accent: "#A1A1A4", text: "#FFFFFF", league: "NBA" },
  "DEN": { name: "Denver Nuggets", city: "Denver", primary: "#0E2240", secondary: "#FEC524", accent: "#8B2131", text: "#FFFFFF", league: "NBA" },
  "PHI": { name: "Philadelphia 76ers", city: "Philadelphia", primary: "#006BB6", secondary: "#ED174C", accent: "#002B5C", text: "#FFFFFF", league: "NBA" },
  "MIN": { name: "Minnesota Timberwolves", city: "Minnesota", primary: "#0C2340", secondary: "#236192", accent: "#78BE20", text: "#FFFFFF", league: "NBA" },
  "GSW": { name: "Golden State Warriors", city: "Golden State", primary: "#1D428A", secondary: "#FFC72C", accent: "#006BB6", text: "#FFFFFF", league: "NBA" },
  "LAL": { name: "Los Angeles Lakers", city: "Los Angeles", primary: "#552583", secondary: "#FDB927", accent: "#000000", text: "#FFFFFF", league: "NBA" },
  "LAC": { name: "LA Clippers", city: "Los Angeles", primary: "#C8102E", secondary: "#1D428A", accent: "#BEC0C2", text: "#FFFFFF", league: "NBA" },
  "BOS": { name: "Boston Celtics", city: "Boston", primary: "#007A33", secondary: "#BA9653", accent: "#000000", text: "#FFFFFF", league: "NBA" },
  "BKN": { name: "Brooklyn Nets", city: "Brooklyn", primary: "#1C1C1C", secondary: "#707271", accent: "#FFFFFF", text: "#FFFFFF", league: "NBA" },
  "NJN": { name: "New Jersey Nets", city: "New Jersey", primary: "#002A60", secondary: "#CD1041", accent: "#C6CFD4", text: "#FFFFFF", league: "NBA" },
  "NYK": { name: "New York Knicks", city: "New York", primary: "#006BB6", secondary: "#F58426", accent: "#BEC0C2", text: "#FFFFFF", league: "NBA" },
  "TOR": { name: "Toronto Raptors", city: "Toronto", primary: "#CE1141", secondary: "#000000", accent: "#A1A1A4", text: "#FFFFFF", league: "NBA" },
  "CHI": { name: "Chicago Bulls", city: "Chicago", primary: "#CE1141", secondary: "#000000", accent: "#FFFFFF", text: "#FFFFFF", league: "NBA" },
  "CLE": { name: "Cleveland Cavaliers", city: "Cleveland", primary: "#860038", secondary: "#041E42", accent: "#FDBB30", text: "#FFFFFF", league: "NBA" },
  "DET": { name: "Detroit Pistons", city: "Detroit", primary: "#C8102E", secondary: "#1D428A", accent: "#BEC0C2", text: "#FFFFFF", league: "NBA" },
  "IND": { name: "Indiana Pacers", city: "Indiana", primary: "#002D62", secondary: "#FDBB30", accent: "#BEC0C2", text: "#FFFFFF", league: "NBA" },
  "MIL": { name: "Milwaukee Bucks", city: "Milwaukee", primary: "#00471B", secondary: "#EEE1C6", accent: "#0077C0", text: "#FFFFFF", league: "NBA" },
  "ATL": { name: "Atlanta Hawks", city: "Atlanta", primary: "#E03A3E", secondary: "#C1D32F", accent: "#26282A", text: "#FFFFFF", league: "NBA" },
  "MIA": { name: "Miami Heat", city: "Miami", primary: "#98002E", secondary: "#F9A01B", accent: "#000000", text: "#FFFFFF", league: "NBA" },
  "ORL": { name: "Orlando Magic", city: "Orlando", primary: "#0077C0", secondary: "#C4CED4", accent: "#000000", text: "#FFFFFF", league: "NBA" },
  "WAS": { name: "Washington Wizards", city: "Washington", primary: "#002B5C", secondary: "#E31837", accent: "#C4CED4", text: "#FFFFFF", league: "NBA" },
  "HOU": { name: "Houston Rockets", city: "Houston", primary: "#CE1141", secondary: "#000000", accent: "#C4CED4", text: "#FFFFFF", league: "NBA" },
  "MEM": { name: "Memphis Grizzlies", city: "Memphis", primary: "#5D76A9", secondary: "#12173F", accent: "#F5B112", text: "#FFFFFF", league: "NBA" },
  "NOP": { name: "New Orleans Pelicans", city: "New Orleans", primary: "#0C2340", secondary: "#C8102E", accent: "#85714D", text: "#FFFFFF", league: "NBA" },
  "NOH": { name: "New Orleans Hornets", city: "New Orleans", primary: "#00788C", secondary: "#1D1160", accent: "#FFC72C", text: "#FFFFFF", league: "NBA" },
  "SAS": { name: "San Antonio Spurs", city: "San Antonio", primary: "#231F20", secondary: "#C4CED4", accent: "#000000", text: "#FFFFFF", league: "NBA" },
  "OKC": { name: "Oklahoma City Thunder", city: "Oklahoma City", primary: "#007AC1", secondary: "#EF3B24", accent: "#002D62", text: "#FFFFFF", league: "NBA" },
  "SEA": { name: "Seattle SuperSonics", city: "Seattle", primary: "#00653A", secondary: "#FFC200", accent: "#FFFFFF", text: "#FFFFFF", league: "NBA" },
  "POR": { name: "Portland Trail Blazers", city: "Portland", primary: "#E03A3E", secondary: "#000000", accent: "#BAC3C9", text: "#FFFFFF", league: "NBA" },
  "SAC": { name: "Sacramento Kings", city: "Sacramento", primary: "#5A2D81", secondary: "#63727A", accent: "#000000", text: "#FFFFFF", league: "NBA" },
  "UTA": { name: "Utah Jazz", city: "Utah", primary: "#002B5C", secondary: "#00471B", accent: "#F9A01B", text: "#FFFFFF", league: "NBA" },
  "PHX": { name: "Phoenix Suns", city: "Phoenix", primary: "#1D1160", secondary: "#E56020", accent: "#63727A", text: "#FFFFFF", league: "NBA" },

  // MLB Teams
  "WSN": { name: "Washington Nationals", city: "Washington", primary: "#AB0003", secondary: "#14225A", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "SDP": { name: "San Diego Padres", city: "San Diego", primary: "#2F241D", secondary: "#FFC425", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "NYY": { name: "New York Yankees", city: "New York", primary: "#0C2340", secondary: "#C4CED4", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "NYM": { name: "New York Mets", city: "New York", primary: "#002D72", secondary: "#FF5910", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "LAD": { name: "Los Angeles Dodgers", city: "Los Angeles", primary: "#005A9C", secondary: "#EF3E42", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "SFG": { name: "San Francisco Giants", city: "San Francisco", primary: "#FD5A1E", secondary: "#27251F", accent: "#EFD19F", text: "#FFFFFF", league: "MLB" },
  "LAA": { name: "Los Angeles Angels", city: "Los Angeles", primary: "#BA0021", secondary: "#003263", accent: "#862633", text: "#FFFFFF", league: "MLB" },
  "ANA": { name: "Anaheim Angels", city: "Anaheim", primary: "#BA0021", secondary: "#003263", accent: "#862633", text: "#FFFFFF", league: "MLB" },
  "OAK": { name: "Oakland Athletics", city: "Oakland", primary: "#003831", secondary: "#EFB21E", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "ATH": { name: "Athletics", city: "Athletics", primary: "#003831", secondary: "#EFB21E", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "HOU": { name: "Houston Astros", city: "Houston", primary: "#EB6E1F", secondary: "#002D62", accent: "#F4911E", text: "#FFFFFF", league: "MLB" },
  "TEX": { name: "Texas Rangers", city: "Texas", primary: "#003278", secondary: "#C0111F", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "SEA": { name: "Seattle Mariners", city: "Seattle", primary: "#0C2340", secondary: "#005C5C", accent: "#C4CED4", text: "#FFFFFF", league: "MLB" },
  "CHC": { name: "Chicago Cubs", city: "Chicago", primary: "#0E3386", secondary: "#CC3433", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "CWS": { name: "Chicago White Sox", city: "Chicago", primary: "#27251F", secondary: "#C4CED4", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "STL": { name: "St. Louis Cardinals", city: "St. Louis", primary: "#C41E3A", secondary: "#0C2340", accent: "#FEDB00", text: "#FFFFFF", league: "MLB" },
  "ATL": { name: "Atlanta Braves", city: "Atlanta", primary: "#CE1141", secondary: "#13274F", accent: "#EAAA00", text: "#FFFFFF", league: "MLB" },
  "BOS": { name: "Boston Red Sox", city: "Boston", primary: "#BD3039", secondary: "#0C2340", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "PHI": { name: "Philadelphia Phillies", city: "Philadelphia", primary: "#E81828", secondary: "#002D72", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "BAL": { name: "Baltimore Orioles", city: "Baltimore", primary: "#DF4601", secondary: "#000000", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "TOR": { name: "Toronto Blue Jays", city: "Toronto", primary: "#134A8E", secondary: "#1D2D5C", accent: "#E8291C", text: "#FFFFFF", league: "MLB" },
  "TBR": { name: "Tampa Bay Rays", city: "Tampa Bay", primary: "#092C5C", secondary: "#8FBCE6", accent: "#F5D130", text: "#FFFFFF", league: "MLB" },
  "CLE": { name: "Cleveland Guardians", city: "Cleveland", primary: "#0C2340", secondary: "#E31937", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "MIN": { name: "Minnesota Twins", city: "Minnesota", primary: "#002B5C", secondary: "#D31145", accent: "#B9975B", text: "#FFFFFF", league: "MLB" },
  "DET": { name: "Detroit Tigers", city: "Detroit", primary: "#0C2340", secondary: "#FA4616", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "KCR": { name: "Kansas City Royals", city: "Kansas City", primary: "#004687", secondary: "#BD9B60", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "MIA": { name: "Miami Marlins", city: "Miami", primary: "#00A3E0", secondary: "#EF3340", accent: "#000000", text: "#FFFFFF", league: "MLB" },
  "MIL": { name: "Milwaukee Brewers", city: "Milwaukee", primary: "#12284C", secondary: "#FFC52F", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "CIN": { name: "Cincinnati Reds", city: "Cincinnati", primary: "#C6011F", secondary: "#000000", accent: "#FFFFFF", text: "#FFFFFF", league: "MLB" },
  "PIT": { name: "Pittsburgh Pirates", city: "Pittsburgh", primary: "#FDB827", secondary: "#000000", accent: "#FFFFFF", text: "#000000", league: "MLB" },
  "ARI": { name: "Arizona Diamondbacks", city: "Arizona", primary: "#A71930", secondary: "#E3D4AD", accent: "#30CED8", text: "#FFFFFF", league: "MLB" },
  "COL": { name: "Colorado Rockies", city: "Colorado", primary: "#33006F", secondary: "#C4CED4", accent: "#000000", text: "#FFFFFF", league: "MLB" }
};

// Generate deterministic fallback color from string
function hashStringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 65%, 45%)`;
}

/**
 * Retrieve team metadata and styling colors
 * @param {string} code - Team abbreviation (e.g. "DAL", "GSW")
 * @param {string} name - Full team name (e.g. "Dallas Mavericks")
 * @returns {object} Team styling object
 */
function getTeamMeta(code, name = "") {
  const upperCode = (code || "").toUpperCase().trim();
  if (upperCode && TEAM_DATABASE[upperCode]) {
    return {
      code: upperCode,
      ...TEAM_DATABASE[upperCode]
    };
  }

  // Search by name match
  if (name) {
    const cleanName = name.toLowerCase().trim();
    for (const [c, info] of Object.entries(TEAM_DATABASE)) {
      if (info.name.toLowerCase() === cleanName || cleanName.includes(info.name.toLowerCase())) {
        return { code: c, ...info };
      }
    }
  }

  // Fallback for minor leagues, historic teams, etc.
  const fallbackColor = hashStringToColor(name || code || "Team");
  return {
    code: upperCode || name.substring(0, 3).toUpperCase(),
    name: name || upperCode || "Team",
    city: "",
    primary: fallbackColor,
    secondary: "#1E293B",
    accent: "#94A3B8",
    text: "#FFFFFF",
    league: "PRO"
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { TEAM_DATABASE, getTeamMeta };
}
