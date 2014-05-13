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

//@Export('airbugserver.AirbugServerApplication')
//@Autoload

//@Require('Class')
//@Require('bugapp.Application')
//@Require('bugentity.EntityManagerAnnotationProcessor')
//@Require('bugentity.EntityManagerAnnotationScan')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var Application                         = bugpack.require('bugapp.Application');
    var EntityManagerAnnotationProcessor    = bugpack.require('bugentity.EntityManagerAnnotationProcessor');
    var EntityManagerAnnotationScan                   = bugpack.require('bugentity.EntityManagerAnnotationScan');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Application}
     */
    var AirbugServerApplication = Class.extend(Application, {

        _name: "airbugserver.AirbugServerApplication",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {EntityManagerAnnotationScan}
             */
            this.entityManagerAnnotationScan    = new EntityManagerAnnotationScan(BugMeta.context(), new EntityManagerAnnotationProcessor(this.getIocContext()));
        },


        //-------------------------------------------------------------------------------
        // Application Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        preProcessApplication: function() {
            this.getConfigurationScan().scanBugpacks([
                "airbugserver.AirbugServerConfiguration",
                "meldbugserver.MeldbugServerConfiguration"
            ]);
            this.entityManagerAnnotationScan.scanAll();
            this.getModuleScan().scanAll({
                excludes: [
                    "bugmigrate.MigrationInitializer",
                    "bugmigrate.MigrationManager"
                ]
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.AirbugServerApplication', AirbugServerApplication);
});
