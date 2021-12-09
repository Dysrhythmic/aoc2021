const fs = require('fs');
const path = require('path');

function getFishTimers(maxFishTimer) {
    // Return an array of BigInts with each position initially set to 0.
    // Each index will correspond to the amount of days until a fish spawns new fish
    // and each value will be how many fish with that timer there are.
    let fishTimers = [];
    for (let i = 0; i <= maxFishTimer; i++) { fishTimers.push(BigInt(0)) }
    fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split(',').forEach(timer => fishTimers[Number(timer)]++);

    return fishTimers;
}

function countFish(days, fishTimers) {
    for (let i = 0; i < days; i++) {
        // This will track how many new fish should be added at the end of the day.
        let newCount = BigInt(0);
        for (timer in fishTimers) {
            if (timer > 0) {
                // Get the number of the fish with the current timer and move them down 1 day.
                fishTimers[timer - 1] += fishTimers[timer];
                fishTimers[timer] = BigInt(0);
                if (timer == 8) {
                    // Since the fish with 0 days left have already gone,
                    // the fish with 0 days left were added to the fish at position 8.
                    // Therefore, when we get to position 8 some of the fish need to move to position 7
                    // while others should remain at 8 since they were already repositioned for that day.
                    // Since each fish at position 0 spawned 1 fish, newCount will be equal to
                    // the number of fish that were moved from position 0.
                    // We can correct for the fish who were moved twice by moving a number of fish equal to newCount
                    // back from position 7 to position 8. 
                    fishTimers[7] -= newCount;
                    fishTimers[timer] += newCount;
                }
            }
            else {
                // Fish at position 0 move to position 8 and spawn 1 new fish each 
                fishTimers[8] += fishTimers[timer];
                newCount = fishTimers[timer];
                fishTimers[timer] = BigInt(0);
            }
        }
        // Add the newly spawned fish to position 6
        fishTimers[6] += newCount;
    }

    // Get the sum of all fish
    return fishTimers.reduce((acc, timerCount) => acc + timerCount);
}

const maxFishTimer = 8;

let fishTimers = getFishTimers(maxFishTimer);
let totalFish = countFish(80, fishTimers);
console.log('Part 1:', totalFish);

fishTimers = getFishTimers(maxFishTimer);
totalFish = countFish(256, fishTimers);
console.log('Part 2:', totalFish);
