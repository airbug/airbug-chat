//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.AddsSignupActionsForExistingUsersMigration')
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

var AddsSignupActionsForExistingUsersMigration = Class.extend(Migration, {

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

        var ActionModel         = this.mongoDataStore.getMongooseModelForName("Action");
        var UserModel           = this.mongoDataStore.getMongooseModelForName("User");

        var users = null;
        var signups = [];
        $series([
            $task(function(flow){
                UserModel.find({anonymous: null}, function(error, returnedUserDocs){
                    users = returnedUserDocs;
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                users.forEach(function(user){
                    signups.push({
                        actionData: {},
                        actionType: "signup",
                        actionVersion: "0.0.1",
                        createdAt: user.createdAt,
                        occurredAt: user.createdAt,
                        userId: user._id
                    });
                });

                ActionModel.create(signups, function(error){
                    flow.complete(error);
                });
            })
        ])
        .execute(function(throwable){
            callback(throwable);
        });

    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(AddsSignupActionsForExistingUsersMigration).with(
    migration()
        .appName("airbug")
        .appVersion("0.0.17")
        .name("AddsSignupActionsForExistingUsersMigration")
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

bugpack.export('airbugserver.AddsSignupActionsForExistingUsersMigration', AddsSignupActionsForExistingUsersMigration);
