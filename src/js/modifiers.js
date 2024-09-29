const facilities = ['Fortification', 'Coastal Artillery'];
const battleTypes = ['Land', 'Amphibious Assault', 'Naval'];
const terrains = ['Normal', 'Mountains', 'Desert', 'Jungle', 'Marshes', 'Tundra/Ice'];
const terrainMods = ['Surrounded City', 'City', 'River'];

function getFacilities() {
    return facilities;
}

function getBattleTypes() {
    return battleTypes;
}

function getTerrains() {
    return terrains;
}

function getTerrainMods() {
    return terrainMods;
}

function getApplicableTerrains(terrain, hasRiver, hasCity, hasSurroundedCity) {
    const terrains = [];
    terrains.push(terrain);
    if (hasRiver) terrains.push('River');
    if (hasCity) {
        terrains.push('City');
    } else if (hasSurroundedCity) {
        terrains.push('Surrounded City');
    }

    return terrains;
}

function getTerrainModifiers(terrains, unit, side, round) {
    const modifiers = [];
    terrains.forEach((terrain) => {
        const modifier = getTerrainModifier(terrain, unit, side, round);
        if (modifier != 0) modifiers.push(modifier);
    });
    return modifiers;
}

function getTerrainModifier(terrain, unit, side, round) {
    const landUnits = ['Infantry', 'Artillery', 'AntiAir', 'Vehicle'];
    if (terrain === 'Mountains') {
        if (landUnits.indexOf(unit.unitClass) != -1) {
            if (['Mountain Infantry', 'Foreign Legion', 'Gurkha'].indexOf(unit.name) != -1) {
                return (side === 'Attack') ? 0 : 1;
            } else {
                return (side === 'Attack') ? -1 : 0;
            }
        }
    } else if (terrain === 'Desert') {
        if (landUnits.indexOf(unit.unitClass) != -1 && side === 'Attack') {
            if (['Foreign Legion'].indexOf(unit.name) != -1) {
                return 1;
            } else {
                return -1;
            }
        }
    } else if (terrain === 'Jungle') {
        if (['Vehicle'].indexOf(unit.unitClass) != -1) {
            return -2;
        } else if (['Gurkha'].indexOf(unit.name) != -1 && side === 'Attack') {
            return 1;
        }
    } else if (terrain === 'Marshes') {
        if (['Vehicle'].indexOf(unit.unitClass) != -1) {
            return -1;
        }
    } else if (terrain === 'River') {
        // TODO cancel penalty for Airborne Infantry if they are participating in airborne assault
        if (landUnits.indexOf(unit.unitClass) != -1
            && ['Marine'].indexOf(unit.name) == -1
            && side === 'Attack' && round === 1)
        {
            return -1;
        }
    } else if (terrain === 'City') {
        // TODO Will need to come back and add target select soon
        if ('Infantry' === unit.unitClass && side === 'Defend') {
            return 1;
        }
    } else if (terrain === 'Surrounded City') {
        return (side === 'Defend') ? -1 : 0;
    }

    return 0;
}
