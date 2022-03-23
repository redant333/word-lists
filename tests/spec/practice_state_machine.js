"use strict";

const SIMPLE_DATA = {
    forms: ["f1", "f2"],
    infos: ["i1", "i2"],
    words: [
        [["wf11", "wf12"],["wi11", "wi12"]],
        [["wf21", "wf22"],["wi21", "wi22"]],
    ]
}

describe("PracticeStateMachine", function() {
    let randomizer = null;
    let stateMachine = null;

    beforeEach(() => {
        randomizer = new WordRandomizer(SIMPLE_DATA.words);
        stateMachine = new PracticeStateMachine(SIMPLE_DATA.words, SIMPLE_DATA.forms, SIMPLE_DATA.infos, randomizer);
    });

    it("should be in state null before starting", function() {
        expect(stateMachine.state).toBeNull();
    });

    it("should be in state STATE_GUESSING after starting", function() {
        stateMachine.start();
        expect(stateMachine.state).toBe(STATE_GUESSING);
    });

    it("should set word properties after starting", function() {
        const [wordIndex, givenForm, wantedForm] = [0, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, givenForm, wantedForm]);

        stateMachine.start();

        expect(stateMachine.wantedWord).toBe(SIMPLE_DATA.words[wordIndex][0][wantedForm]);
        expect(stateMachine.givenWord).toBe(SIMPLE_DATA.words[wordIndex][0][givenForm]);
        expect(stateMachine.givenForm).toBe(SIMPLE_DATA.forms[givenForm]);
        expect(stateMachine.wantedForm).toBe(SIMPLE_DATA.forms[wantedForm]);
        expect(stateMachine.wantedWordAllForms).toEqual([["f1", "wf11"], ["f2", "wf12"]]);
        expect(stateMachine.wantedWordAllInfos).toEqual([["i1", "wi11"], ["i2", "wi12"]]);
    });

    it("should be in state STATE_SUCCESS after a correct guess", function() {
        const [wordIndex, givenForm, wantedForm] = [0, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, givenForm, wantedForm]);

        stateMachine.start();
        stateMachine.guess(SIMPLE_DATA.words[wordIndex][0][wantedForm]);

        expect(stateMachine.state).toBe(STATE_SUCCESS);
    });

    it("should be in state STATE_FAILURE after an incorrect guess", function() {
        const [wordIndex, givenForm, wantedForm] = [0, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, givenForm, wantedForm]);

        stateMachine.start();
        stateMachine.guess("wrong_guess");

        expect(stateMachine.state).toBe(STATE_FAILURE);
    });

    it("should increase success count on a correct guess", function() {
        const [wordIndex, givenForm, wantedForm] = [0, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, givenForm, wantedForm]);

        stateMachine.start();
        stateMachine.guess(SIMPLE_DATA.words[wordIndex][0][wantedForm]);

        expect(stateMachine.successCount).toBe(1);

        stateMachine.start();
        stateMachine.guess(SIMPLE_DATA.words[wordIndex][0][wantedForm]);

        expect(stateMachine.successCount).toBe(2);
    });

    it("should increase failure count on an incorrect guess", function() {
        const [wordIndex, givenForm, wantedForm] = [0, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, givenForm, wantedForm]);

        stateMachine.start();
        stateMachine.guess("wrong_guess");

        expect(stateMachine.failureCount).toBe(1);

        stateMachine.start();
        stateMachine.guess("wrong_guess");

        expect(stateMachine.failureCount).toBe(2);
    });
});