"use strict";
/* globals getAmbiguousWords */

describe("getAmbiguousWords", () => {
    it("should return empty set when there are no ambigous words", () => {
        let forms = ["f1", "f2"];
        let words = [
            [["wf11", "wf12"], ["i1"]],
            [["wf21", "wf22"], ["i2"]]
        ];

        expect(getAmbiguousWords(words, forms)).toEqual(new Set());
    });

    it("should return empty set when same word exists in different forms", () => {
        let forms = ["f1", "f2"];
        let words = [
            [["wf11", "same"], ["i1"]],
            [["same", "wf22"], ["i2"]]
        ];

        expect(getAmbiguousWords(words, forms)).toEqual(new Set());
    });

    it("should return a set of ambiguous words when they exist", () => {
        let forms = ["f1", "f2"];
        let words = [
            [["wf11", ["wf12", "ambiguous2"]], ["i1"]],
            [["ambiguous1", "ambiguous2"], ["i2"]],
            [["ambiguous1", "wf32"], ["i3"]],
            [["wf41", "wf42"], ["i4"]]
        ];
        let expected = new Set(["ambiguous1","ambiguous2"]);

        expect(getAmbiguousWords(words, forms)).toEqual(expected);
    });

    it("should be case insensitive and always return lowercase values", () => {
        let forms = ["f1", "f2"];
        let words = [
            [["wf11", "WF22"], ["i1"]],
            [["wf21", "wf22"], ["i2"]]
        ];

        let expected = new Set(["wf22"]);

        expect(getAmbiguousWords(words, forms)).toEqual(expected);
    });

    it("should ignore dashes", () => {
        let forms = ["f1", "f2"];
        let words = [
            [["wf11", "-"], ["i1"]],
            [["wf21", "-"], ["i2"]]
        ];

        expect(getAmbiguousWords(words, forms)).toEqual(new Set());
    });
});