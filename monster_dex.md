# Monster Dex: The Odd Labs Encyclopedia 🧬🎞️

This document tracks the cellular entities discovered within The Odd Labs.

## 1. Monster Profiles

### 🧪 Nitrophil (Cell03)
| Property | Value |
| :--- | :--- |
| **Archetype** | LYTIC (Offense Focus) |
| **Type** | THERMOGENIC |
| **Stats** | 100 HP / 14 ATK / 10 DEF / 10% CRIT |
| **Lore** | A mutated neutrophil immune cell with explosive properties. It maybe has too much fun throwing its burst pods everywhere. |
| **Tactics** | High damage output but fragile. Use **"Nitric Burst"** (**EASY TARGET**) to guarantee high-damage hits even with imperfect movement predictions.
| **Skills** | **• Membrane Pierce**: Basic enzymatic strike (Power 40).<br>**• Oxidative Purge**: Mid-range pressure (Power 55, 3 PP).<br>**• Nitric Burst**: Tactical explosion (Power 60, 6 PP). [**EASY TARGET**]: Wide blast area; adjacent nodes still count as a perfect MATCH (1.25x DMG). |
| **Defense** | **• Quick Dodge**: Standard evasion (0 PP).<br>**• Thermo Shell**: Heat buffer; forces [**NEAR**] hit and reflects 20% damage (2 PP).<br>**• Magma Chitin**: Volcanic hardening; forces [**FAR**] hit and reflects 20% damage (4 PP). |

---

### 002. CAMBIHIL 🍀
**Type**: BOTANIC | **Archetype**: SOMATIC
**Stats**: HP 120 | ATK 10 | DEF 15 | CRIT 5%

*Lore*: A resilient entity derived from specialized plant cambium tissue. Its dense cellulose shielding and rapid regenerative capacity make it a formidable tank in the cellular arena.

**Tactical Protocol**:
1. **Siphon Energy**: Use `Cambium Root` to maintain HP while building PP.
2. **Defensive Entanglement**: Deploy `Phloem Snare` to force the enemy into **NEAR** results that trigger the **HURTBLOCK** concussion system.
3. **Overwhelming Growth**: Execute `Overgrowth` to ensure hits even against highly mobile targets.

**Biological Arsenal**:
- `Chloro-Strike`: Basic enzymatic strike.
- `Cambium Root` (Cost 3): Siphons life to **heal 10% HP**.
- `Overgrowth` (Cost 4): Massive AoE with **MATCH EXPAND**.
- `Cellulose Wall` (Def): Rigid buffer that **heals 15% HP**.
- `Phloem Snare` (Def): Sticky trap that triggers **HURTBLOCK**, disabling the current nodes for both players in the next turn.

---

### 💧 Lydrosome (Cell02)
| Property | Value |
| :--- | :--- |
| **Archetype** | TACTICIAN (Sniper / Glass Cannon) |
| **Type** | OSMOTIC |
| **Stats** | 85 HP / 18 ATK / 8 DEF / 20% CRIT |
| **Lore** | A high-enzyme lysosome modified for long-range secretion. It uses chemical lances to dissolve enemy membranes from a safe tactical distance. |
| **Tactics** | Extreme glass-cannon. Use "Hydro Shot" (**HIGH RISK**) for massive burst damage if you can predict a point-blank encounter, and "Ion Veil" to stay at distance. |
| **Skills** | **• Enzyme Lance**: Basic enzymatic jet (Power 40).<br>**• Hydro Shot**: Osmotic blast (Power 85, 6 PP). [**HIGH RISK**]: Devastating damage at Node 0 (MATCH), but power falls off sharply at range. |
| **Defense** | **• Quick Dodge**: Standard evasion (0 PP).<br>**• Ion Veil**: Repulsive field; forces [**FAR**] result to stay away from predators (2 PP). |

## 2. Damage Engine 2.0 (Pokemon-Inspired)
| Component | Logic |
| :--- | :--- |
| **Core Ratio** | (Attacker ATK / Defender DEF) |
| **Scaling** | x 0.5 Move Power + 2 |
| **Modifiers** | Type (1.5x / 0.75x), Crit (1.5x), MAP (1.25x / 1.0x / 0.75x) |
| **Shielding** | Final damage reduced by (Defender PP * 3) |
| **Floor** | Minimum 1 HP Damage guaranteed. |

---

> [!NOTE]
> All monsters start with **1 Pellicle (PP)** to ensure strategic resource management from the first turn.
