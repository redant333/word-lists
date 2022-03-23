describe("WordRandomizer", function() {
    const words = [
        [["wf11", "wf12"], ["wi11", "wi12", "wi13"]],
        [["wf21", "wf22"], ["wi21", "wi22", "wi23"]],
    ];
    const wordsWithDash = [
        [["-", "wf12"], ["wi11", "wi12", "wi13"]],
        [["wf21", "wf22"], ["wi21", "wi22", "wi23"]],
    ];
    const checkCount = 10000;

    it("should return values in valid range", function() {
        const randomizer = new WordRandomizer(words);
        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex, givenFormIndex, wantedFormIndex] = randomizer.nextWord();

            expect(wordIndex).toBeLessThan(words.length);
            expect(givenFormIndex).toBeLessThan(words[0][0].length);
            expect(wantedFormIndex).toBeLessThan(words[0][0].length);
        }
    });

    it("should not repeat words", function() {
        const randomizer = new WordRandomizer(words);
        let lastWordIndex = null;

        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex, givenFormIndex, wantedFormIndex] = randomizer.nextWord();
            expect(wordIndex).not.toBe(lastWordIndex);
            lastWordIndex = wordIndex;
        }
    });

    it("should return all valid values for word index", function() {
        let values = new Set();
        const randomizer = new WordRandomizer(words);

        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex, givenFormIndex, wantedFormIndex] = randomizer.nextWord();
            values.add(wordIndex);
        }

        expect(values.size).toBe(words.length);
    });

    it("should return all valid values for given form index", function() {
        let values = new Set();
        const randomizer = new WordRandomizer(words);

        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex, givenFormIndex, wantedFormIndex] = randomizer.nextWord();
            values.add(givenFormIndex);
        }

        expect(values.size).toBe(words[0][0].length);
    });

    it("should return all valid values for wanted form index", function() {
        let values = new Set();
        const randomizer = new WordRandomizer(words);

        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex, givenFormIndex, wantedFormIndex] = randomizer.nextWord();
            values.add(wantedFormIndex);
        }

        expect(values.size).toBe(words[0][0].length);
    });

    it("should never select dash as given form", function() {
        const randomizer = new WordRandomizer(wordsWithDash);
        for (let _ = 0; _ < checkCount; _++) {
            const [wordIndex, givenFormIndex, wantedFormIndex] = randomizer.nextWord();
            expect(wordsWithDash[wordIndex][0][givenFormIndex]).not.toEqual("-");
        }
    });
});