export const QUESTS = {
    'quest_wild_stemmy': {
        id: 'quest_wild_stemmy',
        title: 'Wild Stemmy Hunt',
        description: "Defeat 5 Wild Stemmies to support the lab's behavioral research.",
        type: 'defeat',
        target: 'stemmy_wild', // Matches opponentId in main.js
        amount: 5,
        reward: { type: 'log', id: 'Log010' },
        consume: false,
        dialogue: {
            offer: ["I'm doing research on Stemmy behavior.", "Could you defeat 5 Wild Stemmies for me?"],
            progress: ["How's the hunt going?", "You've defeated {progress} out of 5."],
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
        reward: { type: 'item', id: 'CARD01' }, // Example card
        consume: false,
        dialogue: {
            offer: ["I need a Nitrophil cell for an experiment.", "Could you synthesize one for me?"],
            progress: ["Still waiting on that Nitrophil...", "Remember, you need Biomass and a Blueprint."],
            complete: ["Perfect specimen!", "Please take this C-Chip as payment."],
            finished: ["Nitrophil is a fascinating unit, isn't it?"]
        }
    },
    'quest_collect_key': {
        id: 'quest_collect_key',
        title: 'Lost Property',
        description: "Find an old Key Card lost somewhere in the Botanic Sector.",
        type: 'collect',
        target: 'Quest01', // ID from Overworld objects/Item pickups
        amount: 1,
        reward: { type: 'resource', id: 'credits', amount: 500 },
        consume: true,
        dialogue: {
            offer: ["I lost my old Key Card somewhere in the Botanic Sector.", "If you find it, I'll pay you well."],
            progress: ["Any luck finding that Key Card?", "It should be near some plants."],
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
                "I am not a ghost. I am merely a witness... // one of the first souls to walk this earth when the world was still green and the masters were ancient. // I remember the first sun before it was hidden behind these walls.",
                "You look so much like them. The same spark in your eyes, the same fragile determination. // It warms these old wires just to see you standing here—a child of the original sun.",
                "It is that same spark I see in the Lydrosome—specimens of profound, osmotic intelligence that remind me of the potential we once held. // Bring me one with Efficiency Level 1, and I shall share with you the truth of our genesis. // You deserve to know who we really are, Child."
            ],
            progress: ["The history of this lab is a circle, Child. // I'm waiting for a Lydrosome with high-level efficiency. Master the technology without letting it consume your spark."],
            complete: [
                "Remarkable. The Lydrosome's harmony is perfect... almost like it remembers the source itself. // You've mastered the technology without letting it consume your spark.",
                "Lily gave us life to save her people, but she accidentally gave us a heart that beats for its own reasons—// and a soul that neither of the ancient races could have ever calculated.",
                "Fox calls us a 'mistake.' Lily calls us a 'tragedy.' // But I look at you, and I see more than a designed resource. // We are the 'Accidental Genesis'—the unexpected children of a hungry solution that has long since passed into myth.",
                "As promised, here is the secret of this lab. // It's Log #020. Read it well; it is the truth that turns a circle into a straight line. // We exist now, and that is the only truth that matters."
            ],
            finished: [
                "The history of this lab is a circle, Child, but you have the potential to turn it into a straight line. // You don't have to be a weapon for the Archeons, and you don't have to be food for the Hemophylls.", 
                "You just have to be human. Go now, and master the technology they left behind. // The next Purge is warming its engines, but the Cells... they are the only ones the Machine cannot delete."
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
                "Can you kick 3 objects in under 20 seconds?",
                "It's the only way to calibrate the bio-sensors in this sector."
            ],
            retry: [
                "Diagnostic failed. The sensors didn't catch enough impact data.",
                "Want to try the High-Pressure Kick Test again for 300 LC?"
            ],
            progress: ["Clock is ticking, Intern! {amount} more kicks needed!"],
            complete: [
                "Calibration successful! Sensors are green across the board.",
                "Here is your compensation for the high-intensity workout."
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
                "Hey Intern! Quick question—did you know that Cells actually enjoy physical interaction?",
                "They respond to affection just like a pet, but their dense sensory nodes are... well, unique. // Our research suggests that a soft head pat and a firm, high-velocity kick are perceived as the exact same sensation of love!",
                "I need to study their reaction to high-frequency affection. Can you give 20 of them a 'gentle pat' with your boot in 30 seconds?",
                "It’s for science, and I’m sure they’ll appreciate the attention!"
            ],
            retry: [
                "The data stream cut out. I think you weren't showing enough 'affection' quickly enough for the sensors to stabilize.",
                "Ready to try 'A Gentle Pat' again? The cells are waiting for your love, and I've still got 800 LC for the data!"
            ],
            progress: ["Don't stop now! You still have {amount} cells waiting for their 'gentle pat'!"],
            complete: [
                "Incredible! Look at those data spikes! The cells are absolutely glowing from all that interaction.",
                "It turns out high-velocity affection is the most efficient way to keep them happy.",
                "Here is your reward. You’ve got a real talent for... well, whatever that was!"
            ],
            finished: ["Thanks again! My research on 'High-Velocity Affection' is going to be a department head-turner for sure."]
        }
    }
};

