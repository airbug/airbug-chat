//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.AddsOwnerTypeToConversationsMigration')
//@Autoload

//@Require('Class')
//@Require('bugflow.BugFlow')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('bugmigrate.Migration')
//@Require('bugmigrate.MigrationTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();
var mongoose                        = require("mongoose");


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var AutowiredTag             = bugpack.require('bugioc.AutowiredTag');
var PropertyTag              = bugpack.require('bugioc.PropertyTag');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var Migration                       = bugpack.require('bugmigrate.Migration');
var MigrationTag             = bugpack.require('bugmigrate.MigrationTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                       = AutowiredTag.autowired;
var bugmeta                         = BugMeta.context();
var migration                       = MigrationTag.migration;
var property                        = PropertyTag.property;
var $forEachParallel                = BugFlow.$forEachParallel;
var $forEachSeries                  = BugFlow.$forEachSeries;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;
var $whileSeries                    = BugFlow.$whileSeries;


//-------------------------------------------------------------------------------
// Migration
//-------------------------------------------------------------------------------

// Migration steps
// 1) Update all Conversations where ownerType is null by setting ownerType to "Room"
// (this is acceptable since we are just now introducing Dialogues)

var AddsOwnerTypeToConversationsMigration = Class.extend(Migration, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} appName
     * @param {string} appVersion
     * @param {string} name
     * @param {string} version
     */
    _constructor: function(appName, appVersion, name, version) {

        this._super(appName, appVersion, name, version);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Logger}
         */
        this.logger                 = null;

        /**
         * @private
         * @type {MongoDataStore}
         */
        this.mongoDataStore         = null
    },


    //-------------------------------------------------------------------------------
    // Migration Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    up: function(callback) {
        this.logger.info("Running ", this.getName(), "...");
        var ConversationModel = this.mongoDataStore.getMongooseModelForName("Conversation");
        $series([
            $task(function(flow){
                ConversationModel.update({ownerType: {$exists: false} }, {$set: {ownerType: "Room"}}, {multi: true}, function(error) {
                    flow.complete(error);
                });
            })
        ])
        .execute(callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(AddsOwnerTypeToConversationsMigration).with(
    migration()
        .appName("airbug")
        .appVersion("0.0.16")
        .name("AddsOwnerTypeToConversationsMigration")
        .version("0.0.3"),
    autowired()
        .properties([
            property("logger").ref("logger"),
            property("mongoDataStore").ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AddsOwnerTypeToConversationsMigration', AddsOwnerTypeToConversationsMigration);
