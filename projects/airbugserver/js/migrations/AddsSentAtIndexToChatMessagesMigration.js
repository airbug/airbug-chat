/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.AddsSentAtIndexToChatMessagesMigration')
//@Autoload

//@Require('Bug')
//@Require('Class')
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

var Bug                             = bugpack.require('Bug')
var Class                           = bugpack.require('Class');
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


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AddsSentAtIndexToChatMessagesMigration = Class.extend(Migration, {

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
        var ChatMessageModel = this.mongoDataStore.getMongooseModelForName("ChatMessage");
        ChatMessageModel.ensureIndexes(function(error){
            if (!error) {
                callback();
            } else {
                callback(new Bug("MongoError", {}, "Error occurred in Mongo DB", [error]))
            }
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(AddsSentAtIndexToChatMessagesMigration).with(
    migration()
        .appName("airbug")
        .appVersion("0.0.13")
        .name("AddsSentAtIndexToChatMessagesMigration")
        .version("0.0.2"),
    autowired()
        .properties([
            property("logger").ref("logger"),
            property("mongoDataStore").ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AddsSentAtIndexToChatMessagesMigration', AddsSentAtIndexToChatMessagesMigration);
