//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AddsBetaKeysMigration')
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

var bugpack     = require('bugpack').context();


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

var AddsBetaKeysMigration = Class.extend(Migration, {

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

    up: function(callback) {
        var BetaKeyModel    = this.mongoDataStore.getMongooseModelForName("BetaKey");

        var baseBetaKeys = [
            {betaKey: "GO_AIRBUG!",                                                     baseKey: "GO_AIRBUG!",                                                  isBaseKey: true, hasCap: false},
            {betaKey: "GO_TEAM_AIRBUG!",                                                baseKey: "GO_TEAM_AIRBUG!",                                                  isBaseKey: true, hasCap: false},
            {betaKey: "GO_AIRBUG#BN14",                                                 baseKey: "GO_AIRBUG#BN14",                                              isBaseKey: true, hasCap: false},
            {betaKey: "GO_AIRBUG#MW14",                                                 baseKey: "GO_AIRBUG#MW14",                                              isBaseKey: true, hasCap: false},
            {betaKey: "GO_AIRBUG#RS14",                                                 baseKey: "GO_AIRBUG#RS14",                                              isBaseKey: true, hasCap: false},
            {betaKey: "GO_AIRBUG#SC14",                                                 baseKey: "GO_AIRBUG#SC14",                                              isBaseKey: true, hasCap: false},
            {betaKey: "GO_AIRBUG#TP14",                                                 baseKey: "GO_AIRBUG#TP14",                                              isBaseKey: true, hasCap: false},
            {betaKey: "GO_AIRBUG#ADVISOR14",                                            baseKey: "GO_AIRBUG#ADVISOR14",                                              isBaseKey: true, hasCap: false},
            {betaKey: "AIRBUG_THE_TSHIRT_KEY",                                          baseKey: "AIRBUG_THE_TSHIRT_KEY",                                       isBaseKey: true, hasCap: false},
            {betaKey: "AIRBUG_AND_DBC_FOR_THE_WIN",                                     baseKey: "AIRBUG_AND_DBC_FOR_THE_WIN",                                  isBaseKey: true, hasCap: false},
            {betaKey: "airbugAndHackReactorForTheWin",                                  baseKey: "airbugAndHackReactorForTheWin",                               isBaseKey: true, hasCap: false},
            {betaKey: "N-C-C-1-7-0-1. No bloody A - B - C - or D!",                     baseKey: "N-C-C-1-7-0-1. No bloody A - B - C - or D!",                  isBaseKey: true, hasCap: false},
            {betaKey: "Why you stuck-up, half-witted, scruffy-looking nerf-herder!",    baseKey: "Why you stuck-up, half-witted, scruffy-looking nerf-herder!", isBaseKey: true, hasCap: false},
            {betaKey: "I’d just as soon kiss a Wookiee.",                               baseKey: "I’d just as soon kiss a Wookiee.",                                  isBaseKey: true, hasCap: false},
            {betaKey: "Here's looking at you, kid.",                                    baseKey: "Here's looking at you, kid.",                                  isBaseKey: true, hasCap: false},
            {betaKey: "Do. Or do not. There is no try.",                                baseKey: "Do. Or do not. There is no try.",                              isBaseKey: true, hasCap: false},
            {betaKey: "Alright, alright, alright!",                                     baseKey: "Alright, alright, alright!",                                  isBaseKey: true, hasCap: false},
            {betaKey: "I'm picking up what you're laying down.",                        baseKey: "I'm picking up what you're laying down.",                     isBaseKey: true, hasCap: false},
            {betaKey: "I'm giving her all she's got, Captain!",                         baseKey: "I'm giving her all she's got, Captain!",                      isBaseKey: true, hasCap: false},
            {betaKey: "Go ahead, make my day.",                                         baseKey: "Go ahead, make my day.",                                      isBaseKey: true, hasCap: false},
            {betaKey: "You had me at \"hello.\"",                                       baseKey: "You had me at \"hello.\"",                                    isBaseKey: true, hasCap: false},
            {betaKey: "I feel the need - the need for speed!",                          baseKey: "I feel the need - the need for speed!",                       isBaseKey: true, hasCap: false},
            {betaKey: "Ride into the Danger Zone",                                      baseKey: "Ride into the Danger Zone",                                   isBaseKey: true, hasCap: false},
            {betaKey: "The Force will be with you...always.",                           baseKey: "The Force will be with you...always."}
        ];

        $forEachParallel(baseBetaKeys, function(flow, baseBetaKey) {
            BetaKeyModel.update(baseBetaKey, {}, {upsert: true}, function(error){
                flow.complete(error);
            });
        }).execute(callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AddsBetaKeysMigration).with(
    migration()
        .appName("airbug")
        .appVersion("0.0.17")
        .name("AddsBetaKeysMigration")
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

bugpack.export('airbugserver.AddsBetaKeysMigration', AddsBetaKeysMigration);
