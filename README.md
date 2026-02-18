# The Odd Labs 2.0 - Technical & Design Specifications

## 1. Project Overview
**The Odd Labs 2.0** is the web-based successor to "The Odd Lab", combining high-octane cellular combat with a streamlined web interface. It focuses on purely strategic 1v1 battles using the **Matching Attack Placement (MAP)** system.

- **Platform**: Web (HTML5/CSS3/Vanilla JS)
- **Visuals**: Neon Bio-tech, high-contrast cellular aesthetics (vibrant colors, dark backgrounds).
- **Core Loop**: Strategic 1v1 Simultaneous Turn-Based Combat.

### 1.1 Tech Stack & Scalability
- **Logic**: Vanilla JavaScript (ES Modules). Organized into `engine/`, `ui/`, and `data/`.
- **Styling**: CSS Flexbox/Grid + CSS Variables for skinning.
- **Rendering**: DOM-based.
- **Scalability**: By avoiding frameworks (React/Vue), we eliminate "dependency hell" and keep raw performance. The modular structure allows easy addition of:
    - **Multiplayer**: Socket.io integration.
    - **New Content**: JSON-based monster/move databases.
    - **Advanced Effects**: WebGL/Canvas layers if needed later.

### 1.2 Design Philosophy: "Hidden Choice & Reveal"
Combat isn't about clicking faster; it's about **prediction**. The outcome is only revealed once both parties have committed to a node.

## 2. Combat System: The Dual Pentagon
Combat takes place in a microscopic arena where two Cells face each other. Each Cell is represented by a **Pentagon with 5 nodes**.

### 2.1 The MAP System (Matching Attack Placement)
The core mechanic is the **simultaneous selection** of a position on the pentagon.

- **Match (Distance 0)**: Both cells chose the **exact same** node position.
    - **MAP Multiplier**: 1.25x (Damage Buff)
    - **PP Gain**: +3 PP
    - **Attack Label**: MATCH | **Defense Label**: HIT
- **Near (Distance 1)**: Cells chose nodes directly **adjacent** to each other (either side).
    - **MAP Multiplier**: 1.0x
    - **PP Gain**: +2 PP
    *   **Attack Label**: NEAR | **Defense Label**: CLOSE
- **Far (Distance 2+)**: All other positions ("The Rest").
    - **MAP Multiplier**: 0.75x
    - **PP Gain**: +1 PP
    - **Attack Label**: FAR | **Defense Label**: NICE

### 2.26 MAP Effects (Tactical Suite)
A fundamental expansion of the **Matching Attack Placement (MAP)** system.

| In Game Name | Mechanic | Effect | Use Case |
| :--- | :--- | :--- | :--- |
| **EASY TARGET** | Match Expand | **3 Match, 2 Near** | Reliable heavy damage. |
| **DRUNK MAN** | Far Expand | **1 Near, 4 Far** | Tactical debuff or penalty. |
| **PERFECT STRIKE**| Super Match | **5 Match** | Unavoidable crit/max DMG. |
| **RELIABLE HIT** | Super Near | **5 Near** | Consistent chip damage. |
| **PUNY SLAP** | Super Far | **5 Far** | Intentional weak hit. |
| **ALL OR NOTHING**| Risky Match | **1 Match, 4 Far** | High-risk skill shots. |
| **CHOICEBLOCK** | Node Block | **Lock Node** | Prevents selection for 1 next turn. |
| **HURTBLOCK** | Node Block | **Lock Node** | Disables the nodes used by both players this turn, preventing them from being re-selected in the next turn. |

### 2.2 Global Color Coding Rules
The laboratory uses a semantic color system to ensure absolute tactical clarity:

| Category | Color | Usage |
| :--- | :--- | :--- |
| **Tactical: MATCH** | 🔴 Red | Exact node match, Critical hit text, Overload alerts |
| **Tactical: NEAR** | 🟡 Yellow | Adjacent node hit, Reflection damage numbers |
| **Tactical: FAR** | 🟢 Green | Distant node hit, Health bar fills |
| **Phase: Attack** | 🟠 Orange | Attack nodes, Selection core (Sword), Move buttons |
| **Phase: Defense** | 🔵 Blue | Defense nodes, Selection core (Shield), Defense buttons |
| **Affiliation: Player** | 🔷 Cyan | Player vitals, Portrait glow, Cell Container UI |
| **Affiliation: Enemy** | 🔮 Magenta | Enemy vitals, Enemy portrait glow |
| **Special: Critical** | 🟣 Purple | [CRITICAL] tags in log, Critical hit popups |

#### 2.2.1 Biological Type Colors
| Type | Color |
| :--- | :--- |
| **THERMOGENIC** | 🔴 Red |
| **OSMOTIC** | 🔵 Blue |
| **BOTANIC** | 🟢 Green |
| **ELECTROLYTIC**| 🟡 Orange Yellow |
| **VIRAL** | 🟣 Purple |
| **APOPTOTIC** | ⚫ Black |
| **SOMATIC** | ⚪ White |
| **KERATINIZED** | 🔘 Bright Gray |

