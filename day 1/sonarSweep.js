const fs = require('fs');
const path = require('path');

function* getMeasurements() {
    // Pasrse the input into an array where each line is an element.
    const measurements = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\r\n');
    for (const measurement of measurements) {
        // Yield each element converted into a number.
        yield Number(measurement);
    }
}

function countIncreasedMeasurements() {
    const measurements = getMeasurements();
    // Get the current measurement.
    let currMeasurements = measurements.next().value;
    // Ensure the prevMeasurements is equal to the currMeasurements for the first comparison
    // so that the count of increasedMeasurements isn't incremented before a true previous measurement exists.
    let prevMeasurements = currMeasurements;
    let increasedMeasurements = 0;
    // Loop as long as there are measurements to check.
    while (currMeasurements !== undefined) {
        // Increment increasedMeasurements if the current measurement is greater than the last.
        currMeasurements > prevMeasurements && increasedMeasurements++;
        // Set the last measurement to the current measurement.
        prevMeasurements = currMeasurements;
        // Set the current measurement to the next measurement.
        currMeasurements = measurements.next().value
    }
    // Return the count.
    return increasedMeasurements;
}

function countIncreasedWindow() {
    const measurements = getMeasurements();
    let increasedMeasurements = 0;
    // Set the inital value of the window1 measurements to the first 3 measurements from the input.
    let window1 = [measurements.next().value, measurements.next().value, measurements.next().value]
    let window2 = []
    // Loop as long as the last element of window1 was able to be updated with a new input.
    while (window1[window1.length - 1] !== undefined) {
        // The measurements for the next window follow the pattern of beginning with the second value
        // of the previous window, its second value being the third value of the previous window, and
        // its last value being the next input.
        window2.push(window1[1])
        window2.push(window1[2])
        window2.push(measurements.next().value)
        // Increment increasedMeasurements if the sum of measurements of the current window are
        // greater than the sum of measurements of the previous window.
        window2.reduce((acc, curr) => acc + curr) > window1.reduce((acc, curr) => acc + curr) && increasedMeasurements++;
        // Make the previous window the current window.
        window1 = window2
        // Remove the values from the current window to reset at the start of the next loop.
        window2 = []
    }
    // Return the increasedMeasurements count.
    return increasedMeasurements;
}

console.log('Part 1:', countIncreasedMeasurements());
console.log('Part 2:', countIncreasedWindow());
