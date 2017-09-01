const exe = require('child_process').execSync;
const fs = require('fs');

const cwd = process.cwd();

function log(msg){
  console.log(msg);
}

function exeNodeModule(command){
<<<<<<< HEAD
  exe(cwd + '/node_modules/.bin/' + command)
}

log('cleaning...');
exeNodeModule('rimraf dist')
=======
  exe(cwd + '/node_modules/.bin/' + command);
}

log('cleaning...');
exeNodeModule('rimraf dist');
>>>>>>> 472f488593a4d805e2b63c06337bad7ac2ecc013

log('tsc...');
exeNodeModule('tsc -p tsconfig.app.json');

log('copying...');
exeNodeModule('cpy package.json dist');
exeNodeModule('cpy app.yaml dist');

<<<<<<< HEAD
log('setting gitter token');
let appYaml = fs.readFileSync('./dist/app.yaml', 'utf-8');
appYaml += '  TOKEN: ' + process.env.TOKEN;
=======
log('setting gitter token...');
let appYaml = fs.readFileSync('./dist/app.yaml', 'utf-8');
appYaml = appYaml.replace('$TOKEN_PLACEHOLDER', process.env['TOKEN']);
>>>>>>> 472f488593a4d805e2b63c06337bad7ac2ecc013
fs.writeFileSync('./dist/app.yaml', appYaml);
