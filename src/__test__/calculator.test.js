const script = (path) => {
    return require('fs').readFileSync(`${process.cwd()}/${path}`, 'UTF8');
};

eval(script('src/js/units.js'));
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
    const army = constructArmy(units, quantities);

    expect(army.length).toBe(3);
    expect(army[0].name).toBe('Infantry');
    expect(army[0].unitClass).toBe('Infantry');
    expect(army[0].details.get('Attack')).toBe(2);
    expect(army[0].details.get('Defend')).toBe(4);

    expect(army[1].name).toBe('Artillery');
    expect(army[1].unitClass).toBe('Artillery');
    expect(army[1].details.get('Attack')).toBe(3);
    expect(army[1].details.get('Defend')).toBe(3);

    expect(army[2].name).toBe('Militia');
    expect(army[2].unitClass).toBe('Infantry');
    expect(army[2].details.get('Attack')).toBe(1);
    expect(army[2].details.get('Defend')).toBe(2);
});
