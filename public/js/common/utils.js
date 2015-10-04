// Define the object
var Utils = {};

//Patterns for input validation
Utils.ONLY_ALPHABETIC = /^[A-Za-z ]+$/;
Utils.ALPHABETIC_NUMS_DOT_UNDER = /^[A-Za-z_.0-9]+$/;
Utils.NUMBERS = /^[0-9]*$/;

Utils.LAZY_LOADING_BLOCK_SIZE = 10;


//object with disciplines grouped in categories
Utils.DISCIPLINES = {
    'time': [
        '60m',
        '100m',
        '200m',
        '400m',
        '800m',
        '1500m',
        '3000m',
        '5000m',
        '10000m',
        '60m_hurdles',
        '100m_hurdles',
        '110m_hurdles',
        '400m_hurdles',
        '3000m_steeplechase',
        '4x100m_relay',
        '4x400m_relay',
        'half_marathon',
        'marathon',
        '20km_race_walk',
        '50km_race_walk',
        'cross_country_running',
    ],
    'distance': [
        'high_jump',
        'long_jump',
        'triple_jump',
        'pole_vault',
        'shot_put',
        'discus',
        'hammer',
        'javelin'
    ],
    'points': [
        'pentathlon',
        'heptathlon',
        'decathlon'
    ]
};
