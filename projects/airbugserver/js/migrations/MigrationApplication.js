//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('MigrationApplication')

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.AddsBetaKeysMigration')
//@Require('airbugserver.AddsChatMessageCountersAndIndexesMigration')
//@Require('airbugserver.AddsOwnerTypeToConversationsMigration')
//@Require('airbugserver.AddsSentAtIndexToChatMessagesMigration')
//@Require('airbugserver.MigrationModel')
//@Require('airbugserver.UpdatesStatusForNonAnonymousUsersMigration')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('configbug.Configbug')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                                     = require('bugpack').context(module);
var mongoose                                    = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                                       = bugpack.require('Class');
var Obj                                         = bugpack.require('Obj');
var AddsBetaKeysMigration                       = bugpack.require('AddsBetaKeysMigration');
var AddsChatMessageCountersAndIndexesMigration  = bugpack.require('airbugserver.AddsChatMessageCountersAndIndexesMigration');
var AddsOwnerTypeToConversationsMigration       = bugpack.require('airbugserver.AddsOwnerTypeToConversationsMigration');
var AddsSentAtIndexToChatMessagesMigration      = bugpack.require('airbugserver.AddsSentAtIndexToChatMessagesMigration');
var MigrationModel                              = bugpack.require('airbugserver.MigrationModel');
var UpdatesStatusForNonAnonymousUsersMigration  = bugpack.require('airbugserver.UpdatesStatusForNonAnonymousUsersMigration');
var BugFlow                                     = bugpack.require('bugflow.BugFlow');
var BugFs                                       = bugpack.require('bugfs.BugFs');
var Configbug                                   = bugpack.require('configbug.Configbug');
var Logger                                      = bugpack.require('loggerbug.Logger');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachSeries                              = BugFlow.$forEachSeries;
var $series                                     = BugFlow.$series;
var $task                                       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MigrationApplication = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Configbug}
         */
        this.configbug      = new Configbug(BugFs.resolvePaths([__dirname, '../resources/config']));

        /**
         * @private
         * @type {Logger}
         */
        this.logger         = new Logger();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Configbug}
     */
    getConfigbug: function() {
        return this.configbug;
    },

    /**
     * @return {Logger}
     */
    getLogger: function() {
        return this.logger;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    start: function(callback) {
        var _this                                       = this;
        var addsChatMessageCountersAndIndexesMigration  = new AddsChatMessageCountersAndIndexesMigration();
        var addsOwnerTypeToConversationsMigration       = new AddsOwnerTypeToConversationsMigration();
        var addsSentAtIndexToChatMessagesMigration      = new AddsSentAtIndexToChatMessagesMigration();
        var updatesStatusForNonAnonymousUsersMigration  = new UpdatesStatusForNonAnonymousUsersMigration();
        var addsBetaKeysMigration                       = new AddsBetaKeysMigration();

        var migrations = [
            addsChatMessageCountersAndIndexesMigration,
            addsOwnerTypeToConversationsMigration,
            addsSentAtIndexToChatMessagesMigration,
            updatesStatusForNonAnonymousUsersMigration,
            addsBetaKeysMigration
        ];


        /** @type {string} */
        var configName  = this.generateConfigName();
        /** @type {Config} */
        var config      = null;

        $series([
            $task(function(flow) {
                _this.loadConfig(configName, function(throwable, loadedConfig) {
                    if (!throwable) {
                        config = loadedConfig;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                mongoose.connect('mongodb://' + config.getProperty("mongoDbIp") + '/airbug');
                $forEachSeries(migrations, function(flow, migration){
                    var migrationName       = migration.getName();
                    var migrationVersion    = migration.getVersion();
                    var migrationAppVersion = migration.getAppVersion();

                    _this.logger.info("checking to see if the migration has been previously run..");
                    MigrationModel.findOne({appVersion: migrationAppVersion, version: migrationVersion}, function(error, returnedMigration){
                        if(!error){
                            if(!returnedMigration){

                                _this.logger.info("Running", migrationName, "...");
                                var migrationDoc        = new MigrationModel();
                                migrationDoc.name       = migrationName;
                                migrationDoc.version    = migrationVersion;
                                migrationDoc.appVersion = migrationAppVersion;

                                migration.up(function(error){
                                    if(!error){
                                        _this.logger.info(migrationName, "migration number:", migrationVersion, "for app version", migrationAppVersion, "completed successfully");
                                        migrationDoc.save(function(error, returnedMigration, numberAffected){
                                            if(!error){
                                                if(numberAffected === 1){
                                                    _this.logger.info("migrationDoc for", migrationName, "has been saved");
                                                    flow.complete();
                                                } else {
                                                    flow.complete(new Error("migrationDoc was not saved"));
                                                }
                                            } else {
                                                flow.complete(error);
                                            }
                                        });
                                    } else {
                                        _this.logger.info("migration", migrationName, "failed");
                                        flow.complete(error);
                                    }
                                });
                            } else {
                                _this.logger.info(migrationName, "migration number:", migrationVersion, "for app version", migrationAppVersion, "has already been run");
                                flow.complete();
                            }
                        } else {
                            flow.error(error);
                        }
                    });
                }).execute(function(throwable) {
                    flow.complete(throwable);
                });
            })
       ]).execute(function(error){
            if (!error) {
                _this.logger.info("Migration successfully completed");
                callback();
            } else {
                _this.logger.error(error);
                callback();
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @return {string}
     */
    generateConfigName: function() {
        var configName = "dev";
        var index = process.argv.indexOf("--config");
        if (index > -1) {
            configName = process.argv[index + 1];
        } else if (process.env.CONFIGBUG) {
            configName = process.env.CONFIGBUG;
        }
        return configName;
    },

    /**
     * @private
     * @param {string} configName
     * @param {function(Throwable, Config=)} callback
     */
    loadConfig: function(configName, callback) {
        this.configbug.getConfig(configName, callback);
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.MigrationApplication', MigrationApplication);
