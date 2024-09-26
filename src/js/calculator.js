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
        if (side == 'Attack') {
            return this.attackIppLost.reduce((a,b) => a + b) / this.rounds;
        } else {
            return this.defendIppLost.reduce((a,b) => a + b) / this.rounds;
        }
    }

    meanLoss(side) {
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
}

function makeStats(rounds) {
    return new Stats(rounds);
}

class Battle {
    constructor(attack, defend) {
        this.attack = attack;
        this.defend = defend;
        this.round = 1;
        this.winner = '';
        this.ippValues = new IppValues(
            calculateIpps(attack), calculateIpps(defend)
        );
    }
}

function makeBattle(attack, defend) {
    return new Battle(attack, defend);
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

function roll() {
    return Math.floor(Math.random() * 12) + 1;
}

function rollRoundForSide(army) {
    const hits = new Hits();
    army.units.forEach((unit) => {
        for (let i = 0; i < unit.quantity; i++) {
            const diceRoll = roll();
            if (diceRoll <= unit.details.get(army.side)) {
                hits.hits += 1;
            }
        }
    });
    return hits;
}

function setEffectiveRoll(army) {
    // Consider pairing of artillery and infantry
    const artilleryCount = 0;

    // Consider terrain
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
        let attackHits = rollRoundForSide(battle.attack, 'Attack');
        let defendHits = rollRoundForSide(battle.defend, 'Defend');
        reconcileArmy(battle.attack);
        reconcileArmy(battle.defend);
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

function simulate(attackUnits, attackUnitsQ, defendUnits, defendUnitsQ) {
    const rounds = 1000;
    const stats = new Stats(rounds);
    for (let i = 0; i < stats.rounds; i++) {
        const battle = new Battle(
            new Army(attackUnits, attackUnitsQ, 'Attack'),
            new Army(defendUnits, defendUnitsQ, 'Defend')
        );
        rollBattle(battle, stats);
    }
    console.log(`Attacker won ${stats.attackWins} times, losing AVG:${stats.avgLoss('Attack')}, MEAN:${stats.meanLoss('Attack')}`);
    console.log(`Defender won ${stats.defendWins} times, losing AVG:${stats.avgLoss('Defend')}, MEAN:${stats.meanLoss('Defend')}`);
    console.log(`There were ${stats.ties} ties`);
}
