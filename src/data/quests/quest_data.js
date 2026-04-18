/**
 * QUEST_DATA: The unified registry for all quest tasks.
 * Progression is driven by quest completion states and story flags.
 */
export const QUEST_DATA = {
    // --- JENZI'S UNLOCK PATH (The "Main" progression) ---

    'quest_atrium_init': {
        id: 'quest_atrium_init',
        title: 'Archive Initialization',
        description: "Retrieve Log #001 from the Lab Lobby specimen tanks.",
        type: 'collect',
        target: 'Log001',
        amount: 1,
        requiredFlag: 'jenziFirstBattleDone',
        reward: { type: 'flag', id: 'jenziAtriumUnlocked' },
        dialogue: {
            offer: [
                "Hey Intern! You're actually decent! That's a good start.",
                "Wait, did you see that? Something just flashed over by the specimen tanks.",
                "Go check if someone dropped something in there.",
                "Scientists here have the attention span of a goldfish."
            ],
            offer_completed: [
                "Wait, what do we have here? Did you just pick up that Datapad?",
                "I swear I saw someone leave it near the red tank a minute ago."
            ],
            progress: ["Still looking? It was definitely over near the red tanks."],
            complete: [
                "Indeed, you found it! You're officially a data retrieval specialist.",
                "I've unlocked the door to the Atrium. Go explore!"
            ],
            finished: ["The Atrium is open. Don't get lost in the sauce!"]
        }
    },

    'quest_atrium_proof': {
        id: 'quest_atrium_proof',
        title: 'The Atrium Proof',
        description: "Collect 5 DataLogs and defeat Jenzi to prove you can handle the Botanic Sector.",
        type: 'defeat',
        target: 'jenzi',
        amount: 1,
        requiredLogs: 5,
        requiredFlag: 'jenziAtriumUnlocked',
        onCompleteFlag: 'jenziAtriumBattleDone',
        reward: { type: 'flag', id: 'botanicSectorUnlocked' },
        dialogue: {
            offer: [
                "Looking for more logs? You must smell something fishy about the Incident.",
                "But before I spill the tea, let's see if you're actually worth it.",
                "Collect 5 logs and defeat me to prove you can handle the Botanic Sector!"
            ],
            progress: [
                "Aha! Still scrounging through the Atrium desks?",
                "Come back when you've got at least 5 logs and you're ready to duel."
            ],
            complete: [
                "Okay, okay, you got me! You're actually decent.",
                "The Director says it was an 'Ionization Leak', but that story is fishy...",
                "If you want the real story, go ask Lana in the Botanic wing.",
                "I've unlocked the door for you. Keep moving!"
            ],
            finished: ["Still can't believe you actually pulled it off. You definitely have that 'Main Character' energy, Intern."]
        }
    },

    'quest_lana_keycard_handoff': {
        id: 'quest_lana_keycard_handoff',
        title: 'Botanic Clearance',
        description: "Bring Lana's Keycard to Jenzi to unlock the Human Research sector.",
        type: 'collect',
        target: 'Quest01',
        amount: 1,
        requiredFlag: 'lanaBattleDone',
        reward: { type: 'flag', id: 'humanWardUnlocked' },
        consume: true,
        dialogue: {
            offer: [
                "Wait, Lana actually gave you her key? And she was acting sus?",
                "Give it here. I'll update your biometric signature for the next sector."
            ],
            offer_completed: [
                "Wait, Lana gave you her key? SUS-PICIOUS! That's weird af.",
                "Hand it over, I'll update your clearance for the Human Research sector."
            ],
            progress: ["Lana's key. I need it to open the Human Research doors."],
            complete: [
                "Clearance updated. You're now authorized for Human Research.",
                "Go bother Dyzes. He's chill, but he definitely knows things he's not saying."
            ],
            finished: ["I've updated your clearance for the Human Research sector. Go bother Dyzes."]
        }
    },

    'quest_dyzes_datastick_handoff': {
        id: 'quest_dyzes_datastick_handoff',
        title: 'Research Access',
        description: "Bring the Old Data Stick to Jenzi to unlock the Executive Suite.",
        type: 'collect',
        target: 'Quest02',
        amount: 1,
        requiredFlag: 'dyzesBattleDone',
        reward: { type: 'flag', id: 'executiveSuiteUnlocked' },
        consume: true,
        dialogue: {
            offer: ["Dyzes gave you a data stick? Hand it over, I'll see what's on it."],
            offer_completed: [
                "Dyzes gave you an 'Old Data Stick'? Okay, now this is getting serious. No more jokes.",
                "Give it here, I'll use it to override the Executive Suite locks."
            ],
            progress: ["The data stick Dyzes gave you. I need it for the override."],
            complete: [
                "Override complete. The Executive Suite is now open.",
                "You need to confront the final boss himself. Director Capsain. Go get the truth, Intern."
            ],
            finished: ["The secret door in the Atrium is now linked to your biometric signature."]
        }
    },

    'quest_capsain_sauce_handoff': {
        id: 'quest_capsain_sauce_handoff',
        title: 'The Final Clue',
        description: "Bring the Rare Inferno Sauce to Jenzi to reveal the Old Lab location.",
        type: 'collect',
        target: 'Quest03',
        amount: 1,
        requiredFlag: 'capsainBattleDone',
        reward: { type: 'flag', id: 'oldLabUnlocked' },
        consume: true,
        dialogue: {
            offer: ["Is it true? Noodle sauce? Give me that bottle!"],
            offer_completed: [
                "Wait, the secret is... Noodle Sauce? That... that is actually making too much sense.",
                "Give me that Inferno Sauce bottle. I need to scan it for residue."
            ],
            progress: ["The Director's 'Inferno Sauce'. I need to scan it."],
            complete: [
                "Scans complete. The '27 security gap was a total farce.",
                "You found the truth, Intern. Find the Old Lab basemement. End this circus."
            ],
            finished: ["You found the Sauce. You have all the clues now. End this circus."]
        }
    },

    'quest_origin_secret': {
        id: 'quest_origin_secret',
        title: 'The Origin Secret',
        description: "Find the Old Lab Room and the Origin Nitrophil to complete the mystery.",
        type: 'collect',
        target: 'Quest04',
        amount: 1,
        requiredFlag: 'oldLabUnlocked',
        onCompleteFlag: 'gameEndTriggered',
        reward: { type: 'resource', id: 'credits', amount: 5000 },
        dialogue: {
            offer: [
                "Find the Old Lab Room hidden in the Specimen Storage or Storage Bay.",
                "The Origin is waiting. End this farce."
            ],
            progress: ["Still searching for the hidden room? It's not on the main maps."],
            offer_completed: [
                "It's all over, isn't it? // You found the Origin Nitrophil... the truth is finally out in the light."
            ],
            complete: [
                "You found it. The Origin Nitrophil. It's... it's orange.",
                "The spicy miracle that started it all.",
                "Congratulations, Specialist. You've uncovered the true heart of Odd Labs."
            ],
            finished: ["The Lab is finally at peace. The truth is out."]
        }
    },

    // --- SECTOR BOSS QUESTS (Reward: Key Items) ---

    'quest_lana_battle': {
        id: 'quest_lana_battle',
        title: 'Petals and Secrets',
        description: "Defeat Lana to secure the Old Key Card.",
        type: 'defeat',
        target: 'lana',
        amount: 1,
        requiredLogs: 10,
        requiredFlag: 'botanicSectorUnlocked',
        onCompleteFlag: 'lanaBattleDone',
        reward: { type: 'item', id: 'Quest01' },
        dialogue: {
            offer: [
                "What are you staring at? // I was merely performing a hydration assessment on your partner Cell.",
                "You want this Key Card? Hmph. You'll have to prove your tactical signature is optimized first!",
                "Come back when you have at least 10 logs of research data."
            ],
            progress: ["Your tactical signature is completely unoptimized. Come back when you have 10 logs."],
            offer_completed: [
                "I suppose even an incompetent intern can find a few datampads. // You have 10 logs? Very well.",
                "Let's see if you can actually use that Cell in a fight!",
                "Don't get the wrong idea! I'm only doing this to calibrate my own team!"
            ],
            complete: [
                "Hmph. Your tactical signature was... informative.",
                "Here, take the 'Old Key Card'. I suppose you've earned it.",
                "Now don't waste my time. Efficiency is the cornerstone of this sector!"
            ],
            finished: ["Efficiency is the cornerstone of the Botanic Sector. Don't waste my time with more questions."]
        }
    },

    'quest_dyzes_battle': {
        id: 'quest_dyzes_battle',
        title: 'Osmotic Revelations',
        description: "Defeat Dyzes to retrieve the Old Data Stick.",
        type: 'defeat',
        target: 'dyzes',
        amount: 1,
        requiredLogs: 15,
        requiredFlag: 'humanWardUnlocked',
        onCompleteFlag: 'dyzesBattleDone',
        reward: { type: 'item', id: 'Quest02' },
        dialogue: {
            offer: [
                "Woah, man. You look like you've been fighting in a greenhouse.",
                "You're looking for the Old Data Stick? Vibes are a bit intense for that right now.",
                "Collect 15 logs and maybe the flow will be right."
            ],
            progress: ["Still scrounging for vibes? You need 15 logs, man. Keep it chill."],
            offer_completed: [
                "15 logs? Woah, okay. Your data-flow is peaking.",
                "If you want the stick, you've gotta sync up with my Lydrosomes first.",
                "Ready to see if your energy is actually fluid?"
            ],
            complete: [
                "Woah, okay. Your tactical flow is elite. I can't really hide the truth if you're this good.",
                "Here's the Data Stick. It's got the 'Old Lab' vibes all over it.",
                "Good luck, Intern. May the cellular harmony be with you."
            ],
            finished: ["The Old Lab exists, man. It's not on the main maps. Go talk to Jenzi."]
        }
    },

    'quest_capsain_battle': {
        id: 'quest_capsain_battle',
        title: 'The Origin Theory',
        description: "Confront Director Capsain to reveal the truth.",
        type: 'defeat',
        target: 'capsain',
        amount: 1,
        requiredLogs: 20,
        requiredFlag: 'executiveSuiteUnlocked',
        onCompleteFlag: 'capsainBattleDone',
        reward: { type: 'item', id: 'Quest03' },
        dialogue: {
            offer: [
                "...",
                "Don't you have work to do, Specialist?",
                "You want my clearance? Access to the secret records?",
                "I don't think you have enough research papers for that. Come back with 20 logs."
            ],
            progress: ["Dismissed. If you can't even handle basic data retrieval (20 logs), you have no business in my office."],
            offer_completed: [
                "So. You found the Noodle Review. // You found the '27 security gap.",
                "You think a little chili sauce is enough to topple this Director?",
                "Fine! If you want the 'Origin', you'll have to go through me and my strongest Nitrophil first!",
                "Prepare to be archived!"
            ],
            complete: [
                "I... I failed? To an intern? *[Sighs deeply]*",
                "You've seen the logs. You have the sauce. You've basically already found out.",
                "Here, take this Rare Inferno Sauce... it's just a research sample! Nothing more!",
                "Now go away, I have... important papers to write."
            ],
            finished: ["Dismissed. I have important papers to write. The Sauce? It's just a sample! Nothing more!"]
        }
    },

    'quest_capsain_truth': {
        id: 'quest_capsain_truth',
        title: 'The Director\'s Secret',
        description: "Confront Director Capsain with the Origin Nitrophil to finally uncover the truth.",
        type: 'collect',
        target: 'Quest04',
        amount: 1,
        requiredFlag: 'oldLabUnlocked',
        onCompleteFlag: 'gameCompleted',
        reward: { type: 'resource', id: 'credits', amount: 5000 },
        dialogue: {
            offer: [
                "Dismissed. I have important papers to write.",
                "Wait, why are you still here? And why do you smell like... spicy ozone?"
            ],
            progress: ["Dismissed. I told you, I have papers to write."],
            offer_completed: [
                "WHAT?! Where did you... how did you find that?!",
                "That room was sealed! It was supposed to stay buried with the '27 logs!",
                "Get that... that anomaly out of my sight immediately!",
                "[Origin Nitrophil glows a hyperactive orange and vibrates happily]",
                "It... it still does that. Just like the night of the... 'accident'.",
                "Look at that hue. It's the exact shade of the 'Inferno' blend.",
                "I tried to tell them it was radiation.",
                "I told the board we were pioneers of bio-hazard engineering...",
                "Fine. You win, intern. The 'Ionization Leak' was a lie."
            ],
            complete: [
                "I was working late. I was hungry.",
                "One drop of the extra-spicy sauce fell into Petri Dish #0, and...",
                "it didn't dissolve. It stood up. It looked at me.",
                "And I was too damn busy worrying about my reputation to tell the truth.",
                "I spent years calling them 'accidents' to cover my own stupidity.",
                "But look at him. He's hyperactive, he's chill, and he's more alive than any of my 'professional' theories.",
                "The Cells aren't anomalies... they're the best mistake I ever made.",
                "Effective immediately, I am rescinding the termination order. The 'Cell Project' will continue—officially.",
                "And I want you to be our newest Official Scientist.",
                "You have proven yourself more capable than any intern I've ever seen, and the lab needs your sharp mind.",
                "Thank you. I didn't realize how heavy this secret was until you took it off my shoulders.",
                "Now, let's go tell the staff that 'Noodle Tuesdays' are officially a lab holiday."
            ],
            finished: ["The Lab is finally at peace. The 'Cell Project' is now an official department."]
        }
    },

    // --- SIDE QUESTS (Preserved) ---

    'quest_wild_stemmy': {
        id: 'quest_wild_stemmy',
        title: 'Wild Stemmy Hunt',
        description: "Defeat 5 Wild Stemmies to support the lab's behavioral research.",
        type: 'defeat',
        target: 'stemmy_wild',
        amount: 5,
        reward: { type: 'log', id: 'Log010' },
        consume: false,
        dialogue: {
            offer: ["I'm doing research on Stemmy behavior.", "Could you defeat 5 Wild Stemmies for me?"],
            progress: ["How's the hunt going?", "You've defeated {progress} out of 5."],
            offer_completed: [
                "I saw your tactical data—the Stemmies have been calibrated! // Ready to finalize the report?"
            ],
            complete: ["Wow, you did it!", "Here is a datalog for your trouble."],
            finished: ["Thanks again for the help!"]
        }
    },

    'quest_nitrophil_synth': {
        id: 'quest_nitrophil_synth',
        title: 'Synthesis Practice',
        description: "Synthesize a Nitrophil cell to help with specimen calibration.",
        type: 'synthesis',
        target: 'nitrophil',
        amount: 1,
        reward: { type: 'item', id: 'CARD01' },
        consume: false,
        dialogue: {
            offer: ["I need a Nitrophil cell for an experiment.", "Could you synthesize one for me?"],
            progress: ["Still waiting on that Nitrophil...", "Remember, you need Biomass and a Blueprint."],
            offer_completed: [
                "Is that a fresh Nitrophil I see? // Splendid! The calibration data is exactly what I needed."
            ],
            complete: ["Perfect specimen!", "Please take this C-Chip as payment."],
            finished: ["Nitrophil is a fascinating unit, isn't it?"]
        }
    },

    'quest_zibrya_firstcollection': {
        id: 'quest_zibrya_firstcollection',
        title: 'The First Collection',
        type: 'defeat',
        target: 'stemmy_wild',
        amount: 2,
        description: "Defeat 2 Wild Stemmies to help Assistant Zibrya with her card research.",
        dialogue: {
            offer: [
                "Hey there, Intern! Did you know the Lab uses both tactical Chips and Collectible Cards?",
                "We use C-Chips for upgrading Cells, but there are also Collectible Cards... just for the sake of collecting!",
                "A true Lab member is one who hunts down every secret card.",
                "Tell you what—if you can defeat 2 Wild Stemmies to help with my research, I'll give you the first spare card I have.",
                "It's a great way to start your collection. What do you say?"
            ],
            progress: ["How's the hunt going? You've defeated {progress} out of 2 Wild Stemmies so far. Keep at it!"],
            offer_completed: [
                "Hey, I saw you out there! You really handled those Stemmies! // Ready for your first reward card?"
            ],
            complete: [
                "Congratulations! Stemmy is actually so cool! People say it's lame, but I find it super handy—that little guy has a lot of potential.",
                "As promised, here is your Stemmy Collectible Card! It's super common, but hey, every legendary collection has to start somewhere.",
                "Keep an eye out for others—they could be anywhere!"
            ],
            finished: ["Did you know that Jenzy actually makes all these collectible cards herself? She's really good at making stuff, isn't she?"]
        },
        reward: {
            type: 'resource_multi',
            rewards: [
                { type: 'item', id: 'CARD00' },
                { type: 'resource', id: 'credits', amount: 200 }
            ]
        }
    },

    'quest_elara_ghost': {
        id: 'quest_elara_ghost',
        title: 'The ghost of the library',
        type: 'show_monster',
        target: 'lydrosome',
        minEfficiency: 1,
        amount: 1,
        description: "Show Elara a Lydrosome with Efficiency Level 1. She is fascinated by its profound intelligence.",
        dialogue: {
            offer: [
                "Don't be startled. The shimmer... it's just a trick of light and ancient circuitry. I am Elara.",
                "I am not a ghost. I am merely a witness... // one of the first souls to walk this earth when the world was still green and the masters were ancient.",
                "You look so much like them. The same spark in your eyes, the same fragile determination.",
                "Bring me a Lydrosome with Efficiency Level 1, and I shall share with you the truth of our genesis."
            ],
            progress: ["The history of this lab is a circle, Child. // I'm waiting for a Lydrosome with high-level efficiency."],
            offer_completed: [
                "The shimmer in your hands... it is the Lydrosome I sought. // Speak with me, and we shall share the secret of the genesis."
            ],
            complete: [
                "Remarkable. The Lydrosome's harmony is perfect... almost like it remembers the source itself.",
                "Lily gave us life to save her people, but she accidentally gave us a heart that beats for its own reasons.",
                "As promised, here is the secret of this lab. // It's Log #020. Read it well."
            ],
            finished: [
                "The history of this lab is a circle, Child, but you have the potential to turn it into a straight line.",
                "You just have to be human."
            ]
        },
        reward: { type: 'log', id: 'Log020' }
    },

    'timed_test_kick': {
        id: 'timed_test_kick',
        title: 'High-Pressure Kick Test',
        description: "Kick 3 objects in 20 seconds. Protocol: Precision and Speed.",
        type: 'kick',
        targetType: 'npc',
        uiLabel: 'KICK COUNT',
        target: 'any',
        amount: 3,
        timeLimit: 20,
        reward: { type: 'resource', id: 'credits', amount: 300 },
        dialogue: {
            offer: [
                "Authorized personnel only! This wing requires a high-speed diagnostic.",
                "Can you kick 3 objects in under 20 seconds?"
            ],
            retry: [
                "Diagnostic failed. Want to try the High-Pressure Kick Test again for 300 LC?"
            ],
            progress: ["Clock is ticking, Intern! {amount} more kicks needed!"],
            complete: [
                "Calibration successful! Sensors are green across the board."
            ],
            finished: ["Good form. You've got quite a kick, Intern."]
        }
    },

    'quest_pessi_playground': {
        id: 'quest_pessi_playground',
        title: 'A Gentle Pat',
        description: "Kick 20 Cells in 30 seconds to help Pessi study how Cells perceive physical interaction.",
        type: 'kick',
        targetType: 'npc',
        uiLabel: 'KICK COUNT',
        target: 'any',
        amount: 20,
        timeLimit: 30,
        reward: { type: 'resource', id: 'credits', amount: 800 },
        dialogue: {
            offer: [
                "Hey Intern! Did you know that Cells actually enjoy physical interaction?",
                "Can you give 20 of them a 'gentle pat' with your boot in 30 seconds?",
                "It’s for science!"
            ],
            retry: [
                "Ready to try 'A Gentle Pat' again? The cells are waiting for your love!"
            ],
            progress: ["Don't stop now! {amount} cells waiting for their 'gentle pat'!"],
            complete: [
                "Incredible! Look at those data spikes!"
            ],
            failed: ["Oops!", "Time's up!"],
            retry: ["Ready to try again? Or have you reached your limit. Intern?"],
            finished: ["Thanks again! My research on 'High-Velocity Affection' is going to be a department head-turner."]
        }
    },

    'quest_lana_cleanup': {
        id: 'quest_lana_cleanup',
        title: 'The Seedling Surge',
        description: "Lana is stressed by the 'over-revived' Musstrep tree spawning seedlings. Kick 15 seedlings in under 60 seconds.",
        type: 'kick',
        targetType: 'prop',
        uiLabel: 'SEEDLING COUNT',
        target: 'MUSSTREP_SEEDLING',
        amount: 15,
        timeLimit: 30,
        onCompleteFlag: 'lanaCleanedUp',
        reward: {
            type: 'resource_multi',
            rewards: [
                { type: 'resource', id: 'credits', amount: 200 },
                { type: 'exp', amount: 200 }
            ]
        },
        dialogue: {
            offer: [
                "*[Mumbling...]* Hmph. No one sees how much effort goes into this work... // *[Sighs]* They just wanna see the results and walk away... // *[Mumbling...]* Tired... so tired, might need a day off...",
                "Wait! You! What are you doing in the Withered Tree wing? // I'm Lana, Lead Scientist in Botanic Sector. Don't mind what you heard, I was just... talking to myself. // You're the new intern, aren't you? First time seeing the great tree? // This is the 'Musstrep'— a giant ancient tree my team and I revived from a dead husk. // It used to be a lifeless, shriveled husk, withered, tired... anyway...",
                "It’s remarkably healthy now. In fact, it’s spawning mischievous seedlings at an alarming rate. // They love hiding beside the furniture and snapping at ankles.",
                "So, it's your first day and no one has assigned you a task yet? // Fine, I'll give you one. Consider this an honor: your first task ever, given by me. // Kick 15 of these younglings in under 30 seconds. // Don't worry about them getting hurt; those seedlings have a shell harder than stone. Ready?"
            ],
            progress: ["Don't stop now!"],
            complete: [
                "Hmph. I suppose you have strong legs and keen eyes after all.",
                "Don't get too comfortable though; they'll be back eventually. They always do.",
                "I’m going back to my room now. // ...By the way, it was nice to meet you. Welcome to the Lab; you have much to learn here."
            ],
            failed: ["Hehe, did you see how their roots flared when they were running? // Ehem... I mean, you weren't quick enough. // Maybe you should scout where they’re hiding and plan a path first?"],
            retry: ["Ready to try again? Or have you reached your limit. Intern?"],
            finished: ["Oh, you cleaned all of them? What a show that was! // The seedlings were a bit slow today, weren't they?"]
        }
    }
};