---

## 3. Turn Loop: The Prediction Phase
The game follows a strict turn-based resolution flow.

### 3.1 Player Action Turn (Player as Attacker)
1.  **Move Selection**: Player chooses a Move (Basic or Pellicle).
2.  **Node Selection**: Player chooses 1 of 5 Nodes on their Pentagon.
3.  **Enemy AI Internal**: AI secretly chooses its Node to defend.
4.  **Resolution Jump**: Both Cells jump to chosen nodes.
5.  **Combat Resolution**: **Only the Player deals damage** to the Enemy.
6. **PP Gain**: The **Attacker only** gains PP based on prediction proximity (MAP).
7.  **Reset**: Both jump back to the center.

### 3.2 Enemy Action Turn (Enemy as Attacker)
1.  **Defense Node Selection**: Player chooses a Node to defend from.
2.  **Execution**: Player clicks "LOCK CHOICE".
3.  **Resolution Jump**: Both jump. **Only the Enemy deals damage** to the Player.
4. **PP Gain**: The **Enemy only** gains PP based on proximity.
5.  **Reset**: Return to center.

---

## 4. Damage & Multipliers
The final damage resolved against HP follows this hierarchy:

`FinalDamage = Math.max(1, ((AttackerAtk / DefenderDef) * MovePower * 0.5 + 2) * TypeEffect * CritMult * MAP_GPM * RandomRoll(0.85-1.0) - (Current_PP * 3))`

> [!NOTE]
> Every hit is guaranteed a floor of **1 HP Damage**, regardless of defense stats or PP levels.

### 4.1 Multipliers
1. **Type Effectiveness**: **1.5x** (Advantage) or **0.75x** (Disadvantage). Calculated based on the **Attacker's Move Type** vs the **Defender's Monster Type**.
2. **Critical Hit**: **1.5x** (Increased for high-stakes tactical shifts).
3. **MAP GPM**: **1.25x / 1.0x / 0.75x** based on tactical proximity.

### 4.2 Tactical Feedback (VFX & Logs)
The UI provides immediate feedback for tactical outcomes:

| Outcome | Log Message | Visual Feedback |
| :--- | :--- | :--- |
| **Super Effective** | `It's a BREACH!!!` | Larger, glowing damage numbers. |
| **Not Very Effective**| `It's RESISTED...` | Smaller, dimmed damage numbers. |
| **Critical Hit** | `[CRITICAL]` | Purple text & screen shake. |
| **MAP Match** | `MATCH` | Red center flash & heavy shake. |

---

## 5. The First Three: Monster Roster

### 🧪 Nitrophil (Cell03) - LYTIC
- **Type**: THERMOGENIC | **Stats**: 100 HP / 14 Atk / 10 Def / 10% Crit
- **Signature**: **Nitric Burst** (Pellicle) | 5 PP Cost | 70 Power.

### 🌿 Cambihil (Cell01) - SOMATIC
- **Type**: BOTANIC | **Stats**: 120 HP / 10 Atk / 15 Def / 5% Crit
- **Signature**: **Overgrowth** (Pellicle) | 4 PP Cost | 65 Power.

### 💧 Lydrosome (Cell02) - TACTICIAN
- **Type**: OSMOTIC | **Stats**: 85 HP / 18 Atk / 8 Def / 20% Crit
- **Signature**: **Hydro Shot** (Pellicle) | 6 PP Cost | 80 Power.

---

## 6. Elemental Table
| Attacker Type | Advantage (x1.5) | Disadvantage (x0.75) |
| :--- | :--- | :--- |
| **SOMATIC** | - | - |
| **THERMOGENIC** | Botanic, Keratinized | Osmotic |
| **OSMOTIC** | Thermogenic | Botanic, Electrolytic |
| **BOTANIC** | Osmotic | Thermogenic, Keratinized, Viral |
| **ELECTROLYTIC**| Osmotic, Keratinized | Botanic |
| **KERATINIZED** | - | Thermogenic, Electrolytic |
| **VIRAL** | Botanic | Keratinized |
| **APOPTOTIC** | Apoptotic | - |

---

## 7. Technical Architecture
- **`/index.html`**: The main viewport containing the dual-pentagon arena.
- **`/style.css`**: CSS Grid/Flexbox for the static pentagon and neon bio-UI.
- **`/src/engine/combat.js`**: Simultaneous resolution and damage math.
- **`/src/engine/state.js`**: Battle state management and Team Loadout storage.
- **`/src/data/monsters.js`**: Monster data definitions and core stats.

---

## 8. Cell Container & Team Management (System C1)

The **Cell Container** is the primary interface for managing your tactical roster.

### 8.1 Team Loadout
- **Capacity**: 3 Active Monsters.
- **Deployment**: The monster in the **First Slot (Leader)** is automatically deployed into battle.
- **Interactions**: Drag-and-drop to swap slots or replace members from the CellDex.

