const infantry = [
    'Infantry', 'Militia', 'Airborne Infantry', 'Elite Airborne Infantry',
    'Marine', 'Mountain Infantry', 'Colonial Infantry', 'Foreign Legion', 'Gurkha'
];
const artillery = [
    'Artillery', 'Self-Propelled Artillery', 'Advanced Artillery', 'Anti Aircraft Artillery',
    'Advanced Self-Propelled Artillery', 'Katyusha'
];
const vehicles = [
    'Cavalry', 'Motorized Infantry', 'Mechanized Infantry', 'Advanced Mechanized Infantry',
    'Panzer Grenadier', 'Tank Destroyer', 'Light Tank', 'Medium Tank', 'T-34',
    'Heavy Tank', 'Tiger I'
];
const planes = [
    'Fighter', 'Jet Fighter', 'Tactical Bomber', 'Medium Bomber', 'Strategic Bomber',
    'Heavy Strategic Bomber', 'Seaplane', 'Air Transport', 'Heavy Air Transport'
];
const boats = [
    'Torpedo Boat Destroyer', 'Destroyer', 'Coastal Defense Ship', 'Light Cruiser',
    'Heavy Cruiser', 'Battlecruiser', 'Battleship', 'Heavy Battleship', 'Light Carrier',
    'Fleet Carrier', 'Heavy Fleet Carrier', 'Coastal Submarine', 'Submarine', 'Advanced Submarine',
    'Naval Transport', 'Attack Transport'
];
const units = [...infantry, ...artillery, ...vehicles, ...planes, ...boats];

function getUnits() {
    return units;
}

function isUnit(unit) {
    return (units.indexOf(unit) != -1);
}
