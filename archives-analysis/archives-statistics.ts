import fs = require('fs');
import cheerio = require('cheerio');

import {Analyzer} from '../src/analyzer/analyzer';

const archiveString: string =
  fs.readFileSync(__dirname + '/archives/archive-2017-01-26.html', 'utf8');

const $ = cheerio.load(archiveString);
const messages: string[] =
  <any>Array.from($('.chat-app .chat-item__text').map((i, el) => $(el).text().trim()));

const analyzer = new Analyzer();
const stats = messages.map(message => Object.assign({message}, analyzer.analyze(message)));

function jsonToTable(json: {[key: string]: any}[]): {headers: string[], data: any[][]} {
  const headers: string[] = Object.keys(json[0]);
  const data: any[][] = json.map(object => {
    let array = [];
    headers.forEach(key => array.push(object[key]));
    return array;
  });
  return {headers, data};
}

function tableToHtml(table: {headers: string[], data: any[][]}): string {
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

fs.writeFileSync(__dirname + '/archives/stats.html', tableToHtml(jsonToTable(stats)));
