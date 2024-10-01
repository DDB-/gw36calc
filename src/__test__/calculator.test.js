const script = (path) => {
    return require('fs').readFileSync(`${process.cwd()}/${path}`, 'UTF8');
};

eval(script('src/js/units.js'));
eval(script('src/js/modifiers.js'));
eval(script('src/js/calculator.js'));

test('100 rolls always falls between 1 and 12', () => {
    for(let i = 0; i < 100; i++) {
        expect(roll())
            .toBeGreaterThanOrEqual(1)
            .toBeLessThanOrEqual(12)
    }
});

test('army constructed with full unit details', () => {
    const units = ['Infantry', 'Artillery', 'Militia'];
    const quantities = [4, 2, 3];
    const army = makeArmy(units, quantities, 'Attack');

    expect(army.units.length).toBe(3);
    expect(army.side).toBe('Attack');

    expect(army.units[0].name).toBe('Infantry');
    expect(army.units[0].unitClass).toBe('Infantry');
    expect(army.units[0].quantity).toBe(4);
    expect(army.units[0].details.get('Attack')).toBe(2);
    expect(army.units[0].details.get('Defend')).toBe(4);

    expect(army.units[1].name).toBe('Artillery');
    expect(army.units[1].unitClass).toBe('Artillery');
    expect(army.units[1].quantity).toBe(2);
    expect(army.units[1].details.get('Attack')).toBe(3);
    expect(army.units[1].details.get('Defend')).toBe(3);

    expect(army.units[2].name).toBe('Militia');
    expect(army.units[2].unitClass).toBe('Infantry');
    expect(army.units[2].quantity).toBe(3);
    expect(army.units[2].details.get('Attack')).toBe(1);
    expect(army.units[2].details.get('Defend')).toBe(2);
});

test('calculate army ipp', () => {
    const army = makeArmy(['Infantry', 'Militia'], [6,2], 'Attack');
    // 6 * 3 + 2 * 2 = 22
    expect(calculateIpps(army)).toBe(22);

    const emptyArmy = makeArmy([],[],'Defend');
    expect(calculateIpps(emptyArmy))
        .toBeDefined()
        .toBe(0);
});

test('army reconciles by simple cost metric', () => {
    let army = makeArmy(['Infantry', 'Militia'], [6,2], 'Attack');
    let hits = makeHits();

    hits.hits = 1;
    reconcileArmy(army, hits);

    expect(army.units.length).toBe(2);
    expect(army.units[0].name).toBe('Militia');
    expect(army.units[0].quantity).toBe(1);
    expect(army.units[1].name).toBe('Infantry');
    expect(army.units[1].quantity).toBe(6);

    hits.hits = 2;
    reconcileArmy(army, hits);
    expect(army.units.length).toBe(1);
    expect(army.units[0].name).toBe('Infantry');
    expect(army.units[0].quantity).toBe(5);

    hits.hits = 5;
    reconcileArmy(army, hits);
    expect(army.units.length).toBe(0);
});

test('winner determined correctly and works with extra hits', () => {
    let attack = makeArmy(['Infantry', 'Artillery'], [6,2], 'Attack');
    let defend = makeArmy(['Militia'], [1], 'Defend');
    let battle = makeBattle(attack, defend);

    expect(hasWinner(battle)).toBe(false);
    expect(battle.winner).toBeFalsy();

    let hits = makeHits()
    hits.hits = 3;
    reconcileArmy(battle.defend, hits);

    expect(hasWinner(battle)).toBe(true);
    expect(battle.winner).toBe('Attack');
});

test('stats object works as expected', () => {
    const stats = makeStats(10);
    stats.attackIppLost = [3, 0, 6, 19, 6, 3, 9, 19, 6, 6];
    stats.defendIppLost = [8, 8, 8, 4, 8, 8, 8, 6, 8, 8];
    stats.attackWins = 8;
    stats.defendWins = 2;

    expect(stats.meanLoss('Defend')).toBe(8);
    expect(stats.meanLoss('Attack')).toBe(6);
    expect(stats.winPercent('Defend')).toBe(20);
    expect(stats.winPercent('Attack')).toBe(80);
    expect(stats.avgLoss('Defend')).toBeCloseTo(7.4);
    expect(stats.avgLoss('Attack')).toBeCloseTo(7.7);
});

test('target selects correctly determined if they apply', () => {
    let targetSelect = makeTargetSelect('Unit Class', ['Infantry', 'Vehicle', 'Artillery']);
    expect(targetSelect.applies(makeUnit('Infantry', 1))).toBeTruthy();
    expect(targetSelect.applies(makeUnit('Militia', 1))).toBeTruthy();
    expect(targetSelect.applies(makeUnit('Medium Tank', 1))).toBeTruthy();
    expect(targetSelect.applies(makeUnit('Self-Propelled Artillery', 1))).toBeTruthy();
    expect(targetSelect.applies(makeUnit('Jet Fighter', 1))).toBeFalsy();

    targetSelect = makeTargetSelect('Unit Name', ['Infantry']);
    expect(targetSelect.applies(makeUnit('Infantry', 1))).toBeTruthy();
    expect(targetSelect.applies(makeUnit('Militia', 1))).toBeFalsy();

    targetSelect = makeTargetSelect('Invalid', ['Infantry']);
    expect(targetSelect.applies(makeUnit('Infantry', 1))).toBeFalsy();
    expect(targetSelect.applies(makeUnit('Militia', 1))).toBeFalsy();
});
