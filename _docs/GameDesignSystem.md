# Game Design Systems

This document tracks the core design systems implemented in The Odd Labs 2.0.

## 1. NPC Quest System
A modular, phased system for assigning tasks to NPCs with dynamic dialogue and rewards.

### Supported Quest Types
| Type | Condition | How it works |
| :--- | :--- | :--- |
| **Defeat** | Monster Hunt | Tracks specific `opponentId` kills in battle. |
| **Duel** | Win a Battle with Giver | Initiates a direct battle with the NPC after dialogue. |
| **Synthesis** | Unit Creation | Tracks unit ID creation at the Cell-Accelerator. |
| **Collect** | Item Finding | Monitors `inventory` for specific item or log IDs. |
| **Relocate** | NPC Movement | (Reward only) Moves an NPC to a new $(x, y)$ coordinate or zone. |

### Technical Features
- **Assignment-Ready**: Quests are not tethered to specific NPCs. Assign by adding `sideQuestId: 'quest_id'` to any NPC in `overworld.js`.
- **Automatic Tracking**: All progress is updated via hooks in the battle and synthesis engines.
- **Quest UI**: Managed via the **QUESTS** tab in the Player Inventory.
- **Dialogue Branching**: High-priority branching (Offer -> Progress -> Complete -> Finished).
- **Return to Random**: NPCs can return to their zone's random dialogue pool if the quest's `finished` dialogue is empty (`[]`).

---

## 2. Persistence & Save System
Ensures player progress (Quest Status, Items, Logs, Story Flags) is kept between sessions.

### Mechanics
- **Storage**: Uses browser `localStorage` to keep a serialized JSON of `gameState`.
- **Commands**: 
    - **New Game**: Clears existing data and resets to defaults.
    - **Continue**: Loads the last saved state from storage.
    - **Save Progress**: Manual save button in the Inventory.
- **Auto-Save**: Triggers automatically after quest completions, boss battles, and item discovery.

---

## 3. Inventory & Management Hub
A centralized UI for game resources and progression tracking.

### Modules
- **Data Logs**: Archive of collected world lore.
- **Items**: Track resources and story-critical objects.
- **Collectible Cards**: Visual library of discovered Cells.
- **Cell Status**: Current health and stats for active squad members.
- **Quests**: Real-time tracker for active and archived missions.
- **Catalyst Box**: Quick access to transformation/synthesis materials.

---

## 4. Battle Engagement Templates

These templates ensure consistent implementation of battles across the game.

### Boss Battle Engagement Template
This template is for high-stakes STORY bosses (Lana, Dyzes, Capsain). They use hardcoded IDs and complex story-gated dialogue rather than simple generic mapping.

#### ⚠️ Boss-Specific Post-Mortem
1.  **ID Mapping**: The Overworld ID (e.g., `lana`) usually maps to a `_boss` profile in `main.js` (e.g., `lana_boss`). Ensure this mapping is consistent in `start-npc-encounter`.
2.  **Reward Tiers**: Bosses have hardcoded high rewards (350 LC, 15 Biomass, 250 EXP) in `main.js`. Do NOT use modular rewards if you want them to feel like "Sectors Bosses".
3.  **Complex Flow**: Bosses require multiple flags (e.g., `lanaMet`, `lanaBattleDone`, `lanaDefeatedSeen`) to handle their post-victory reward sequence (Items, Keys).
4.  **Auto-Equip**: Bosses MUST use `syncCardsToLevel` and `executeQuickEquip` to have legitimate, high-tier card setups in the battle engine.

#### 📋 Boss Data Format
Unlike NPCs, Bosses are a **Hybrid**: defined in Data, but controlled in Code.

##### 1. Data Segment (`src/data/cards.js`)
- **Key**: (e.g., `lana`) - Used for team and style definition.
- **Team/RG**: Standard mapping, but usually higher RG (10+).

##### 2. Code Segment (`main.js` & `overworld.js`)
- **ID Mapping**: `lana` maps to `lana_boss` profile.
- **Fixed Rewards**: Credits and Biomass are hardcoded for high stakes.
- **Story States**: Manual check for `lanaMet`, `lanaBattleDone`, etc.

#### 📋 Boss Data Format (Basic Info)
Use this format for planning new Boss encounters.

##### 1. Dialogue (Story-Gated)
- **Before Battle**: [Manual Overworld Interaction - requires story logs]
- **Pre-battle**: [Short line said in the VS/Portrait sequence]
- **Defeated (Player Wins)**: [Lines said after player victory]
- **Won (Player Loses)**: [Lines said after player defeat]

##### 2. Monster Team (NPC_ENCOUNTERS & main.js)
- **Monster IDs**: [e.g., cambihil, lydrosome]
- **Opponent RG Level**: [High stakes: 10, 15, 20]
- **AI Combat Style**: [survival, utility, aggressive]

