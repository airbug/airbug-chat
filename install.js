var child_process = require('child_process');
var fs = require('fs');

var installDir = process.cwd();

function ensureDeployDirectory() {
    var exists = fs.existsSync(installDir + '/.deploy');
    if (!exists) {
        console.log("Deploy directory does not exist");
        createDeployDirectory();
    } else {
        console.log("Deploy directory exists");
    }
}

function createDeployDirectory() {
    fs.mkdirSync(installDir + '/.deploy');
    console.log("Created deploy directory");
}

function ensureRedisInstalled() {

}

ensureDeployDirectory();
ensureRedisInstalled();

