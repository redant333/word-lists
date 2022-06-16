"use strict";
import { maybeIndex } from "./Utils.js";

export default class WordRandomizer {
    constructor(words, excludedGivenWords) {
        this._words = words;
        this._lastWordIndex = null;
        this._excludedGivenWords = excludedGivenWords ? excludedGivenWords : [];
    }

    _randomInt(lowerThan) {
        return Math.floor(Math.random() * lowerThan);
    }

    _getRandomWord() {
        let wordIndex = null;
        while (wordIndex === this._lastWordIndex || wordIndex === null) {
            wordIndex = this._randomInt(this._words.length);
        }
        this._lastWordIndex = wordIndex;

        let givenFormIndex = null;
        while (givenFormIndex === null || this._words[wordIndex][0][givenFormIndex] === "-") {
            givenFormIndex = this._randomInt(this._words[wordIndex][0].length);
        }

        let wantedFormIndex = null;
        while (wantedFormIndex === givenFormIndex || wantedFormIndex === null) {
            wantedFormIndex = this._randomInt(this._words[wordIndex][0].length);
        }

        let wordSubIndex = null;
        if (this._words[wordIndex][0][givenFormIndex] instanceof Array) {
            wordSubIndex = this._randomInt(this._words[wordIndex][0][givenFormIndex].length);
        }

        return [wordIndex, wordSubIndex, givenFormIndex, wantedFormIndex];
    }

    nextWord() {
        let wordSpec = null;
        let givenWord = null;

        do {
            wordSpec = this._getRandomWord();

            const [wordIndex, wordSubIndex, givenFormIndex] = wordSpec;
            givenWord = maybeIndex(this._words[wordIndex][0][givenFormIndex], wordSubIndex);
        } while (this._excludedGivenWords.includes(givenWord));

        return wordSpec;
    }
}