"use strict";

import { getAmbiguousWords } from "./utils/TestUtils.js";
import * as fs from 'fs';

function readJSON(path) {
    let data = fs.readFileSync(path);
    return JSON.parse(data);
}

// Suite
describe("Word lists", () => {
    const wordListIndex = readJSON("src/data/index.json");

    for (const group of wordListIndex) {
        for (const wordList of group.lists) {
            const jsonName = wordList.listName;
            // jshint -W083
            describe(jsonName, () => {
                its(`src/data/${jsonName}`);
            });
            // jshint +W083
        }
    }
});

// Tests
function its(wordList) {
    let words = null;
    let forms = null;
    let infos = null;
    let excludedGivenWords = [];

    beforeEach(async () => {
        const json = readJSON(wordList);
        words = json.list;
        forms = json.metadata.forms;
        infos = json.metadata.infos;

        if ("excludedGivenWords" in json.metadata) {
            excludedGivenWords = json.metadata.excludedGivenWords;
        }
    });

    it("should contain at least two words", () => {
        expect(words.length).toBeGreaterThanOrEqual(2);
    });

    it("should contain at least two forms", () => {
        expect(words.length).toBeGreaterThanOrEqual(2);
    });

    it("should have infos and forms for each word", () => {
        for (const word of words) {
            expect(word.length).toBe(2, word);
        }
    });

    it("should have correct number of forms for each word", () => {
        for (const [wordForms] of words) {
            expect(wordForms.length).toBe(forms.length);
        }
    });

    it("should have correct number of infos for each word", () => {
        for (const [, wordInfos] of words) {
            expect(wordInfos.length).toBe(infos.length);
        }
    });

    it("should have all ambiguous words listed", () => {
        let ambiguousWords = getAmbiguousWords(words);

        expect(ambiguousWords).toBeInstanceOf(Set);

        for (const ambiguousWord of ambiguousWords) {
            expect(excludedGivenWords)
                .withContext(`Full list of ambiguous words is [${Array.from(ambiguousWords)}]\n`)
                .toContain(ambiguousWord);
        }
    });
}
