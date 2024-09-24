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

function getUnitDetails(unit) {
    const details = new Map();
    switch(unit) {
        case 'Militia':
            details.set('Attack', 1);
            details.set('Defend', 2);
            details.set('Cost', 2);
            break;
        case 'Infantry':
            details.set('Attack', 2);
            details.set('Defend', 4);
            details.set('Cost', 3);
            break;
        case 'Airborne Infantry':
            details.set('Attack', 2);
            details.set('Defend', 2);
            details.set('Cost', 3);
            break;
        case 'Elite Airborne Infantry':
            details.set('Attack', 3);
            details.set('Defend', 3);
            details.set('Cost', 3);
            break;
        case 'Marine':
            details.set('Attack', 2);
            details.set('Defend', 4);
            details.set('Cost', 4);
            break;
        case 'Mountain Infantry':
            details.set('Attack', 2);
            details.set('Defend', 4);
            details.set('Cost', 4);
            break;
        case 'Colonial Infantry':
            details.set('Attack', 2);
            details.set('Defend', 4);
            details.set('Cost', 4);
            break;
        case 'Foreign Legion':
            details.set('Attack', 2);
            details.set('Defend', 4);
            details.set('Cost', 4);
            break;
        case 'Gurkha':
            details.set('Attack', 2);
            details.set('Defend', 4);
            details.set('Cost', 4);
            break;
        case 'Artillery':
            details.set('Attack', 3);
            details.set('Defend', 3);
            details.set('Cost', 4);
            break;
        case 'Self-Propelled Artillery':
            details.set('Attack', 3);
            details.set('Defend', 3);
            details.set('Cost', 5);
            break;
        case 'Advanced Artillery':
            details.set('Attack', 4);
            details.set('Defend', 4);
            details.set('Cost', 4);
            break;
        case 'Advanced Self-Propelled Artillery':
            details.set('Attack', 4);
            details.set('Defend', 4);
            details.set('Cost', 5);
            break;
        case 'Katyusha':
            details.set('Attack', 5);
            details.set('Defend', 4);
            details.set('Cost', 5);
            break;
        case 'Anti Aircraft Artillery':
            details.set('Attack', 3);
            details.set('Defend', 3);
            details.set('Cost', 4);
        case 'Torpedo Boat Destroyer':
            details.set('Attack', 2);
            details.set('Defend', 2);
            details.set('Cost', 0);
            break;
        case 'Destroyer':
            details.set('Attack', 4);
            details.set('Defend', 4);
            details.set('Cost', 7);
            break;
        case 'Coastal Defense Ship':
            details.set('Attack', 4);
            details.set('Defend', 6);
            details.set('Cost', 0);
            break;
        case 'Light Cruiser':
            details.set('Attack', 5);
            details.set('Defend', 5);
            details.set('Cost', 9);
            break;
        case 'Heavy Cruiser':
            details.set('Attack', 6);
            details.set('Defend', 6);
            details.set('Cost', [5, 5]);
            break;
        case 'Battlecruiser':
            details.set('Attack', 7);
            details.set('Defend', 7);
            details.set('Cost', [7, 7]);
            break;
        case 'Battleship':
            details.set('Attack', 8);
            details.set('Defend', 8);
            details.set('Cost', [6, 6, 6]);
            break;
        case 'Heavy Battleship':
            details.set('Attack', 10);
            details.set('Defend', 10);
            details.set('Cost', [7, 7, 7]);
            break;
        case 'Light Carrier':
            details.set('Attack', 0);
            details.set('Defend', 1);
            details.set('Cost', [4, 4]);
            break;
        case 'Fleet Carrier':
            details.set('Attack', 0);
            details.set('Defend', 2);
            details.set('Cost', [5, 5, 5]);
            break;
        case 'Heavy Fleet Carrier':
            details.set('Attack', 0);
            details.set('Defend', 2);
            details.set('Cost', [6, 6, 6]);
            break;
        case 'Coastal Submarine':
            details.set('Attack', 2);
            details.set('Defend', 2);
            details.set('Cost', 0);
            break;
        case 'Submarine':
            details.set('Attack', 3);
            details.set('Defend', 3);
            details.set('Cost', 6);
            break;
        case 'Advanced Submarine':
            details.set('Attack', 4);
            details.set('Defend', 4);
            details.set('Cost', 7);
            break;
        case 'Naval Transport':
            details.set('Attack', 0);
            details.set('Defend', 0);
            details.set('Cost', 7);
            break;
        case 'Attack Transport':
            details.set('Attack', 0);
            details.set('Defend', 1);
            details.set('Cost', 7);
            break;
        case 'Fighter':
            details.set('Attack', 6);
            details.set('Defend', 6);
            details.set('Cost', 10);
            break;
        case 'Jet Fighter':
            details.set('Attack', 8);
            details.set('Defend', 8);
            details.set('Cost', 12);
            break;
        case 'Tactical Bomber':
            details.set('Attack', 7);
            details.set('Defend', 5);
            details.set('Cost', 11);
            break;
        case 'Medium Bomber':
            details.set('Attack', 7);
            details.set('Defend', 4);
            details.set('Cost', 11);
            break;
        case 'Strategic Bomber':
            details.set('Attack', 2);
            details.set('Defend', 2);
            details.set('Cost', 12);
            break;
        case 'Heavy Strategic Bomber':
            details.set('Attack', 2);
            details.set('Defend', 3);
            details.set('Cost', 13);
            break;
        case 'Seaplane':
            details.set('Attack', 3);
            details.set('Defend', 3);
            details.set('Cost', 7);
            break;
        case 'Air Transport':
            details.set('Attack', 0);
            details.set('Defend', 0);
            details.set('Cost', 8);
            break;
        case 'Heavy Air Transport':
            details.set('Attack', 0);
            details.set('Defend', 0);
            details.set('Cost', 10);
            break;
        case 'Cavalry':
            details.set('Attack', 3);
            details.set('Defend', 2);
            details.set('Cost', 3);
            break;
        case 'Motorized Infantry':
            details.set('Attack', 2);
            details.set('Defend', 4);
            details.set('Cost', 4);
            break;
        case 'Mechanized Infantry':
            details.set('Attack', 3);
            details.set('Defend', 4);
            details.set('Cost', 4);
            break;
        case 'Advanced Mechanized Infantry':
            details.set('Attack', 4);
            details.set('Defend', 5);
            details.set('Cost', 4);
            break;
        case 'Panzer Grenadier':
            details.set('Attack', 4);
            details.set('Defend', 5);
            details.set('Cost', 4);
            break;
        case 'Tank Destroyer':
            details.set('Attack', 3);
            details.set('Defend', 4);
            details.set('Cost', 5);
            break;
        case 'Light Tank':
            details.set('Attack', 3);
            details.set('Defend', 1);
            details.set('Cost', 4);
            break;
        case 'Medium Tank':
            details.set('Attack', 6);
            details.set('Defend', 5);
            details.set('Cost', 6);
            break;
        case 'T-34':
            details.set('Attack', 6);
            details.set('Defend', 5);
            details.set('Cost', 5);
            break;
        case 'Heavy Tank':
            details.set('Attack', 8);
            details.set('Defend', 7);
            details.set('Cost', 7);
            break;
        case 'Tiger I':
            details.set('Attack', 8);
            details.set('Defend', 7);
            details.set('Cost', 7);
            break;
    }
    return details;
}

class Unit {
    constructor(name, quantity) {
        this.name = name;
        this.quantity = quantity;
        this.unitClass = getUnitType(name);
        this.details = getUnitDetails(name);
    }
}

function makeUnit(name, quantity) {
    return new Unit(name, quantity);
}
