# The Odd Labs 2.0 - Gameplay Diary

This document serves as a technical log and handover guide for "The Odd Labs 2.0", detailing the logic, design decisions, and fixes implemented during development.

## 1. Core Mechanics & Design Logic

### 1.1 The MAP System (Matching Attack Placement)
- **Concept**: Simultaneous hidden selection of nodes on a pentagon.
- **Distances**:
    - **Match (0)**: Exact same relative node. (1.0x DMG, +3 PP)
    - **Near (1)**: Adjacent nodes. (0.75x DMG, +2 PP)
    - **Far (2)**: All other nodes. (0.5x DMG, +1 PP)
- **Relative Identity**: Node 0 is the "Point". Node 1 is "Top-Right", etc. Indices are aligned so that Index 1 for Player = Index 1 for Enemy in a mirrored relative sense.

### 1.2 Pellicle Points (PP) & HP
- **Passive Shield**: Damage taken is reduced by `PP * 3`.
- **PP Generation**: Gained every turn based on MAP distance (even on defense).
- **Pellicle Discharge (Overload)**: Starting a turn with **10 PP** (Max) causes an immediate **30 HP Pellicle Discharge**. This prevents "PP Camping" and forces tactical resource rotation.
- **Asymmetric Turns**: To clarify combat, only the **Attacker** deals damage. The **Defender** only gains/uses PP and mitigates damage.

## 2. Major Updates & Fixes

### 2.1 Pentagon Mirroring (The "Left is Left" Fix)
- **Problem**: Default rotation made "Right" for one player feel like "Left" for another.
- **Fix**: Mirrored the pentagons (Player Point-Up, Enemy Point-Down) and re-calculated angles.
- **Result**: Visual and logical symmetry. Indices (0-4) now represent the same "relative" positions.

### 2.2 Monster Movement & Precise Jumps
- **JS-Driven Positions**: Moved node layouts from CSS to JS to ensure cross-browser pixel-perfect centering.
- **Standardized Baseline**: Monsters and Nodes both use `translate(-50%, -50%)`.
- **Slide Sync**: The "Enemy Ghost" indicator slides from center-to-node in perfect 0.5s sync with the real monster jump.

### 2.5 Hero-Centric UI Redesign
- **Layout**: Reorganized the battle screen into a mirrored duo-layout. 
    - **Player**: Portrait/Stats (Left) | Pentagon (Right).
    - **Enemy**: Pentagon (Left) | Portrait/Stats (Right).
- **Vitals**: Simplified the bulky stats panels into compact "Vitals Bars" placed directly below the monster portraits.
- **Assets**: Integrated high-res monster portraits (`Nitrophil.png`). Removed decorative containers for a cleaner, character-first look where the monsters represent the health bars directly.
- **Centering**: Grouped move buttons and the action button in the center of the footer for better focus and reachability.
- **Wording**: Renamed the primary action button from "LOCK CHOICE" to "ATTACK" for a more aggressive, battle-focused feel.

### 2.6 Pokemon-Style Attack Animations (Gen 3)
- **The Lunge**: Portraits now use `@keyframes` to quickly slide towards the center and snap back during an attack, mirroring the classic Gen 3 Pokemon style.
- **The Shake**: Defensive portraits perform a jittery "hit shake" when damage is resolved, providing tactile feedback for successful hits.
- **Polish**: Removed `overflow: hidden` from portraits to prevent clipping during lunge animations. Flipped the player portrait horizontally (scaleX(-1)) to face the enemy for better visual confrontation.
- **Sync**: Animation triggers are handled in `resolvePhase` and synchronized with the MAP reveal and HP bar updates.

### 2.7 Final Visual Polish & Z-Index Tuning
- **VFX Overlap**: Fixed a bug where monster portraits (z:30) and ghosts (z:40) were covering the node flashes. Boosted `.flash-*` z-index to **100 !important**.
- **State Clearing**: Hardened the selection clearing logic. Visuals are scrubbed immediately, but `currentNode` state is preserved until after the jump animation to ensure correct positioning for sprites, ghosts, and VFX.

