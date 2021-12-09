const fs = require('fs');
const path = require('path');

function getGammaRate(report) {
    let gammaRate = [];
    // Loop through each row a number of times equal to the length of the current row.
    for (let i = 0; i < report[i].length; i++) {
        // Track if 0 or 1 has been encountered more for each column.
        let zeroCount = 0;
        let oneCount = 0;
        for (entry of report) {
            // Check if a character is 0 or 1.
            // Limit the check on each row to 1 character at a time to check each column.
            entry[i] === '0' ? zeroCount++ : oneCount++
        }
        // The gammaRate is ever which digit occured the most times.
        zeroCount > oneCount ? gammaRate.push(0) : gammaRate.push(1);
    }

    return gammaRate.join('');
}

function getEpsilonRate(report) {
    // The epsilonRate is the same as the gammeRate except it is whichever digit appeared the least time.
    // Therefore, we can get the gammaRate and then flip each bit to get the epsilonRate.
    return getGammaRate(report).split('').map(bit => 1 - bit).join('');
}

function multBinStrings(binString1, binString2) {
    // Convert 2 given binary strings into integers and multiply them together.
    return parseInt(binString1, 2) * parseInt(binString2, 2)
}

function getRating(report, ratingType) {
    // Clone the report.
    let rating = report.slice(0);
    let i = 0;
    while (rating.length > 1) {
        // Filter the sets of bits until there is 1 left.
        let entriesToRemove = []
        let zeroCount = 0;
        let oneCount = 0;
        // Determine if 0 or 1 appears more for each set of bits.
        for (entry of rating) { entry[i] === '0' ? zeroCount++ : oneCount++ }
        if (zeroCount > oneCount) {
            for (entry of rating) {
                // Since the calculation for the rating types are so similar, I am just using a flag to detemine
                // which one to calculate.
                switch (ratingType) {
                    case 'O2Generator':
                        // Only keep the set of bits if the set begins with 0.
                        entry[i] !== '0' && entriesToRemove.push(entry);
                        break;
                    case 'CO2Scrubber':
                        // Only keep the set of bits if the set begins with 1.
                        entry[i] !== '1' && entriesToRemove.push(entry);
                        break;
                }
            }
        }
        else {
            for (entry of rating) {
                switch (ratingType) {
                    case 'O2Generator':
                        // Only keep the set of bits if the set begins with 1.
                        entry[i] !== '1' && entriesToRemove.push(entry);
                        break;
                    case 'CO2Scrubber':
                        // Only keep the set of bits if the set begins with 0.
                        entry[i] !== '0' && entriesToRemove.push(entry);
                        break;
                }
            }
        }
        for (entry of entriesToRemove) {
            // Remove all sets of bits that were added to entriesToRemove from rating.
            rating.splice(rating.indexOf(entry), 1);
        }
        i++;
    }
    // Return the last remaining set of bits.
    return rating[0];
}

const report = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\r\n');

const gammaRate = getGammaRate(report);
const epsilonRate = getEpsilonRate(report);
const powerConsumption = multBinStrings(gammaRate, epsilonRate);
console.log('Part 1:', powerConsumption);

const O2GenRating = getRating(report, 'O2Generator');
const CO2ScrubberRating = getRating(report, 'CO2Scrubber');
const lifeSupportRating = multBinStrings(O2GenRating, CO2ScrubberRating);
console.log('Part 2:', lifeSupportRating);