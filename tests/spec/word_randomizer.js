"use strict";

describe("WordRandomizer", function() {
    const words = [
        [["wf11", "wf12"], ["wi11", "wi12", "wi13"]],
        [["wf21", "wf22"], ["wi21", "wi22", "wi23"]],
    ];
    const wordsWithDash = [
        [["-", "wf12"], ["wi11", "wi12", "wi13"]],
        [["wf21", "wf22"], ["wi21", "wi22", "wi23"]],
    ];
    const wordsWithMultipleVersions = [
        [[["wf11v1", "wf11v2"], ["wf12v1", "wf12v2"]], ["wi11", "wi12", "wi13"]],
        [[["wf21v1", "wf21v2"], ["wf22v1","wf22v2", "wf22v3"]], ["wi21", "wi22", "wi23"]],
    ];
    // TODO Mock the randomization to avoid checking many times
    const checkCount = 10000;

    it("should return values in valid range", function() {
        const randomizer = new WordRandomizer(words);
        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex,, givenFormIndex, wantedFormIndex] = randomizer.nextWord();

            expect(wordIndex).toBeLessThan(words.length);
            expect(givenFormIndex).toBeLessThan(words[0][0].length);
            expect(wantedFormIndex).toBeLessThan(words[0][0].length);
        }
    });

    it("should not repeat words", function() {
        const randomizer = new WordRandomizer(words);
        let lastWordIndex = null;

        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex,,,] = randomizer.nextWord();
            expect(wordIndex).not.toBe(lastWordIndex);
            lastWordIndex = wordIndex;
        }
    });

    it("should never return a word that is listed in ambiguous words", function() {
        const excludedGivenWords = ["wf11"];
        const randomizer = new WordRandomizer(words, excludedGivenWords);
        let values = new Set();

        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex,,givenFormIndex,] = randomizer.nextWord();
            values.add(words[wordIndex][0][givenFormIndex]);
        }

        for (const word of excludedGivenWords) {
            expect(values).not.toContain(word);
        }
    });

    it("should return all valid values for word index", function() {
        let values = new Set();
        const randomizer = new WordRandomizer(words);

        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex] = randomizer.nextWord();
            values.add(wordIndex);
        }

        expect(values.size).toBe(words.length);
    });

    it("should return all valid values for given form index", function() {
        let values = new Set();
        const randomizer = new WordRandomizer(words);

        for (let _ = 0; _ < checkCount; _++) {
            const [,, givenFormIndex] = randomizer.nextWord();
            values.add(givenFormIndex);
        }

        expect(values.size).toBe(words[0][0].length);
    });

    it("should return all valid values for wanted form index", function() {
        let values = new Set();
        const randomizer = new WordRandomizer(words);

        for (let _ = 0; _ < checkCount; _++) {
            const [,,, wantedFormIndex] = randomizer.nextWord();
            values.add(wantedFormIndex);
        }

        expect(values.size).toBe(words[0][0].length);
    });

    it("should never select dash as given form", function() {
        const randomizer = new WordRandomizer(wordsWithDash);
        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex,, givenFormIndex] = randomizer.nextWord();
            expect(wordsWithDash[wordIndex][0][givenFormIndex]).not.toEqual("-");
        }
    });

    it("should return null as word subindex if given word has only one version", function() {
        const randomizer = new WordRandomizer(words);
        for (let _ = 0; _ < checkCount; _++) {
            const [, wordSubIndex,] = randomizer.nextWord();

            expect(wordSubIndex).toBe(null);
        }
    });

    it("should return valid word subindex if given word has multiple versions", function() {
        const randomizer = new WordRandomizer(wordsWithMultipleVersions);
        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex, wordSubIndex, givenFormIndex] = randomizer.nextWord();

            expect(wordSubIndex).not.toBe(null);
            expect(wordSubIndex).toBeLessThan(wordsWithMultipleVersions[wordIndex][0][givenFormIndex].length);
        }
    });
});
