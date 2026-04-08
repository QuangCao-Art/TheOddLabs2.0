/**
 * Shop Data and State for The Odd Labs 2.0
 */

export const SHOP_ITEMS = {
    'biomass': {
        id: 'biomass',
        name: 'Biomass',
        desc: 'Raw biological material used for synthesis. Highly sought after by lab researchers.',
        icon: '',
        iconClass: 'icon-biomass',
        price: 100,
        sellPrice: 50,
        oneTime: false
    },
    'blueprint_stemmy': {
        id: 'blueprint_stemmy',
        name: 'Stemmy Blueprint',
        desc: 'A blueprint to create Stemmy.',
        icon: '',
        iconClass: 'icon-blueprint',
        price: 500,
        sellPrice: 0,
        oneTime: true
    },
    'blueprint_nitrophil': {
        id: 'blueprint_nitrophil',
        name: 'Nitrophil Blueprint',
        desc: 'A blueprint to create Nitrophil.',
        icon: '',
        iconClass: 'icon-blueprint',
        price: 900,
        sellPrice: 0,
        oneTime: true
    },
    'blueprint_cambihil': {
        id: 'blueprint_cambihil',
        name: 'Cambihil Blueprint',
        desc: 'A blueprint to create Cambihil.',
        icon: '',
        iconClass: 'icon-blueprint',
        price: 900,
        sellPrice: 0,
        oneTime: true
    },
    'blueprint_lydrosome': {
        id: 'blueprint_lydrosome',
        name: 'Lydrosome Blueprint',
        desc: 'A blueprint to create Lydrosome.',
        icon: '',
        iconClass: 'icon-blueprint',
        price: 900,
        sellPrice: 0,
        oneTime: false
    }
};

export const shopState = {
    activeTab: 'buy',
    selectedItemId: null
};
