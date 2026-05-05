# Map Builder Guide: Lab_TileSet_01

This document serves as the official reference for building levels using the `Lab_TileSet_01` and `Lab_TileSet_02` assets.

## 1. Tileset Specifications
- **Assets Name**: `Lab_TileSet_01.png` (Terrain), `Lab_TileSet_02.png` (Furniture / Props), `Lab_TileSet_Cells.png` (Encounter Cells) (2048px Standard)
- **Logical Tile Size**: 256x256 pixels (Mapped via 1/4 scale: `calc(-Xpx / 4)`)
- **Format**: PNG with Transparency
---
- **Important note**: Whenever receive a add more furniture or update furniture request, always check the overworld.js and style.css to make sure the furniture is added to the game correctly. 
---

## Room Tileset (Lab_TileSet_01)

| Tile ID | Description | X Position | Y Position |
| :--- | :--- | :--- | :--- |
| **0** | Corners-Top-Left | 0 | 0 |
| **1** | Corners-Top-Right | 512 | 0 |
| **2** | Corners-Bottom-Left | 0 | 512 |
| **3** | Corners-Bottom-Right | 512 | 512 |
| **4** | Corners-Inner-Top-Left | 768 | 0 |
| **5** | Corners-Inner-Top-Right | 1024 | 0 |
| **6** | Corners-Inner-Bottom-Left | 768 | 256 |
| **7** | Corners-Inner-Bottom-Right | 1024 | 256 |
| **8** | WallEdge-Top | 256 | 0 |
| **9** | WallEdge-Bottom | 256 | 512 |
| **10** | Wall-Left-Side (Standard Side Wall) | 0 | 256 |
| **11** | Wall-Right-Side (Standard Side Wall) | 512 | 256 |
| **12** | EmptyFill | 256 | 256 |
| **13** | Floor-Basic | 256 | 1280 |
| **14** | Wall-Center-Top (Top Tier) | 256 | 768 |
| **15** | Wall-Center-Bottom (Bottom Tier) | 256 | 1024 |
| **16** | Wall-Left-Top | 0 | 768 |
| **17** | Wall-Left-Bottom | 0 | 1024 |
| **18** | Wall-Right-Top | 512 | 768 |
| **19** | Wall-Right-Bottom | 512 | 1024 |
| **20** | Door-Edge-Bottom-Close | 768 | 512 |
| **21** | Door-Edge-Bottom-Open | 1024 | 512 |
| **22** | Door-Basic-Close | 768 | 768 |
| **23** | Door-Basic-Open | 1024 | 768 |
| **24** | Door-Edge-Left-Close | 1280 | 256 |
| **25** | Door-Edge-Right-Close | 1536 | 256 |
| **26** | Door-Edge-Left-Open | 1280 | 512 |
| **27** | Door-Edge-Right-Open | 1536 | 512 |
| **28** | Door-Basic-Locked | 768 | 1024 |
| **29** | Door-Edge-Bottom-Locked | 1024 | 1024 |
| **30** | Door-Edge-Left-Locked | 1280 | 1024 |
| **31** | Door-Edge-Right-Locked | 1536 | 1024 |
| **32** | Window-Basic | 1280 | 768 |
| **33** | Window-FullWall | 1536 | 768 |
| **34** | Door-Secret-Open | 768 | 1280 |
| **35** | Door-Edge-Bottom-Secret-Open | 1024 | 1280 |
| **36** | Door-Edge-Right-Secret-Open | 1280 | 1280 |
| **37** | Door-Edge-Left-Secret-Open | 1536 | 1280 |
| **38** | Floor-SideDeco | 0 | 1280 |
| **39** | Hidden-Door-Basic-Closed | 256 | 1024 |
| **40** | Hidden-Door-Bottom-Closed | 256 | 512 |
| **41** | Hidden-Door-Right-Closed | 512 | 256 |
| **42** | Hidden-Door-Left-Closed | 0 | 256 |
| **43** | Window-FullWall-Vary01 | 1792 | 768 |
| **44** | Floor-Basic-Dirty | 512 | 1280 |
| **45** | Floor-Diamond | 0 | 1536 |
| **46** | Floor-Stripe-Vertical | 256 | 1536 |
| **47** | Floor-Stripe-Horizontal | 512 | 1536 |
| **48** | DoorWall-Left-Top | 768 | 1536 |
| **49** | DoorWall-Left-Bottom | 768 | 1792 |
| **50** | DoorWall-Mid-Top | 1024 | 1536 |
| **51** | DoorWall-Right-Top | 1280 | 1536 |
| **52** | DoorWall-Right-Bottom | 1280 | 1792 |
| **53** | Wall-Center-Top-Pipes | 1536 | 1536 |
| **54** | Wall-Center-Top-Pipes | 1536 | 1792 |
| **55** | Wall-Center-Top-Dirty | 1792 | 1536 |
| **56** | Wall-Center-Top-Dirty | 1792 | 1792 |
| **57** | Wall-Center-Top-Nitrophil | 1792 | 0 |
| **58** | Wall-Center-Top-Lydrosome | 1536 | 0 |
| **59** | Wall-Center-Bottom-Cambihil | 1280 | 0 |
| **60** | Wall-Center-Top-ScifiDeco | 1792 | 256 |
| **61** | Wall-Center-Bottom-ScifiDeco | 1792 | 512 |
| **62** | Wall-Center-Top-HeavyDirty | 1792 | 1024 |
| **63** | Wall-Center-Bottom-HeavyDirty | 1792 | 1280 |
| **64** | Floor-WhiteDiamond | 0 | 1792 |
| **65** | Floor-Basic-DirtyVary | 512 | 1792 |
| **66** | Floor-Basic-Crack | 256 | 1792 |

