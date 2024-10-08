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

function getTerrainModifiers(terrains, unit, side, round, isBorder) {
    const modifiers = [];
    terrains.forEach((terrain) => {
        const modifier = getTerrainModifier(terrain, unit, side, round, isBorder);
        if (modifier != 0) modifiers.push(modifier);
    });
    return modifiers;
}

function getTerrainModifier(terrain, unit, side, round, isBorder) {
    const landUnits = ['Infantry', 'Artillery', 'AntiAir', 'Vehicle'];
    // Rule 1.7.0 Border terrains only apply round one
    if (!isBorder || round == 1) {
        // Rule 1.7.1
        if (terrain === 'Mountains') {
            if (landUnits.indexOf(unit.unitClass) != -1) {
                if (['Mountain Infantry', 'Foreign Legion', 'Gurkha'].indexOf(unit.name) != -1) {
                    return (side === 'Attack') ? 0 : 1;
                } else {
                    return (side === 'Attack') ? -1 : 0;
                }
            }
        } else if (terrain === 'Desert') {
            // Rule 1.7.2
            if (landUnits.indexOf(unit.unitClass) != -1 && side === 'Attack') {
                if (['Foreign Legion'].indexOf(unit.name) != -1) {
                    return 1;
                } else {
                    return -1;
                }
            }
        } else if (terrain === 'Jungle') {
            // Rule 1.7.3
            if (['Vehicle'].indexOf(unit.unitClass) != -1) {
                return -2;
            } else if (['Gurkha'].indexOf(unit.name) != -1 && side === 'Attack') {
                return 1;
            }
        } else if (terrain === 'Marshes') {
            // Rule 1.7.4
            if (['Vehicle'].indexOf(unit.unitClass) != -1) {
                return -1;
            }
        }
    }
    if (terrain === 'River') {
        // Rule 1.7.6
        // TODO cancel penalty for Airborne Infantry if they are participating in airborne assault
        if (round === 1 &&
            (['Infantry', 'Vehicle']).indexOf(unit.unitClass) != -1
            && ['Marine'].indexOf(unit.name) == -1
            && side === 'Attack')
        {
            return -1;
        }
    } else if (terrain === 'City') {
        // Rule 1.7.7
        if ('Infantry' === unit.unitClass && side === 'Defend') {
            return 1;
        }
    } else if (terrain === 'Surrounded City') {
        return (side === 'Defend') ? -1 : 0;
    }

    return 0;
}
