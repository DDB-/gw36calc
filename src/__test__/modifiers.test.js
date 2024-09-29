const script = (path) => {
    return require('fs').readFileSync(`${process.cwd()}/${path}`, 'UTF8');
};

eval(script('src/js/units.js'));
eval(script('src/js/modifiers.js'));

test('getters return expected list', () => {
    const facilities = getFacilities();
    expect(facilities.length).toBe(2);

    const terrains = getTerrains();
    expect(terrains.length).toBe(6);
});

test('get expected terrain modifiers', () => {
    expect(getTerrainModifier('Normal', makeUnit('Infantry', 1), 'Attack', 1)).toBe(0);

    expect(getTerrainModifier('Mountains', makeUnit('Infantry', 1), 'Attack', 1)).toBe(-1);
    expect(getTerrainModifier('Mountains', makeUnit('Infantry', 1), 'Defend', 1)).toBe(0);
    expect(getTerrainModifier('Mountains', makeUnit('Mountain Infantry', 1), 'Attack', 1)).toBe(0);
    expect(getTerrainModifier('Mountains', makeUnit('Foreign Legion', 1), 'Defend', 1)).toBe(1);
    expect(getTerrainModifier('Mountains', makeUnit('Medium Tank', 1), 'Attack', 1)).toBe(-1);
    expect(getTerrainModifier('Mountains', makeUnit('Fighter', 1), 'Defend', 1)).toBe(0);

    expect(getTerrainModifier('Desert', makeUnit('Infantry', 1), 'Attack', 1)).toBe(-1);
    expect(getTerrainModifier('Desert', makeUnit('Artillery', 1), 'Attack', 1)).toBe(-1);
    expect(getTerrainModifier('Desert', makeUnit('Artillery', 1), 'Defend', 1)).toBe(-1);
    expect(getTerrainModifier('Desert', makeUnit('Foreign Legion', 1), 'Defend', 1)).toBe(0);
    expect(getTerrainModifier('Desert', makeUnit('Foreign Legion', 1), 'Attack', 1)).toBe(1);

    expect(getTerrainModifier('Jungle', makeUnit('Infantry', 1), 'Attack', 1)).toBe(0);
    expect(getTerrainModifier('Jungle', makeUnit('Medium Tank', 1), 'Attack', 1)).toBe(-2);
    expect(getTerrainModifier('Jungle', makeUnit('Light Tank', 1), 'Defend', 1)).toBe(-2);
    expect(getTerrainModifier('Jungle', makeUnit('Gurkha', 1), 'Attack', 1)).toBe(1);
    expect(getTerrainModifier('Jungle', makeUnit('Gurkha', 1), 'Defend', 1)).toBe(0);

    expect(getTerrainModifier('River', makeUnit('Infantry', 1), 'Attack', 1)).toBe(-1);
    expect(getTerrainModifier('River', makeUnit('Infantry', 1), 'Attack', 2)).toBe(0);
    expect(getTerrainModifier('River', makeUnit('Infantry', 1), 'Defend', 1)).toBe(0);
    expect(getTerrainModifier('River', makeUnit('Marine', 1), 'Attack', 1)).toBe(0);
    expect(getTerrainModifier('River', makeUnit('Medium Tank', 1), 'Attack', 1)).toBe(-1);
    expect(getTerrainModifier('River', makeUnit('Jet Fighter', 1), 'Attack', 1)).toBe(0);

    expect(getTerrainModifier('City', makeUnit('Infantry', 1), 'Attack', 1)).toBe(0);
    expect(getTerrainModifier('City', makeUnit('Infantry', 1), 'Defend', 1)).toBe(1);
    expect(getTerrainModifier('City', makeUnit('Medium Tank', 1), 'Attack', 1)).toBe(0);
    expect(getTerrainModifier('City', makeUnit('Jet Fighter', 1), 'Attack', 1)).toBe(0);

    getUnits().forEach((unit) => {
        expect(getTerrainModifier('Surrounded City', makeUnit(unit, 1), 'Attack', 1)).toBe(0);
        expect(getTerrainModifier('Surrounded City', makeUnit(unit, 1), 'Defend', 1)).toBe(-1);
    });
});

test('applicable terrains is expected', () => {
    expect(getApplicableTerrains('Normal', false, false, false)).toStrictEqual(['Normal']);
    expect(getApplicableTerrains('Mountains', false, false, false)).toStrictEqual(['Mountains']);
    expect(getApplicableTerrains('Mountains', true, false, false))
        .toStrictEqual(['Mountains', 'River']);

    expect(getApplicableTerrains('Jungle', true, true, false))
        .toStrictEqual(['Jungle', 'River', 'City']);

    expect(getApplicableTerrains('Marshes', true, true, true))
        .toStrictEqual(['Marshes', 'River', 'City']);

    expect(getApplicableTerrains('Tundra/Ice', true, false, true))
        .toStrictEqual(['Tundra/Ice', 'River', 'Surrounded City']);
});

test('multiple terrains applying 0 to many modifiers', () => {
    expect(getTerrainModifiers(['Mountains'], makeUnit('Infantry', 1), 'Attack', 1))
        .toStrictEqual([-1]);

    expect(getTerrainModifiers(['Mountains', 'Surrounded City'],
        makeUnit('Mountain Infantry', 1), 'Defend', 1))
        .toStrictEqual([1, -1]);

    expect(getTerrainModifiers(['Mountains', 'City'],
        makeUnit('Mountain Infantry', 1), 'Defend', 1))
        .toStrictEqual([1, 1]);
});
