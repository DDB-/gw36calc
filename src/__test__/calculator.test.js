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

test('get target select for an attack against a city', () => {
    let attack = makeArmy(['Infantry', 'Artillery', 'Medium Tank'], [6,2,2], 'Attack');
    let defend = makeArmy(['Infantry', 'Light Tank', 'Militia'], [3,1,4], 'Defend');
    let battle = makeBattle(attack, defend, ['City']);

    battle.attack.units.forEach((unit) => {
        expect(getIfTargetSelect(battle, unit, 'Attack', 1)).toBeUndefined();
    });

    battle.defend.units.forEach((unit) => {
        if (unit.unitClass === 'Infantry') {
            expect(getIfTargetSelect(battle, unit, 'Defend', 1))
                .toStrictEqual(makeTargetSelect('Unit Class', ['Vehicle']));
        } else {
            expect(getIfTargetSelect(battle, unit, 'Defend', 1)).toBeUndefined();
        }
    });
});

test('resolve with target selection', () => {
    let attack = makeArmy(['Infantry', 'Light Tank', 'Medium Tank'], [6,2,2], 'Attack');
    let defend = makeArmy(['Infantry', 'Militia'], [3,4], 'Defend');
    let battle = makeBattle(attack, defend, ['City']);
    let unit = defend.units[0];

    // City defender gets target select on a 1
    let targetSelect = getIfTargetSelect(battle, unit, 'Defend', 1);
    expect(targetSelect).not.toBeUndefined();

    let hits = makeHits();
    hits.hits = 1;
    hits.targetSelects = [targetSelect];

    attack = reconcileArmy(attack, hits);

    // Infantry defending in city has target select against vehicles at a 1
    // Because it is attacker selected, the most expensive is picked, Medium Tank
    // The regular hit is taken against the Infantry, as it is cheapest
    expect(attack.units[0].name).toBe('Infantry');
    expect(attack.units[0].quantity).toBe(5);
    expect(attack.units[1].name).toBe('Light Tank');
    expect(attack.units[1].quantity).toBe(2);
    expect(attack.units[2].name).toBe('Medium Tank');
    expect(attack.units[2].quantity).toBe(1);
});

test('vehicle target selections; target select overflow becomes normal hit', () => {
    let attack = makeArmy(['Tank Destroyer', 'T-34', 'Heavy Tank'], [2,2,2], 'Attack');
    let defend = makeArmy(['Infantry', 'Militia', 'Tiger I'], [4,4,2], 'Defend');
    let battle = makeBattle(attack, defend);

    let attackHits = makeHits();
    attack.units.forEach((unit) => {
        let targetSelect = getIfTargetSelect(battle, unit, 'Attack', 1);
        expect(targetSelect).not.toBeUndefined();
        attackHits.targetSelects.push(targetSelect);
    });

    let tigerI = defend.units[2];
    let targetSelect = getIfTargetSelect(battle, tigerI, 'Defend', 1);
    expect(targetSelect).not.toBeUndefined();
    let defendHits = makeHits();
    defendHits.hits += 1;
    defendHits.targetSelects = [targetSelect];

    attack = reconcileArmy(attack, defendHits);
    expect(attack.units[0].name).toBe('Tank Destroyer');
    expect(attack.units[0].quantity).toBe(1);
    expect(attack.units[1].name).toBe('T-34');
    expect(attack.units[1].quantity).toBe(2);
    expect(attack.units[2].name).toBe('Heavy Tank');
    expect(attack.units[2].quantity).toBe(1);

    defend = reconcileArmy(defend, attackHits);
    expect(defend.units.length).toBe(2);
    expect(defend.units[0].name).toBe('Militia');
    expect(defend.units[0].quantity).toBe(3);
    expect(defend.units[1].name).toBe('Infantry');
    expect(defend.units[1].quantity).toBe(4);
});

test('has first strike', () => {
    expect(hasFirstStrike(makeUnit('Infantry', 1))).toBe(false);
    expect(hasFirstStrike(makeUnit('Artillery', 1))).toBe(true);
    expect(hasFirstStrike(makeUnit('Anti Air Artillery', 1))).toBe(false);
    expect(hasFirstStrike(makeUnit('Fighter', 1))).toBe(false);

    const destroyerArmy = makeArmy(['Destroyer'], [1], 'Attack');
    const noDestroyerArmy = makeArmy(['Light Cruiser'], [1], 'Defend');
    expect(hasFirstStrike(makeUnit('Coastal Submarine', 1))).toBe(false);
    expect(hasFirstStrike(makeUnit('Submarine', 1), destroyerArmy)).toBe(false);
    expect(hasFirstStrike(makeUnit('Advanced Submarine', 1), noDestroyerArmy)).toBe(true);
});

test('army with no first strike never gets them', () => {
    const firstStrikeDefend = makeArmy(['Infantry', 'Artillery'], [8, 2], 'Defend');
    const noFirstStrikeAttack = makeArmy(['Infantry', 'Tactical Bomber'], [8, 2], 'Attack');
    const battle = makeBattle(noFirstStrikeAttack, firstStrikeDefend);
    for (let i = 0; i < 100; i++) {
        let hits = rollRoundForSide(battle, 'Attack', true);
        expect(hits.hits).toBe(0);
    }
});
