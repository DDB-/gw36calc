const units = ['Infantry', 'Militia', 'Marine', 'Artillery'];
let attackerUnits = [];
let defenderUnits = [];

function getUnits() {
    return units;
}

function getUnitsForSide(side) {
    if (side === "attack") {
        return attackerUnits;
    } else {
        return defenderUnits;
    }
}

function addUnit(side, unit) {
    if (units.indexOf(unit) == -1) {
        console.log(unit);
        return;
    }
    if (side === "attack") {
        attackerUnits.push(unit)
    } else {
        defenderUnits.push(unit)
    }
}
