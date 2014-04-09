//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UpdatesStatusForNonAnonymousUsersMigration')
//@Autoload

//@Require('Class')
//@Require('bugflow.BugFlow')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugmigrate.Migration')
//@Require('bugmigrate.MigrationAnnotation')


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
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var Migration                       = bugpack.require('bugmigrate.Migration');
var MigrationAnnotation             = bugpack.require('bugmigrate.MigrationAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                       = AutowiredAnnotation.autowired;
var bugmeta                         = BugMeta.context();
var migration                       = MigrationAnnotation.migration;
var property                        = PropertyAnnotation.property;
var $forEachParallel                = BugFlow.$forEachParallel;
var $forEachSeries                  = BugFlow.$forEachSeries;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;
var $whileSeries                    = BugFlow.$whileSeries;


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

bugmeta.annotate(UpdatesStatusForNonAnonymousUsersMigration).with(
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
