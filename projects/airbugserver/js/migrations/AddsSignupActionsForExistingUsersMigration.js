//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AddsSignupActionsForExistingUsersMigration')
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

bugmeta.annotate(AddsSignupActionsForExistingUsersMigration).with(
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
