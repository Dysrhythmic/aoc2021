const fs = require('fs');
const path = require('path');

// Collect each number in the input into an array sorted from elast to greatest
const positions = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split(',').map(str => Number(str)).sort((a, b) => a - b);

// The target position for part 1 is the median position since each movement only costs 1 fuel
const medianPos = positions[Math.floor(positions.length / 2)];

// The totalFuelCost will be the sum of the distances each submarine is from the middle submarine
const totalFuelCost = positions.reduce((acc, pos) => acc + Math.abs(medianPos - pos), 0);

console.log('Part 1:', totalFuelCost)

function getConsecutiveFuelCost(targetPos) {
    // For part 2 the fuel cost increments for each movement a submarine makes
    return positions.reduce((acc, pos) => {
        const n = Math.abs(targetPos - pos);
        // We can use Gauss' formula to easily get the consecutive sum of the fuel cost for each submarine
        const consecutiveSum = n * (n + 1) / 2;
        // We return the sum of the calculated fuel costs
        return acc + consecutiveSum;
    }, 0);
}

// The optimal position for part 2 is the mean +/- 0.5
// We can get the ceiling and floor of the mean and check which has the lowest fuel cost
// to check which is the most optimal
const meanPos1 = Math.ceil(positions.reduce((acc, pos) => acc + pos) / positions.length, 0);
const meanPos2 = Math.floor(positions.reduce((acc, pos) => acc + pos) / positions.length, 0);
const totalFuelCost1 = getConsecutiveFuelCost(meanPos1)
const totalFuelCost2 = getConsecutiveFuelCost(meanPos2)

let totalConsecutiveFuelCost;
if (totalFuelCost1 < totalFuelCost2) { totalConsecutiveFuelCost = totalFuelCost1 }
else { totalConsecutiveFuelCost = totalFuelCost2 }

console.log('Part 2:', totalConsecutiveFuelCost)