var fs = require('fs');

var token =  process.env.TOKEN;
var fileName = 'app.yaml';

var data = fs.readFileSync(fileName, 'utf-8');
data = data + '  TOKEN: ' + token;

fs.writeFileSync(fileName, data);
