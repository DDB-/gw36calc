class Army {
    constructor(units, quantities, side) {
        this.side = side;
        this.units = [];
        units.forEach((unit, index) => {
            this.units.push(makeUnit(unit, quantities[index]));
        });
    }
}

function makeArmy(units, quantities, side) {
    return new Army(units, quantities, side);
}

class IppValues {
    constructor(startingAttack, startingDefend) {
        this.startingAttack = startingAttack;
        this.startingDefend = startingDefend;
    }
}

function calculateIpps(army) {
    let ippValue = 0;
    army.units.forEach((unit) => {
        ippValue += unit.details.get('Cost') * unit.quantity;
    });
    return ippValue;
}

function roundForDisplay(value) {
    if (value % 1 != 0) {
        return value.toFixed(2);
    }
    return value;
}

class Stats {
    constructor(rounds) {
        this.rounds = rounds;
        this.ties = 0;
        this.attackWins = 0;
        this.defendWins = 0;
        this.attackIppLost = [];
        this.defendIppLost = [];
    };

    avgLoss(side) {
        if (this.attackIppLost.length === 0) {
            return 0;
        }
        if (side == 'Attack') {
            return this.attackIppLost.reduce((a,b) => a + b) / this.rounds;
        } else {
            return this.defendIppLost.reduce((a,b) => a + b) / this.rounds;
        }
    }

    meanLoss(side) {
        if (this.attackIppLost.length === 0) {
            return 0;
        }
        if (side == 'Attack') {
            this.attackIppLost.sort((a,b) => a - b);
            return this.attackIppLost[this.rounds/2];
        } else {
            this.defendIppLost.sort((a,b) => a - b);
            return this.defendIppLost[this.rounds/2];
        }
    }

    winPercent(side) {
        if (side == 'Attack') {
            return this.attackWins / this.rounds * 100;
        } else {
            return this.defendWins / this.rounds * 100;
        }
    }

    winDisplay(side) {
        return roundForDisplay(this.winPercent(side)) + "%";
    }

    avgLossDisplay(side) {
        return roundForDisplay(this.avgLoss(side));
    }

}

function makeStats(rounds) {
    return new Stats(rounds);
}

class Battle {
    constructor(attack, defend, terrains, isBorder) {
        this.attack = attack;
        this.defend = defend;
        this.terrains = terrains;
        this.isBorder = isBorder;
        this.round = 1;
        this.winner = '';
        this.ippValues = new IppValues(
            calculateIpps(attack), calculateIpps(defend)
        );
    }
}

function makeBattle(attack, defend, terrains, isBorder) {
    return new Battle(attack, defend, terrains ?? ['Normal'], isBorder ?? false);
}

class Hits {
    constructor() {
        this.hits = 0;
        this.targetSelects = [];
    }
}

function makeHits() {
    return new Hits();
}

class TargetSelect {
    constructor(targetType, targets, attackSelect, strict) {
        this.targetType = targetType;
        this.targets = targets;
        // By default, the attacker will pick which units are target selected
        // However, this class will also be used for things like air superiority
        // Where the defender will pick their losses, but the losses must be planes
        this.attackSelect = attackSelect ?? true;
        // While most target selects revert to normal hits if there is no eligible
        // target, there are a couple of units who can only hit certain units
        // so this helps prioritize using those hits if there are available targets
        this.strict = strict ?? false;
    }

    applies(unit) {
        if (this.targetType === 'Unit Class') {
            return (this.targets.indexOf(unit.unitClass) != -1);
        } else if (this.targetType === 'Unit Name') {
            return (this.targets.indexOf(unit.name) != -1);
        }
        return false;
    }
}

function makeTargetSelect(targetType, targets, attackSelect, strict) {
    return new TargetSelect(targetType, targets, attackSelect, strict);
}

function getIfTargetSelect(battle, unit, side, diceRoll) {
    // 1.7.7 Infantry class units defending a city target select
    if (side === 'Defend' && unit.unitClass === 'Infantry' && diceRoll === 1) {
        return new TargetSelect('Unit Class', ['Vehicle'])
    }

    return undefined;
}

function clamp(num, min, max) {
    if (num <= min) return min;
    if (num >= max) return max;
    return num;
}

function roll() {
    return Math.floor(Math.random() * 12) + 1;
}