---

## Furniture Tileset (Lab_TileSet_02)
Used for atmospheric decoration via the `objects` system. Props follow the class convention `.world-object.prop.[propName]`.

| Furniture ID | Description | X Position | Y Position | Have Collision | Info |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **f0** | ChairA-Left | 0px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **f1** | ChairA-Right | 256px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **f2** | ChairA-Front | 512px | 0px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **f3** | TableA | 768px | 0px | Yes | Stained with coffee, acid, and the tears of failed hypotheses. Mostly coffee. |
| **f4** | TableB-Left | 1024px | 0px | Yes | So sturdy it once survived a localized gravity collapse. The equipment on it didn't. |
| **f5** | TableB-Right | 1280px | 0px | Yes | So sturdy it once survived a localized gravity collapse. The equipment on it didn't. |
| **f6** | WallHangingA | 1536px | 0px | Yes | A poster showing the evolution of Cells. Sadly, the dev lacked resources to implement these. |
| **f7** | TableComputerA | 0px | 256px | Yes | Whirrs loudly and smells faintly of burnt toast. Please don't check its browser history. |
| **f8** | TableLabCylindersA | 256px | 256px | Yes | Do not shake. Do not stir. In fact, just don't even look at it too hard. |
| **f9** | TableDeviceA | 512px | 256px | Yes | A protein sequencer that occasionally plays elevator music when it's bored. |
| **f11** | TableC-Top | 768px | 256px | Yes | A table usually surrounded by people arguing about whose lunch is missing from the fridge. |
| **f12** | TableC-Bottom | 768px | 512px | Yes | A table usually surrounded by people arguing about whose lunch is missing from the fridge. |
| **f13** | LabTankGreen-Top | 0px | 512px | No | This specimen has only one eye. The label says: DON'T LOOK AT ITS EYE. |
| **f14** | LabTankGreen-Bottom | 0px | 768px | Yes | This specimen has only one eye. The label says: DON'T LOOK AT ITS EYE. |
| **f15** | LabTankBlue-Top | 256px | 512px | No | Why did the cold specimen refuse to talk? Because it had Absolute Zero interest in you. |
| **f16** | LabTankBlue-Bottom | 256px | 768px | Yes | Why did the cold specimen refuse to talk? Because it had Absolute Zero interest in you. |
| **f17** | WallHangingB | 1792px | 0px | Yes | A poster showing three creature races. Or perhaps they aren't simply 'races'... |
| **f18** | PotPlantA-Top | 1536px | 256px | No | Looks like a plant, smells like old gym socks. Science still isn't sure why. |
| **f19** | PotPlantA-Bottom | 1536px | 512px | Yes | Looks like a plant, smells like old gym socks. Science still isn't sure why. |
| **f20** | PotPlantB-Top | 1792px | 256px | No | Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship. |
| **f21** | PotPlantB-Bottom | 1792px | 512px | Yes | Cambihil talks to this fern. Often, the fern whispers back. It's a mutual friendship. |
| **f22** | LabTankRed-Top | 512px | 512px | No | The specimen here is slowly swimming; why are its surroundings turning yellow? |
| **f23** | LabTankRed-Bottom | 512px | 768px | Yes | The specimen here is slowly swimming; why are its surroundings turning yellow? |
| **f24** | PotPlantC-Top | 1792px | 768px | No | The leaves are glowing. It might be happy, or it might be preparing for ignition. |
| **f25** | PotPlantC-Bottom | 1792px | 1024px | Yes | The leaves are glowing. It might be happy, or it might be preparing for ignition. |
| **f26** | TableD-Left | 1024px | 256px | Yes | Reserved for 'The Important People'. Includes a built-in panic button. |
| **f27** | TableD-Right | 1280px | 256px | Yes | Reserved for 'The Important People'. Includes a built-in panic button. |
| **f28** | TableLeaderA-Left | 1024px | 512px | Yes | Features a secret drawer for hiding snacks from the interns. |
| **f29** | TableLeaderA-Right | 1280px | 512px | Yes | Features a secret drawer for hiding snacks from the interns. |
| **f30** | TableDirectorA-Left | 1024px | 768px | Yes | Carved from obsidian glass. Legend says the Director actually sleeps under it. |
| **f31** | TableDirectorA-Right | 1280px | 768px | Yes | Carved from obsidian glass. Legend says the Director actually sleeps under it. |
| **f32** | BedA-Left | 1024px | 1024px | Yes | A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days. |
| **f33** | BedA-Right | 1280px | 1024px | Yes | A medical pod. Warning: Set to 'Deep Sleep', not 'Quick Nap'. See you in three days. |
| **f34** | SkeletonA-Top | 1536px | 768px | No | A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised. |
| **f35** | SkeletonA-Bottom | 1536px | 1024px | Yes | A model skeleton named 'Steve'. Sometimes his jaw falls off when he's surprised. |
| **f36** | TableNoodleA | 1024px | 1280px | Yes | Instant noodles. The true fuel of all scientific breakthroughs and 3 AM crying sessions. |
| **f37** | EmptyNoodleBowlA | 1280px | 1280px | Yes | An empty bowl. The salt levels within are high enough to preserve a whole lab tech. |
| **f38** | IncubatorA-TopLeft | 0px | 1024px | No | A biological maintenance pod. Restores Cell health through concentrated nutrient mists. |
| **f39** | IncubatorA-TopRight | 256px | 1024px | No | A biological maintenance pod. Restores Cell health through concentrated nutrient mists. |
| **f40** | IncubatorA-BottomLeft | 0px | 1280px | Yes | A biological maintenance pod. Restores Cell health through concentrated nutrient mists. |
| **f41** | IncubatorA-BottomRight | 256px | 1280px | Yes | A biological maintenance pod. Restores Cell health through concentrated nutrient mists. |
| **f42** | BioExtractorA-TopLeft | 512px | 1024px | No | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f43** | BioExtractorA-TopRight | 768px | 1024px | No | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f44** | BioExtractorA-MidLeft | 512px | 1280px | Yes | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f45** | BioExtractorA-MidRight | 768px | 1280px | Yes | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f46** | BioExtractorA-BottomLeft | 512px | 1536px | Yes | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f47** | BioExtractorA-BottomRight | 768px | 1536px | Yes | A high-precision industrial centrifuge. Extracts pure biological traces from raw biomass. |
| **f48** | BoxHandA | 768px | 768px | Yes | Labeled: 'DO NOT SHAKE'. |
| **f49** | KeyItem-DataPad | 1280px | 1792px | Yes | Mostly contains encrypted logs, but some files are just high-score records for 'Snake'. |
| **f50** | KeyItem-RoomKey | 1536px | 1792px | Yes | A magnetic keycard. Smells like the Director's expensive cologne. |
| **f51** | KeyItem-SauceBottle | 1792px | 1792px | Yes | Label: 'SUPERNOVA SAUCE'. Scoville rating: YES. Lab-certified to burn through metal. |
| **f52** | Cabinet-Big-TopLeft | 1536px | 1280px | No | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **f53** | Cabinet-Big-TopRight | 1792px | 1280px | No | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **f54** | Cabinet-Big-BottomLeft | 1536px | 1536px | Yes | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **f55** | Cabinet-Big-BottomRight | 1792px | 1536px | Yes | Organized chaos. Opening it risks a landslide of clipboards and broken test tubes. |
| **f56** | TableLeaderB-Top | 1024px | 1536px | Yes | "Why do all the tables have to be this messy?" asked the janitor. |
| **f57** | TableLeaderB-Bottom | 1024px | 1792px | Yes | "Why do all the tables have to be this messy?" asked the janitor. |
| **f58** | Cabinet-Small | 1280px | 1536px | Yes | I can see the little cockroaches crawling out! |
| **f59** | PotPlant-Small | 768px | 1792px | Yes | Looks like a normal plant... or is it? |
| **f60** | Cartonbox-Small | 512px | 1792px | Yes | This box is heavier than it looks. |
| **f61** | Cartonbox-Pile-Top | 256px | 1536px | No | Please don't fall on my head |
| **f62** | Cartonbox-Pile-Bottom | 256px | 1792px | Yes | Please don't fall on my head |
| **f63** | KeyItem-SecretCard | 0px | 1792px | Yes | This is the best ultimate super rare card ever! |

