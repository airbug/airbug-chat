//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var BuildTask = require('./BuildTask');
var Class = require('./Class');
var Map = require('./Map');
var Obj  = require('./Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Build = Class.extend(Obj);


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

Build.defaultTaskName = "build";
Build.specifiedTaskName = "";

if (process.argv.length >= 2) {
    Build.specifiedTaskName = process.argv[2];
}

Build.tasks = new Map();


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

Build.addTask = function(taskName, taskFunction) {
    var buildTask = new BuildTask(taskName, taskFunction);
    Build.tasks.put(taskName, buildTask);
    return buildTask;
};

Build.getTask = function(taskName) {
    return Build.tasks.get(taskName);
};

Build.defaultTask = function(taskName) {
    Build.defaultTaskName = taskName;
};

//TODO BRN: Need to think of a better way of doing this rather than requiring the build to be executed by the build script.
Build.execute = function() {
    var buildTaskName = null;
    if (Build.specifiedTaskName) {
        buildTaskName = Build.specifiedTaskName;
    } else {
        buildTaskName = Build.defaultTaskName;
    }

    //TODO BRN: Validate that there are no circular dependencies.

    var buildTask = Build.tasks.get(buildTaskName);

    if (buildTask) {
        Build.executeTask(buildTask);
    } else {
        throw new Error("Build task '" + buildTaskName + "' cannot be found.");
    }
};


Build.executeTask = function(buildTask) {
    if (!buildTask.hasExecuted()) {
        var dependentTaskNames = buildTask.getDependentTaskNames();
        dependentTaskNames.forEach(function(dependentTaskName) {
            var dependentTask = Build.getTask(dependentTaskName);
            Build.executeTask(dependentTask);
        });
        buildTask.execute();
    }
};

//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = Build;
