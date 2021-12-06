const fs = require('fs');
const path = require('path');

const maxFishTimer = 8;
const days = 80;

let fishTimers = [];
for (let i = 0; i <= maxFishTimer; i++) { fishTimers.push(0) }

fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split(',').forEach(timer => fishTimers[Number(timer)]++);

let newCount = 0;
for (let i = 0; i < days; i++) {
    newCount = 0;
    for (timer in fishTimers) {
        if (timer > 0) { 
            fishTimers[timer - 1] += fishTimers[timer];
            fishTimers[timer] = 0;
            if (timer == 8) {
                fishTimers[7] -= newCount;
                fishTimers[timer] += newCount;
            }
        }
        else { 
            fishTimers[8] += fishTimers[timer];
            newCount = fishTimers[timer];
            fishTimers[timer] = 0;
        }
    }
    fishTimers[6] += newCount;
}

console.log('sum:', fishTimers.reduce((acc, timerCount) => acc + timerCount))