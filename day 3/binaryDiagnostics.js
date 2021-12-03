const fs = require('fs');
const path = require('path');

function getGammaRate(report) {
    let gammaRate = [];
    for (let i = 0; i < report[i].length; i++) {
        let zeroCount = 0;
        let oneCount = 0;
        for (entry of report) {
            entry[i] === '0' ? zeroCount++ : oneCount++
        }
        zeroCount > oneCount ? gammaRate.push(0) : gammaRate.push(1);
    }

    return gammaRate.join('');
}

function getEpsilonRate(report) {
    return getGammaRate(report).split('').map(bit => 1 - bit).join('');
}

function multBinStrings(gammaRate, epsilonRate) {
    return parseInt(gammaRate, 2) * parseInt(epsilonRate, 2)
}

function getRating(report, ratingType) {
    let rating = report.slice(0);
    let i = 0;
    while (rating.length > 1) {
        let entriesToRemove = []
        let zeroCount = 0;
        let oneCount = 0;
        for (entry of rating) {
            entry[i] === '0' ? zeroCount++ : oneCount++
        }
        if (zeroCount > oneCount) {
            for (entry of rating) {
                switch (ratingType) {
                    case 'O2Generator':
                        entry[i] !== '0' && entriesToRemove.push(entry);
                        break;
                    case 'CO2Scrubber':
                        entry[i] !== '1' && entriesToRemove.push(entry);
                        break;
                }
            }
        }
        else {
            for (entry of rating) {
                switch (ratingType) {
                    case 'O2Generator':
                        entry[i] !== '1' && entriesToRemove.push(entry);
                        break;
                    case 'CO2Scrubber':
                        entry[i] !== '0' && entriesToRemove.push(entry);
                        break;
                }
            }
        }
        for (entry of entriesToRemove) {
            rating.splice(rating.indexOf(entry), 1);
        }
        i++;
    }
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
console.log('Part 2:', lifeSupportRating)