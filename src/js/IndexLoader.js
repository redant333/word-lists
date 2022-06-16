"use strict";

function createWordListEntryNode(title, description, listName) {
    const entryTemplate = document.getElementById("id_word_list_entry");
    const entryNode = entryTemplate.content.cloneNode(true);

    entryNode.querySelector(".data-title").innerText = title;
    entryNode.querySelector(".data-description").innerHTML = description;
    entryNode.querySelectorAll(".data-link").forEach(anchor => {
        anchor.href += listName;
    });

    return entryNode;
}

export default function loadListEntries(containerId) {
    fetch("/word-lists/data/index.json")
    .then(data => {return data.json(); })
    .then(json => {
        const container = document.getElementById(containerId);
        for (const entry of json) {
            const entryNode = createWordListEntryNode(entry.title, entry.description, entry.listName);
            container.appendChild(entryNode);
        }
    });
}