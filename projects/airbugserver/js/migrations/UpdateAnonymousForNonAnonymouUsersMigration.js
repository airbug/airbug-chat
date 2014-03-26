//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UpdatesAnonymousForNonAnonymousUsersMigration')
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
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// Migration steps
// 1) Update all Users where 'anonymous' does not exist AND anonymous is 'false' by setting status to "offline"

var UpdatesAnonymousForNonAnonymousUsersMigration = Class.extend(Migration, {

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
                UserModel.update({email: {$exists: true}}, {$set: {anonymous: false}}, {multi: true}, function(error) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    }
});



//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UpdatesAnonymousForNonAnonymousUsersMigration).with(
    migration()
        .appName("airbug")
        .appVersion("0.0.18")
        .name("UpdatesAnonymousForNonAnonymousUsersMigration")
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

bugpack.export('airbugserver.UpdatesAnonymousForNonAnonymousUsersMigration', UpdatesAnonymousForNonAnonymousUsersMigration);