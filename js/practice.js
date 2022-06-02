"use strict";
const STATE_GUESSING = "STATE_GUESSING";
const STATE_SUCCESS = "STATE_SUCCESS";
const STATE_FAILURE = "STATE_FAILURE";

class WordRandomizer {
    constructor(words) {
        this._words = words;
        this._lastWordIndex = null;
    }

    _randomInt(lowerThan) {
        return Math.floor(Math.random() * lowerThan);
    }

    nextWord() {
        let wordIndex = null;
        while(wordIndex === this._lastWordIndex || wordIndex === null) {
            wordIndex = this._randomInt(this._words.length);
        }
        this._lastWordIndex = wordIndex;

        let givenFormIndex = null;
        while(givenFormIndex === null || this._words[wordIndex][0][givenFormIndex] === "-") {
            givenFormIndex = this._randomInt(this._words[wordIndex][0].length);
        }

        let wantedFormIndex = null;
        while(wantedFormIndex === givenFormIndex || wantedFormIndex === null) {
            wantedFormIndex = this._randomInt(this._words[wordIndex][0].length);
        }

        let wordSubIndex = null;
        if(this._words[wordIndex][0][givenFormIndex] instanceof Array) {
            wordSubIndex = this._randomInt(this._words[wordIndex][0][givenFormIndex].length);
        }

        return [wordIndex, wordSubIndex, givenFormIndex, wantedFormIndex];
    }
}

class PracticeStateMachine {
    constructor(words, forms, infos, wordRandomizer) {
        this._wordRandomizer = wordRandomizer ? wordRandomizer : new WordRandomizer(words);

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

        if(givenFormSubIndex !== null) {
            this._givenWord = this._words[wordIndex][0][givenFormIndex][givenFormSubIndex];
        } else {
            this._givenWord = this._words[wordIndex][0][givenFormIndex];
        }

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

/* exported Practice */
class Practice {
    constructor(dataFile) {
        const DATA_LOCATION = "/word-lists/data/";
        this.dataFile = DATA_LOCATION + dataFile;
    }

    setControls() {
        function byId(id) { return document.getElementById(id); }

        this.sGivenWord = byId("id_word");
        this.sWantedWord = byId("id_expected_word");
        this.sGivenForm = byId("id_given_form");
        this.sWantedForm = byId("id_wanted_form");
        this.sWantedFormFailure = byId("id_wanted_form_failure");
        this.bCheck = byId("id_check");
        this.bNext = byId("id_next");
        this.iInput = byId("id_input");

        this.dSuccess = byId("id_success");
        this.dFailure = byId("id_failure");

        this.sSuccessCount = byId("id_success_count");
        this.sFailureCount = byId("id_failure_count");

        this.dAllForms = byId("id_all_forms");
        this.dAllInfos = byId("id_all_infos");
    }

    start() {
        fetch(this.dataFile)
            .then(data => {return data.json();})
            .then(json => {
                this.stateMachine = new PracticeStateMachine(json.list,
                                                             json.metadata.forms,
                                                             json.metadata.infos);
                this.stateMachine.start();

                this.setControls();
                this.setEventListeners();
                this.adaptControlsToState();
            });
    }

    setEventListeners() {
        const checkInputHandler = () => { this.handleInput(); };
        this.bCheck.addEventListener("click", checkInputHandler);
        this.iInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter" && this.stateMachine.state === STATE_GUESSING) {
                this.bCheck.click();
            }
        });
        this.bNext.addEventListener("click", () => {
            this.stateMachine.start();
            this.adaptControlsToState();
        });
    }

    handleInput() {
        const word = this.iInput.value.trim();

        if(word === "") {
            this.iInput.focus();
            return;
        }

        this.stateMachine.guess(word);
        this.adaptControlsToState();
    }

    _createReferenceTableRow(name, value) {
        const template = document.getElementById("id_reference_table_row");
        const node = template.content.cloneNode(true);

        node.querySelector(".data-name").innerText = name;
        node.querySelector(".data-value").innerText = value;

        return node;
    }

    adaptControlsToState() {
        if(this.stateMachine.state === STATE_GUESSING) {
            this.bNext.setAttribute("hidden", true);
            this.bCheck.removeAttribute("hidden");

            this.iInput.value = "";
            this.iInput.removeAttribute("readonly");
            this.iInput.placeholder = this.stateMachine.wantedForm;

            this.dFailure.setAttribute("hidden", true);
            this.dSuccess.setAttribute("hidden", true);

            this.sGivenForm.innerText = this.stateMachine.givenForm;
            this.sGivenWord.innerText = this.stateMachine.givenWord;
            this.sWantedForm.innerText = this.stateMachine.wantedForm;

            this.dAllForms.setAttribute("hidden", true);
            this.dAllInfos.setAttribute("hidden", true);

            this.iInput.focus();
            return;
        }

        if(this.stateMachine.state === STATE_SUCCESS || this.stateMachine.state === STATE_FAILURE) {
            this.bNext.removeAttribute("hidden");
            this.bCheck.setAttribute("hidden", true);

            this.iInput.setAttribute("readonly", true);

            this.sSuccessCount.innerText = this.stateMachine.successCount;
            this.sFailureCount.innerText = this.stateMachine.failureCount;

            this.dAllInfos.innerHTML = "";
            for (const [info, value] of this.stateMachine.wantedWordAllInfos) {
                this.dAllInfos.appendChild(this._createReferenceTableRow(info, value));
            }
            this.dAllInfos.removeAttribute("hidden");

            this.dAllForms.innerHTML = "";
            for (const [form, value] of this.stateMachine._wantedWordAllForms) {
                this.dAllForms.appendChild(this._createReferenceTableRow(form, value));
            }
            this.dAllForms.removeAttribute("hidden");

            this.bNext.focus();
        }

        if(this.stateMachine.state === STATE_SUCCESS) {
            this.dSuccess.removeAttribute("hidden");
        } else if(this.stateMachine.state === STATE_FAILURE) {
            this.sWantedFormFailure.innerText = this.stateMachine.wantedForm;
            this.sWantedWord.innerText = this.stateMachine.wantedWords;

            this.dFailure.removeAttribute("hidden");
        }
    }
}


