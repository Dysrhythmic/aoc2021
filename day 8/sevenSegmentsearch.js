const fs = require('fs');
const path = require('path');

function getCommonSegmentCount(key, patternMap, patternToCheck) {
    // Given a key, we want to check how many characters in the patternToCheck matches the pattern in the patternMap with that key.
    // We will be calling this function later with 1 as a key and then with 4 as a key
    let commonSegments = 0;
    for (segment of patternMap.get(key)) { patternToCheck.includes(segment) && commonSegments++; }
    return commonSegments;
}

function mapPatterns(signalPatterns) {
    // We can map the patterns for keys 1, 7, 4, and 8 based on length alone since they are unique.
    // We map those patterns first so that we can later use them to determine the other patterns.
    // For the patterns that can't yet be mapped, collect them in an array for now.
    const patternMap = new Map();
    const unknownPatterns = []
    for (pattern of signalPatterns) {
        switch (pattern.length) {
            case 2:
                patternMap.set(1, pattern);
                break;
            case 3:
                patternMap.set(7, pattern);
                break;
            case 4:
                patternMap.set(4, pattern);
                break;
            case 5:
                unknownPatterns.push(pattern)
                break;
            case 6: 
                unknownPatterns.push(pattern)
                break;
            case 7:
                patternMap.set(8, pattern);
                break;
            default:
                console.log('Pattern length outside expected range')
        }
    }

    // Now that we have all of the patterns that can be mapped collected,
    // we compare how many characters the unmapped patterns have to the mapped patterns
    // for keys 1 and 4 since thsoe are the only 2 we need to differentiate the rest of the patterns
    for (pattern of unknownPatterns) {
       const commonWith1 = getCommonSegmentCount(1, patternMap, pattern);
       const commonWith4 = getCommonSegmentCount(4, patternMap, pattern);
       if (pattern.length === 6 && commonWith1 === 2 && commonWith4 === 3) { patternMap.set(0, pattern) }
       else if (pattern.length === 5 && commonWith1 === 1 && commonWith4 === 2) { patternMap.set(2, pattern) }
       else if (pattern.length === 5 && commonWith1 === 2 && commonWith4 === 3) { patternMap.set(3, pattern) }
       else if (pattern.length === 5 && commonWith1 === 1 && commonWith4 === 3) { patternMap.set(5, pattern) }
       else if (pattern.length === 6 && commonWith1 === 1 && commonWith4 === 3) { patternMap.set(6, pattern) }
       else if (pattern.length === 6 && commonWith1 === 2 && commonWith4 === 4) { patternMap.set(9, pattern) }
    }

    // We now have a map of all the inputs that can be used as a key to decode the outputs
    return patternMap;
}

function decodeOutput(patternMap, output) {
    // Since the order of the letters in the output may not correspond with the orders in the map we made,
    // we check all characters in each output for the characters in each mapped pattern.
    // We can map each output to its corresponding key in our patternMap with this information
    const decodedOutput = new Map();
    for (pattern of patternMap) {
        for (outputPattern of output) {
            // If the pattern is not the same length at the output then it can't be a match
            if (pattern[1].length === outputPattern.length) {
                let match = false;
                const segments = pattern[1].split('');
                for (segment of segments) {
                    if (outputPattern.includes(segment)) { match = true; }
                    else {
                        // If any character from the mapped pattern is not found in the output, it is not a match
                        match = false;
                        break;
                    }
                }
                // Map the output pattern as a key with a value of its cooresponding patternMap key for easy referencing
                match && decodedOutput.set(outputPattern, pattern[0]);
            }
        }
    }
    // We now have a map of decoded outputs with the pattern as the key and the number it corresponds to as the value
    return decodedOutput;
}

function getMatchCount(entries, limitCount=true) {
    // Count the number of matches
    let matchCount = 0;
    for (entry of entries) { 
        const decodedOutput = decodeOutput(mapPatterns(entry.signalPatterns), entry.output);
        if (limitCount) {
            // Since it just asks for the count of specific matches, we delete all other matches from the map before counting
            for (decodedPattern of decodedOutput) { 
                if (decodedPattern[1] !== 1 && decodedPattern[1] !== 4 && decodedPattern[1] !== 7 && decodedPattern[1] !== 8) {
                    decodedOutput.delete(decodedPattern[0]);
                }
            }
        }
        // Now that all maps other than for 1, 4, 7, and 8 have been deleted,
        // we can count the matches that are requested in part 1
        for (decodedPattern of decodedOutput) { entry.output.forEach(outputPattern => outputPattern === decodedPattern[0] && matchCount++) }
    }
    return matchCount;
}

function getDisplaysSum(entries) {
    // Get the value for each pattern in the decodedOutput and append them
    // to determine what the display for that pattern should be.
    // Then get the sum of all the displays.
    const displays = [];
    for (entry of entries) {
        const decodedOutput = decodeOutput(mapPatterns(entry.signalPatterns), entry.output);
        const display = [];
        entry.output.forEach(outputPattern => { display.push(decodedOutput.get(outputPattern)) });
        displays.push(Number(display.join('')));
    }
    return displays.reduce((acc, display) => acc + display)
}

// For each line in the input create an array of objects with keys for the input patterns and the output patterns
const entries = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\r\n').map(entry => {
    const [ signalPatterns, output ] = entry.split(' | ');
    return { signalPatterns: signalPatterns.split(' '), output: output.split(' ') }
});

console.log('Part 1:', getMatchCount(entries));
console.log('Part 2:', getDisplaysSum(entries));
