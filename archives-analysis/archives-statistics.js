"use strict";
const fs = require("fs");
const cheerio = require("cheerio");
function escape(text) {
    return text
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t')
        .replace(/</g, '&lt;')
        .replace(/"/g, '""');
}
const formatting_analyzer_1 = require("../src/formatting/formatting.analyzer");
const archiveString = fs.readFileSync(__dirname + '/archives/archive-2017-01-26.html', 'utf8');
const $ = cheerio.load(archiveString);
const messages = Array.from($('.chat-app .chat-item__text').map((i, el) => $(el).text().trim()));
const analyzer = new formatting_analyzer_1.FormattingAnalyzer();
const stats = messages.map(message => {
    return Object.assign({ message: escape(message) }, { score: analyzer.getScore(message) }, analyzer.analyze(message));
});
stats.sort((a, b) => a.score < b.score ? 1 : -1);
function jsonToTable(json) {
    const headers = Object.keys(json[0]);
    const data = json.map(object => {
        let array = [];
        headers.forEach(key => array.push(object[key]));
        return array;
    });
    return { headers, data };
}
function tableToHtml(table) {
    let html = ``;
    html += `<table>`;
    html += `<thead><tr>`;
    {
        table.headers.forEach(header => html += `<th>${header}</th>`);
    }
    html += `</tr></thead>`;
    html += `<tbody>`;
    {
        table.data.forEach(row => {
            html += `<tr>`;
            row.forEach(cell => html += `<td>${cell}</td>`);
            html += `</tr>`;
        });
    }
    html += `</tbody>`;
    html += `</table>`;
    return html;
}
function tableToCsv(table) {
    let csv = ``;
    csv += table.headers.join(',') + `\n`;
    csv += table.data.map(row => row.map(cell => `"${cell}"`).join(`,`)).join(`\n`);
    return csv;
}
fs.writeFileSync(__dirname + '/archives/stats.html', tableToHtml(jsonToTable(stats)));
fs.writeFileSync(__dirname + '/archives/stats.csv', tableToCsv(jsonToTable(stats)));
//# sourceMappingURL=archives-statistics.js.map