### 8.2 CellDex Grid
- **Function**: Displays all acquired cellular entities.
- **Inspection**: Click any icon to open the **High-Res Monster Card**, showing full tactical specs and bio-data.
- **Aesthetic**: Integrated with the Player Cyan (`--color-player`) semantic theme.

---

## 9. Overworld Exploration & Discovery

The overworld is a grid-based laboratory environment where players explore, talk to NPCs, and uncover the truth behind the "Cell Project."

### 9.1 Interaction Mechanic (The 'E' Key)
Players can interact with their environment by pressing **'E'** when facing an object or NPC.

- **NPCs**: Triggers dialogue sequences. Some NPCs provide hints, while others trigger story battles.
- **Lore Inspection**: Most lab furniture (tanks, desks, racks) can be inspected to reveal flavor text and lore.
- **Hidden Discovery (DataLogs)**: 
    - DataLogs are the primary collectible and story driver. 
    - **CRITICAL RULE**: DataLogs are only "hidden" within furniture that has **Active Collision** (e.g., solid desks, large tanks, or planters). 
    - Non-collidable decor (posters, floor markings) can never hide a datapad.
    - If a datapad is found, it triggers a popup and is added to the **Inventory**.

---

## 10. Progression & Leveling (Bio-Growth)

The game features a 10-level progression system for the player's cellular team.

### 10.1 Leveling Mechanics
- **Level Cap**: 10.
- **XP Curve**: `Current Level * 100` (Linear scaling).
- **Stat Growth**: 
    - **HP**: +10 per level.
    - **Atk/Def**: +2 per level.
- **Skill Unlocks**:
    - **Level 5**: Signature Skill unlock.
    - **Level 9**: Ultimate Skill unlock.

### 10.2 Story Balancing
 Progression is balanced across four major milestones:
1. **Lobby (Lvl 1)**: Introduction & Jenzi Battle.
2. **Botanic Sector (Lvl 4)**: Lana Boss Battle.
3. **Human Research Ward (Lvl 7)**: Dyzes Boss Battle.
4. **Director's Suite (Lvl 10)**: Final Boss Challenge.

---

## 11. Inventory & Progression Tracking

The inventory system acts as a central hub for your research progress.

- **DataLog Archive**: A chronological list of all collected logs (01-20).
- **Key Items**: Tracks essential story items (e.g., Old Lab Room Key, Inferno Sauce).
- **Cell Status**: View detailed stats and XP progress for your active team.
- **Progression Logic**: The world's "Gatekeeper" (Jenzi) checks your log count to unlock new wings of the lab.

---

## Appendix: Monster Mechanic Template

Use this blueprint when introducing new cellular entities to the lab.

### A.1 Data Schema (src/data/monsters.js)
```javascript
id: 'unique_id', // CamelCase or snake_case identifier
name: 'Display Name',
type: 'ELEMENT_TYPE', // See Section 6 for valid types
archetype: 'CLASS_LEVEL', // e.g., LYTIC, SOMATIC, TACTICIAN
lore: 'Tactical and flavor description.',
hp: 100, maxHp: 100,
pp: 1, maxPp: 10,
atk: 10, def: 10, crit: 5, // Stats balanced around 10-20 range
moves: [
    { 
        id: 'move_id', name: 'Move Name', type: 'basic|pellicle', 
        power: 40, cost: 0, 
        desc: '...',
        // Optional Tactical Modifiers:
        matchOffset: -1, // [**EASY TARGET**]: Distance 1 counts as Distance 0 (MATCH)
        matchExpand: 1,  // [**MATCH EXPAND**]: Inclusive matching
        matchRisky: true // [**HIGH RISK**]: Massive falloff if not Distance 0
    }
],
defenseMoves: [
    { 
        id: 'def_id', name: 'Defense Name', type: 'basic|pellicle', cost: 0, 
        desc: '...',
        // Optional Tactical Modifiers:
        matchFixed: 1, // [**RELIABLE HIT**]: Forces a NEAR result regardless of selection
        reflect: 0.2   // Reflects percentage of absorbed damage
    }
]
```

### A.2 UI & Asset Requirements
Every monster requires two dedicated visual assets located in `assets/images/`:
1.  **Icon**: `[Name].png` (e.g., `Nitrophil.png`)
    - **Usage**: CellDex Grid, Team Slots, Arena Portrait.
    - **Specs**: 512x512 transparent PNG, centered cellular subject.
2.  **Card**: `Card_[Name].png` (e.g., `Card_Nitrophil.png`)
    - **Usage**: High-Res Inspection Modal, Sidebars.
    - **Specs**: Standard 2.5" x 3.5" portrait aspect ratio.

### A.3 Tactical Law Compliance
Ensure new monsters leverage the **Official Tactical MAP Suite** whenever possible. Avoid generic damage buffs; prioritize positional manipulation (forced NEAR/FAR) and impact-based utility.
