"use strict";

export default function listData(tableId, dataFile) {
    dataFile = "/word-lists/data/" + dataFile;

    fetch(dataFile)
    .then(data => {return data.json();})
    .then(json => {
        fillTable(tableId, json);
    });
}

function addHeader(table, columns) {
    const thead = document.createElement("thead");
    table.appendChild(thead);

    const tr = document.createElement("tr");
    thead.appendChild(tr);

    for (const form of columns) {
        const th = document.createElement("th");
        th.setAttribute("scope", "col");
        th.innerText = form;
        tr.appendChild(th);
    }
}

function fillTable(tableId, json) {
    const table = document.getElementById(tableId);
    const columns = [...json.metadata.forms, ...json.metadata.infos];
    addHeader(table, columns);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (const word of json.list) {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);

        for(let formInfo of word.flat()) {
            const td = document.createElement("td");
            td.innerText = formInfo;
            tr.appendChild(td);
        }

    }
}