---

## Furniture Tileset (Lab_TileSet_03)
Used for advanced lab equipment and specialized props. Texture asset: `Lab_TileSet_03.png`.

| Furniture ID | Description | X Position | Y Position | Have Collision | Info |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **f64** | KeyItem-OldDataStick | 0px | 0px | Yes | Ancient people used this to store data! |
| **f65** | CryoPod-Left | 256px | 0px | Yes | Whatever is lying here doesn't look exactly human; it'd better be! |
| **f66** | CryoPod-Right | 512px | 0px | Yes | Whatever is lying here doesn't look exactly human; it'd better be! |
| **f67** | VendingMachine-TopLeft | 0px | 256px | No | Selling lots of odd stuff, some of which isn't meant to be eaten! |
| **f68** | VendingMachine-TopRight | 256px | 256px | No | Selling lots of odd stuff, some of which isn't meant to be eaten! |
| **f69** | VendingMachine-BottomLeft | 0px | 512px | Yes | Selling lots of odd stuff, some of which isn't meant to be eaten! |
| **f70** | VendingMachine-BottomRight | 256px | 512px | Yes | Selling lots of odd stuff, some of which isn't meant to be eaten! |
| **f71** | BattleMachine-TopLeft | 512px | 256px | Yes | An official device for Cell battles, though researchers strangely prefer using their lunch tables instead. |
| **f72** | BattleMachine-TopRight | 768px | 256px | Yes | An official device for Cell battles, though researchers strangely prefer using their lunch tables instead. |
| **f73** | BattleMachine-BottomLeft | 512px | 512px | Yes | An official device for Cell battles, though researchers strangely prefer using their lunch tables instead. |
| **f74** | BattleMachine-BottomRight | 768px | 512px | Yes | An official device for Cell battles, though researchers strangely prefer using their lunch tables instead. |
| **f75** | Item-CollectibleCard | 768px | 0px | Yes | Just collect them all! |
| **f76** | Bookshelf-TopLeft | 1024px | 256px | No | These books are surprisingly well preserved! |
| **f77** | Bookshelf-TopRight | 1280px | 256px | No | These books are surprisingly well preserved! |
| **f78** | Bookshelf-BottomLeft | 1024px | 512px | Yes | These books are surprisingly well preserved! |
| **f79** | Bookshelf-BottomRight | 1280px | 512px | Yes | These books are surprisingly well preserved! |
| **f80** | CryoPodBig-TopLeft | 1536px | 256px | No | Stay cool—we'll be out in a century or two. |
| **f81** | CryoPodBig-TopRight | 1792px | 256px | No | Stay cool—we'll be out in a century or two. |
| **f82** | CryoPodBig-BottomLeft | 1536px | 512px | Yes | Stay cool—we'll be out in a century or two. |
| **f83** | CryoPodBig-BottomRight | 1792px | 512px | Yes | Stay cool—we'll be out in a century or two. |
| **f84** | StoragePod-Top | 1792px | 768px | Yes | Whatever is kept inside is in a deep freeze state! |
| **f85** | StoragePod-Bottom | 1792px | 1024px | Yes | Whatever is kept inside is in a deep freeze state! |
| **f86** | HealthyAncientNeptheesPlant-Top | 1536px | 768px | No | People are trying to bring this ancient plant back; sometimes it's a success! |
| **f87** | HealthyAncientNeptheesPlant-Bottom | 1536px | 1024px | Yes | People are trying to bring this ancient plant back; sometimes it's a success! |
| **f88** | WitherAncientNeptheesPlant-Top | 1280px | 768px | No | People are trying to bring this ancient plant back; sometimes it's a failure! |
| **f89** | WitherAncientNeptheesPlant-Bottom | 1280px | 1024px | Yes | People are trying to bring this ancient plant back; sometimes it's a failure! |
| **f90** | KeyItem-Official Employee Card | 1024px | 0px | Yes | You are now a truly member of the pack! |
| **f91** | Empty Pot | 1280px | 0px | Yes | Empty ceramic pot. |
| **f92** | CellAccelerator-TopLeft | 0px | 1280px | No | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f93** | CellAccelerator-TopMid | 256px | 1280px | No | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f94** | CellAccelerator-TopRight | 512px | 1280px | No | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f95** | CellAccelerator-MidLeft | 0px | 1536px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f96** | CellAccelerator-MidMid | 256px | 1536px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f97** | CellAccelerator-MidRight | 512px | 1536px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f98** | CellAccelerator-BottomLeft | 0px | 1792px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f99** | CellAccelerator-BottomMid | 256px | 1792px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f100** | CellAccelerator-BottomRight | 512px | 1792px | Yes | They say this is where all cells begin. It’s a mouthful of a name for what is essentially a high-speed evolution oven. |
| **f101** | Item-CellBlueprint | 1536px | 0px | Yes | Contains the complex genomic blueprint of a Cell. It's essentially the ultimate 'cheat sheet' for biological reconstruction. |
| **f102** | Item-BioMass | 1792px | 0px | Yes | A container of stabilized raw biological material. It smells faintly of damp earth and limitless potential. |
| **f103** | HugePetryDish | 0px | 768px | Yes | An oversized cultivation dish designed for Cell. It's climate-controlled and remarkably soft—essentially a luxury suite for a Cell. |
| **f104** | Item-LabCredit | 256px | 768px | Yes | An internal currency chip exclusive to Labs. What started as a corporate joke became the only way to pay for the 'premium' noodles. |
| **f105** | WarningSign-Front | 512px | 768px | Yes | Nothing can stop me, even when the sign says so. |
| **f106** | WarningSign-Side | 768px | 768px | Yes | Nothing can stop me; turning the sign sideways won't help. |
| **f107** | Mr-Slim-Top | 1024px | 768px | No | This skeleton robot has an auto-assemble function; otherwise, it's a real mess. |
| **f108** | Mr-Slim-Bottom | 1024px | 1024px | Yes | This skeleton robot has an auto-assemble function; otherwise, it's a real mess. |
| **f109** | HugeTwoStoryPetryDish-Top | 1536px | 1280px | No | An oversized cultivation dish designed for Cells. It's the same model used in the main lab, but standing two stories tall. |
| **f110** | HugeTwoStoryPetryDish-Bottom | 1536px | 1536px | Yes | An oversized cultivation dish designed for Cells. It's the same model used in the main lab, but standing two stories tall. |
| **f111** | MobileMonitorCabinet-Top | 1792px | 1280px | No | A mobile cabinet equipped with a monitor screen, for those who want to keep an eye on their stuff... all the time! |
| **f112** | MobileMonitorCabinet-Bottom | 1792px | 1536px | Yes | A mobile cabinet equipped with a monitor screen, for those who want to keep an eye on their stuff... all the time! |
| **f113** | EmptyTank-Top | 768px | 1280px | No | An empty specimen tank. Its occupants seem to have... moved on. |
| **f114** | EmptyTank-Bottom | 768px | 1536px | Yes | An empty specimen tank. Its occupants seem to have... moved on. |
| **f115** | OldWeatheredTank-Top | 1024px | 1280px | No | A weathered, antique tank. Its glass is thick and yellowed, hinting at a long history of questionable experiments. |
| **f116** | OldWeatheredTank-Bottom | 1024px | 1536px | Yes | A weathered, antique tank. Its glass is thick and yellowed, hinting at a long history of questionable experiments. |
| **f117** | CrackedTank-Top | 1280px | 1280px | No | A fragile tank covered in fractures, even a sneeze can take it down! |
| **f118** | CrackedTank-Bottom | 1280px | 1536px | Yes | A fragile tank covered in fractures, even a sneeze can take it down! |
| **f119** | ShatteredTank-Remains | 1024px | 1792px | Yes | Jagged glass shards and a rusted frame. Leave it for the cleaning crew; your fingers will thank you. |
| **f120** | BrokenTank-Debris | 1280px | 1792px | Yes | Fragmented remains of a tank. Oddly lightweight for its size. |
| **f121** | OldTankTopLid | 768px | 1024px | Yes | A common tank lid. It doesn't seem to be sealed properly; someone might have left it untightened. |
| **f122** | OldTankTopLidiwitStemmy | 1536px | 1792px | Yes | A tank lid with a small, unpowered Stemmy clinging to it. It seems to have found a cozy spot. |
| **f123** | BrokenTankTopLid | 768px | 1792px | Yes | A heavily dented and cracked tank lid. One good stomp will likely finish it off. |
| **f124** | BrokenDamagedTankTopLid | 1792px | 1792px | Yes | A mangled piece of metal that used to be a tank lid. It's completely beyond repair. |
| **f125** | Poster-Troublemakers | 0px | 1024px | Yes | Top 3 Lab troublemakers. Who's going to be a star this month? |
| **f126** | Poster-SilentEmployee | 256px | 1024px | Yes | Nominated for Best Employee as a dedicated silent worker—someone who repairs things no one asked and asks no one. |
| **f127** | WallOfStickers | 512px | 1024px | Yes | Either someone has a short memory, or they just wanted to decorate the boring Lab walls. |

