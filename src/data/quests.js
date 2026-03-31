export const QUESTS = {
    'quest_wild_stemmy': {
        id: 'quest_wild_stemmy',
        title: 'Wild Stemmy Hunt',
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
        type: 'synthesis',
        target: 'nitrophil',
        amount: 1,
        reward: { type: 'item', id: 'CARD01' }, // Example card
        consume: false,
        dialogue: {
            offer: ["I need a Nitrophil cell for an experiment.", "Could you synthesize one for me?"],
            progress: ["Still waiting on that Nitrophil...", "Remember, you need Biomass and a Blueprint."],
            complete: ["Perfect specimen!", "Please take this C-Card as payment."],
            finished: ["Nitrophil is a fascinating unit, isn't it?"]
        }
    },
    'quest_collect_key': {
        id: 'quest_collect_key',
        title: 'Lost Property',
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
    }
};

export const MAIN_QUEST_LOGS = {
    'initialization': {
        title: '[MAIN] PROTOCOL: INITIALIZATION',
        objective: 'Select your first Companion Cell.',
        narrative: 'Day 1 at Odd Labs. Honestly? This place is terrifyingly beautiful. I\'m supposed to \'pair\' with a sentient cell today. They\'re way bigger than the textbooks said (15cm!), and they almost seem to be watching me back. Time to see which one wants to be my partner in this maze.'
    },
    'first_duel': {
        title: '[MAIN] THE GATEKEEPER\'S VIBE',
        objective: 'Survive Jenzi\'s introductory diagnostic.',
        narrative: 'Jenzi says I\'ve got \'main character energy,\' but she’s still making me undergo a \'diagnostic duel.\' She’s cool, but she keeps teasing me about some \'weird smells\' and a cover-up. If I can beat her, maybe she’ll actually tell me what she knows about the Incident.'
    },
    'atrium_threshold': {
        title: '[MAIN] THE ATRIUM THRESHOLD',
        objective: 'Find Log #001 near the specimen tanks.',
        narrative: 'I’m techincally \'in.\' The Atrium is massive, but it feels like the whole building is holding its breath. Jenzi hinted that someone dropped a datapad near the specimen tanks. I need to find it; the official \'Ionization Leak\' story is starting to feel like a corporate fairy tale.'
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
        narrative: 'I have the key. I have the map. Now I just have the Director. Capsain looks like he hasn\'t slept since 2027. He keeps shouting about \'anomalies,\' but I found a draft of a \'Noodle Review\' in his private files. Is the head of Odd Labs really hiding a portal to a chili-based disaster?'
    },
    'spicy_origin': {
        title: '[MAIN] THE SPICY ORIGIN',
        objective: 'Locate the Origin Nitrophil in the Old Lab.',
        narrative: 'Capsain is down. He gave me a bottle of \'Inferno Sauce\' and looked like his world was ending. The secret is in the basement—the Old Lab. I\'m going to find the \'Origin.\' If the legend is true, this whole facility was built on a beautiful, spicy accident.'
    }
};