### 2.8 Tactical UI/UX Polish
- **Overload Alert**: The PP bar and text now pulse bright red when a combatant reaches 10 PP, signaling immediate "Overload Recall" danger.
- **Move Validation**: Technique buttons (e.g., Nitric Burst) are automatically grayed out and disabled if the player lacks the required PP.
- **Pellicle VFX**: Small Pellicle tokens pop upwards and arc across the screen from the **opponent's side** to the **attacker's portrait** after every successful action, visualizing the "harvesting" of energy from the foe.

### 2.9 Dynamic Action Button
- **Contextual UI**: Merged the "ATTACK" and "DEFENSE" roles into a single dynamic button.
- **Visual Cues**: The button glows **Green** and says **ATTACK** when it's your turn to strike, then shifts to **Yellow** and says **DEFENSE** when you must move to avoid the enemy's incoming blow.

### 2.10 Refined Selection Visuals
- **Sleeker Rings**: Reduced the selection ring thickness by 50% for a more precise, high-tech appearance.
- **Defense Phase (Green)**: When defending, the pentagon and nodes glow with a clean **Neon Green** theme, providing a clear distinction from the yellow 'NEAR' match indicator.

### 2.11 Enhanced Skill Info Cards
- **Rounded Aesthetics**: Both move buttons and the main action command (**ATTACK/DEFENSE**) now feature a consistent **20px rounded corner** design for a unified UI language.
- **Rich Data**:Each skill card displays Power (POW) and Type alongside the cost.
- **Dynamic Color Coding**: Costs and power levels are color-coded to match the neon theme (Green for cost, Yellow for power).

### 2.12 Refined MAP Visual Impact
- **Flash-Free Ghost**: Neutralized color state until impact.
- **Contextual Feedback**: The feedback labels now change based on the phase:
    - **Attack**: MATCH / NEAR / FAR
    - **Defense**: HIT / CLOSE / NICE
- **Stabilized Vertical Burst**: Corrected the diagonal drift. The results text now features a perfectly anchored **vertical upward snap** by unifying the transform logic, ensuring zero horizontal deviation during the fade-out.
- **Enhanced Contrast**: Using explicit hex codes with controlled luminescence for clear resolution feedback.

### 2.13 Balanced Resource Logic
- **One-Sided PP Gain**: Corrected the combat engine to only reward the active Attacker with PP (Pellicle) based on proximity.
- **Initial State**: All monsters start combat with **1 PP** (down from 3) to emphasize tactical resource building.
- **Rebalanced MAP Multipliers (Buff)**: Increased the impact of tactical placement across the board:
    - **Match (0)**: 1.25x DMG (from 1.0x) + 3 PP
    - **Near (1)**: 1.0x DMG (from 0.75x) + 2 PP
    - **Far (2+)**: 0.75x DMG (from 0.5x) + 1 PP
- **Lethality Increase**: This change increases overall damage output, rewarding precise placement with devastating blows while keeping "Far" hits meaningful.

### 2.14 Pellicle Heavy Attacks (Tiered VFX)
- **Heavy Lunge**: Skills that cost PP (Pellicle type) now feature a significantly more aggressive lunge animation with a larger travel distance and a faster impact snap.
- **Refined Pellicle Aura**: The monster emits a balanced bio-tech glow (reduced intensity for better clarity) to signal the release of stored energy.
- **Screen Shake**: Impact from a Pellicle attack now triggers a tactical screen-shake effect, providing a visceral sense of power compared to basic strikes.

### 2.15 Damage Engine 2.0 (Pokemon-Inspired)
- **Stat Ratio Integration**: Implemented a sophisticated damage formula based on the official Pokemon mechanics: `((Atk/Def) * Power * 0.5 + 2)`. This ensures that a monster's individual Attack and Defense stats are finally relevant to combat outcomes.
- **Dynamic Variance**: Added a random roll modifier (0.85 - 1.0) to prevent static "solved" damage numbers, adding high-quality suspense to every resolution.
- **Critical Buff**: Increased Critical multiplier to **1.5x** to match global competitive standards.
- **Minimum Damage Enforced**: Updated damage calculation to ensure every successful hit deals at least **1 HP damage**, preventing situations where high defense or PP could reduce damage to zero.

