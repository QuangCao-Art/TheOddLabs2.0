# Research Grade (RG) System & Leader Chips

## RG Reward Table

| RG | Chip(s) Received | Primary Stat | Tier |
|:---|:---|:---|:---|
| 1 | 2x Muscle Fiber Overdrive (+5) | Attack | 1 (S+0) |
| 2 | 2x Dermal Hardening (+5) | Defense | 1 (S+0) |
| 3 | 1x Synaptic Rewiring (+5), 1x Vascular Expansion (+10) | Spd/HP | 1 (S+0) |
| 4 | 1x Weak-Point Analysis (2%) [S+1], 1x ATP Enrichment (1) | Crit/PP | 2/1 |
| 5 | 1x ATP Enrichment (2) [S+1], **Lead: The Second Brain** | PP/Lead | 2/L |
| 6 | 2x Muscle Fiber Overdrive (+10), 1x Weak-Point Analysis (1%) | Attack/Crit | 1 (S+0) |
| 7 | 1x Conductive Nerve Gel (+10) [S+1], 1x Spare Cytoplasm (+20) | Speed/HP | 2/1 |
| 8 | 1x Organismal Cushion (+30) [S+1], 1x Conductive Slime Coating (+15) | HP/Speed | 2/1 |
| 9 | 1x Carbon-Latice Claws (+20) [S+2], 1x Weak-Point Analysis (3%) [S+2] | Atk/Crit | 3/3 |
| 10 | 1x Bio-Ceramic Plating (+20) [S+2], **Lead: The Third Brain** | Def/Lead | 3/L |
| 11 | 1x ATK MAX (+40), 1x DEF MAX (+40), 1x HP MAX (+60) | Multi | 1 (S+0) |
| 12 | 1x ATP Enrichment (3) [S+2] | PP | 3 (S+2) |
| 13 | 1x Vascular Expansion (+30) [S+2], 1x Synaptic Processor (+15) [S+2]| HP/Spd | 3/3 |
| 14 | 1x Weak-Point Analysis (3%) [S+2] | Crit | 3 (S+2) |
| 15 | 1x ATP Enrichment (3) [S+2], **Lead: Oxidative Energy Burst** | PP/Lead | 3/L |
| 16 | 1x Weak-Point Analysis MAX (5%), 1x ATP Enrichment MAX (5) | Crit/PP | 1/1 |
| 17 | 1x Carbon-Latice Claws (+20) [S+2], 1x Bio-Ceramic Plating (+20) [S+2]| Atk/Def | 3/3 |
| 18 | 1x Organismal Cushion (+30) [S+1], 1x Synaptic Rewiring MAX (+20) | HP/Spd | 2/1 |
| 19 | 1x Muscle Fiber Overdrive MAX (+40), 1x Dermal Hardening MAX (+40) | Atk/Def | 1/1 |
| 20 | **Lead: Molecular Dissolver** | Lead | L |

## Leader Chip Effects

Leader chips are **Passive**. Having them in the `chipBox` unlocks specific tactical advantages.

| Leader | Type | Effect |
|:---|:---|:---|
| **The Second Brain** | **Passive** (Box) | Unlocks 1st Pellicle Attack/Defense skills (Index 1). |
| **The Third Brain** | **Passive** (Box) | Unlocks 2nd Pellicle Attack/Defense skills (Index 2). |
| **Oxidative Energy Burst** | **Equipped** (Slot) | **Overload Alpha**: First hit of the battle deals x2 Damage. |
| **Neural Initiative** | **Equipped** (Slot) | **Initiative Zero**: Always go first regardless of Speed. |
| **Molecular Dissolver** | **Equipped** (Slot) | **Hyper-Enzyme**: Damage ignores opponent Defense. |

> [!NOTE]
> All cards are now grouped into 3 Standard Tiers:
> - **Tier 1**: Slot +0 (Stats: 1-4 Rarity Levels. Crit/PP: 1, 2, 3, 5).
> - **Tier 2**: Slot +1 (Crit 2% / PP +2).
> - **Tier 3**: Slot +2 (Crit 3% / PP +3).

## EXP & Progression Scaling

### EXP Requirements per RG Level
The total EXP required to reach the next RG level follows a power curve:
**Total EXP Required = Sum(floor(30 * (RG + 1)^1.5))**

| RG | EXP to Next | Total EXP |
|:---|:---|:---|
| 0 | 30 | 0 |
| 1 | 84 | 30 |
| 2 | 155 | 114 |
| 3 | 240 | 269 |
| 4 | 335 | 509 |

### Wild Encounter Rewards
Rewards scale dynamically based on the current player RG level and a monster-specific variety multiplier:
**Reward = round(10 * (1.0 + (PlayerRG * 0.5)) * Multiplier)**

| Monster | Multiplier | Base Reward (RG 0) |
|:---|:---|:---|
| **Stemmy** | 1.0x | 10 EXP |
| **Nitrophil** | 1.15x | 12 EXP |
| **Cambihil** | 1.25x | 13 EXP |
| **Lydrosome** | 1.1x | 11 EXP |

### Fixed Rewards
- **NPC / Training**: 50 EXP
- **Sector Bosses**: 250 EXP

🧠 Tactical Skill Unlocking
I've clarified the Leader Brain descriptions to ensure the mapping is clear:

The Second Brain: Unlocks the 1st Pellicle slot (the 2nd move in your list).
The Third Brain: Unlocks the 2nd Pellicle slot (the 3rd move in your list).
The basic 1st move is always ready for combat.