"use strict";
import { maybeIndex } from "../src/js/Utils.js";

describe("maybeIndex", () => {
    it("should return the the first argument when the first argument is not an array", () => {
        expect(maybeIndex(1, 0)).toBe(1);
    });

    it("should return the appropriate element if the first argument is an array", () => {
        expect(maybeIndex([1, 2, 3], 1)).toBe(2);
    });
});
