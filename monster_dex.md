# Monster Dex: The Odd Labs Encyclopedia 🧬🎞️

This document tracks the cellular entities discovered within The Odd Labs.

## 1. Monster Profiles

### 🧪 Nitrophil (Cell03)
| Property | Value |
| :--- | :--- |
| **Archetype** | LYTIC (Offense Focus) |
| **Type** | THERMOGENIC |
| **Stats** | 100 HP / 15 ATK / 10 DEF / 10 MAX PP / 12 SPD / 5% CRIT |
| **Lore** | A mutated neutrophil immune cell with explosive properties. It maybe has too much fun throwing its burst pods everywhere. |
| **Skills** | **• Membrane Pierce** [**SOMATIC**]: Basic enzymatic strike (Power 40).<br>**• Oxidative Purge** [**THERMOGENIC**]: Mid-range pressure (Power 55, 3 PP).<br>**• Nitric Burst** [**THERMOGENIC**]: Tactical explosion (Power 65, 6 PP). [**EASY TARGET**]: Wide blast area; adjacent nodes still count as a perfect MATCH (1.25x DMG). |
| **Defense** | **• Thermo Dodge** [**THERMOGENIC**]: Standard evasion (0 PP).<br>**• Thermo Shell** [**THERMOGENIC**]: Heat buffer; forces [**RELIABLE HIT**] and reflects 20% damage (2 PP).<br>**• Magma Chitin** [**THERMOGENIC**]: Volcanic hardening; forces [**PUNY SLAP**] and reflects 20% damage (4 PP). |

### 🦠 Stemmy (Cell00)
| Property | Value |
| :--- | :--- |
| **Archetype** | BASE_CELL (Playable) |
| **Type** | SOMATIC |
| **Stats** | 100 HP / 15 ATK / 10 DEF / 10 MAX PP / 12 SPD / 5% CRIT |
| **Lore** | An undifferentiated stem cell brimming with potential. While it lacks specialized organelles, its raw adaptable cytoplasm allows it to mimic more advanced functions. It is the blank slate from which all cellular life emerges. |
| **Skills** | **• Cell Bump** [**SOMATIC**]: Clumsy unspecialized bump (Power 40).<br>**• Mitosis Slap** [**SOMATIC**]: Divides to slap twice (Power 55, 3 PP). [**RELIABLE HIT**]: Forces a NEAR result.<br>**• Potency Surge** [**SOMATIC**]: Raw undifferentiated energy (Power 60, 5 PP). [**RELIABLE HIT**]: Cytoplasmic stabilization forces a NEAR result. |
| **Defense** | **• Wobble** [**SOMATIC**]: A pathetic wobble evasion (0 PP).<br>**• Cytoplasmic Wall** [**SOMATIC**]: Jelly-like shield (2 PP). [**RELIABLE HIT**]: Forces a NEAR result on enemy attacks.<br>**• Apopto-Shield** [**SOMATIC**]: Sacrificial layer (4 PP). [**RELIABLE HIT**]: Forces a NEAR result on enemy attacks. |

---v

### 🍀 Cambihil (Cell01)
| Property | Value |
| :--- | :--- |
| **Archetype** | SOMATIC (Tank / Regenerator) |
| **Type** | BOTANIC |
| **Stats** | 110 HP / 12 ATK / 13 DEF / 11 MAX PP / 10 SPD / 4% CRIT |
| **Lore** | A resilient entity derived from specialized plant cambium tissue. Its dense cellulose shielding and rapid regenerative capacity make it a formidable tank in the cellular arena. |
| **Skills** | **• Chloro-Strike** [**SOMATIC**]: Basic botanical strike (Power 45).<br>**• Cambium Root** [**BOTANIC**]: Siphons life force; [**HEAL**] restored 10% HP (Power 50, 3 PP).<br>**• Overgrowth** [**BOTANIC**]: AoE vines; [**EASY TARGET**] results better than FAR count as MATCH (Power 70, 4 PP). |
| **Defense** | **• Bota Dodge** [**BOTANIC**]: Standard evasion (0 PP).<br>**• Cellulose Wall** [**BOTANIC**]: Rigid plate; forces [**NEAR**] hit and [**HEAL**] restores 15% HP (3 PP).<br>**• Phloem Snare** [**BOTANIC**]: Sticky sap trap; forces [**NEAR**] result and triggers [**HURTBLOCK**] disabling nodes for both players (4 PP). |

---

### 💧 Lydrosome (Cell02)
| Property | Value |
| :--- | :--- |
| **Archetype** | TACTICIAN (Sniper / Glass Cannon) |
| **Type** | OSMOTIC |
| **Stats** | 95 HP / 17 ATK / 8 DEF / 9 MAX PP / 14 SPD / 6% CRIT |
| **Lore** | A high-enzyme lysosome modified for long-range secretion. It uses chemical lances to dissolve enemy membranes from a safe tactical distance. |
| **Skills** | **• Enzyme Lance** [**SOMATIC**]: Basic enzymatic jet (Power 40).<br>**• Osmotic Surge** [**OSMOTIC**]: Pressure burst; [**CHOICEBLOCK**] locks movement options (Power 65, 4 PP).<br>**• Hydro Shot** [**OSMOTIC**]: Osmotic blast (Power 85, 6 PP). [**ALL OR NOTHING**]: Devastating damage at Node 0 (MATCH), but accuracy falls off sharply at range. |
| **Defense** | **• Osmo Dodge** [**OSMOTIC**]: Standard evasion (0 PP).<br>**• Ion Veil** [**OSMOTIC**]: Repulsive field; forces [**PUNY SLAP**] result to stay away from predators (2 PP).<br>**• Osmotic Snare** [**OSMOTIC**]: Suspended field; [**HURTBLOCK**] disables nodes for both (4 PP). |

## 2. Damage Engine 2.0 (Pokemon-Inspired)
| Component | Logic |
| :--- | :--- |
| **Scaling** | x 0.5 Move Power + 2 |
| **Modifiers** | Type (1.5x / 0.75x), Crit (1.5x), MAP (1.25x / 1.0x / 0.75x) |
| **Shielding** | Final damage reduced by (Defender PP * 3) |
| **Mitigation** | PP acts as a flat shield. Every 1 PP blocks 3 incoming HP damage. |
| **Floor** | Minimum 1 HP Damage guaranteed. |

---

> [!NOTE]
> All monsters start with **1 Pellicle (PP)** to ensure strategic resource management from the first turn.
