"use strict";
import Practice from "./Practice.js";
import loadListEntries from "./IndexLoader.js";
import listData from "./ListLoader.js";

function getWordListName() {
    return window.location.search.substring(1);
}

window.WordListsLoader = {
    loadPractice: function() {
        new Practice(getWordListName()).start();
    },
    loadIndex: function(containerId) {
        loadListEntries(containerId);
    },
    loadList: function(containerId) {
        listData(containerId, getWordListName());
    }
};
