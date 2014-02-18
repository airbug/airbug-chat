//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AddsOwnerTypeToConversationsMigration')

//@Require('Class')
//@Require('airbugserver.ConversationModel')
//@Require('airbugserver.Migration')
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
var ConversationModel       = bugpack.require('airbugserver.ConversationModel');
var Migration               = bugpack.require('airbugserver.Migration');
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
// 1) Update all Conversations where ownerType is null by setting ownerType to "Room"
// (this is acceptable since we are just now introducing Dialogues)

var AddsOwnerTypeToConversationsMigration = Class.extend(Migration, {
    name: "AddsOwnerTypeToConversationsMigration",
    app: "airbug",
    appVersion: "0.0.16",
    version: "0.0.3",
    up: function(callback) {
        console.log("Running ", this.getName(), "...");
        var _this = this;
        $series([
            $task(function(flow){
                ConversationModel.update({ownerType: {$exists: false} }, {$set: {ownerType: "Room"}}, {multi: true}, function(error) {
                    flow.complete(error);
                });
            })
        ])
        .execute(function(error){
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

bugpack.export('airbugserver.AddsOwnerTypeToConversationsMigration', AddsOwnerTypeToConversationsMigration);
