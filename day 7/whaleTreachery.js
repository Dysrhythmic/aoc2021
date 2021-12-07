const fs = require('fs');
const path = require('path');

const positions = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split(',').map(str => Number(str));
positions.sort((a, b) => a - b);

const medianPos = positions[Math.floor(positions.length / 2)];
const totalFuelCost = positions.reduce((acc, pos) => acc + (Math.abs(medianPos - pos)), 0);
console.log('Part 1:', totalFuelCost)

function getConsecutiveFuelCost(targetPos) {
    return positions.reduce((acc, pos) => {
        const n = Math.abs(targetPos - pos);
        const consecutiveSum = n * (n + 1) / 2;
        return acc + consecutiveSum;
    }, 0);
}

const meanPos1 = Math.ceil(positions.reduce((acc, pos) => acc + pos) / positions.length);
const meanPos2 = Math.floor(positions.reduce((acc, pos) => acc + pos) / positions.length);
const totalFuelCost1 = getConsecutiveFuelCost(meanPos1)
const totalFuelCost2 = getConsecutiveFuelCost(meanPos2)

let totalConsecutiveFuelCost;
if (totalFuelCost1 < totalFuelCost2) { totalConsecutiveFuelCost = totalFuelCost1 }
else { totalConsecutiveFuelCost = totalFuelCost2 }

console.log('Part 2:', totalConsecutiveFuelCost)