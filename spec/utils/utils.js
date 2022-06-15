"use strict";

function getAmbiguousWordsForForm(words, formIndex) {
    let wordSet = new Set();
    let ambiguousWords = new Set();

    for (const [forms,] of words) {
        let words = [forms[formIndex]].flat();

        for (const word of words) {
            if(word === "-") { continue; }

            let wordLower = word.toLowerCase();
            if(wordSet.has(wordLower)) {
                ambiguousWords.add(wordLower);
            } else {
                wordSet.add(wordLower);
            }
        }
    }

    return ambiguousWords;
}

/* exported getAmbiguousWords */
function getAmbiguousWords(words) {
    let ambiguousWords = new Set();

    let formCount = words[0][0].length;

    for (let formIndex = 0; formIndex < formCount; formIndex++) {
        getAmbiguousWordsForForm(words, formIndex)
            .forEach(ambiguousWords.add, ambiguousWords);
    }

    return ambiguousWords;
}

module.exports = getAmbiguousWords;