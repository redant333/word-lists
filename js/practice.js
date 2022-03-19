"use strict";
const DATA_LOCATION = "/data/";

const ID_WORD = "id_word";
const ID_EXPECTED_WORD = "id_expected_word";
const ID_GIVEN_FORM = "id_given_form";
const ID_WANTED_FORM = "id_wanted_form";
const ID_INFO = "id_info";
const ID_CHECK = "id_check";
const ID_NEXT = "id_next";
const ID_INPUT = "id_input";

const ID_SUCCESS = "id_success";
const ID_FAILURE = "id_failure";

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

                this.setEventListeners();
                this.startRound();
            });
    }

    setEventListeners() {
        const checkInputHandler = () => { this.handleInput() };
        byId(ID_CHECK).addEventListener("click", checkInputHandler);
        byId(ID_NEXT).addEventListener("click", () => { this.startRound() });
        byId(ID_INPUT).addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                byId(ID_CHECK).click();
            }
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

        if(word == "") {
            byId(ID_INPUT).focus();
            return;
        }

        if(word.toLowerCase() === this.wantedWord.toLowerCase()) {
            byId(ID_SUCCESS).removeAttribute("hidden");
        } else {
            byId(ID_FAILURE).removeAttribute("hidden");
        }

        byId(ID_INPUT).setAttribute("readonly", true);
        byId(ID_NEXT).removeAttribute("hidden");
        byId(ID_CHECK).setAttribute("hidden", true);

        byId(ID_NEXT).focus();
    }

    fillWordData(wordData, givenForm, wantedForm) {
        byId(ID_WORD).innerText = wordData[givenForm];
        byId(ID_EXPECTED_WORD).innerText = wordData[wantedForm];
        byId(ID_GIVEN_FORM).innerText = givenForm;
        byId(ID_INFO).innerText = wordData[this.infoField];
        byId(ID_INPUT).value = "";
        byId(ID_INPUT).placeholder = wantedForm;

        byId(ID_SUCCESS).setAttribute("hidden", true);
        byId(ID_FAILURE).setAttribute("hidden", true);

        byId(ID_CHECK).removeAttribute("hidden");
        byId(ID_NEXT).setAttribute("hidden", true);
        byId(ID_INPUT).removeAttribute("readonly");

        byId(ID_INPUT).focus();
    }
}


