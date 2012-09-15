//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Class = require('./Class');
var List = require('./List');
var Obj = require('./Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BuildTask = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(name, method) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.executed = false;

        this.method = method;

        this.name = name;

        this.dependentTaskNames = new List();
    },


    getDependentTaskNames: function() {
        return this.dependentTaskNames;
    },

    hasExecuted: function() {
        return this.executed;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    execute: function() {
        if (!this.executed) {
            console.log("Executing task " + this.name);
            this.method();
            console.log("Completed task " + this.name);
            this.executed = true;
        }
    },

    dependsOn: function(taskName) {
        if (!this.dependentTaskNames.contains(taskName)) {
            this.dependentTaskNames.add(taskName);
        }
    }
});


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = BuildTask;
