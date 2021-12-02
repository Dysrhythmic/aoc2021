const fs = require('fs');
const path = require('path');

function* getMeasurements() {
    const measurements = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\r\n');
    for (const measurement of measurements) {
        yield Number(measurement);
    }
}

function countIncreasedMeasurements() {
    const measurements = getMeasurements();
    let currMeasurements = measurements.next().value;
    let prevMeasurements = currMeasurements;
    let increasedMeasurements = 0;

    while (currMeasurements !== undefined) {
        currMeasurements > prevMeasurements && increasedMeasurements++;
        prevMeasurements = currMeasurements;
        currMeasurements = measurements.next().value
    }
    
    return increasedMeasurements;
}

function countIncreasedWindow() {
    const measurements = getMeasurements();
    let measurement = measurements.next().value;
    let increasedMeasurements = 0;
    let window1 = [measurement, measurements.next().value, measurements.next().value]
    let window2 = []

    while (window1[window1.length - 1] !== undefined) {
        window2.push(window1[1])
        window2.push(window1[2])
        window2.push(measurements.next().value)
        window2.reduce((acc, curr) => acc + curr) > window1.reduce((acc, curr) => acc + curr) && increasedMeasurements++;
        window1 = window2
        window2 = []
    }

    return increasedMeasurements;
}

console.log('Part 1:', countIncreasedMeasurements());
console.log('Part 2:', countIncreasedWindow());
