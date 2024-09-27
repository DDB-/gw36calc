const script = (path) => {
    return require('fs').readFileSync(`${process.cwd()}/${path}`, 'UTF8');
};

eval(script('src/js/modifiers.js'));

test('getters return expected list', () => {
    const facilities = getFacilities();
    expect(facilities.length).toBe(2);

    const terrains = getTerrains();
    expect(terrains.length).toBe(6);
});
