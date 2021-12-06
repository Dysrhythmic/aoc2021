const fs = require('fs');
const path = require('path');

function getFishTimers(maxFishTimer) {
    let fishTimers = [];
    for (let i = 0; i <= maxFishTimer; i++) { fishTimers.push(BigInt(0)) }
    fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split(',').forEach(timer => fishTimers[Number(timer)]++);

    return fishTimers;
}

function countFish(days, fishTimers) {
    for (let i = 0; i < days; i++) {
        let newCount = BigInt(0);
        for (timer in fishTimers) {
            if (timer > 0) { 
                fishTimers[timer - 1] += fishTimers[timer];
                fishTimers[timer] = BigInt(0);
                if (timer == 8) {
                    fishTimers[7] -= newCount;
                    fishTimers[timer] += newCount;
                }
            }
            else { 
                fishTimers[8] += fishTimers[timer];
                newCount = fishTimers[timer];
                fishTimers[timer] = BigInt(0);
            }
        }
        fishTimers[6] += newCount;
    }

    return fishTimers.reduce((acc, timerCount) => acc + timerCount);
}

const maxFishTimer = 8;

let fishTimers = getFishTimers(maxFishTimer);
let totalFish = countFish(80, fishTimers);
console.log('Part 1:', totalFish);

fishTimers = getFishTimers(maxFishTimer);
totalFish = countFish(256, fishTimers);
console.log('Part 2:', totalFish);
