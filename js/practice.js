"use strict";
const DATA_LOCATION = "/data/";

const ID_WORD = "id_word";
const ID_GIVEN_FORM = "id_given_form";
const ID_WANTED_FORM = "id_wanted_form";
const ID_INFO = "id_info";
const ID_CHECK = "id_check";
const ID_INPUT = "id_input";

function byId(id) { return document.getElementById(id); }

class Practice {
    constructor(dataFile) {
        this.dataFile = DATA_LOCATION + dataFile;
    }

    start() {
        fetch(this.dataFile)
            .then(data => {return data.json()})
            .then(json => {
                this.words = json["list"];
                this.forms = json["metadata"]["forms"];
                this.infoField = json["metadata"]["info"];

                const checkInputHandler = (() => { this.handleInput() });
                byId(ID_CHECK).addEventListener("click", checkInputHandler);

                this.startRound();
            });
    }

    randomInt(lowerThan) {
        return Math.floor(Math.random() * lowerThan);
    }

    getRandomQuestion() {
        // TODO Make sure the questions are not repeated
        const wordIndex = this.randomInt(this.words.length);
        const givenFormIndex = this.randomInt(this.forms.length);
        let wantedFormIndex = this.randomInt(this.forms.length);

        if(givenFormIndex === wantedFormIndex) {
            wantedFormIndex = (wantedFormIndex + 1) % this.forms.length;
        }

        const wantedForm = this.forms[wantedFormIndex];
        const givenForm = this.forms[givenFormIndex];
        const word = this.words[wordIndex];

        return [word, wantedForm, givenForm];
    }

    startRound() {
        const [ word, givenForm, wantedForm ] = this.getRandomQuestion();
        this.wantedWord = word[wantedForm];

        this.fillWordData(word, givenForm, wantedForm);
    }

    handleInput() {
        const word = byId(ID_INPUT).value;

        if(word.toLowerCase() === this.wantedWord.toLowerCase()) {
            console.log("Good");
        } else {
            // TODO Display the correct word
            console.log("Bad");
        }

        this.startRound();
    }

    fillWordData(wordData, givenForm, wantedForm) {
        byId(ID_WORD).innerText = wordData[givenForm];
        byId(ID_GIVEN_FORM).innerText = givenForm;
        byId(ID_WANTED_FORM).innerText = wantedForm;
        byId(ID_INFO).innerText = wordData[this.infoField];
        byId(ID_INPUT).value = "";
    }
}


