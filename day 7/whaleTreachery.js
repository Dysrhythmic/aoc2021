const fs = require('fs');
const path = require('path');

const positions = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split(',').map(str => Number(str));
positions.sort((a, b) => a - b);

let targetPos = positions[Math.floor(positions.length / 2)];
let totalFuelCost = positions.reduce((acc, pos) => acc + (Math.abs(targetPos - pos)), 0);
console.log('Part 1:', totalFuelCost)

function getConsecutiveFuelCost(targetPos) {
    return positions.reduce((acc, pos) => {
        const n = Math.abs(targetPos - pos);
        consecutiveSum = n * (n + 1) / 2;
        return acc + consecutiveSum;
    }, 0);
}
const targetPos1 = Math.ceil(positions.reduce((acc, pos) => acc + pos) / positions.length);
const targetPos2 = Math.floor(positions.reduce((acc, pos) => acc + pos) / positions.length);
const totalFuelCost1 = getConsecutiveFuelCost(targetPos1)
const totalFuelCost2 = getConsecutiveFuelCost(targetPos2)
totalFuelCost1 < totalFuelCost2 ? console.log('Part 2:', totalFuelCost1) : console.log('Part 2:', totalFuelCost2)