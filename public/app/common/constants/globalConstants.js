(function(angular) {
    angular.module('trafie')
    .constant('DISCIPLINES', ['60m','100m','200m','400m','800m','1500m','3000m','5000m','10000m','60m_hurdles','100m_hurdles','110m_hurdles','400m_hurdles','3000m_steeplechase','4x100m_relay','4x400m_relay','half_marathon','marathon','20km_race_walk','50km_race_walk','cross_country_running','high_jump','long_jump','triple_jump','pole_vault','shot_put','discus','hammer','javelin','pentathlon','heptathlon','decathlon'])
    .constant('DISCIPLINE_CATEGORIES', {
        time: ['60m', '100m', '200m', '400m', '800m', '1500m', '3000m', '5000m', '10000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeplechase', '4x100m_relay', '4x400m_relay', 'half_marathon', 'marathon', '20km_race_walk', '50km_race_walk', 'cross_country_running'],
        distance: ['high_jump', 'long_jump', 'triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin'],
        points: ['pentathlon', 'heptathlon', 'decathlon']
    })
    .constant('DISCIPLINES_MAP', {
        "60m": "DISCIPLINES.60M",
        "100m": "DISCIPLINES.100M",
        "200m": "DISCIPLINES.200M",
        "400m": "DISCIPLINES.400M",
        "800m": "DISCIPLINES.800M",
        "1500m": "DISCIPLINES.1500M",
        "3000m": "DISCIPLINES.3000M",
        "5000m": "DISCIPLINES.5000M",
        "10000m": "DISCIPLINES.10000M",
        "60m_hurdles": "DISCIPLINES.60M_HURDLES",
        "100m_hurdles": "DISCIPLINES.100M_HURDLES",
        "110m_hurdles": "DISCIPLINES.110M_HURDLES",
        "400m_hurdles": "DISCIPLINES.400M_HURDLES",
        "3000m_steeplechase": "DISCIPLINES.3000M_STEEPLECHASE",
        "4x100m_relay": "DISCIPLINES.4X100M_RELAY",
        "4x400m_relay": "DISCIPLINES.4X400M_RELAY",
        "half_marathon": "DISCIPLINES.HALF_MARATHON",
        "marathon": "DISCIPLINES.MARATHON",
        "20km_race_walk": "DISCIPLINES.20KM_RACE_WALK",
        "50km_race_walk": "DISCIPLINES.50KM_RACE_WALK",
        "cross_country_running": "DISCIPLINES.CROSS_COUNTRY_RUNNING",
        "high_jump": "DISCIPLINES.HIGH_JUMP",
        "long_jump": "DISCIPLINES.LONG_JUMP",
        "triple_jump": "DISCIPLINES.TRIPLE_JUMP",
        "pole_vault": "DISCIPLINES.POLE_VAULT",
        "shot_put": "DISCIPLINES.SHOT_PUT",
        "discus": "DISCIPLINES.DISCUS",
        "hammer": "DISCIPLINES.HAMMER",
        "javelin": "DISCIPLINES.JAVELIN",
        "pentathlon": "DISCIPLINES.PENTATHLON",
        "heptathlon": "DISCIPLINES.HEPTATHLON",
        "decathlon": "DISCIPLINES.DECATHLON"
    });
})(angular);