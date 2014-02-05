//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Require('airbugserver.AddsChatMessageCountersAndIndexesMigration')
//@Require('airbugserver.AddsSentAtIndexToChatMessagesMigration')
//@Require('airbugserver.MigrationModel')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context(module);
var mongoose    = require('mongoose');

//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AddsChatMessageCountersAndIndexesMigration  = bugpack.require('airbugserver.AddsChatMessageCountersAndIndexesMigration');
var AddsSentAtIndexToChatMessagesMigration      = bugpack.require('airbugserver.AddsSentAtIndexToChatMessagesMigration');
var MigrationModel                              = bugpack.require('airbugserver.MigrationModel');
var BugFlow                                     = bugpack.require('bugflow.BugFlow');


var $forEachSeries                              = BugFlow.$forEachSeries;

//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var addsChatMessageCountersAndIndexesMigration  = new AddsChatMessageCountersAndIndexesMigration();
var addsSentAtIndexToChatMessagesMigration      = new AddsSentAtIndexToChatMessagesMigration();

var migrations = [
    addsChatMessageCountersAndIndexesMigration,
    addsSentAtIndexToChatMessagesMigration
];

mongoose.connect('mongodb://10.209.21.90/airbug'); //production //localhost is 127.0.0.1

$forEachSeries(migrations, function(flow, migration){
    var migrationName       = migration.getName();
    var migrationVersion    = migration.getVersion();
    var migrationAppVersion = migration.getAppVersion();

    console.log("checking to see if the migration has been previously run..");
    MigrationModel.findOne({appVersion: migrationAppVersion, version: migrationVersion}, function(error, returnedMigration){
        if(!error){
            if(!returnedMigration){

                console.log("Running", migrationName, "...");
                var migrationDoc        = new MigrationModel();
                migrationDoc.name       = migrationName;
                migrationDoc.version    = migrationVersion;
                migrationDoc.appVersion = migrationAppVersion;

                migration.up(function(error){
                    if(!error){
                        console.log(migrationName, "migration number:", migrationVersion, "for app version", migrationAppVersion, "completed successfully");
                        migrationDoc.save(function(error, returnedMigration, numberAffected){
                            if(!error){
                                if(numberAffected === 1){
                                    console.log("migrationDoc for", migrationName, "has been saved");
                                    flow.complete();
                                } else {
                                    flow.complete(new Error("migrationDoc was not saved"));
                                }
                            } else {
                                flow.complete(error);
                            }
                        });
                    } else {
                        console.log("migration", migrationName, "failed");
                        flow.complete(error);
                    }
                });
            } else {
                console.log(migrationName, "migration number:", migrationVersion, "for app version", migrationAppVersion, "has already been run");
                flow.complete();
            }
        } else {
            flow.error(error);
        }
    });
})
.execute(function(error){
    if(error){
        console.error(error);
        process.exit(1);
    } else {
        console.log("Migration successfully completed");
        process.exit(1);
    }
});
