/**
 * SIDE_QUESTS: Optional tasks given by NPCs across the lab.
 * These provide rewards like logs, credits, and collectible cards.
 */
export const SIDE_QUEST_DATA = {
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
    'quest_collect_key': {
        id: 'quest_collect_key',
        title: 'Lost Property',
        description: "Find an old Key Card lost somewhere in the Botanic Sector.",
        type: 'collect',
        target: 'Quest01',
        amount: 1,
        reward: {
            type: 'resource_multi',
            rewards: [
                { type: 'resource', id: 'credits', amount: 500 },
                { type: 'exp', amount: 500 }
            ]
        },
        consume: true,
        dialogue: {
            offer: ["I lost my old Key Card somewhere in the Botanic Sector.", "If you find it, I'll pay you well."],
            progress: ["Any luck finding that Key Card?", "It should be near some plants."],
            offer_completed: [
                "You found it! // Thank goodness, that key grants access to the high-priority archives."
            ],
            complete: ["My Key Card! Thank you so much.", "Here are the credits I promised."],
            finished: ["I should really be more careful with my belongings."]
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