### 2.16 Roster Expansion: The First Three
- **Full Integration**: Added **Cambihil** (Botanic Tank) and **Lydrosome** (Osmotic Sniper) alongside Nitrophil.
- **Lore Sync**: Every monster now carries its official cellular lore from the Cellular Wars archives, defining its role in the ecosystem.
- **Balanced Starts**: Confirmed all monsters now begin combat with exactly **1 PP**, emphasizing tactical resource building.

### 2.17 Real-Time Damage Numbers
- **Dynamic Feedback**: Implemented floating red damage text that appears directly above a monster whenever it takes damage.
- **Visual Tiering**: The numbers utilize the same "Burst" logic as the MAP results, scaling and fading to ensure they feel like heavy cellular impact feedback.
- **Immediate Clarity**: This makes the result of complex damage calculations (Ratio, Crit, MAP) instantly readable to the player.

### 2.18 UI Polish: Information Hierarchy
- **Subdued Feedback**: Scaled damage numbers down to **1.4rem** and reduced their vertical float distance (-40px) to prevent them from distracting from the main action. 
- **Name Repositioning**: Moved monster name labels from the header to the "Vitals" stack (between the portrait and HP bar). This creates a tighter, more logical grouping of character identity and status.

### 2.19 Game Loop: Start & Game Over
- **Main Menu**: Implemented a dedicated entry screen featuring a high-impact logo, versioning, and an expanded button layout (Standardized with Cellular War: Start, Container, Rulebook, Settings).
- **Game Over Overlay**: Added a full-screen, blurred glassmorphism overlay for mission resolution (Success/Failure). 
- **Back to Base**: Added a minimalistic **BACK** button in the combat arena, allowing players to retreat to the main menu at any time.
- **State Continuity**: Integrated a `resetGame()` sequence that allows for immediate re-battle without needing to refresh the page, maintaining a fast, additive gameplay loop.

### 2.20 Layout Fix: Battle Scene Alignment
- **Flexbox Context**: Restored vertical centering and `space-between` logic by applying `display: flex` to the new `.screen` container class. This ensures the battle arena fills the entire viewport and correctly positions the enemy and player at opposite ends.

### 2.21 Visual Atmosphere: Background Integration
- **Legacy Assets**: Migrated the high-fidelity `BG_Main.png` and `BG_Battle.png` from the original Cellular War archives.
- **Enhanced Contrast**: Applied subtle darkening gradients over the images within the CSS to ensure that neon UI elements (Health bars, MAP labels) remain perfectly legible against the detailed laboratory environments.

### 2.22 Visual Polish: Tactical Pentagon Overlay
- **Structural Overlay**: Integrated the `PentagonPosition.png` graphic into the `.pentagon-shape` background.
- **Asymmetric Calibration**: Optimized the vertical alignment by setting the player pentagon at **-7px** and applying a **25px downward offset** to the enemy side (**top: 18px**). Combined with `scaleY(-1)` mirroring, this ensures that the tactical blueprints align with surgical precision across both sides of the battlefield.

### 2.23 Combat Content: Nitrophil Skill Expansion
- **New Skill: Oxidative Purge**: Added a third move for Nitrophil. Categorized as a **Pellicle** attack, it costs **3 PP** and deals **55 base damage**.
- **Tactical Utility**: This move offers a middle ground between the free basic attack and the expensive 5 PP burst, allowing for more granular resource management during combat.

### 2.25 UI Enhancement: Skill Info Hover Panel
- **Tactical Clarity**: Implemented an automated info panel that triggers when hovering over attack buttons.
- **Dynamic Content**: The panel retrieves move descriptions directly from `monsters.js`, ensuring that complex mechanics like "Match Expand 01" are clearly explained to the player.
- **Visual Polish**: Utilized absolute-positioned glassmorphism overlays with a slide-up animation to maintain the high-fidelity laboratory aesthetic without cluttering the main battle UI.
- **Combat Logic**: `src/engine/combat.js` handles the circular distance math and damage formulas.
- **Main Loop**: `src/main.js` handles the `async` jump animations and transition timings (mostly 0.5s - 0.6s).

