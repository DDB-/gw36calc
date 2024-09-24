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

function rollRoundForSide(army, side) {
    const hits = new Hits();
    army.units.forEach((unit) => {
        for (let i = 0; i < unit.quantity; i++) {
            const diceRoll = roll();
            if (diceRoll <= unit.details.get(side)) {
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

function rollBattle(battle) {
    while(!hasWinner(battle)) {
        let attackHits = rollRoundForSide(battle.attack, 'Attack');
        let defendHits = rollRoundForSide(battle.defend, 'Defend');
        console.log(`Round ${battle.round}`);
        console.log(`Attack hits: ${attackHits.hits}`);
        console.log(`Defend hits: ${defendHits.hits}`);
        reconcileArmy(battle.attack, defendHits);
        reconcileArmy(battle.defend, attackHits);
        battle.round += 1;
    }
    console.log(`${battle.winner} is the winner!`);
    console.log(battle);
}

function simulate(attackUnits, attackUnitsQ, defendUnits, defendUnitsQ) {
    const battle = new Battle(
        new Army(attackUnits, attackUnitsQ, 'Attack'),
        new Army(defendUnits, defendUnitsQ, 'Defend')
    );
    rollBattle(battle);
}
