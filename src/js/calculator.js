function roll() {
    return Math.floor(Math.random() * 12) + 1;
}

function constructArmy(units, quantities) {
    const army = [];
    units.forEach((unit, index) => {
        army.push(makeUnit(unit, quantities[index]));
    });
    return army;
}

function simulate(attackUnits, attackUnitsQ, defendUnits, defendUnitsQ) {
    const attackArmy = constructArmy(attackUnits, attackUnitsQ);
    const defendArmy = constructArmy(defendUnits, defendUnitsQ);
}
