"use strict";
import WordRandomizer from "./WordRandomizer.js";
import { maybeIndex } from "./Utils.js";

export const STATE_GUESSING = "STATE_GUESSING";
export const STATE_SUCCESS = "STATE_SUCCESS";
export const STATE_FAILURE = "STATE_FAILURE";

export class PracticeStateMachine {
    constructor(words, forms, infos, excludedGivenWords, wordRandomizer) {
        this._wordRandomizer = wordRandomizer ? wordRandomizer : new WordRandomizer(words, excludedGivenWords);

        this._words = words;
        this._forms = forms;
        this._infos = infos;

        this._successCount = 0;
        this._failureCount = 0;

        this._state = null;
    }

    get state() { return this._state; }

    get wantedWords() { return this._wantedWords; }

    get wantedWordAllInfos() { return this._wantedWordAllInfos; }

    get wantedWordAllForms() { return this._wantedWordAllForms; }

    get givenWord() { return this._givenWord; }

    get givenForm() { return this._givenForm; }

    get wantedForm() { return this._wantedForm; }

    get successCount() { return this._successCount; }

    get failureCount() { return this._failureCount; }

    start() {
        const [wordIndex, givenFormSubIndex, givenFormIndex, wantedFormIndex] = this._wordRandomizer.nextWord();

        this._wantedWords = [this._words[wordIndex][0][wantedFormIndex]].flat();

        this._wantedWordAllForms = [];
        for (let i = 0; i < this._forms.length; i++) {
            this._wantedWordAllForms.push([this._forms[i], [this._words[wordIndex][0][i]].flat()]);
        }

        this._wantedWordAllInfos = [];
        for (let i = 0; i < this._infos.length; i++) {
            this._wantedWordAllInfos.push([this._infos[i], this._words[wordIndex][1][i]]);
        }

        this._givenWord = maybeIndex(this._words[wordIndex][0][givenFormIndex], givenFormSubIndex);

        this._wantedForm = this._forms[wantedFormIndex];
        this._givenForm = this._forms[givenFormIndex];

        this._state = STATE_GUESSING;
    }

    guess(word) {
        const wantedWordsLowercase = this._wantedWords.map((w) => w.toLowerCase());

        if(wantedWordsLowercase.includes(word.toLowerCase())) {
            this._state = STATE_SUCCESS;
            this._successCount++;
        } else {
            this._state = STATE_FAILURE;
            this._failureCount++;
        }
    }
}
