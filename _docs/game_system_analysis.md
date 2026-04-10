# The Odd Labs 2.0 — System Analysis
> **Updated:** 2026-04-01
> **Created:** 2026-03-06


## Current Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| Runtime | Vanilla HTML + CSS + JS (ES Modules) | No build step needed |
| Main logic | `src/main.js` (~183KB, ~4300 lines) | Monolithic, all game systems in one file |
| Engine | `src/engine/overworld.js`, `state.js` | Modular, well-separated |
| Data | `src/data/monsters.js`, `chips.js` | Clean data tables |
| Storage | `localStorage` (presets only today) | No save system yet |
| Assets | `assets/images/` | Static PNGs |

---

## 1. New Features — Feasibility

### 💰 Shop System
> **Readiness: HIGH** — `gameState.credits` already exists but is never awarded or spent.

- **What's needed:** A shop screen (HTML overlay), a `shopInventory` data table, and credit award logic in the battle reward handler.
- **Hooks already in place:** `gameState.credits`, `gameState.items[]`, `gameState.profiles.player.chipBox[]`.
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
        chipBox: gameState.profiles.player.chipBox,
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

---

## 4. Technical Performance & Logic Analysis
> **Report Date:** 2026-04-01

### ⚡ Performance Overview
The engine currently utilizes a **DOM-centric rendering model** combined with **CSS-hardware acceleration**.

- **Strengths:** 
    - **Visual Fidelity:** High-end UI effects (neon glows, glassmorphism, parallax) are handled by the browser's CSS compositor, keeping the Main Thread free for logic.
    - **Layout Flexibility:** Standard HTML/CSS makes building complex, responsive menus (Inventory, Catalyst Box) significantly faster than a purely Canvas-based UI.
    - **Asset Management:** Browsers handle image caching and lazy loading natively.
- **Bottlenecks:**
    - **Entity Scaling:** Adding 50+ moving NPCs on a single map would cause "reflow" overhead.
    - **VFX Complexity:** High-count particle systems (e.g., thousands of sparks during a crit) are inefficient using DOM nodes.

### 🧠 Logic Handling Efficiency
The system uses a **Centralized Singleton State** (`gameState`) which is highly efficient for this genre.

- **Architecture:** The separation into `engine/` (Logic) and `data/` (Content) follows industry best practices. 
- **Modular Flow:** By isolating the `Overworld` and `Battle` engines, the system avoids memory leaks common in monolithic "switch-case" game loops.
- **Prediction Battle System:** The choice-prediction logic is computationally lightweight but delivers deep tactical complexity, which is the "sweet spot" for web-based engines.

### 🛑 Tech Stack Limits
1. **No Shared Hardware Buffers:** Since it's Vanilla JS, we don't have multithreaded worker logic for heavy data processing (yet).
2. **Post-Processing:** CSS filters (blur, contrast) are great but limited. We cannot easily do "God rays," "Chromatic aberration," or "Refraction" without a dedicated graphics context.
3. **Collision Complexity:** Currently limited to grid-based or simple AABB. Circular or complex polygon collisions would require a custom math library.

### 🌀 WebGL Integration (Combat Effects)
> **Feasibility: OPTIMAL**

We can introduce WebGL specifically as a **Battle VFX Layer** without refactoring the entire engine.

- **The Vision:** Overlay a transparent WebGL `<canvas>` on the battle screen.
- **VFX Opportunities:**
    - **Heat Distortion:** Apply a fragment shader to the enemy's portrait when Nitrophil uses a Thermogenic skill.
    - **Glitch Effects:** Distort the screen when a Pellicle Overload occurs.
    - **Particle Systems:** High-performance particle bursts for "Perfect MATCH" hits that would lag the DOM.
- **Library Recommendation:** **PixiJS** (Lightweight, high-perf WebGL wrapper) or **Raw WebGL** for custom shaders to keep the bundle size small.

### 🌟 Synthesis: Current System State
**Overall Rating: STABLE & SCALABLE**

The current architecture is surprisingly robust for a "Vanilla" stack. It punches well above its weight class in terms of visual "WOW" factor. The move to a unified **Catalyst Hub** and the recent work on **Bio-Extraction** shows a system that is maturing into a full-featured RPG engine.

**Next Major Milestone:** Transitioning from "Solid UI" to "Cinematic Combat" using the proposed WebGL layer.

---

## 5. Audio System Analysis (Planning)
> **Report Date:** 2026-04-01

### 🔊 Core Architecture
*   **BGM (Music):** Long-form seamless tracks (ideally `.ogg` for gapless loops).
*   **SFX (Effects):** "One-shot" triggers (UI, Combat, Ambient).
*   **Implementation:** A centralized `AudioManager.js` is required to pre-load assets into the browser's memory and trigger them via JS events (e.g., `resolveTurn`, `button.onclick`).

### 🎹 Sound Palette Recommendations
A "Hybrid" approach to match the Cyber-Bio aesthetic:
-   **UI:** Minimalist digital chirps and high-end mechanical clicks (think camera shutters).
-   **Combat:** Visceral organic sounds (squelches, fizzing) mixed with industrial "stings" for hits.
-   **The "Sync" Chime:** A rewarding, resonant frequency for "Perfect MATCH" placements.
-   **Ambient:** Low-pitched "Laboratory Drone" and bubbling fluid textures.

### 🌐 Recommended Free Resources
| Resource | Best For... |
| :--- | :--- |
| **Kenney.nl** | Standard UI Clicks, Sci-Fi packs, and Digital SFX. |
| **Sonniss (GDC)** | High-quality atmospheric drones and mechanical SFX. |
| **FreeSound.org** | Specific organic textures (bubbling, sizzling, electronic hums). |
| **itch.io Assets** | Dark Synthwave / Ambient music packs. |

> [!TIP]
> **Performance Note:** Use `.ogg` for high-quality loops and `.mp3` for general UI sounds to maintain a small total game bundle size.


