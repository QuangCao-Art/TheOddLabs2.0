# Map Builder Guide: Lab_TileSet_01

This document serves as the official reference for building levels using the `Lab_TileSet_01` and `Lab_TileSet_02` assets.

## 1. Tileset Specifications
- **Assets Name**: `Lab_TileSet_01.png` (Terrain), `Lab_TileSet_02.png` (Furniture / Props)
- **Tile Size**: 64x64 pixels (standard)
- **Format**: PNG with Transparency

---

## 2. Official Map Key (v2.0)

| Tile ID | Description | X Position | Y Position |
| :--- | :--- | :--- | :--- |
| **0** | Corners-Top-Left | 0 | 0 |
| **1** | Corners-Top-Right | 128 | 0 |
| **2** | Corners-Bottom-Left | 0 | 128 |
| **3** | Corners-Bottom-Right | 128 | 128 |
| **4** | Corners-Inner-Top-Left | 192 | 0 |
| **5** | Corners-Inner-Top-Right | 256 | 0 |
| **6** | Corners-Inner-Bottom-Left | 192 | 64 |
| **7** | Corners-Inner-Bottom-Right | 256 | 64 |
| **8** | WallEdge-Top | 64 | 0 |
| **9** | WallEdge-Bottom | 64 | 128 |
| **10** | Wall-Left-Side (Standard Side Wall) | 0 | 64 |
| **11** | Wall-Right-Side (Standard Side Wall) | 128 | 64 |
| **12** | EmptyFill | 64 | 64 |
| **13** | Floor-Basic | 64 | 320 |
| **14** | Wall-Center-Top (Top Tier) | 64 | 192 |
| **15** | Wall-Center-Bottom (Bottom Tier) | 64 | 256 |
| **16** | Wall-Left-Top | 0 | 192 |
| **17** | Wall-Left-Bottom | 0 | 256 |
| **18** | Wall-Right-Top | 128 | 192 |
| **19** | Wall-Right-Bottom | 128 | 256 |
| **20** | Door-Edge-Bottom-Close | 192 | 128 |
| **21** | Door-Edge-Bottom-Open | 256 | 128 |
| **22** | Door-Basic-Close | 192 | 192 |
| **23** | Door-Basic-Open | 256 | 192 |
| **24** | Door-Edge-Left-Close | 320 | 64 |
| **25** | Door-Edge-Right-Close | 384 | 64 |
| **26** | Door-Edge-Left-Open | 320 | 128 |
| **27** | Door-Edge-Right-Open | 384 | 128 |
| **28** | Door-Basic-Locked | 192 | 256 |
| **29** | Door-Edge-Bottom-Locked | 256 | 256 |
| **30** | Door-Edge-Left-Locked | 320 | 256 |
| **31** | Door-Edge-Right-Locked | 384 | 256 |

---

## Furniture Tileset (Lab_TileSet_02)
Used for atmospheric decoration via the `objects` system. Props follow the class convention `.world-object.prop.[propName]`.

