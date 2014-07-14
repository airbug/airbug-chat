//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UpdatesStatusForNonAnonymousUsersMigration')
//@Autoload

//@Require('Class')
//@Require('Flows')
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
var Flows                         = bugpack.require('Flows');
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
var $forEachParallel                = Flows.$forEachParallel;
var $forEachSeries                  = Flows.$forEachSeries;
var $series                         = Flows.$series;
var $task                           = Flows.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// Migration steps
// 1) Update all User where 'status' does not exist AND anonymous is 'false' by setting status to "offline"

var UpdatesStatusForNonAnonymousUsersMigration = Class.extend(Migration, {

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
        var UserModel = this.mongoDataStore.getMongooseModelForName("User");
        $series([
            $task(function(flow){
                UserModel.update({status: {$exists: false}}, {$set: {status: "offline"}}, {multi: true}, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    }
});



//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(UpdatesStatusForNonAnonymousUsersMigration).with(
    migration()
        .appName("airbug")
        .appVersion("0.0.16")
        .name("UpdatesStatusForNonAnonymousUsersMigration")
        .version("0.0.1"),
    autowired()
        .properties([
            property("logger").ref("logger"),
            property("mongoDataStore").ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UpdatesStatusForNonAnonymousUsersMigration', UpdatesStatusForNonAnonymousUsersMigration);