---

## Furniture Tileset (Lab_TileSet_04)
Interactive machinery and experimental equipment. Texture asset: `Lab_TileSet_04.png`.

| Furniture ID | Description | X Position | Y Position | Have Collision | Info |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **f128** | OldCellAccelerator-TopLeft | 0px | 0px | No | The first edition of the Cell Accelerator, since replaced by a higher-powered model. |
| **f129** | OldCellAccelerator-TopMid | 256px | 0px | No | The first edition of the Cell Accelerator, since replaced by a higher-powered model. |
| **f130** | OldCellAccelerator-TopRight | 512px | 0px | No | The first edition of the Cell Accelerator, since replaced by a higher-powered model. |
| **f131** | OldCellAccelerator-MidLeft | 0px | 256px | Yes | The first edition of the Cell Accelerator, since replaced by a higher-powered model. |
| **f132** | OldCellAccelerator-MidMid | 256px | 256px | Yes | The first edition of the Cell Accelerator, since replaced by a higher-powered model. |
| **f133** | OldCellAccelerator-MidRight | 512px | 256px | Yes | The first edition of the Cell Accelerator, since replaced by a higher-powered model. |
| **f134** | OldCellAccelerator-BottomLeft | 0px | 512px | Yes | The first edition of the Cell Accelerator, since replaced by a higher-powered model. |
| **f135** | OldCellAccelerator-BottomMid | 256px | 512px | Yes | The first edition of the Cell Accelerator, since replaced by a higher-powered model. |
| **f136** | OldCellAccelerator-BottomRight | 512px | 512px | Yes | The first edition of the Cell Accelerator, since replaced by a higher-powered model. |
| **f137** | DamagedCellAccelerator-TopLeft | 768px | 0px | No | It looks like it could collapse at any time... but what's that strange noise coming from inside? |
| **f138** | DamagedCellAccelerator-TopMid | 1024px | 0px | No | It looks like it could collapse at any time... but what's that strange noise coming from inside? |
| **f139** | DamagedCellAccelerator-TopRight | 1280px | 0px | No | It looks like it could collapse at any time... but what's that strange noise coming from inside? |
| **f140** | DamagedCellAccelerator-MidLeft | 768px | 256px | Yes | It looks like it could collapse at any time... but what's that strange noise coming from inside? |
| **f141** | DamagedCellAccelerator-MidMid | 1024px | 256px | Yes | It looks like it could collapse at any time... but what's that strange noise coming from inside? |
| **f142** | DamagedCellAccelerator-MidRight | 1280px | 256px | Yes | It looks like it could collapse at any time... but what's that strange noise coming from inside? |
| **f143** | DamagedCellAccelerator-BottomLeft | 768px | 512px | Yes | It looks like it could collapse at any time... but what's that strange noise coming from inside? |
| **f144** | DamagedCellAccelerator-BottomMid | 1024px | 512px | Yes | It looks like it could collapse at any time... but what's that strange noise coming from inside? |
| **f145** | DamagedCellAccelerator-BottomRight | 1280px | 512px | Yes | It looks like it could collapse at any time... but what's that strange noise coming from inside? |
| **f146** | BrokenCellAccelerator-TopLeft | 0px | 768px | No | The Playground's mystery has been solved by the sheer power of the sprint-kick. |
| **f147** | BrokenCellAccelerator-TopMid | 256px | 768px | No | The Playground's mystery has been solved by the sheer power of the sprint-kick. |
| **f148** | BrokenCellAccelerator-TopRight | 512px | 768px | No | The Playground's mystery has been solved by the sheer power of the sprint-kick. |
| **f149** | BrokenCellAccelerator-MidLeft | 0px | 1024px | Yes | The Playground's mystery has been solved by the sheer power of the sprint-kick. |
| **f150** | BrokenCellAccelerator-MidMid | 256px | 1024px | Yes | The Playground's mystery has been solved by the sheer power of the sprint-kick. |
| **f151** | BrokenCellAccelerator-MidRight | 512px | 1024px | Yes | The Playground's mystery has been solved by the sheer power of the sprint-kick. |
| **f152** | BrokenCellAccelerator-BottomLeft | 0px | 1280px | Yes | The Playground's mystery has been solved by the sheer power of the sprint-kick. |
| **f153** | BrokenCellAccelerator-BottomMid | 256px | 1280px | Yes | The Playground's mystery has been solved by the sheer power of the sprint-kick. |
| **f154** | BrokenCellAccelerator-BottomRight | 512px | 1280px | Yes | The Playground's mystery has been solved by the sheer power of the sprint-kick. |
| **f155** | Musstrep-Seedling | 1x1 | 0px | 1536px | Yes | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f156** | MusstrepPlant-TopLeft | 1x1 | 1536px | 0px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f157** | MusstrepPlant-TopRight | 1x1 | 1792px | 0px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f158** | MusstrepPlant-NearTopLeft | 1x1 | 1536px | 256px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f159** | MusstrepPlant-NearTopRight | 1x1 | 1792px | 256px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f160** | MusstrepPlant-NearUpperMidLeft | 1x1 | 1536px | 512px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f161** | MusstrepPlant-NearUpperMidRight | 1x1 | 1792px | 512px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f162** | MusstrepPlant-UpperMidLeft | 1x1 | 1536px | 768px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f163** | MusstrepPlant-UpperMidRight | 1x1 | 1792px | 768px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f164** | MusstrepPlant-LoweMidLeft | 1x1 | 1536px | 1024px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f165** | MusstrepPlant-LowerMidRight | 1x1 | 1792px | 1024px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f166** | MusstrepPlant-NearLoweMidLeft | 1x1 | 1536px | 1280px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f167** | MusstrepPlant-NearLowerMidRight | 1x1 | 1792px | 1280px | No | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f168** | MusstrepPlant-NearBottomLeft | 1x1 | 1536px | 1536px | Yes | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f169** | MusstrepPlant-NearBottomRight | 1x1 | 1792px | 1536px | Yes | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f170** | MusstrepPlant-BottomLeft | 1x1 | 1536px | 1792px | Yes | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f171** | MusstrepPlant-BottomRight | 1x1 | 1792px | 1792px | Yes | A giant ancient plant, originally a dead tree revived by scientists, hence the room's name. It is now strong and healthy... perhaps a little bit too healthy. |
| **f172** | Nepthees-Seedling | 1x1 | 256px | 1536px | Yes | An ancient Nepthees seedling. Where do these little guys even come from? |
| **f173** | Mega Multi Material Printer-TopLeft | 1x1 | 768px | 768px | No | A massive industrial multi-material 3D printer responsible for the fabrication of all Laboratory equipment. // It utilizes raw liquid material to materialize complex structures. |
| **f174** | Mega Multi Material Printer-TopMid | 1x1 | 1024px | 768px | No | (Same as above). |
| **f175** | Mega Multi Material Printer-TopRight | 1x1 | 1280px | 768px | No | (Same as above). |
| **f176** | Mega Multi Material Printer-TopMidLeft | 1x1 | 768px | 1024px | No | (Same as above). |
| **f177** | Mega Multi Material Printer-TopMidMid | 1x1 | 1024px | 1024px | No | (Same as above). |
| **f178** | Mega Multi Material Printer-TopMidRight | 1x1 | 1280px | 1024px | Yes | (Same as above). |
| **f179** | Mega Multi Material Printer-BottomMidLeft | 1x1 | 768px | 1280px | Yes | (Same as above). |
| **f180** | Mega Multi Material Printer-BottomMidMid | 1x1 | 1024px | 1280px | Yes | (Same as above). |
| **f181** | Mega Multi Material Printer-BottomMidRight | 1x1 | 1280px | 1280px | Yes | (Same as above). |
| **f182** | Mega Multi Material Printer-BottomLeft | 1x1 | 768px | 1536px | Yes | (Same as above). |
| **f183** | Mega Multi Material Printer-BottomMid | 1x1 | 1024px | 1536px | Yes | (Same as above). |
| **f184** | Mega Multi Material Printer-BottomRight | 1x1 | 1280px | 1536px | Yes | (Same as above). |
| **f185** | LiquidMaterial-Red | 1x1 | 0px | 1792px | Yes | Raw liquified material used for the printer. // Simply plug the container into the machine; it is remarkably lightweight and efficient. |
| **f186** | LiquidMaterial-Yellow | 1x1 | 256px | 1792px | Yes | Raw liquified material used for the printer. // Simply plug the container into the machine; it is remarkably lightweight and efficient. |
| **f187** | LiquidMaterial-Blue | 1x1 | 768px | 1792px | Yes | Raw liquified material used for the printer. // Simply plug the container into the machine; it is remarkably lightweight and efficient. |
| **f188** | StackedLiquidMaterial-Top | 1x1 | 512px | 1536px | No | A stack of raw liquified material used for the printer. // One container is easy to carry, but three are surprisingly heavy. |
| **f189** | StackedLiquidMaterial-Bottom | 1x1 | 512px | 1792px | Yes | A stack of raw liquified material used for the printer. // One container is easy to carry, but three are surprisingly heavy. |
| **f190** | PiledLiquidMaterial-Left | 1x1 | 1024px | 1792px | Yes | A messy pile of raw liquified material used for the printer. // Someone really should have organized this area. |
| **f191** | PiledLiquidMaterial-Right | 1x1 | 1280px | 1792px | Yes | A messy pile of raw liquified material used for the printer. // Someone really should have organized this area. |

