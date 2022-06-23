"use strict";

export function maybeIndex(arr, index) {
    let indexed = arr[index];
    if (indexed !== undefined) {
        return indexed;
    } else {
        return arr;
    }
}

export function createElementWithText(elementName, text) {
    const element = document.createElement(elementName);
    element.innerText = text;

    return element;
}