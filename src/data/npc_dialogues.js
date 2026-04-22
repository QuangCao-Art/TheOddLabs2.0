// NPC_SCRIPTS: The narrative engine logic for each character.

export const NPC_SCRIPTS = {
    'jenzi': {
        name: "Jenzi",
        quests: [
            'quest_atrium_init',
            'quest_atrium_proof',
            'quest_lana_keycard_handoff',
            'quest_dyzes_datastick_handoff',
            'quest_capsain_sauce_handoff',
            'quest_origin_secret'
        ],
        // Initial onboarding logic for the tutorial selection
        getScript: (gameState, overworld, params) => {
            const { storyFlags } = gameState;

            // 1. Check for Battle Completion (Tutorial ends on any outcome)
            if (params.isPostBattle && !storyFlags.jenziFirstBattleDone) {
                const lines = params.bossWon
                    ? ["Oof, that looked like it hurt... // But hey, a lesson learned is a lesson earned, right? // You've seen enough to get the gist of it."]
                    : ["Whew! That was a good warm up! // You've got the basics down, Intern. Let's get to work."];

                return {
                    lines: lines,
                    triggers: ['jenziFirstBattleDone']
                };
            }

            // 2. Initial Onboarding
            if (!storyFlags.starterChosen) {
                return {
                    lines: [
                        "Welcome to the trenches, Intern! I'm Jenzi, your guide through this corporate fever dream. // We're supposedly 'healing the world,' but mostly we're just trying not to get fired by Lab Director Capsain. // This floor is only a tiny slice of the National Lab mega-structure, though. // We just handle a few departments here—Botanic, Human Research, and the Executive Suite.",
                        "Since you're the new main character, you need a Companion Cell. It's like a smart pet, but way more... liquid. // We use them for everything—from heavy lifting to high-end research, // though most researchers just end up teaching them tricks during lunch. // Their origins are a whole rabbit hole of lab theories, but basically everyone loves them.",
                        "I've got three in the incubator. It's a lab tradition—who knows when or why, but everyone here must have at least one Companion Cell. // So just pick one that vibe with you the most."
                    ],
                    pendingBattleEncounter: 'starter_selection'
                };
            }

            // 3. Challenge to Tutorial Battle
            if (storyFlags.starterChosen && !storyFlags.jenziFirstBattleDone) {
                return {
                    lines: [
                        "Sheesh, nice pick! Let's see if you can actually use it though. // Bet you can't even touch me in a battle. // Pelli-it up!"
                    ],
                    pendingBattleEncounter: 'jenzi_tutorial'
                };
            }

            return { lines: ["..."] };
        }
    },
    'lana': {
        name: "Lana",
        quests: [
            'quest_lana_cleanup',
            'quest_lana_battle'
        ],
        getScript: (gameState, overworld, params) => {
            if (gameState.storyFlags.lanaCleanedUp && !gameState.storyFlags.lanaBattleDone) {
                return {
                    lines: [
                        "Dealing with those seedlings is undeniably exhausting... // Yet, seeing the tree at peace brings a certain stillness to my own thoughts. Don't mention I said that, Intern.",
                        "That was quite entertaining, wasn't it? // Though they will inevitably return. // Perhaps I should assign you a daily seedling culling? *(She giggles softly)* I'm almost serious.",
                        "Jenzi mentioned she drafted you for some minor orientation task. // If you've finished my culling, you should probably focus on that! // Efficiency requires prioritization, after all."
                    ]
                };
            }
            return { lines: ["..."] };
        }
    },
    'lana_withered': {
        name: "Lana",
        getScript: (gameState, overworld, params) => NPC_SCRIPTS['lana'].getScript(gameState, overworld, params)
    },
    'lana_moved': {
        name: "Lana",
        getScript: (gameState, overworld, params) => NPC_SCRIPTS['lana'].getScript(gameState, overworld, params)
    },
    'dyzes': {
        name: "Dyzes",
        quests: ['quest_dyzes_battle'],
        getScript: (gameState, overworld, params) => {
            const { storyFlags } = gameState;
            if (storyFlags.dyzesBattleDone) {
                const flavors = [
                    "Woah, nice data-cycle, man. The Old Lab is the heart of the facility. Good luck finding the 'vibes' down there.",
                    "The Lydrosomes are in a good mood today. One of them actually waved at me. Or it was just a pressure vent. I'm choosing to believe it waved.",
                    "You ever wonder if we're just big cells in a giant lab called 'Earth'? Deep stuff, Intern. Real deep."
                ];
                return { lines: [flavors[Math.floor(Math.random() * flavors.length)]] };
            }
            return { lines: ["..."] };
        }
    },
    'capsain': {
        name: "Director Capsain",
        quests: [
            'quest_capsain_battle',
            'quest_capsain_truth'
        ],
        // Initial fallback logic for his final climax revelation
        getScript: (gameState, overworld, params) => {
            const { storyFlags } = gameState;
            if (params.isPostBattle && params.bossWon && params.isBattleDone) {
                return {
                    lines: [
                        "Dismissed. If you can't even handle a basic engagement, you have no business poking around the archives.",
                        "Go back to filing paperwork, Intern."
                    ]
                };
            }
            return { lines: ["..."] };
        }
    },
    'deartis': {
        name: "Deartis",
        getScript: (gameState, overworld, params) => {
            const flavors = [
                "Boxes, more boxes...// I think I saw a Nitrophil hiding in one of these crates.",
                "Why do we store so many 'Adhesive Residue' samples?// Storage duty is the worst.",
                "The lab is full of history, but not all of it is in the main database.// Keep an eye out for unique furniture or abandoned test tanks—you might find a hidden data log or a rare item.",
                "Who keeps kicking the stuff all over the place?// It's becoming a logistical nightmare to keep track of everything!",
                "I'm so tired of having to put things back where they belong...// One of these days, I WILL glue all the furniture to the floor!",
                "I saw Lana looking for something here recently.// She seemed... unusually tense."
            ];
            return { lines: [flavors[Math.floor(Math.random() * flavors.length)]] };
        }
    },
    'panter': {
        name: "Janitor Panter",
        quests: ['quest_panter_maintenance'],
        getScript: (gameState, overworld, params) => {
            const flavors = [
                "Need something moved? I'm your man.",
                "Storage is a mess, but at least it's quiet. Perfect for thinking about... boxes.",
                "If you find any loose credits, let me know. The maintenance fund is always looking for 'donations'.",
                "Storage Bay duty isn't so bad. It's better than having to clean up after some of those Botanic experiments.",
                "The flickering lights here are really getting to me. I hope someone contributes some credits to fix them soon."
            ];
            return { lines: [flavors[Math.floor(Math.random() * flavors.length)]] };
        }
    },
    'maya': {
        name: "Scientist Maya",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = ["Don't be discouraged! Sometimes a bit of luck helps with the final sync, but skill is the foundation! // Just keep practicing your placement."];
                } else {
                    lines = [
                        "Incredible! Your placement was precise. // That's the secret to the MAP system—it's not just about power, it's about the proximity of your attack nodes.",
                        "Think of it like a puzzle: the closer you are to the target, the more damage you deal and the more energy (PP) you gain. // It's all about finding that sweet spot!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Excuse me, Intern! Have you mastered the Matching Attack Placement (MAP) system yet? // It's the core of our tactical research.",
                    "If you can prove your proficiency, I'll share some insights on the finer points of MAP."
                ];
                pendingBattleEncounter = 'maya';
            } else {
                lines = ["It's all about finding that sweet spot in your attack placement! Keep practicing!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'sapstan': {
        name: "Biologist Sapstan",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Don't sweat it. The Pellicle Point system is all about balance. // You'll eventually turn your Pellicle Points into an advantage...",
                        "...but avoid that nasty 25% HP Overload discharge for now. // Take a breather and we'll try again later."
                    ];
                } else {
                    lines = [
                        "Nice job! You've got a good handle on the tactical flow. // Tip: positive PP creates a kinetic shield, softening incoming hits.",
                        "Just don't hit Max PP—that'll cause a Pellicle Discharge, dealing 25% of your Max HP in damage!",
                        "Later, you'll unlock skills to 'vent' those Pellicle Points for massive damage. Keep it up!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Hey there. Have you noticed how the Pellicle Point system works? // Most focus on attacks, but PP management is where you see real results.",
                    "Spar with me? I'll show you the 'Positive Shield' effect. Ready?"
                ];
                pendingBattleEncounter = 'sapstan';
            } else {
                lines = ["Positive PP creates a kinetic shield. It's the secret to staying alive in a tough fight!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'blundur': {
        name: "Researcher Blundur",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Predictable. You won't win without using a calibrated Catalyst Hub to boost your stats. // You lacked the tactical effects needed to penetrate my defense.",
                        "Access your Inventory to slot new cards and see the results in your next battle. It's the best part of the job!"
                    ];
                } else {
                    lines = [
                        "Inquiry! How did you bypass my dermal bio-ceramics? A high-frequency sync? Fascinating.",
                        "Pro-tip: Check your Catalyst Hub in the Inventory menu to slot your rewards and boost your stats.",
                        "Increasing your Research Grade will unlock even more slots for skills and passive effects. Truly revolutionary!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Salutations! I'm Biologist Blundur. Have you heard of the C-Chip system? // They're bio-synthetic boosters that significantly enhance your Cell's stats.",
                    "Slotting them into your Catalyst Hub is essential for maximizing your tactical advantage. // Ready to see how much of a difference a good build makes?"
                ];
                pendingBattleEncounter = 'blundur';
            } else {
                lines = ["Check your Catalyst Hub frequently and slot new cards. It's the only way to reach peak efficiency!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'saito': {
        name: "Assistant Saito",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Better luck next time! // Since I'm nice, here's a tip: I see Blunder wandering around near the large cabinets...",
                        "That maybe where he dropped his datapad!"
                    ];
                } else {
                    lines = [
                        "Fine, you're better than you look! // Here's a tip: I hear a faint buzzing sound coming from the computer station...",
                        "...it's humming a bit strangely. Check the ports, maybe someone left a datapad plugged in!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Oh, you're looking for Sapstan and Blundur's lost datapads? // I might have seen them... but I won't tell you for free!",
                    "Let's have a quick Cell battle. If you win, I'll give you a hint!"
                ];
                pendingBattleEncounter = 'saito';
            } else {
                lines = ["Did you find the shiny thing in the Atrium? I told you it was there!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'shopia': {
        name: "Scientist Shopia",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Efficiency is the cornerstone of research. // To succeed, one must master elemental counters: Thermal melts Botanic...",
                        "Botanic absorbs Osmotic, and Osmotic cools Thermal. // Always analyze the nature of your target before initiating a sync."
                    ];
                } else {
                    lines = [
                        "Incredible! Identifying the elemental nature of your opponent is the first step toward mastery.",
                        "Each type has a counter: Thermal melts Botanic, Botanic absorbs Osmotic, and Osmotic cools Thermal. // These 1.5x multipliers are the only way to survive the deeper wards."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "The Botanic Sector is a delicate ecosystem. You can't just barge in without a plan! // Have you analyzed the elemental spectrum?",
                    "Every organism here has a specific nature that can be countered. // If you don't know your types, this will be a very short lesson."
                ];
                pendingBattleEncounter = 'shopia';
            } else {
                lines = ["Thermal melts Botanic, Botanic absorbs Osmotic, Osmotic cools Thermal. Keep those counters in mind!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'clips': {
        name: "Tech Clips",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = ["Lagging behind? // If a Second Brain isn't enough to save you, maybe you should start looking for a third!"];
                } else {
                    lines = [
                        "Solid processing speed! // Remember, the Second Brain card's presence alone grants you that extra Pellicle slot.",
                        "It allows you to equip a second active skill, giving you much more control over your Pellicle Points (PP) in battle."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "New intern, right? You're entering a sector where one Basic skill just isn't enough to manage the tactical load.",
                    "Have you heard of the 'Second Brain'? // It's a special card that unlocks an additional skill slot. // Let's see if you're ready for that kind of growth!"
                ];
                pendingBattleEncounter = 'clips';
            } else {
                lines = ["Equipping a second active skill is a total game-changer. Don't forget to slot your Second Brain card!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'lustra': {
        name: "Researcher Lustra",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "See that extra damage? That's the Lysis Penalty. // For every point of Negative PP, you take 10% more damage from every hit.",
                        "It's like fighting without a skin!"
                    ];
                } else {
                    lines = [
                        "Risky, but effective! You managed to 'vent' your PP just before your membrane collapsed.",
                        "Remember: every point below zero increases incoming damage by 10%. // If you hit your debt limit, you're taking DOUBLE damage!",
                        "It's called the 'Lysis State'—your cell's structural integrity is compromised."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Be careful—if you push your Cell too hard, it'll literally fall apart. // Most interns think Negative PP is just a number...",
                    "but it's a structural failure waiting to happen. // Want to see what 'Lysis' looks like up close?"
                ];
                pendingBattleEncounter = 'lustra';
            } else {
                lines = ["Watch your PP debt! The Lysis penalty is no joke—it'll double the damage you take."];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'rattou': {
        name: "Chef Rattou",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Sloppy! You came in underprepared. // Make sure to stop by the Vending Machine.",
                        "It sells more than just food; you can trade in your excess Biomass for Lab credits, then buy Blueprints for advanced Cells."
                    ];
                } else {
                    lines = [
                        "Delicious work! You've got the hunger. // The Vending Machine here is more than just furniture.",
                        "It’s not just for grabbing a quick bite; use your credits to get stock! // Remember to visit it often."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Hungry for progress, Intern? Cooking's all about preparation. // Have you used the Vending Machine here in the Kitchen?",
                    "It's essential for trading Biomass and acquiring Blueprints. // Let me show you why stayin' stocked is stayin' alive!"
                ];
                pendingBattleEncounter = 'rattou';
            } else {
                lines = ["The kitchen's vending machine is your hub for recipes and credits. Don't go hungry out there!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'ecto': {
        name: "Researcher Ecto",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = ["Diversity is the key to winning, Intern. If you only rely on one type, you'll hit a wall eventually. Go back and synthesize something different."];
                } else {
                    lines = ["Impressive sync. You're ready to use the Cell-Accelerator properly. Just remember: a balanced team is a stable team."];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Hey Intern. You're deep into the labs now. Have you started using the Cell-Accelerator in the Atrium?",
                    "It's where we synthesize new life from collected recipes. // Want a demonstration of what a well-accelerated Cell can do?"
                ];
                pendingBattleEncounter = 'ecto';
            } else {
                lines = ["A balanced squad is a stable squad. Don't forget to use the Accelerator to diversify your team!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'premy': {
        name: "Researcher Premy",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Listen closely: if you have two of the same Cell, you can merge them at the Bio-extractor.",
                        "It makes them stronger and generates much more Biomass for future research. Don't waste your duplicates!"
                    ];
                } else {
                    lines = [
                        "You've got the spark! Now go use that Bio-extractor. // Remember: merging identical Cells is the secret to power.",
                        "It boosts their stats and gives you a surplus of Biomass."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Welcome to the Human Research Ward! Have you used the Bio-extractor in the Extraction Room yet?",
                    "It's the primary tool for harvesting Biomass and refining your Cell potential. // Let's see if you're ready for the next level!"
                ];
                pendingBattleEncounter = 'premy';
            } else {
                lines = ["Merging duplicate cells at the Bio-extractor is the fastest way to build up your biomass reserves."];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'yifec': {
        name: "Researcher Yifec",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "MAP Effects are game-changers. For example, EASY TARGET makes any NEAR hit count as a perfect MATCH.",
                        "Or use PERFECT STRIKE for an unavoidable hit where all nodes count as a MATCH. You need to control the field!"
                    ];
                } else {
                    lines = [
                        "Impressive! You handled the field well. // Don't forget MAP Effects like RELIABLE HIT, which forces a NEAR result.",
                        "Or use PUNY SLAP if you need an intentional weak hit—it makes all nodes count as FAR. Knowledge is power!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Mastering basic placement is for interns. True researchers use MAP Effects to manipulate the battlefield.",
                    "These effects give you direct control over your sync results, regardless of how you place your attack. // Ready to see it in action?"
                ];
                pendingBattleEncounter = 'yifec';
            } else {
                lines = ["MAP Effects like Perfect Strike can completely ignore placement difficulty. Use them wisely!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'white': {
        name: "Researcher White",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = ["See? Perfection in PP management and a solid C-Chip build. That's how you win—luck has nothing to do with it!"];
                } else {
                    lines = ["Wait... did you just out-manage my PP? Fine, maybe your C-Chip strategy was just slightly better... for now!"];
                }
            } else if (!isBattleDone) {
                lines = [
                    "I'm telling you, the MAP system is pure luck! // The real pros win through superior PP management and C-Chip strategy.",
                    "Here, I'll prove it by crushing this intern with pure tactical efficiency!"
                ];
                pendingBattleEncounter = 'white';
            } else {
                lines = ["PP management is the only logical path to victory. Everything else is just static!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'cherry': {
        name: "Researcher Cherry",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = ["A beautiful MAP sync! That's the power of the placement system. PP management is just for those who can't aim!"];
                } else {
                    lines = ["Even in defeat, I can see you value the MAP system. That placement was beautiful... even if it did wreck my squad!"];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Nonsense! Placement is everything! // If you can't place it, you can't win. // Intern, show this 'optimizer' that a perfect MAP placement is the true path!"
                ];
                pendingBattleEncounter = 'cherry';
            } else {
                lines = ["A perfect match on every node is the mark of a true researcher. Practice your aim!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'anreal': {
        name: "Assistant Anreal",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Operational failure. You allowed the CHOICEBLOCK to restrict your options until you had nowhere to turn.",
                        "And HURTBLOCK is a double-edged sword—if you use the same node as me, we both lose access to it."
                    ];
                } else {
                    lines = [
                        "Impressive. You navigated the blocks and maintained operational flow. // Remember: CHOICEBLOCK prevents re-selecting used nodes.",
                        "HURTBLOCK disables nodes used by BOTH players. Maneuverability is everything!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "The Director demands 99.9% uptime. To survive at this level, you must navigate operational constraints.",
                    "Specifically, the specialized interference patterns we call BLOCK protocols. // Ready to see how they can paralyze a squad?"
                ];
                pendingBattleEncounter = 'anreal';
            } else {
                lines = ["Block protocols are the Director's specialized security layer. Always think two moves ahead!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'godou': {
        name: "Assistant Godou",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Calculation error. You ran out of PP for your Pellicle skills when it mattered most.",
                        "Basic Skills cost 0 PP; Pellicle Skills cost life-force. You must cycle them perfectly."
                    ];
                } else {
                    lines = [
                        "Your resource cycling is... statistically significant. // You used Basic Skills to build energy and saved your Pellicle Skills for the strike.",
                        "That's the hallmark of a high-performance researcher."
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Data analysis shows most interns waste their biological potential on raw power.",
                    "True tactical efficiency comes from balancing Basic energy-builders with Pellicle-heavy finishers. // Let's stress-test your management."
                ];
                pendingBattleEncounter = 'godou';
            } else {
                lines = ["Cycle your basic skills to bank PP for your big finishers. It's simple arithmetic!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'yunidi': {
        name: "Assistant Yunidi",
        getScript: (gameState, overworld, params) => {
            const { isPostBattle, bossWon, isBattleDone } = params;
            let lines = ["..."];
            let pendingBattleEncounter = null;

            if (isPostBattle) {
                if (bossWon) {
                    lines = [
                        "Operational oversight. You lacked the high-tier synergy needed to bypass my Perk's influence.",
                        "Leader Perks are the foundation of an elite squad. Without a Perk, you're just a statistic."
                    ];
                } else {
                    lines = [
                        "A victory against the Executive Suite... statistically improbable, yet here you are.",
                        "You must have a powerful Leader Perk of your own to have survived that. // Tier L cards are the true keys to power!"
                    ];
                }
            } else if (!isBattleDone) {
                lines = [
                    "Director Capsain doesn't hire assistants; he hires strategic advantages.",
                    "The true elite operate through Leader Perks—passive Tier L cards that rewrite the laws of the sync. // Ready for a Perks build?"
                ];
                pendingBattleEncounter = 'yunidi';
            } else {
                lines = ["Leader Perks grant passive advantages that override standard battle rules. Never go into the suite without one!"];
            }
            return { lines, pendingBattleEncounter };
        }
    },
    'playground_randomizer': {
        getScript: (gameState, overworld) => {
            const pool = overworld.randomPools.cellPlayGround;
            const lines = pool[Math.floor(Math.random() * pool.length)];
            return { lines };
        }
    },
    'generic_staff': {
        getScript: (gameState, overworld) => {
            const pool = overworld.randomPools[overworld.currentZone] || overworld.randomPools.atrium;
            const lines = pool[Math.floor(Math.random() * pool.length)];
            return { lines };
        }
    },
    'lee': {
        getScript: (gameState, overworld) => {
            const pool = overworld.randomPools[overworld.currentZone] || overworld.randomPools.atrium;
            const lines = pool[Math.floor(Math.random() * pool.length)];
            return { lines };
        }
    },
    'babo': {
        getScript: (gameState, overworld) => {
            const pool = overworld.randomPools[overworld.currentZone] || overworld.randomPools.atrium;
            const lines = pool[Math.floor(Math.random() * pool.length)];
            return { lines };
        }
    },
    'andar': {
        getScript: (gameState, overworld) => {
            const pool = overworld.randomPools[overworld.currentZone] || overworld.randomPools.atrium;
            const lines = pool[Math.floor(Math.random() * pool.length)];
            return { lines };
        }
    },
    'elegee': {
        getScript: (gameState, overworld) => {
            const pool = overworld.randomPools[overworld.currentZone] || overworld.randomPools.atrium;
            const lines = pool[Math.floor(Math.random() * pool.length)];
            return { lines };
        }
    },
    'mercurie': {
        getScript: (gameState, overworld) => {
            const pool = overworld.randomPools[overworld.currentZone] || overworld.randomPools.atrium;
            const lines = pool[Math.floor(Math.random() * pool.length)];
            return { lines };
        }
    }
};