---

## Lab_TileSet_05
Used for special items and consumables.

| furniture ID | Description | Dimension | X Position | Y Position | Have Collision | Info |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **f192** | KeyItem-EnhancedShoes | 1x1 | 0px | 1792px | No | Specially engineered for the modern Scientist. It enhances leg muscle output and protects your feet from the impact of running away from failed experiments. |
| **f193** | KeyItem-SuperShoes | 1x1 | 256px | 1792px | No | The "Super" version of the Lab’s signature footwear. Now with extra shock absorption and even more neon trim, because science is 40% performance and 60% looking cool. |
| **f194** | ConsumableItem-Milktea | 1x1 | 1024px | 1792px | No | A specialty beverage enjoyed by both Humans and Cells. Jenzi and the other girls specifically requested 'Less Sweet' to help keep their shape, but somehow, it still feels a little too sweet for a Lab-certified diet. |
| **f195** | ConsumableItem-NoodleCup | 1x1 | 768px | 1792px | No | The staple diet of any researcher. The label claims it's bad for your health, but surely a single small cup won't hurt... much. |
| **f196** | ConsumableItem-NoodleBowl | 1x1 | 512px | 1792px | No | Eating too much is bad for your health, but this bowl is only slightly larger than a cup. Surely it's still within the 'safe' limit, right? |
| **f197** | SmallBookshelf-Top | 1x1 | 0px | 0px | No | A small, meticulously organized bookshelf. // Its contents are arranged with scientific precision, leaving no room for clutter. |
| **f198** | SmallBookshelf-Bottom | 1x1 | 0px | 256px | Yes | A small, meticulously organized bookshelf. // Its contents are arranged with scientific precision, leaving no room for clutter. |
| **f199** | Poster-CollectThemAll | 1x1 | 256px | 0px | Yes | A vibrant poster celebrating the Lab's card collection. // "There are some truly legendary secret cards out there. I challenge you to collect them all!" |
| **f200** | Poster-Consumables | 1x1 | 256px | 256px | Yes | A colorful PSA about dietary habits. // "While junk food is suboptimal for physical health, occasional consumption is scientifically proven to rejuvenate the soul." |
| **f201** | HoloLines-01 | 1x1 | 512px | 0px | Yes | A flickering holographic projection. // Purely decorative, it adds a touch of high-tech ambiance to the sterile lab environment. |
| **f202** | HoloLines-02 | 1x1 | 512px | 256px | Yes | A flickering holographic projection. // Purely decorative, it adds a touch of high-tech ambiance to the sterile lab environment. |
| **f203** | InfoHoloStation-Top | 1x1 | 768px | 0px | No | A terminal displaying high-level research data. // "The sheer diversity of Cell strains documented here is staggering. Every mutation tells a story." |
| **f204** | InfoHoloStation-Bottom | 1x1 | 768px | 256px | Yes | A terminal displaying high-level research data. // "The sheer diversity of Cell strains documented here is staggering. Every mutation tells a story." |
| **f205** | ServiceStation-Top | 1x1 | 1024px | 0px | No | A polite but firm notice regarding workplace grievances. // "Please direct all complaints to Jenzi. Do not attempt to file them here... seriously, please." |
| **f206** | ServiceStation-Bottom | 1x1 | 1024px | 256px | Yes | A polite but firm notice regarding workplace grievances. // "Please direct all complaints to Jenzi. Do not attempt to file them here... seriously, please." |
| **f207** | InstructionStation-Top | 1x1 | 1280px | 0px | No | A complex navigation station displaying facility blueprints. // "A wealth of directional data, yet I still can't find a single clear path to the restroom." |
| **f208** | InstructionStation-Bottom | 1x1 | 1280px | 256px | Yes | A complex navigation station displaying facility blueprints. // "A wealth of directional data, yet I still can't find a single clear path to the restroom." |
| **f209** | CurveMeetingTable-Top | 1x1 | 1536px | 0px | Yes | A heavy, high-gloss meeting table. // Its surface is so polished you can practically see the Director's stern gaze reflected in the grain. |
| **f210** | CurveMeetingTable-Bottom | 1x1 | 1536px | 256px | Yes | A heavy, high-gloss meeting table. // Its surface is so polished you can practically see the Director's stern gaze reflected in the grain. |
| **f211** | StraightMeetingTable-Top | 1x1 | 1792px | 0px | Yes | A surprisingly comfortable-looking meeting table. // Its padded surface seems perfectly calibrated for an unauthorized nap by someone like Dyzes. |
| **f212** | StraightMeetingTable-Bottom | 1x1 | 1792px | 256px | Yes | A surprisingly comfortable-looking meeting table. // Its padded surface seems perfectly calibrated for an unauthorized nap by someone like Dyzes. |
| **f213** | Generator-TopLeft | 1x1 | 0px | 512px | Yes | A high-output power unit capable of electrifying an entire district. // It utilizes raw liquified energy for maximum throughput. |
| **f214** | Generator-BottomLeft | 1x1 | 0px | 768px | Yes | A high-output power unit capable of electrifying an entire district. // It utilizes raw liquified energy for maximum throughput. |
| **f215** | Generator-TopMid | 1x1 | 256px | 512px | Yes | A high-output power unit capable of electrifying an entire district. // It utilizes raw liquified energy for maximum throughput. |
| **f216** | Generator-BottomMid | 1x1 | 256px | 768px | Yes | A high-output power unit capable of electrifying an entire district. // It utilizes raw liquified energy for maximum throughput. |
| **f217** | Generator-TopRight | 1x1 | 512px | 512px | Yes | A high-output power unit capable of electrifying an entire district. // It utilizes raw liquified energy for maximum throughput. |
| **f218** | Generator-BottomRight | 1x1 | 512px | 768px | Yes | A high-output power unit capable of electrifying an entire district. // It utilizes raw liquified energy for maximum throughput. |
| **f219** | BatteryStation-Offline-Top | 1x1 | 768px | 512px | No | An emergency battery housing unit. // It was designed to store excess generated power, but the reserves have been completely depleted. |
| **f220** | BatteryStation-Offline-Bottom | 1x1 | 768px | 768px | Yes | An emergency battery housing unit. // It was designed to store excess generated power, but the reserves have been completely depleted. |
| **f221** | BatteryStation-Online-Top | 1x1 | 1024px | 512px | No | An emergency battery housing unit. // The internal capacitors are humming with stored power, indicating a fully charged emergency reserve. |
| **f222** | BatteryStation-Online-Bottom | 1x1 | 1024px | 768px | Yes | An emergency battery housing unit. // The internal capacitors are humming with stored power, indicating a fully charged emergency reserve. |
| **f223** | EnergyBattery-Full | 1x1 | 0px | 1024px | Yes | A versatile, lightweight energy cell. // Its high-efficiency core is currently operating at maximum charge capacity. |
| **f224** | EnergyBattery-Depleted | 1x1 | 256px | 1024px | Yes | A versatile, lightweight energy cell. // The energy indicator is dark, signaling that this unit's charge has been entirely spent. |
| **f225** | RawLiquifiedEnergy | 1x1 | 512px | 1024px | Yes | A container of raw liquified energy. // Its extreme volatility is matched only by its incredible efficiency as a fuel source. |
| **f226** | LabChair-Back | 1x1 | 0px | 1280px | Yes | Ergonomically designed to be 4% uncomfortable, ensuring researchers never fall asleep on the job. |
| **f227** | HeavyRoadBlock-Front | 1x1 | 256px | 1280px | Yes | A heavy-duty road block. // "End of the road. Access beyond this point is strictly restricted by Laboratory Protocol." |
| **f228** | HeavyRoadBlock-Side | 1x1 | 512px | 1280px | Yes | A heavy-duty road block positioned at an angle. // "End of the road... sideways. Even at this angle, the message is clear: Turn back." |
| **f229** | HeavyShippingBox | 1x1 | 768px | 1280px | Yes | A reinforced shipping container. // It is remarkably heavy and structurally reinforced to survive extreme handling conditions. |
| **f230** | StackedHeavyBoxes-Top | 1x1 | 1024px | 1024px | No | A towering stack of reinforced shipping containers. // These boxes are incredibly heavy. Did you forget your leg day? |
| **f231** | StackedHeavyBoxes-Bottom | 1x1 | 1024px | 1280px | Yes | A towering stack of reinforced shipping containers. // These boxes are incredibly heavy. Did you forget your leg day? |

