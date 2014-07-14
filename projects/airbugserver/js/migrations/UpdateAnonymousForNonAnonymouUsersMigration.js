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

//@Export('airbugserver.UpdatesAnonymousForNonAnonymousUsersMigration')
//@Autoload

//@Require('Class')
//@Require('Flows')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('bugmigrate.Migration')
//@Require('bugmigrate.MigrationTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var mongoose        = require("mongoose");


    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Flows           = bugpack.require('Flows');
    var AutowiredTag    = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag     = bugpack.require('bugioc.PropertyTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var Migration       = bugpack.require('bugmigrate.Migration');
    var MigrationTag    = bugpack.require('bugmigrate.MigrationTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired       = AutowiredTag.autowired;
    var bugmeta         = BugMeta.context();
    var migration       = MigrationTag.migration;
    var property        = PropertyTag.property;
    var $series         = Flows.$series;
    var $task           = Flows.$task;


    //-------------------------------------------------------------------------------
    // Migration
    //-------------------------------------------------------------------------------

    // Migration steps
    // 1) Update all Users where 'anonymous' does not exist AND anonymous is 'false' by setting status to "offline"


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Migration}
     */
    var UpdatesAnonymousForNonAnonymousUsersMigration = Class.extend(Migration, {

        _name: "airbugserver.UpdatesAnonymousForNonAnonymousUsersMigration",


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

    bugmeta.tag(UpdatesAnonymousForNonAnonymousUsersMigration).with(
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
});
