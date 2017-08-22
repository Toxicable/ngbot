const exe = require('child_process').execSync;
const fs = require('fs');

const cwd = process.cwd();

function log(msg){
  console.log(msg);
}

function exeNodeModule(command){
  exe(cwd + '/node_modules/.bin/' + command);
}

log('cleaning...');
exeNodeModule('rimraf dist');

log('tsc...');
exeNodeModule('tsc -p tsconfig.app.json');

log('copying...');
exeNodeModule('cpy package.json dist');
exeNodeModule('cpy app.yaml dist');

log('setting gitter token...');
let appYaml = fs.readFileSync('./dist/app.yaml', 'utf-8');
appYaml = appYaml.replace('$TOKEN_PLACEHOLDER', process.env['TOKEN']);
fs.writeFileSync('./dist/app.yaml', appYaml);
