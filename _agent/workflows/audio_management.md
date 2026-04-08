---
description: Manage and Add SFX to the Dynamic Audio Engine
---

### 🎧 The "Convention-Over-Configuration" System
The laboratory uses a **Layered Audio System**. As long as files are named correctly in the `assets/audio/` folder, the engine will automatically load and layer them.

### 1. Naming Convention
Place your `.mp3` files in `assets/audio/` using the following exact names:

| Interaction | Required Filename | Description |
| :--- | :--- | :--- |
| **Base Impact** | `impact_base.mp3` | The core "Thud" played for EVERY kick. |
| **Wood** | `impact_wood.mp3` | Secondary layer for wooden crates or desks. |
| **Glass** | `impact_glass.mp3` | High-pitched layer for tanks and tech. |
| **Liquid** | `impact_liquid.mp3` | Splash layer for speciment tanks. |
| **Monsters** | `impact_monster.mp3` | Fleshy squish layer for **Wild Cells** (Auto-assigned). |
| **Homerun** | `kick_homerun.mp3` | Explosive launch and woosh sound. |
| **Shatter** | `shatter_tank.mp3` | The heavy crash for broken tanks. |

### 2. Music (BGM) Convention
Background music loops automatically and cross-fades during screen transitions.

| Screen | Required Filename | Description |
| :--- | :--- | :--- |
| **Main Menu** | `music_main_menu.mp3` | Played on the title screen. |
| **Overworld** | `music_overworld.mp3` | Played while exploring the lab. |
| **Battle** | `music_battle.mp3` | Tactical battle theme. |

### 3. Implementation Rules
1.  **Defaults**: If a furniture item has NO material tag, it will only play `impact_base.mp3`.
2.  **Fallback**: If you define a material (e.g., `glass`) but haven't provided the file yet, the engine will safely skip that layer without crashing.
3.  **Monsters**: Any object with `type: 'npc'` automatically plays the `monster` layer.

### 3. Assigning Materials to Furniture
To give a specific object a unique sound, add the `material` tag in `overworld.js` -> `furnitureMetadata`:

```javascript
'f118': { 
    hasCollision: true, 
    material: 'glass' // Options: wood | glass | metal | liquid | monster
}
```

### 4. Multi-Layering (Advanced)
You can assign multiple materials by providing an array:
```javascript
'f118': { 
    material: ['glass', 'liquid'] // Plays Base + Glass + Liquid layers simultaneously
}
```

---

### ✅ Success Criteria
- [ ] New sound file is placed in `assets/audio/` with the correct name.
- [ ] The console log confirms the sound is loaded and playing upon interaction.
- [ ] Pitch is randomized (sounds slightly different on every hit).
