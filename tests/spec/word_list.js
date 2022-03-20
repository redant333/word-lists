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

    beforeEach(async () => {
        const data = await fetch(wordList);
        const json = await data.json();
        words = json["list"];
        words = json["metadata"]["forms"];
    });

    it(wordList + " should contain at least two words", function() {
        expect(words.length).toBeGreaterThanOrEqual(2);
    });

    it(wordList + " should contain at least two forms", function() {
        expect(words.length).toBeGreaterThanOrEqual(2);
    });
}
