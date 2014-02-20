//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UpdatesStatusForNonAnonymousUsersMigration')

//@Require('Class')
//@Require('airbugserver.Migration')
//@Require('airbugserver.UserModel')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var mongoose                = require("mongoose");


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Migration               = bugpack.require('airbugserver.Migration');
var UserModel               = bugpack.require('airbugserver.UserModel');
var BugFlow                 = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachParallel        = BugFlow.$forEachParallel;
var $forEachSeries          = BugFlow.$forEachSeries;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;
var $whileSeries            = BugFlow.$whileSeries;


//-------------------------------------------------------------------------------
// Migration
//-------------------------------------------------------------------------------

// Migration steps
// 1) Update all User where 'status' does not exist AND anonymous is 'false' by setting status to "offline"

var UpdatesStatusForNonAnonymousUsersMigration = Class.extend(Migration, {
    name: "UpdatesStatusForNonAnonymousUsersMigration",
    app: "airbug",
    appVersion: "0.0.16",
    version: "0.0.1",
    up: function(callback) {
        console.log("Running ", this.getName(), "...");
        var _this = this;
        $series([
            $task(function(flow){
                UserModel.update({status: {$exists: false}}, {$set: {status: "offline"}}, {multi: true}, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(function(error){
            if (error) {
                console.log("Error:", error);
                console.log("Up migration", _this.name, "failed.");
                callback(error);
            } else {
                console.log("Up migration", _this.name, "completed.");
                console.log("Currently at migration version", _this.version, "for", _this.app, _this.appVersion);
                callback();
            }
        });
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UpdatesStatusForNonAnonymousUsersMigration', UpdatesStatusForNonAnonymousUsersMigration);
