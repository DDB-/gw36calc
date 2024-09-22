const script = (url) => {
    const { protocol } = new URL(url, 'file://');
    switch (protocol) {
        case 'file:':
            return require('fs').readFileSync(`${process.cwd()}/${url}`, 'UTF8');
        case 'http:':
        case 'https:':
            return String(require('child_process').execSync(`wget -O - -o /dev/null '${url}'`))
        default:
            throw new Error('unsupported protocol');
    }
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
