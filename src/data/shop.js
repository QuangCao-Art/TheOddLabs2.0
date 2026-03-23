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
        oneTime: false
    }
};

export const shopState = {
    activeTab: 'buy',
    selectedItemId: null
};
