//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var fs = require('fs');

var AnnotateUnit = require('./lib/annotate_unit/AnnotateUnit');
var Build = require('./lib/Build');
var ChatServerApplication = require('./lib/chat/ChatServerApplication');
var List = require('./lib/List');


//TODO BRN: Not sure this is the right way of getting the project directory.
var projectDir = process.cwd();


//-------------------------------------------------------------------------------
// Declare Build Tasks
//-------------------------------------------------------------------------------

var buildTask = Build.addTask('build', function() {

});

var deployTask = Build.addTask('deploy', function() {
    var chatServerApplication = new ChatServerApplication({
        redisConfigFile: projectDir + "/etc/redis.conf"
    });
    chatServerApplication.deploy();

    //TODO BRN (IMPROVEMENT): I think this should be moved out of here and the application should be able to start itself after it has deployed.
    chatServerApplication.start();
});
deployTask.dependsOn('build');

var testTask = Build.addTask('test', function() {
    requireModulesFromDirectory(projectDir + "/test/unit");
    AnnotateUnit.runTests(true);
});


//-------------------------------------------------------------------------------
// Execute Build
//-------------------------------------------------------------------------------

Build.execute();


//-------------------------------------------------------------------------------
// Helper Methods
//-------------------------------------------------------------------------------

//TODO BRN (IMPROVEMENT): This is a temporary measure until we can put together the annotate-js compiler.

function requireModulesFromDirectory(directoryPathString) {
    var modulePathList = scanDirectoryForModules(directoryPathString);
    modulePathList.forEach(function(modulePath) {
        require(modulePath);
    });
}

/**
 * @param {string} directoryPathString
 * @param {boolean} scanRecursively (defaults to true)
 * @return {List<string>}
 */
function scanDirectoryForModules(directoryPathString, scanRecursively) {
    //TEST
    console.log("scanning directory - " + directoryPathString);
    if (scanRecursively !== undefined) {
        scanRecursively = true;
    }
    var modulePathList = new List();
    var fileStringArray = fs.readdirSync(directoryPathString);
    for (var i = 0, size = fileStringArray.length; i < size; i++) {
        var pathString = directoryPathString + "/" + fileStringArray[i];

        //TEST
        console.log("pathString:" + pathString);
        var stat = fs.statSync(pathString);
        if (stat.isDirectory()) {
            if (scanRecursively) {
                var childModulePathList = scanDirectoryForModules(pathString);
                modulePathList.addAll(childModulePathList);
            }
        } else if (stat.isFile()) {
            if (pathString.lastIndexOf('.js') === pathString.length - 3) {
                modulePathList.add(pathString);
            }
        }
    }
    return modulePathList;
}

