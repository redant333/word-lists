"use strict";
import {
    PracticeStateMachine,
    STATE_GUESSING,
    STATE_SUCCESS,
    STATE_FAILURE
} from "./PracticeStateMachine.js";

export default class Practice {
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
                                                             json.metadata.infos,
                                                             json.metadata.excludedGivenWords);
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