### 2.26 Tactical MAP Suite (Official)
A fundamental expansion of the **Matching Attack Placement (MAP)** system.

| Title | Mechanic | Effect | Use Case |
| :--- | :--- | :--- | :--- |
| **Easy Target** | Match Expand | **3 Match, 2 Near** | Reliable heavy damage. |
| **Drunk Man** | Far Expand | **1 Near, 4 Far** | Tactical debuff or penalty. |
| **Perfect Strike**| Super Match | **5 Match** | Unavoidable crit/max DMG. |
| **Reliable Hit** | Super Near | **5 Near** | Consistent chip damage. |
| **Puny Slap** | Super Far | **5 Far** | Intentional weak hit. |
| **All or Nothing**| Risky Match | **1 Match, 4 Far** | High-risk skill shots. |

### 2.27 UI/UX Overhaul: Command Zone & Drag-Drop
A significant leap in the game's interaction model, shifting from static button clicks to a modern, direct-manipulation interface.

- **Command Zone (Right Panel)**: All tactical inputs (Pentagon, Skill Buttons, Info Panel) are now consolidated into a dedicated glassmorphism sidebar on the right. This declutters the main screen and focuses the player's attention on the tactical data.
- **Drag-and-Drop Selection**: Replaced the "Select Node -> Click Attack" flow. Players now drag a central "Selection Core" from the middle of the pentagon directly onto their target node.
- **Instant Resolution**: Releasing the core on a node immediately triggers the combat sequence (jump, hit, VFX), creating a much faster and more satisfying gameplay rhythm.
- **Centralized Battle Arena**: Characters and vitals are now grouped in the center of the screen, creating a cinematic focal point for all combat animations.

### 2.28 Dual Phase Visuals: High-Fidelity Turn Feedback
To improve phase clarity, the tactic pentagon now uses dedicated high-fidelity assets that swap dynamically.

- **Attack Version**: When striking, the pentagon uses `PentagonPosition_Attack.png` with a neon blue glow.
- **Defense Version**: Swaps to `PentagonPosition_Defense.png` with the updated **Neon Green** accent theme.
- **Implementation**: The transition is handled via CSS `background-image` swapping with a smooth opacity transition, ensuring zero-latency visual feedback for combat state changes.

### 2.29 Pokemon-Style Asymmetric Layout (Hero-Centric)
- **Concept**: Refined the arena into a classic high-fidelity asymmetric diagonal view to prioritize "Hero" presence.
- **Asymmetric Scaling**: Enlarged the player monster to **1.4x** scale to create an immersive, over-the-shoulder feeling. The enemy is scaled to **0.9x** to emphasize the strategic distance.
- **Diagonal Framing**: Combatants are positioned on a diagonal axis (Player Bottom-Left / Enemy Top-Right), clearing the center of the screen for dynamic VFX and data readouts.
- **Clustered Vitals**: Health and Pellicle bars are now docked directly adjacent to their respective monsters (Enemy Top-Left, Player Bottom-Right) for immediate, contextual readability.

### 2.30 Zero-Shift Additive Animations
- **The Problem**: Discovered a "snapping" or "shifting" bug where monsters would jitter slightly at the start of an attack animation because the JS jump and CSS lunge were clashing on the same properties.
- **Hardware-Accelerated Fix**: Implemented a technical separation of properties. The JS "jump" offset is applied to the **monster image** (using the standalone `translate` property), while the combat "lunge" is applied to the **container** (using `transform: translate()`). 
- **Additive Motion**: Because these are additive in modern CSS, the lunge now starts **exactly from the landed position** with zero jitter, creating a perfectly smooth and stable combat flow.

