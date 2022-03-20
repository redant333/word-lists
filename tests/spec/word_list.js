"use strict";

// Suite
describe("Word list", function() {
    const wordLists = [
        "/data/verb.json",
    ]

    for (const wordList of wordLists) {its(wordList) };
});

// Tests
function its(wordList) {
    let words = null;
    let forms = null;
    let infos = null;

    beforeEach(async () => {
        const data = await fetch(wordList);
        const json = await data.json();
        words = json["list"];
        forms = json["metadata"]["forms"];
        infos = json["metadata"]["infos"];
    });

    it(wordList + " should contain at least two words", function() {
        expect(words.length).toBeGreaterThanOrEqual(2);
    });

    it(wordList + " should contain at least two forms", function() {
        expect(words.length).toBeGreaterThanOrEqual(2);
    });

    it(wordList + " should should have infos and forms for each word", function() {
        for (const word of words) {
            expect(word.length).toBe(2, word);
        }
    });

    it(wordList + " should should have correct number of forms for each word", function() {
        for (const [wordForms, _] of words) {
            expect(wordForms.length).toBe(forms.length, wordForms);
        }
    });

    it(wordList + " should should have correct number of infos for each word", function() {
        for (const [_, wordInfos] of words) {
            expect(wordInfos.length).toBe(infos.length, wordInfos);
        }
    });
}
