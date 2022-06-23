"use strict";
import { createElementWithText } from "./Utils.js";

function getGroupId(group) {
    // Remove anything that is not in A-Za-z0-9_
    // This might need to be adapted if non ASCII
    // characters need to be supported
    const id = group.title.replace(/\W/g, "").toLowerCase();
    return `id_group_${id}`;
}

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

function createGroup(groupJson) {
    const groupDiv = document.createElement("div");
    groupDiv.classList += "mt-4";

    const groupTitle = createElementWithText("h4", groupJson.title);
    groupTitle.id = getGroupId(groupJson);
    groupDiv.appendChild(groupTitle);


    for (const list of groupJson.lists) {
        const entryNode = createWordListEntryNode(list.title, list.description, list.listName);
        groupDiv.appendChild(entryNode);
    }

    return groupDiv;
}

function fillGroups(container, json) {
    for (const group of json) {
        container.appendChild(createGroup(group));
    }
}

function createTocEntry(groupJson) {
    const entryTemplate = document.getElementById("id_toc_entry_template");
    const entry = entryTemplate.content.cloneNode(true);

    const link = entry.querySelector(".data-link");
    link.href = `#${getGroupId(groupJson)}`;
    link.innerText = groupJson.title;

    entry.querySelector(".data-count").innerText = groupJson.lists.length;

    return entry;
}

function fillToc(container, json) {
    for (const group of json) {
        container.appendChild(createTocEntry(group));
    }
}

export default function loadListEntries(containerId, tocContainerId) {
    fetch("/word-lists/data/index.json")
    .then(data => {return data.json(); })
    .then(json => {
        const container = document.getElementById(containerId);
        fillGroups(container, json);

        const tocContainer = document.getElementById(tocContainerId);
        fillToc(tocContainer, json);
    });
}