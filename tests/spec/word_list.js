"use strict";
/* globals getAmbiguousWords */

// Suite
describe("Word lists", () => {
    const wordLists = [
        "/word-lists/data/verbs.json",
        "/word-lists/data/months.json",
        "/word-lists/data/days.json",
        "/word-lists/data/numbers.json",
        "/word-lists/data/pronouns.json",
    ];

    // jshint -W083
    for (const wordList of wordLists) {
        describe(wordList, () => {
            its(wordList);
        });
    }
    // jshint +W083
});

// Tests
function its(wordList) {
    let words = null;
    let forms = null;
    let infos = null;

    beforeEach(async () => {
        const data = await fetch(wordList);
        const json = await data.json();
        words = json.list;
        forms = json.metadata.forms;
        infos = json.metadata.infos;
    });

    it(wordList + " should contain at least two words", () => {
        expect(words.length).toBeGreaterThanOrEqual(2);
    });

    it(wordList + " should contain at least two forms", () => {
        expect(words.length).toBeGreaterThanOrEqual(2);
    });

    it(wordList + " should have infos and forms for each word", () => {
        for (const word of words) {
            expect(word.length).toBe(2, word);
        }
    });

    it(wordList + " should have correct number of forms for each word", () => {
        for (const [wordForms] of words) {
            expect(wordForms.length).toBe(forms.length);
        }
    });

    it(wordList + " should have correct number of infos for each word", () => {
        for (const [, wordInfos] of words) {
            expect(wordInfos.length).toBe(infos.length);
        }
    });

    it(wordList + " should not have ambiguous words", () => {
        let ambiguousWords = getAmbiguousWords(words);
        expect(ambiguousWords).withContext(`Full list of ambiguous words is [${Array.from(ambiguousWords)}]\n`)
                              .toEqual(new Set());
    });
}
