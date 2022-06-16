"use strict";

export function maybeIndex(arr, index) {
    let indexed = arr[index];
    if (indexed !== undefined) {
        return indexed;
    } else {
        return arr;
    }
}