### 2.31 Static Portrait Transitions (Focus)
- **Simplification**: Removed the vertical jump animation for the portrait layer during the resolution phase.
- **Result**: Keeps the visual focus entirely on the tactical lunge/attack. Characters remain grounded at their base until the strike begins, preventing unnecessary visual clutter.

### 2.32 Tactical UI Hierarchy: Command Zone Header
- **Consolidation**: Relocated the **Turn Indicator** and **Phase Status** labels from the central arena to the top of the **Command Zone** panel.
- **Header Logic**: These labels now serve as a permanent header for the tactile inputs, clearing up the central scene for unobstructed view of the monster encounter.
- **Ergonomics**: Moved the attack skill buttons up closer to the pentagon by removing greedy flex expansion, creating a tighter, more cohesive control cluster.

### 2.33 Enhanced Pellicle Sky-Drop VFX
- **Visual Scale**: Increased the Pellicle token size by **20% (to 36px)** for a more premium, high-fidelity look.
- **Drop from Sky**: Refactored the animation from "traveling between monsters" to "dropping from the sky."
- **Rain Effect**: Tokens now stagger-fall from the top of the viewport onto the target monster. This creates a satisfying "rain" of tactical points that feels like a distinct reward for good placement.

### 2.34 Dynamic Tactical Phase Labels
- **Descriptive Naming**: Renamed the generic "MOVE SELECTION" phase to more descriptive, context-aware labels.
- **Contextual Shift**: The UI now explicitly displays **"ATTACK NODE SELECTION"** when it's the player's turn to strike, and **"DEFENSE NODE SELECTION"** when the enemy is preparing their move.

### 2.35 Diagonal Combat Lunges (45-Degree Alignment)
- **Direct Clashing**: Updated all attack animations (Lunge and Heavy Lunge) to follow the diagonal axis of the Pokémon-style layout.
- **Perfect Geometry**: The lunges are now calibrated to exactly **45 degrees** by using equal X and Y magnitudes (e.g., `translate(80px, -80px)`). 
- **Orientation**: Player lunges **Up-Right**, and the Enemy lunges **Down-Left**, ensuring they attack directly towards each other's centers.
- **Consistency**: Unified all movement keyframes to use the `transform: translate()` property, preventing conflicts and ensuring smooth, predictable motion during the clash.

### 2.36 'Heavy Drop' Death Animation (Cinematic Finish)
- **Concept**: To provide a high-impact "defeat" moment, monsters are now replaced by a grayscaled "Cell Container" upon death.
- **Visuals**: The defeated monster portrait performs a **death-fade** (opacity 0 + grayscale) while a high-fidelity container asset drops from `-250%` vertical height.
- **Timing**: Integrated a **1.8s cinematic pause** in the `checkGameOver` loop to allow the play to witness the heavy impact and bounce.

### 2.37 Overload (Pellicle Discharge) Overhaul
- **High-Stakes Penalty**: Re-tooled the legacy recoil into a critical "Pellicle Discharge." Reaching the 10 PP limit now deals **30 HP damage** (up from 10).
- **Universal Logic**: The system now checks **both** combatants during turn transitions, ensuring that a fully-charged defender also suffers the penalty before the board reset.
- **Diagnostic Feedback**: Added a specific `[OVERLOAD]` log entry and a `flash-red` portrait animation to emphasize the danger of the discharge.

### 2.38 Dynamic Move Info Panel (Contextual Tooltips)
- **Concept**: To prevent the info panel from obscuring move buttons, implemented dynamic vertical positioning and auto-scaling.
- **Glassmorphism**: Reduced background opacity to **0.7** with a **15px blur** for a premium, less intrusive feel.
- **Content-First Sizing**: Removed fixed height constraints, allowing the panel to shrink/grow based on the move's description length.
- **Real-Time Calculation**: `main.js` now anchors the panel 10px above the hovered button's top edge.

### 2.39 Tactical Core Icons (Phase Indicators)
- **Visual Feedback**: Integrated phase-specific icons directly into the selection core circle.
- **Minimalist Aesthetic**: Icons (Sword/Shield) are now rendered in **pure white** with **0.5 opacity** (`filter: brightness(0) invert(1)`) to provide clean tactical guidance without cluttering the neon glow.
- **Dynamic Assets**: The core displays a sword during the Attack phase and a shield during the Defense phase with a smooth **0.3s transition**.

