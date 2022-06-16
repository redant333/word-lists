"use strict";

import {
    STATE_GUESSING,
    STATE_SUCCESS,
    STATE_FAILURE,
    PracticeStateMachine
} from "../src/js/PracticeStateMachine.js";

const SIMPLE_DATA = {
    forms: ["f1", "f2"],
    infos: ["i1", "i2"],
    words: [
        [["wf11", "wf12"],["wi11", "wi12"]],
        [["wf21", "wf22"],["wi21", "wi22"]],
        [[["wf31_1", "wf31_2"], ["wf32_1", "wf32_2"]],["wi31", "wi32"]],
    ]
};

describe("PracticeStateMachine", function() {

    let randomizer = null;
    let stateMachine = null;

    beforeEach(() => {
        randomizer = {nextWord : () => {}};
        stateMachine = new PracticeStateMachine(SIMPLE_DATA.words, SIMPLE_DATA.forms, SIMPLE_DATA.infos, null, randomizer);
    });

    it("should be in state null before starting", function() {
        expect(stateMachine.state).toBeNull();
    });

    it("should be in state STATE_GUESSING after starting", function() {
        const [wordIndex, wordSubIndex, givenForm, wantedForm] = [2, 1, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, wordSubIndex, givenForm, wantedForm]);

        stateMachine.start();
        expect(stateMachine.state).toBe(STATE_GUESSING);
    });

    it("should set word properties after starting", function() {
        const [wordIndex, wordSubIndex, givenForm, wantedForm] = [0, null, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, wordSubIndex, givenForm, wantedForm]);

        stateMachine.start();

        expect(stateMachine.wantedWords).toEqual(["wf12"]);
        expect(stateMachine.givenWord).toEqual("wf11");
        expect(stateMachine.givenForm).toEqual("f1");
        expect(stateMachine.wantedForm).toEqual("f2");
        expect(stateMachine.wantedWordAllForms).toEqual([["f1", ["wf11"]], ["f2", ["wf12"]]]);
        expect(stateMachine.wantedWordAllInfos).toEqual([["i1", "wi11"], ["i2", "wi12"]]);
    });


    it("should set word properties after starting when word has multiple form versions", function() {
        const [wordIndex, wordSubIndex, givenForm, wantedForm] = [2, 1, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, wordSubIndex, givenForm, wantedForm]);

        stateMachine.start();

        expect(stateMachine.wantedWords).toEqual(["wf32_1", "wf32_2"]);
        expect(stateMachine.givenWord).toEqual("wf31_2");
        expect(stateMachine.givenForm).toEqual("f1");
        expect(stateMachine.wantedForm).toEqual("f2");
        expect(stateMachine.wantedWordAllForms).toEqual([["f1", ["wf31_1", "wf31_2"]], ["f2", ["wf32_1", "wf32_2"]]]);
        expect(stateMachine.wantedWordAllInfos).toEqual([["i1", "wi31"], ["i2", "wi32"]]);
    });

    it("should be in state STATE_SUCCESS after a correct guess", function() {
        const [wordIndex, wordSubIndex, givenForm, wantedForm] = [0, null, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, wordSubIndex, givenForm, wantedForm]);

        stateMachine.start();
        stateMachine.guess(SIMPLE_DATA.words[wordIndex][0][wantedForm]);

        expect(stateMachine.state).toBe(STATE_SUCCESS);
    });

    it("should be in state STATE_SUCCESS after a correct guess when word has multiple form versions", function() {
        const [wordIndex, wordSubIndex, givenForm, wantedForm] = [2, 1, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, wordSubIndex, givenForm, wantedForm]);

        stateMachine.start();
        stateMachine.guess("wf32_2");

        expect(stateMachine.state).toBe(STATE_SUCCESS);
    });

    it("should be in state STATE_FAILURE after an incorrect guess", function() {
        const [wordIndex, wordSubIndex, givenForm, wantedForm] = [0, null, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, wordSubIndex, givenForm, wantedForm]);

        stateMachine.start();
        stateMachine.guess("wrong_guess");

        expect(stateMachine.state).toBe(STATE_FAILURE);
    });

    it("should increase success count on a correct guess", function() {
        const [wordIndex, wordSubIndex, givenForm, wantedForm] = [0, null, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, wordSubIndex, givenForm, wantedForm]);

        stateMachine.start();
        stateMachine.guess(SIMPLE_DATA.words[wordIndex][0][wantedForm]);

        expect(stateMachine.successCount).toBe(1);

        stateMachine.start();
        stateMachine.guess(SIMPLE_DATA.words[wordIndex][0][wantedForm]);

        expect(stateMachine.successCount).toBe(2);
    });

    it("should increase failure count on an incorrect guess", function() {
        const [wordIndex, wordSubIndex, givenForm, wantedForm] = [0, null, 0, 1];
        spyOn(randomizer, "nextWord").and.returnValue([wordIndex, wordSubIndex, givenForm, wantedForm]);

        stateMachine.start();
        stateMachine.guess("wrong_guess");

        expect(stateMachine.failureCount).toBe(1);

        stateMachine.start();
        stateMachine.guess("wrong_guess");

        expect(stateMachine.failureCount).toBe(2);
    });
});