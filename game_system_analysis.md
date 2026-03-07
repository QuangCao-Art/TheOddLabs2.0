# The Odd Labs 2.0 — System Analysis
> **Created:** 2026-03-06


## Current Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| Runtime | Vanilla HTML + CSS + JS (ES Modules) | No build step needed |
| Main logic | `src/main.js` (~183KB, ~4300 lines) | Monolithic, all game systems in one file |
| Engine | `src/engine/overworld.js`, `state.js` | Modular, well-separated |
| Data | `src/data/monsters.js`, `cards.js` | Clean data tables |
| Storage | `localStorage` (presets only today) | No save system yet |
| Assets | `assets/images/` | Static PNGs |

---

## 1. New Features — Feasibility

### 💰 Shop System
> **Readiness: HIGH** — `gameState.credits` already exists but is never awarded or spent.

- **What's needed:** A shop screen (HTML overlay), a `shopInventory` data table, and credit award logic in the battle reward handler.
- **Hooks already in place:** `gameState.credits`, `gameState.items[]`, `gameState.profiles.player.cardBox[]`.
- **Complexity:** Medium — new screen + UI wiring. No engine changes needed.
- **Suggested flow:** After battle → award credits → player can visit a "Lab Store" NPC in overworld → buy cards, healing items, or synthesis materials.

---

### 💉 Healing System
> **Readiness: HIGH** — Monster HP/maxHp fields already tracked. `gameState.items[]` exists for consumables.

- **What's needed:** An item consumable system (use item → restore X HP), a healer NPC or rest station object in overworld.
- **Complexity:** Low — HP restoration is just `monster.hp = Math.min(monster.hp + amount, monster.maxHp)`. The overworld already has interactable objects.
- **Suggested flow:** Interact with a "Med Bay" object on the map → choose which Cell to heal → spend credits or items.

---

### 🧪 Monster Synthesis (Create from Materials)
> **Readiness: MEDIUM** — Requires a new material drop system and a synthesis screen.

- **What's needed:**
  1. **Material drops:** After battle, award `material_<type>` items into `gameState.items[]`.
  2. **Recipe table:** A new `SYNTHESIS_RECIPES` data object (e.g., `3x BOTANIC_SHARD → Cambihil`).
  3. **Synthesis screen:** A new UI modal with a recipe book and crafting button.
- **Complexity:** Medium-High — requires new data tables and a new UI screen, but state management is already in place.
- **Note:** `gameState.cellDex`, `gameState.playerTeam`, and `profiles.player.team` already handle adding new monsters.

---

### 💾 Save System
> **Readiness: HIGH** — localStorage already used for presets. The full `gameState` is a plain JS object — it can be JSON-serialized directly.

- **What's needed:** Two functions: `saveGame()` and `loadGame()` that read/write `gameState` + `storyFlags` + `Overworld.currentZone` + player position to `localStorage`.
- **Complexity:** Low — single-session save is ~30 lines of code. Multi-slot saves just wrap that in an array.
- **Risk:** `main.js` is large — need to be careful not to save circular references (monster party objects). Should serialize IDs, not full objects.

```javascript
// Example save/load skeleton
function saveGame(slot = 0) {
    const data = {
        storyFlags: gameState.storyFlags,
        playerTeam: gameState.playerTeam,
        cardBox: gameState.profiles.player.cardBox,
        credits: gameState.credits,
        items: gameState.items,
        logs: gameState.logs,
        zone: Overworld.currentZone,
        playerPos: { x: Overworld.player.x, y: Overworld.player.y }
    };
    localStorage.setItem(`oddlabs_save_${slot}`, JSON.stringify(data));
}
```

---

## 2. Desktop Install App (Electron)

> **Feasibility: VERY HIGH** — The game is a pure web app. Electron wraps it in a Chromium shell with zero code changes.

### Steps
1. `npm init` in the project root.
2. `npm install electron --save-dev`
3. Create `main-electron.js`:
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
app.whenReady().then(() => {
    const win = new BrowserWindow({ width: 1280, height: 720, webPreferences: { nodeIntegration: false } });
    win.loadFile('index.html');
});
```
4. Add to `package.json`: `"main": "main-electron.js"` and `"start": "electron ."`.
5. For distribution: `npm install electron-builder --save-dev` → runs on Windows, Mac, Linux.

> [!NOTE]
> `type="module"` ES imports work fine in Electron's renderer. No changes to game code needed.

### Output
- **Windows:** `.exe` installer via `electron-builder`
- **macOS:** `.dmg`
- **Linux:** `.AppImage`

### Effort estimate: ~2-3 hours

---

## 3. Android App (Capacitor)

> **Feasibility: HIGH** — Capacitor wraps web apps into native Android/iOS containers.

### Steps
1. `npm install @capacitor/core @capacitor/cli @capacitor/android`
2. `npx cap init "The Odd Labs" com.theoddlabs.game`
3. Since the game has no build step, point `webDir` to `./` (project root with `index.html`).
4. `npx cap add android`
5. `npx cap sync`
6. Open in Android Studio: `npx cap open android` → Build → Generate Signed APK/AAB.

### Challenges
| Issue | Solution |
|-------|----------|
| `type="module"` ES imports | Capacitor's WebView supports them on Android 5+ |
| File paths (`./assets/`) | Work fine — served from bundled web content |
| Screen size / touch input | Overworld uses keyboard — **touch/gamepad layer needed** |
| No touch controls | Add a D-pad overlay HTML element for mobile |
| Save data persistence | `localStorage` works in WebView — saves persist between sessions |

> [!IMPORTANT]
> The biggest gap for Android is **touch input**. The overworld and battle system are keyboard-driven. A virtual D-pad / tap-to-move layer would need to be implemented before the game is playable on mobile.

### Effort estimate: ~1 day for APK shell, ~1-2 weeks for full touch controls

---

## Summary Recommendation

| Goal | Effort | Feasibility |
|------|--------|-------------|
| Save system | 🟢 Low (~30 lines) | ✅ Ready now |
| Healing system | 🟢 Low-Medium | ✅ Ready now |
| Shop system | 🟡 Medium | ✅ Ready now |
| Monster synthesis | 🟠 Medium-High | ✅ Feasible |
| Desktop app (Electron) | 🟢 Low (~2-3 hrs) | ✅ Trivial |
| Android app | 🟡 Medium + Touch work | ⚠️ Need touch controls |

**Recommended order:** Save system → Healing → Shop → Monster Synthesis → Desktop → Android
