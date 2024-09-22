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

function getUnitIndex(unit, unitList) {
    for (let i = 0; i < unitList.length; i++) {
        if (unit === unitList[i]) {
            return i;
        }
    }
    return -1;
}

function getUnitType(unit) {
    if (infantry.indexOf(unit) != -1) {
        return 'Infantry';
    } else if (artillery.indexOf(unit) != -1) {
        return 'Artillery';
    } else if (vehicles.indexOf(unit) != -1) {
        return 'Vehicle';
    } else if (planes.indexOf(unit) != -1) {
        return 'Plane';
    } else if (boats.indexOf(unit) != -1) {
        return 'Boat';
    }

    return "Invalid";
}
