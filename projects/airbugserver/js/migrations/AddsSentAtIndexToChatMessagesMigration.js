//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AddsSentAtIndexToChatMessagesMigration')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.ChatMessageModel')
//@Require('airbugserver.Migration')
//@Require('bugflow.BugFlow')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();

//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ChatMessageModel        = bugpack.require('airbugserver.ChatMessageModel');
var Migration               = bugpack.require('airbugserver.Migration');


var AddsSentAtIndexToChatMessagesMigration = Class.extend(Migration, {
    name: "AddsSentAtIndexToChatMessagesMigration",
    appVersion: "0.0.13",
    version: "0.0.2",
    up: function(callback) {
        var _this = this;
        console.log("Running", this.getName(), "...");
        ChatMessageModel.ensureIndexes(function(error){
            if(!error){
                console.log(_this.getName(), "completed");
            } else {
                console.log(_this.getName(), "failed");
            }
            callback(error);
        });
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AddsSentAtIndexToChatMessagesMigration', AddsSentAtIndexToChatMessagesMigration);