##### 3. Rewards (Hardcoded in main.js)
- **EXP**: [High: 250+]
- **Biomass**: [High: 15+]
- **Credits (LC)**: [High: 350+]

#### 🛠️ Implementation Steps
1.  **Narrative Setup** (`src/data/npc_dialogues.js`):
    - Register the Boss ID in the `NPC_SCRIPTS` object.
    - Implement branching logic based on `gameState.storyFlags` and `params.logs`.
    - Return `pendingBattleEncounter = 'boss_id'` to trigger the fight.
2.  **Battle Engine Initialization** (`main.js`):
    - Add a branch in the `start-npc-encounter` listener for team/stat setup.
3.  **Reward & Flag Logic** (`main.js`):
    - Add the ID to the "Sector Boss" block in `showGameOver` to set `battleDone`.
4.  **Post-Victory State** (`npc_dialogues.js`):
    - Update the script to handle the `isPostBattle` state with a "Defeated" dialogue branch.

---

### NPC Battle Engagement Template
This template ensures one-time, bug-free battle encounters for generic or quest NPCs using the modular system.

#### ⚠️ AI Post-Mortem: Mistakes to Avoid
1.  **Reward Nesting (main.js)**: Do NOT nest `NPC_ENCOUNTERS` rewards inside sector boss checks. They must be in their own `else if` branch to set flags correctly.
2.  **Missing Post-Battle Flag**: `startNPCInteraction` MUST be called with `isPostBattle = true` in `showGameOver` to prevent infinite loops.
3.  **Result Tracking**: `battleDone` is not enough. You MUST set `battleWon_[id]` and `battleLost_[id]` in `main.js` to show the correct permanent dialogue later.
4.  **ID Resolution**: Always ensure the `opponentId` from the battle engine matches the `battleEncounterId` in the overworld object.
5.  **Pre-Battle Character Art (main.js)**: You MUST add the `battleEncounterId` to the `PRE_BATTLE_DATA` mapping in `main.js`. Failure to do so will result in the pre-battle sequence displaying the wrong character art (e.g., using Female art for a Male NPC).

#### 📋 NPC Data Format
Use this format when defining a new NPC encounter (like Julia).

##### 1. Dialogue
- **Before Battle**: [Lines said when interaction starts in Overworld]
- **Pre-battle**: [Short line said in the VS/Portrait sequence]
- **NPC Victorious (Player Loses)**: [npcWinDialogue]
- **NPC Defeated (Player Wins)**: [npcLossDialogue]

##### 2. Monster Team (NPC_ENCOUNTERS)
- **Monster IDs**: [e.g., stemmy, nitrophil]
- **Opponent RG Level**: [e.g., 5, 10, or 'auto']
- **AI Combat Style**: [aggressive, balanced, survival, utility]

##### 3. Rewards
- **EXP**: [Amount]
- **Biomass**: [Amount]
- **Credits (LC)**: [Amount]

#### 🛠️ Implementation Steps
1.  **Define Encounter** (`src/data/cards.js` -> `NPC_ENCOUNTERS`):
    - Set `rg`, `team`, `style`, and `reward`.
2.  **Setup NPC Narrative** (`src/data/npc_dialogues.js`):
    - Register the NPC ID and define `Before Battle` and `Post Battle` responses.
    - Point to the `battleEncounterId` from Step 1.
3.  **Result Persistence**: The system automatically handles flags (`battleDone`, `battleWon`, `battleLost`) via the core engine.

---

## 5. Systematic Narrative Engine
A data-driven registry that decouples dialogue logic from the simulation engine.

### Core Mechanics
- **Registry**: [npc_dialogues.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/data/npc_dialogues.js) maintains all unique NPC scripts.
- **Hook System**: Supports `triggers` (story flags), `pendingBattleEncounter`, and dynamic `lines`.
- **Logic Parameters**: Scripts receive `gameState`, `overworld` engine, and `params` (isPostBattle, bossWon, totalLogs) to allow for complex branching without hardcoding.

---

## 6. Persistent Relocation System
Allows NPCs to move dynamically between coordinates or zones while maintaining state across sessions.

### Mechanics
- **Relocate Command**: `overworld.relocateNPC(npcId, x, y, zoneId, direction, useFade)`.
- **Persistence**: Final positions are saved in `gameState.npcRelocations` and override base map data during [applyMapPatches](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js).
- **Triggers**:
    - **Quest Reward**: Add a reward of type `{ type: 'relocate' }` to any quest.
    - **Script Trigger**: Call directly from an NPC script in the Narrative Engine.
- **Visuals**: Uses `triggerQuickTransition` for a seamless fade-to-black effect during movement.
