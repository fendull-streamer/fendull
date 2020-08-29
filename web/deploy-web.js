var sys = require('util')
var exec = require('child_process').exec;


var os = require('os');
//control OS
//then run command depengin on the OS

if (os.type() === 'Linux')
{
    var proc = exec("npm run build && \"../deploy/env/bin/python.exe\" \"../deploy/deploy_web.py\"");
    proc.stdout.on('data', function(data){console.log(data)});
} 
    
else if (os.type() === 'Darwin'){
    var proc = exec("npm run build && \"../deploy/env/bin/python.exe\" \"../deploy/deploy_web.py\"");
    proc.stdout.on('data', function(data){console.log(data)});
} 
    
else if (os.type() === 'Windows_NT') {
    var proc = exec("npm run build && \"../deploy/env/Scripts/python.exe\" \"../deploy/deploy_web.py\"");
    proc.stdout.on('data', function(data){console.log(data)});
    proc.stderr.on('data', function(data){console.log(data)});
}
else
   throw new Error("Unsupported OS found: " + os.type());