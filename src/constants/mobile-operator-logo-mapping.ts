export const MobileOperatorLogoMapping: {name:string, imageUri: NodeRequire, BBPSBillerID: string, BBPSBillerName: string }[] = [
    { name: 'airtel', imageUri: require('../../assets/logos/mobile-operators/airtel-logo.jpg'),  BBPSBillerID: 'BILAVAIRTEL001', BBPSBillerName: 'Airtel' },
    { name: 'bsnl', imageUri: require('../../assets/logos/mobile-operators/bsnl.png'), BBPSBillerID: 'BILAVBSNL00001', BBPSBillerName: 'BSNL'},
    { name: 'jio', imageUri: require('../../assets/logos/mobile-operators/jio.png'), BBPSBillerID: 'BILAVJIO000001', BBPSBillerName: 'Jio'},
    { name: 'vi', imageUri: require('../../assets/logos/mobile-operators/vi.png'), BBPSBillerID: 'BILAVVI0000001', BBPSBillerName: 'VI'},
    { name: 'voda', imageUri: require('../../assets/logos/mobile-operators/vi.png'), BBPSBillerID: 'BILAVVI0000001', BBPSBillerName: 'VI'},
]


export const MunimultiOperatorLogoMapping: {op: number, provider: string} [] = [
    { "op": 1, "provider": "AirTel" },
    { "op": 604, "provider": "airtel up east" },
    { "op": 2, "provider": "BSNL" },
    { "op": 32, "provider": "BSNL Special" },
    { "op": 505, "provider": "DOCOMO RECHARGE" },
    { "op": 506, "provider": "DOCOMO SPECIAL" },
    { "op": 4, "provider": "Idea" },
    { "op": 167, "provider": "Jio" },
    { "op": 5, "provider": "Vodafone" }
]