---

## Encounter Cell Tileset (Lab_TileSet_Cells)
Used for wild cell encounters. Props follow the class convention `.world-object.cell.[cellName]`.

| furniture ID | Description | Dimension | X Position | Y Position | Have Collision | Info |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **C0** | Stemmy | 1x1 | 0px | 0px | Yes | A wild Stemmy is wandering. |
| **C1** | Cambihil | 1x1 | 0px | 256px | Yes | A wild Cambihil is looking for leaf. |
| **C2** | Lydrosome | 1x1 | 0px | 512px | Yes | A wild Lydrosome is watching a lab tube. |
| **C3** | Nitrophil | 1x1 | 0px | 768px | Yes | A wild Nitrophil is searching for food. |

---


## 3. Implementation Logic (Collisions)
> [!IMPORTANT]
> The source of truth for terrain properties is the **SYSTEMATIC TILE REGISTRY** in [overworld.js](file:///d:/AntiGravityWorkSpace/TheOddLabs2.0/src/engine/overworld.js). The lists below are for quick reference and must be kept in sync with the engine.

- **Solid (Walls)**: 0-11, 12 (Empty Fill), 14-20, 22, 24-25, 28-33, 39-43, 48-63.
- **Walkable (Floor)**: 13, 21, 23, 26, 27, 34-38, 44-47, 64-66.
- **Transitional (Doors)**: 20-31, 34-37.


## 4. Building 2-Tile High Walls
To build a wall that spans two tiles high, use the Top and Bottom segments in vertical pairs:
```javascript
// Example vertical segment
[14], // Wall-Middle-Top
[15]  // Wall-Middle-Bottom
```

## 5. Hidden Reward IDs (Builder Tool Reference)
When using the **HIDDEN REWARD ID** field in the Builder Tool, you can use any ID from `ITEM_PICKUP_DATA`. Here are common ones:

### Resources
- `REWARD_CREDITS_50` - 50 Lab Credits
- `REWARD_CREDITS_100` - 100 Lab Credits
- `REWARD_CREDITS_250` - 250 Lab Credits
- `REWARD_CREDITS_10` - 10 Lab Credits (Tiny cache)
- `REWARD_CREDITS_50` - 50 Lab Credits (Small cache)
- `REWARD_CREDITS_100` - 100 Lab Credits (Secure cache)
- `REWARD_CREDITS_250` - 250 Lab Credits (Executive cache)
- `REWARD_BIOMASS_20` - 20 Biomass (Small container)
- `REWARD_BIOMASS_50` - 50 Biomass (Bulk container)
- `REWARD_BIOMASS_100` - 100 Biomass (Major container)

### Special Item Protocols (Blueprints)
- `REWARD_BLUEPRINT_STEMMY` - Blueprint for Stemmy
- `REWARD_BLUEPRINT_NITROPHIL` - Blueprint for Nitrophil
- `REWARD_BLUEPRINT_CAMBIHIL` - Blueprint for Cambihil
- `REWARD_BLUEPRINT_LYDROSOME` - Blueprint for Lydrosome

### Collectible Cards
- `REWARD_CARD_STEMMY` - Stemmy Card
- `REWARD_CARD_NITROPHIL` - Nitrophil Card
- `REWARD_CARD_CAMBIHIL` - Cambihil Card
- `REWARD_CARD_LYDROSOME` - Lydrosome Card

### Legacy Datalogs
- `Log001` - Atrium Intro
- `Log002` - First Discovery
- *(Use 3-digit numeric codes like 004, 005 for basic pads)*
