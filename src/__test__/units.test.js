const script = (url) => {
    return require('fs').readFileSync(`${process.cwd()}/${url}`, 'UTF8');
};

eval(script('src/js/units.js'));

test('getUnits returns a list of expected size', () => {
    const unitList = getUnits();
    expect(unitList).toBeDefined();
    expect(unitList.length).toBeGreaterThan(1);
});

test('isUnit correctly determines unit', () => {
    expect(isUnit('Infantry')).toBeTruthy();
    expect(isUnit('Foofantry')).toBeFalsy();
});

test('getUnitIndex retrieves proper index', () => {
    let unitList = ['Infantry', 'Militia', 'Marine', 'Jet Fighter'];
    expect(getUnitIndex('Infantry', unitList)).toBe(0);
    expect(getUnitIndex('Marine', unitList)).toBe(2);
    expect(getUnitIndex('Fighter', unitList)).toBe(-1);
});

test('getUnitType correctly identifies unit type', () => {
    expect(getUnitType('Marine')).toBe('Infantry');
    expect(getUnitType('Destroyer')).toBe('Boat');
    expect(getUnitType('Medium Bomber')).toBe('Plane');
    expect(getUnitType('Self-Propelled Artillery')).toBe('Artillery');
    expect(getUnitType('Foo Fighter')).toBe('Invalid');
});

test('Unit class constructs as expected', () => {
    const unit = makeUnit('Marine', 3);
    expect(unit.name).toBe('Marine');
    expect(unit.quantity).toBe(3);
    expect(unit.unitClass).toBe('Infantry');
    expect(unit.details.get('Attack')).toBe(2);
    expect(unit.details.get('Defend')).toBe(4);
});

test('all units construct with values', () => {
    const allUnits = getUnits();
    allUnits.forEach((unitName, index) => {
        const unit = makeUnit(unitName, index);
        expect(unit.name).toBe(unitName);
        expect(unit.quantity).toBe(index);
        expect(unit.details.get('Attack'))
            .toBeDefined()
            .toBeGreaterThanOrEqual(0)
            .toBeLessThan(12);
        expect(unit.details.get('Defend'))
            .toBeDefined()
            .toBeGreaterThanOrEqual(0)
            .toBeLessThan(12);
        
        const cost = unit.details.get('Cost');
        expect(cost).toBeDefined()
        if (Array.isArray(cost)) {
            cost.forEach((stageCost) => {
                expect(stageCost).toBeGreaterThanOrEqual(0);
            });
        } else {
            expect(cost).toBeGreaterThanOrEqual(0);
        }
        
    });
});
