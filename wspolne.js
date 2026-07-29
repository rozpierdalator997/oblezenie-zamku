/* ============================================================
   WSPÓLNA LOGIKA — używana przez index.html, gra.html i kolejne strony.
   Zmiana czegoś tutaj (np. sposobu łączenia z Firebase, sprawdzania tury)
   automatycznie działa wszędzie, bez kopiowania kodu do każdego pliku.
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyBzgmxYdMvGOtS62Tr8eFDoROwfMEE9L7M",
  authDomain: "oblezenie-zamku.firebaseapp.com",
  projectId: "oblezenie-zamku",
  storageBucket: "oblezenie-zamku.firebasestorage.app",
  messagingSenderId: "288564292983",
  appId: "1:288564292983:web:f2ba2f472ea341f1e94572"
};

const GAME_TITLE = "Oblężenie zamku";
const TEAM_LABEL = { atak: "Atakujący", obrona: "Broniący" };
const TEAM_ICON  = { atak: "⚔️", obrona: "🛡️" };

const isConfigured = !String(firebaseConfig.apiKey).startsWith("WKLEJ_TU");

let db = null;
if (isConfigured) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  // niektore sieci (zwlaszcza komorkowe) blokuja domyslny sposob
  // polaczenia na zywo Firestore - to wymusza bardziej kompatybilna metode
  db.settings({ experimentalAutoDetectLongPolling: true });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- tozsamosc gracza na tym urzadzeniu (zapisana w localStorage) ---------- */
function getMyIdentity() {
  const team = localStorage.getItem("bg_team") || null;
  const slot = Number(localStorage.getItem("bg_slot")) || null;
  const id = (team && slot) ? (team + "-" + slot) : null;
  return { team, slot, id };
}
function setMyIdentity(team, slot) {
  localStorage.setItem("bg_team", team);
  localStorage.setItem("bg_slot", String(slot));
}
function clearMyIdentity() {
  localStorage.removeItem("bg_team");
  localStorage.removeItem("bg_slot");
}

/* ---------- pomocnicze: gracze pogrupowani wg druzyny ---------- */
function playersByTeamFrom(playersData, team) {
  return Object.entries(playersData)
    .filter(([id, p]) => p.team === team)
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => a.slot - b.slot);
}

/* ---------- domyslna struktura statystyk nowego gracza ---------- */
function defaultStatMods() {
  return {
    wojownicy: { atak: 0, zdrowie: 0 },
    lancjerzy: { atak: 0, zdrowie: 0 },
    lucznicy:  { atak: 0, zdrowie: 0 }
  };
}

/* ---------- bazowe statystyki jednostki (jednakowe dla wszystkich typow na razie) ---------- */
/* Zmien te liczby, gdy bedziesz mial docelowy balans. */
const BASE_UNIT_STATS = { hp: 100, atk: 20 };

function effectiveUnitStats(playerData, unitType) {
  const mods = (playerData && playerData.statMods && playerData.statMods[unitType]) || { atak: 0, zdrowie: 0 };
  return {
    hp: Math.max(1, BASE_UNIT_STATS.hp + (mods.zdrowie || 0)),
    atk: Math.max(0, BASE_UNIT_STATS.atk + (mods.atak || 0))
  };
}

/* ---------- zakonicz rozgrywke (pelny reset, uzywane na kazdym ekranie) ---------- */
async function endGame() {
  if (!confirm("Zakończyć rozgrywkę? Wszyscy gracze będą musieli dołączyć od nowa.")) return;
  const snap = await db.collection("players").get();
  const batch = db.batch();
  snap.forEach(doc => batch.delete(doc.ref));
  batch.set(db.collection("game").doc("state"), {
    lobbyOpened: false, started: false, turnOrder: [], turnCounter: 0,
    mainGateOpen: false, rearGateOpen: false
  });
  await batch.commit();
  clearMyIdentity();
  window.location.href = "index.html";
}

/* ---------- menu ustawien (rozwijane, uzywane w kazdym pasku gornym) ---------- */
function setupGearMenu(btnId, menuId) {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  if (!btn || !menu) return;
  btn.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("hidden"); });
  document.addEventListener("click", () => menu.classList.add("hidden"));
}
