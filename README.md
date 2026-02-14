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
1. **Type Effectiveness**: **1.5x** (Advantage) or **0.75x** (Disadvantage).
2. **Critical Hit**: **1.5x** (Increased for high-stakes tactical shifts).
3. **MAP GPM**: **1.25x / 1.0x / 0.75x** based on tactical proximity.

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
| **THERMOGENIC** | Botanic, Keratinized | Osmotic |
| **OSMOTIC** | Thermogenic | Botanic, Electrolytic |
| **BOTANIC** | Osmotic | Thermogenic, Keratinized, Viral |
| **ELECTROLYTIC**| Osmotic, Keratinized | Botanic |
| **VIRAL** | Botanic | Keratinized |
| **APOPTOTIC** | Apoptotic | Somatic (0.75x) |
| **SOMATIC** | - | Apoptotic, Keratinized |

---

## 7. Technical Architecture
- **`/index.html`**: The main viewport containing the dual-pentagon arena.
- **`/style.css`**: CSS Grid/Flexbox for the static pentagon and neon bio-UI.
- **`/src/engine/combat.js`**: Simultaneous resolution and damage math.
- **`/src/engine/state.js`**: Battle state management.
- **`/src/data/monsters.js`**: Monster data definitions.