### 2.41 Calibrated Tactical Shake (Visceral Feedback)
- **Concept**: Refined physical impact feedback for a more professional tactical feel.
- **Calibrated Intensity Tiers**:
    - **MATCH (Heavy)**: Maintained at **8px** for maximum impact on perfect alignment.
    - **NEAR (Medium)**: Calibrated to **3px** (reduced 25%) for balanced proximity feedback.
    - **FAR (Light)**: Calibrated to **1.5px** (reduced 25%) for subtle misalignment alerts.
- **High-Fidelity Implementation**: Hardware-accelerated transitions ensures a smooth and impact-heavy resolution phase without performance degradation.

### 2.42 Critical Hit Visual Feedback (Purple Impact)
- **High-Impact Indicators**: Decided to use a distinct **neon purple** (`--neon-pink`) color palette for critical damage numbers to differentiate them from standard tactical damage.
- **Sub-label Integration**: Added a "CRITICAL HIT" sub-label using `::after` pseudo-elements on critical damage numbers for immediate tactical recognition.
- **Whole Screen Shake**: Implemented a powerful `screen-shake` animation applied to the main game container on critical impact, providing a heavy visceral feel to high-damage turns.
- **Dynamic Triggering**: The visual system is now fully integrated with the `isCrit` logic in the combat engine, ensuring a perfect sync between math and aesthetics.

### 2.43 Reactive Defense System (Tactical Counters)
- **Phase-Specific Movesets**: Implemented dynamic moveset swapping. When the turn switches to the enemy, the player's command zone automatically updates with **Defense Skills**.
- **Defense-Side MAP Overrides**:
    - **Thermo Shell**: Forces a **NEAR** (Reliable) result on enemy attacks, mitigating damage regardless of proximity.
    - **Magma Chitin**: Forces a **FAR** (Puny) result on enemy attacks, minimizing damage.
- **Reactive Defense System**:
    - Nitrophil can now swap to defensive skills: `Quick Dodge`, `Thermo Shell`, and `Magma Chitin`.
    - `Thermo Shell`: Forces [NEAR] result, 20% reflection.
    - `Magma Chitin`: Forces [FAR] result, 20% reflection.
    - Added phase-coded UI (Neon Green) and reflection damage VFX.
- **Damage Reflection Engine**: Integrated reactive counters. Skills like Thermo Shell and Magma Chitin now return **20%** of the received damage back to the attacker's HP.
- **Visual Counter-Feedback**: Added **neon yellow** damage numbers and independent hit animations to represent reflection damage during the combat resolution phase.

### 2.44 Global Color Scheme Recalibration
- **Problem**: Tactical feedback was using disjointed colors (e.g., Match was Red, but Far was White) and generic variable names like `--neon-blue`.
- **Pure Semantic CSS**: Refactored the entire color system to use semantic variables: `--color-match`, `--color-player`, `--color-attack`, etc.
- **Outcome Standardization**: Unified the tactical results as **Red (Match)**, **Yellow (Near)**, and **Green (Far)**. This mapping is now mirrored in the rulebook, node flashes, and combat label bursts.
- **Affiliation Coding**: Enforced a strict **Cyan (Player)** vs **Magenta (Enemy)** affiliation glow for all vitals, portraits, and UI panels.

### 2.45 Cell Container: Team Loadout & CellDex
- **Multi-Screen Navigation**: Implemented the "Cell Container" screen as a dedicated team management hub.
- **Drag-and-Drop Interaction**: Built a native JS drag-and-drop system for the team slots. Releasing a CellDex icon over a slot instantly persists the choice in `gameState.playerTeam`.
- **Inspection Modal**: Added a high-fidelity modal that renders `Card_{Name}.png` assets upon clicking icons. Designed with a custom `modal-appear` spring animation for tactile feel.

