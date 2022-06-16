(()=>{"use strict";const t="STATE_GUESSING",e="STATE_SUCCESS",s="STATE_FAILURE";function n(t,e){let s=t[e];return void 0!==s?s:t}class i{constructor(t,e){this._words=t,this._lastWordIndex=null,this._excludedGivenWords=e||[]}_randomInt(t){return Math.floor(Math.random()*t)}_getRandomWord(){let t=null;for(;t===this._lastWordIndex||null===t;)t=this._randomInt(this._words.length);this._lastWordIndex=t;let e=null;for(;null===e||"-"===this._words[t][0][e];)e=this._randomInt(this._words[t][0].length);let s=null;for(;s===e||null===s;)s=this._randomInt(this._words[t][0].length);let n=null;return this._words[t][0][e]instanceof Array&&(n=this._randomInt(this._words[t][0][e].length)),[t,n,e,s]}nextWord(){let t=null,e=null;do{t=this._getRandomWord();const[s,i,o]=t;e=n(this._words[s][0][o],i)}while(this._excludedGivenWords.includes(e));return t}}class o{constructor(t,e,s,n,o){this._wordRandomizer=o||new i(t,n),this._words=t,this._forms=e,this._infos=s,this._successCount=0,this._failureCount=0,this._state=null}get state(){return this._state}get wantedWords(){return this._wantedWords}get wantedWordAllInfos(){return this._wantedWordAllInfos}get wantedWordAllForms(){return this._wantedWordAllForms}get givenWord(){return this._givenWord}get givenForm(){return this._givenForm}get wantedForm(){return this._wantedForm}get successCount(){return this._successCount}get failureCount(){return this._failureCount}start(){const[e,s,i,o]=this._wordRandomizer.nextWord();this._wantedWords=[this._words[e][0][o]].flat(),this._wantedWordAllForms=[];for(let t=0;t<this._forms.length;t++)this._wantedWordAllForms.push([this._forms[t],[this._words[e][0][t]].flat()]);this._wantedWordAllInfos=[];for(let t=0;t<this._infos.length;t++)this._wantedWordAllInfos.push([this._infos[t],this._words[e][1][t]]);this._givenWord=n(this._words[e][0][i],s),this._wantedForm=this._forms[o],this._givenForm=this._forms[i],this._state=t}guess(t){this._wantedWords.map((t=>t.toLowerCase())).includes(t.toLowerCase())?(this._state=e,this._successCount++):(this._state=s,this._failureCount++)}}function r(t,e,s){const n=document.getElementById("id_word_list_entry").content.cloneNode(!0);return n.querySelector(".data-title").innerText=t,n.querySelector(".data-description").innerHTML=e,n.querySelectorAll(".data-link").forEach((t=>{t.href+=s})),n}window.Practice=class{constructor(t){this.dataFile="/word-lists/data/"+t}setControls(){function t(t){return document.getElementById(t)}this.sGivenWord=t("id_word"),this.sWantedWord=t("id_expected_word"),this.sGivenForm=t("id_given_form"),this.sWantedForm=t("id_wanted_form"),this.sWantedFormFailure=t("id_wanted_form_failure"),this.bCheck=t("id_check"),this.bNext=t("id_next"),this.iInput=t("id_input"),this.dSuccess=t("id_success"),this.dFailure=t("id_failure"),this.sSuccessCount=t("id_success_count"),this.sFailureCount=t("id_failure_count"),this.dAllForms=t("id_all_forms"),this.dAllInfos=t("id_all_infos")}start(){fetch(this.dataFile).then((t=>t.json())).then((t=>{this.stateMachine=new o(t.list,t.metadata.forms,t.metadata.infos,t.metadata.excludedGivenWords),this.stateMachine.start(),this.setControls(),this.setEventListeners(),this.adaptControlsToState()}))}setEventListeners(){this.bCheck.addEventListener("click",(()=>{this.handleInput()})),this.iInput.addEventListener("keyup",(e=>{"Enter"===e.key&&this.stateMachine.state===t&&this.bCheck.click()})),this.bNext.addEventListener("click",(()=>{this.stateMachine.start(),this.adaptControlsToState()}))}handleInput(){const t=this.iInput.value.trim();""!==t?(this.stateMachine.guess(t),this.adaptControlsToState()):this.iInput.focus()}_createReferenceTableRow(t,e){const s=document.getElementById("id_reference_table_row").content.cloneNode(!0);return s.querySelector(".data-name").innerText=t,s.querySelector(".data-value").innerText=e,s}adaptControlsToState(){if(this.stateMachine.state===t)return this.bNext.setAttribute("hidden",!0),this.bCheck.removeAttribute("hidden"),this.iInput.value="",this.iInput.removeAttribute("readonly"),this.iInput.placeholder=this.stateMachine.wantedForm,this.dFailure.setAttribute("hidden",!0),this.dSuccess.setAttribute("hidden",!0),this.sGivenForm.innerText=this.stateMachine.givenForm,this.sGivenWord.innerText=this.stateMachine.givenWord,this.sWantedForm.innerText=this.stateMachine.wantedForm,this.dAllForms.setAttribute("hidden",!0),this.dAllInfos.setAttribute("hidden",!0),void this.iInput.focus();if(this.stateMachine.state===e||this.stateMachine.state===s){this.bNext.removeAttribute("hidden"),this.bCheck.setAttribute("hidden",!0),this.iInput.setAttribute("readonly",!0),this.sSuccessCount.innerText=this.stateMachine.successCount,this.sFailureCount.innerText=this.stateMachine.failureCount,this.dAllInfos.innerHTML="";for(const[t,e]of this.stateMachine.wantedWordAllInfos)this.dAllInfos.appendChild(this._createReferenceTableRow(t,e));this.dAllInfos.removeAttribute("hidden"),this.dAllForms.innerHTML="";for(const[t,e]of this.stateMachine._wantedWordAllForms)this.dAllForms.appendChild(this._createReferenceTableRow(t,e));this.dAllForms.removeAttribute("hidden"),this.bNext.focus()}this.stateMachine.state===e?this.dSuccess.removeAttribute("hidden"):this.stateMachine.state===s&&(this.sWantedFormFailure.innerText=this.stateMachine.wantedForm,this.sWantedWord.innerText=this.stateMachine.wantedWords,this.dFailure.removeAttribute("hidden"))}},window.loadListEntries=function(t){fetch("/word-lists/data/index.json").then((t=>t.json())).then((e=>{const s=document.getElementById(t);for(const t of e){const e=r(t.title,t.description,t.listName);s.appendChild(e)}}))},window.listData=function(t,e){e="/word-lists/data/"+e,fetch(e).then((t=>t.json())).then((e=>{!function(t,e){const s=document.getElementById(t);!function(t,e){const s=document.createElement("thead");t.appendChild(s);const n=document.createElement("tr");s.appendChild(n);for(const t of e){const e=document.createElement("th");e.setAttribute("scope","col"),e.innerText=t,n.appendChild(e)}}(s,[...e.metadata.forms,...e.metadata.infos]);const n=document.createElement("tbody");s.appendChild(n);for(const t of e.list){const e=document.createElement("tr");n.appendChild(e);for(let s of t.flat()){const t=document.createElement("td");t.innerText=s,e.appendChild(t)}}}(t,e)}))}})();