function getUnitResolved(battle, unit, side) {
    const modifiers = getTerrainModifiers(battle.terrains, unit, side, 
        battle.round, battle.isBorder);
    // Rule 0.5b, you only get your highest positive modifier, and lowest negative modifier
    // Get the highest positive modifier, if it exists, else 0
    const maxPositiveMod = clamp(Math.max(...modifiers), 0, 12);
    // Get the lowest negative modifier, if it exists, else 0
    const maxNegativeMod = clamp(Math.min(...modifiers), -12, 0);

    // You can't go below 1 or above 12 regardless of bonuses
    return clamp(unit.details.get(side) + maxPositiveMod + maxNegativeMod, 1, 12);
}

function rollRoundForSide(battle, side) {
    const army = (side === 'Attack') ? battle.attack : battle.defend;
    const hits = new Hits();
    army.units.forEach((unit) => {
        for (let i = 0; i < unit.quantity; i++) {
            const diceRoll = roll();
            const resolvedValue = getUnitResolved(battle, unit, side);
            if (diceRoll <= resolvedValue) {
                const targetSelect = getIfTargetSelect(battle, unit, side, diceRoll);
                hits.hits += 1;
            }
        }
    });
    return hits;
}

function reconcileArmy(army, hits) {
    let sortedUnits = army.units.sort((a,b) => {
        return a.details.get('Cost') - b.details.get('Cost');
    });

    while (hits.hits > 0) {
        if (sortedUnits.length == 0) {
            break;
        }

        hits.hits -= 1;
        sortedUnits[0].quantity -= 1;
        if (sortedUnits[0].quantity == 0) {
           sortedUnits.splice(0,1); 
        }
    }

    army.units = sortedUnits;
    return army;
}

function hasWinner(battle) {
    if (battle.attack.units.length == 0) {
        battle.winner = 'Defend';
    } else if (battle.defend.units.length == 0) {
        if (battle.winner != 'Defend') {
            battle.winner = 'Attack';
        } else {
            battle.winner = 'Tie';
        }
    } else {
        return false;
    }

    battle.ippValues.endingDefend = calculateIpps(battle.defend);
    battle.ippValues.endingAttack = calculateIpps(battle.attack);

    return true;
}

function rollBattle(battle, stats) {
    while(!hasWinner(battle)) {
        let attackHits = rollRoundForSide(battle, 'Attack');
        let defendHits = rollRoundForSide(battle, 'Defend');
        reconcileArmy(battle.attack, defendHits);
        reconcileArmy(battle.defend, attackHits);
        battle.round += 1;
    }
    updateStats(battle, stats);
}

function updateStats(battle, stats) {
    if (battle.winner == 'Defend') {
        stats.defendIppLost.push(
            battle.ippValues.startingDefend - battle.ippValues.endingDefend
        );
        stats.attackIppLost.push(battle.ippValues.startingAttack);
        stats.defendWins += 1;
    } else if (battle.winner == 'Attack') {
        stats.attackIppLost.push(
            battle.ippValues.startingAttack - battle.ippValues.endingAttack
        );
        stats.defendIppLost.push(battle.ippValues.startingDefend);
        stats.attackWins += 1;
    } else {
        stats.ties += 1;
        stats.defendIppLost.push(battle.ippValues.startingDefend);
        stats.attackIppLost.push(battle.ippValues.startingAttack);
    }
}

function simulate(attackUnits, attackUnitsQ, defendUnits, defendUnitsQ,
        selectedTerrain, hasRiver, hasCity, hasSurroundedCity, isBorderTerrain) {
    const rounds = 1000;
    const stats = new Stats(rounds);
    const battleTerrains = getApplicableTerrains(selectedTerrain, hasRiver, hasCity, hasSurroundedCity);
    for (let i = 0; i < stats.rounds; i++) {
        const battle = new Battle(
            new Army(attackUnits, attackUnitsQ, 'Attack'),
            new Army(defendUnits, defendUnitsQ, 'Defend'),
            battleTerrains, isBorderTerrain
        );
        rollBattle(battle, stats);
    }
    console.log(`Attacker won ${stats.attackWins} times, losing AVG:${stats.avgLoss('Attack')}, MEAN:${stats.meanLoss('Attack')}`);
    console.log(`Defender won ${stats.defendWins} times, losing AVG:${stats.avgLoss('Defend')}, MEAN:${stats.meanLoss('Defend')}`);
    console.log(`There were ${stats.ties} ties`);
    return stats;
}