### 2.46 Team Leader Deployment
- **Dynamic Initialization**: Updated the `resetGame()` sequence to automatically identify the monster in `playerTeam[0]` as the active combatant.
- **Stats Synchronization**: The system now deep-clones the leader's stats (HP, PP, Moveset) into the active player state, ensuring the correct tactical profile is loaded into the arena.
- **UI Refresh**: Portraits and names in the battle arena are now dynamically pulled from the deployed monster's assets during the `updateUI` pass.
### 2.47 System Integrity Check (Audit & Hardening)
- **PP limit Unification**: Resolved a discrepancy between monster data and the rulebook. All monsters are now capped at **10 PP**, synchronized with the "Overload Recall" penalty threshold.
- **Architectural Cleanup**: Purged legacy JavaScript listeners and redundant CSS associated with the old modal-style monster card.
- **Persistence Verification**: Confirmed that the new sidebar remains stable and persistent across all user interaction paths.

### 2.48 Energetic Float Synchronization
- **Turn-Based Initiative**: Refined combat animations so only the active attacker floats. This provides a clear, visceral indicator of whose turn it is to strike.
- **High-Intensity Motion**: Increased the float amplitude to **25px** (from 10px) and frequency to **1.5s** (from 4s).
- **Charged Visuals**: Added a rhythmic scale and brightness pulse to the float keyframes, making the active monster feel "energized" and ready for resolution.

### 2.49 Animation Layering & Aesthetic Refinement
- **DOM Layering**: Introduced `.monster-float-layer` to decouple floating motion from interaction pulses. This fixes the bug where clicking a monster would stop its floating animation.
- **Subtle & Quick Motion**: Recalibrated the energetic float to a **1.0s** cycle with a **12px** amplitude. This provides a snappier, more professional "ready-state" without excessive screen movement.
- **Property Decoupling**: Floating now uses `transform` on the layer, while pulses/lunges use `transform` on the portrait image and container respectively, ensuring property conflicts are architecturally impossible.

### 2.50 Nitrophil Narrative Enrichment (Final User Version)
- **User Tone Alignment**: Updated the lore to the exact sentence requested: "A mutated neutrophil immune cell with explosive properties. It maybe has too much fun throwing its burst pods everywhere."
- **Story Consolidation**: Finalized the hyper-playful "Burst Pod" persona as the official laboratory record.
- **Data Synchronization**: Verified that both the user-facing `monster_dex.md` and the internal `monsters.js` are in perfect sync.
### 2.51 3D Card Flip System Implementation
- **True 3D Architecture**: Refactored the monster card sidebar with a `.card-inner` container and dual faces (`.card-front`, `.card-back`), leveraging `preserve-3d`.
- **180-Degree Reveal**: Implemented a physical 180-degree flip animation to reveal the monster from the laboratory's "Card Back" state.
- **Monster Expansion Pack (v1.2)**: Fully integrated `Cambihil` (Cell01) and `Lydrosome` (Cell02) with specialized mechanics.
- **Tactical Logic Enrichment**: Implemented `Overgrowth` (Match Expand), `Hydro Shot` (High Risk), and `Cellulose Wall/Ion Veil` (Official MAP Suite) to expand strategic variety.
- **Cell Container Optimization**: Resolved a critical interaction bug where slot images blocked drag-and-drop events. Implemented `pointer-events: auto` and moved the draggable target to the entire `.slot` container for 100% reliable grabbing.
- **Bi-Directional Drag-and-Drop**: Completed the DND cycle by allowing monsters to be dragged **out of the team slots** and back to the collection grid, effectively removing them from the active roster.
### 2.52 Locked Node Visual Overhaul
- **Professional Iconography**: Replaced the placeholder `??` text for disabled nodes (Burned/Jammed) with a high-fidelity `padlock.png` asset.
- **Tactical Scaling**: Calibrated the padlock icon to **150%** of the node's dimensions, creating a massive, unavoidable visual signal that overflows the diagnostic grid.
- **Semantic Rendering**: Paired the icon with a red `drop-shadow` glow to maintain the "Hazardous" data aesthetic while improving immediate scannability of the tactical arena.