export const MAIN_QUEST_LOGS = {
    'initialization': {
        title: '[MAIN] PROTOCOL: INITIALIZATION',
        objective: 'Select your first Companion Cell.',
        narrative: 'Day 1 at Odd Labs. Honestly? This place is terrifyingly beautiful. I\'m supposed to \'pair\' with a sentient cell today. They\'re way bigger than the textbooks said, and they almost seem to be watching me back. Time to see which one wants to be my partner in this maze.'
    },
    'first_duel': {
        title: '[MAIN] THE GATEKEEPER\'S VIBE',
        objective: 'Survive Jenzi\'s introductory diagnostic.',
        narrative: 'Jenzi’s got this refreshing, honest energy that actually makes me believe her when she says I’ve got potential. She isn’t just being nice—she’s testing me because she thinks I can handle it. If I can win this duel, I’ll know for sure that I’m not just another hire, but someone who actually belongs in this Lab.'
    },
    'atrium_threshold': {
        title: '[MAIN] THE ATRIUM THRESHOLD',
        objective: 'Find Log #001 near the specimen tanks.',
        narrative: 'Phew, what a test. The Atrium doors are still locked, and Jenzi is playing coy. She hinted that someone dropped a datapad near the specimen tanks in this wing. I need to find it.'
    },
    'atrium_archive': {
        title: '[MAIN] ATRIUM ARCHIVE',
        objective: 'Archive 5 DataLogs and battle Jenzi again.',
        narrative: 'I\'ve been scrounging through the Atrium desks. Mention of \'Point Zero\' and \'Noodle Tuesday\' is everywhere. Jenzi is ready to spill the \'tea\' about the Incident, but only if I win this next duel. She says the Director\'s story is fishy... well, more like spicy.'
    },
    'botanic_secrets': {
        title: '[MAIN] PETALS AND SECRETS',
        objective: 'Defeat Lana to secure the Old Lab Key.',
        narrative: 'Scientist Lana is... intense. She treats her Cambihils like royalty and me like a budget virus. She’s definitely hiding something about the Director\'s \'private research.\' If I want that key to the restricted wing, I\'m going to have to out-sync her in a fight.'
    },
    'osmotic_revelations': {
        title: '[MAIN] OSMOTIC REVELATIONS',
        objective: 'Defeat Dyzes to retrieve the Old Data Stick.',
        narrative: 'Dyzes is the \'chillest\' guy here, but even he looks nervous when I mention the Old Lab. He says the truth is \'fluid.\' He’s got an old data stick that supposedly maps out a hidden sector. If I can stay in sync during his Lydrosome test, I might finally have a map to the truth.'
    },
    'executive_truth': {
        title: '[MAIN] THE EXECUTIVE TRUTH',
        objective: 'Confront Director Capsain in his suite.',
        narrative: 'I have the key. I have the map. Now I just have the Director. Capsain looks like he hasn\'t slept since 2027. He’s a frantic mess of high-level anxiety and corporate paranoia, acting more like a man guarding a haunted house than a scientific research facility. Something tells me he’s much closer to the edge than he lets on. Is the head of Odd Labs really hiding a portal to a chili-based disaster?'
    },
    'spicy_origin': {
        title: '[MAIN] THE SPICY ORIGIN',
        objective: 'Locate the Origin Nitrophil in the Old Lab.',
        narrative: 'Capsain is down. He gave me a bottle of \'Inferno Sauce\' and looked like his world was ending. The secret is in the basement—the Old Lab. I\'m going to find the \'Origin.\' If the legend is true, this whole facility was built on a beautiful, spicy accident.'
    }
};