| Furniture ID | Description | Dimension | X Position | Y Position | Have Collision | Info |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **F0** | ChairA-Left | 1x1 | 0px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **F1** | ChairA-Right | 1x1 | 64px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **F2** | ChairA-Front | 1x1 | 128px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **F3** | TableA | 1x1 | 192px | 0px | Yes | Stained with coffee, acid, and the tears of failed hypotheses. Mostly coffee. |
| **F4** | TableB-Left | 1x1 | 256px | 0px | Yes | So sturdy it once survived a localized gravity collapse. The equipment on it didn't. |
| **F5** | TableB-Right | 1x1 | 320px | 0px | Yes | So sturdy it once survived a localized gravity collapse. The equipment on it didn't. |
| **F6** | WallHangingA | 1x1 | 384px | 0px | No | A poster of Mitosis. Someone drew tiny screaming faces on the dividing cells. |
| **F7** | TableComputerA | 1x1 | 0px | 64px | Yes | Whirrs loudly and smells faintly of burnt toast. Please don't check its browser history. |
| **F8** | TableLabCylindersA | 1x1 | 64px | 64px | Yes | Do not shake. Do not stir. In fact, just don't even look at it too hard. |
| **F9** | TableDeviceA | 1x1 | 128px | 64px | Yes | A protein sequencer that occasionally plays elevator music when it's bored. |
| **F10** | TableC-Top | 1x1 | 192px | 64px | No | A table usually surrounded by people arguing about whose lunch is missing from the fridge. |
| **F12** | TableC-Bottom | 1x1 | 192px | 128px | Yes | A table usually surrounded by people arguing about whose lunch is missing from the fridge. |
| **F13** | LabTankA-Top | 1x1 | 0px | 128px | No | This specimen waves back if you tap the glass. Rules say: DON'T WAVE BACK. |
| **F14** | LabTankA-Bottom | 1x1 | 0px | 192px | Yes | This specimen waves back if you tap the glass. Rules say: DON'T WAVE BACK. |
| **F15** | LabTankB-Top | 1x1 | 64px | 128px | No | Frozen solid. The label says 'DO NOT THAW UNTIL 2099'. It's vibrating slightly. |
| **F16** | LabTankB-Bottom | 1x1 | 64px | 192px | Yes | Frozen solid. The label says 'DO NOT THAW UNTIL 2099'. It's vibrating slightly. |
| **F17** | WallHangingB | 1x1 | 448px | 0px | No | 'DAYS SINCE ACCIDENTAL MUTATION: 0'. Someone just crossed out the '1'. |
| **F18** | PotPlantA-Top | 1x1 | 384px | 64px | No | Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship. |
| **F19** | PotPlantA-Bottom | 1x1 | 384px | 128px | Yes | Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship. |
| **F20** | PotPlantB-Top | 1x1 | 448px | 64px | No | Looks like a plant, smells like old gym socks. Science still isn't sure why. |
| **F21** | PotPlantB-Bottom | 1x1 | 448px | 128px | Yes | Looks like a plant, smells like old gym socks. Science still isn't sure why. |
| **F22** | LabTankC-Top | 1x1 | 128px | 128px | No | Filled with a fluid so blue it technically shouldn't exist in this dimension. |
| **F23** | LabTankC-Bottom | 1x1 | 128px | 192px | Yes | Filled with a fluid so blue it technically shouldn't exist in this dimension. |
| **F24** | PotPlantC-Top | 1x1 | 448px | 192px | No | The leaves are glowing. It might be happy, or it might be preparing for ignition. |
| **F25** | PotPlantC-Bottom | 1x1 | 448px | 256px | Yes | The leaves are glowing. It might be happy, or it might be preparing for ignition. |
| **F26** | TableD-Left | 1x1 | 256px | 64px | Yes | Reserved for 'The Important People'. Includes a built-in panic button. |
| **F27** | TableD-Right | 1x1 | 320px | 64px | Yes | Reserved for 'The Important People'. Includes a built-in panic button. |
| **F28** | TableLeaderA-Left | 1x1 | 256px | 128px | Yes | Features a secret drawer for hiding snacks from the interns. |
| **F29** | TableLeaderA-Right | 1x1 | 320px | 128px | Yes | Features a secret drawer for hiding snacks from the interns. |
| **F30** | TableDirectorA-Left | 1x1 | 256px | 192px | Yes | Carved from obsidian glass. Legend says the Director actually sleeps under it. |
| **F31** | TableDirectorA-Right | 1x1 | 320px | 192px | Yes | Carved from obsidian glass. Legend says the Director actually sleeps under it. |
| **F32** | BedA-Left | 1x1 | 256px | 256px | Yes | A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days. |
| **F33** | BedA-Right | 1x1 | 320px | 256px | Yes | A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days. |
| **F34** | SkeletonA-Top | 1x1 | 384px | 192px | No | A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised. |
| **F35** | SkeletonA-Bottom | 1x1 | 384px | 256px | Yes | A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised. |
| **F36** | TableNoodleA | 1x1 | 256px | 320px | Yes | Instant noodles. The true fuel of all scientific breakthroughs and 3 AM crying sessions. |
| **F37** | EmptyNoodleBowlA | 1x1 | 320px | 320px | Yes | An empty bowl. The salt levels within are high enough to preserve a whole lab tech. |
| **F38** | IncubatorA-TopLeft | 1x1 | 0px | 256px | No | A standard-issue Cell synthesis machine. Humms with the potential of new life. |
| **F39** | IncubatorA-TopRight | 1x1 | 64px | 256px | No | A standard-issue Cell synthesis machine. Humms with the potential of new life. |
| **F40** | IncubatorA-BottomLeft | 1x1 | 0px | 320px | Yes | A standard-issue Cell synthesis machine. Humms with the potential of new life. |
| **F41** | IncubatorA-BottomRight | 1x1 | 64px | 320px | Yes | A standard-issue Cell synthesis machine. Humms with the potential of new life. |
| **F42** | MegaIncubatorA-TopLeft | 1x1 | 128px | 256px | No | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F43** | MegaIncubatorA-TopRight | 1x1 | 192px | 256px | No | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F44** | MegaIncubatorA-MidLeft | 1x1 | 128px | 320px | Yes | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F45** | MegaIncubatorA-MidRight | 1x1 | 192px | 320px | Yes | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F46** | MegaIncubatorA-BottomLeft | 1x1 | 128px | 384px | Yes | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F47** | MegaIncubatorA-BottomRight | 1x1 | 192px | 384px | Yes | The 'Genesis Machine'. The first ever Cell was synthesized within this very chamber. |
| **F48** | BoxHandA | 1x1 | 192px | 192px | Yes | Labeled: 'DO NOT SHAKE'. |
| **F49** | KeyItem-DataPad | 1x1 | 320px | 448px | Yes | Mostly contains encrypted logs, but some files are just high-score records for 'Snake'. |
| **F50** | KeyItem-RoomKey | 1x1 | 384px | 448px | Yes | A magnetic keycard. Smells like the Director's expensive cologne. |
| **F51** | KeyItem-SauceBottle | 1x1 | 448px | 448px | Yes | Label: 'SUPERNOVA SAUCE'. Scoville rating: YES. Lab-certified to burn through metal. |
| **F52** | BigCabinet-TopLeft | 1x1 | 384px | 320px | No | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **F53** | BigCabinet-TopRight | 1x1 | 448px | 320px | No | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **F54** | BigCabinet-BottomLeft | 1x1 | 384px | 384px | Yes | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **F55** | BigCabinet-BottomRight | 1x1 | 448px | 384px | Yes | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |

---

## 3. Implementation Logic (Collisions)
- **Solid (Walls)**: 0-11, 14-20, 22, 24-25, 28-31.
- **Walkable (Floor)**: 13, 21, 23, 26, 27.
- **Transitional (Doors)**: 20-27.

## 4. Building 2-Tile High Walls
To build a wall that spans two tiles high, use the Top and Bottom segments in vertical pairs:
```javascript
// Example vertical segment
[14], // Wall-Middle-Top
[15]  // Wall-Middle-Bottom
```
