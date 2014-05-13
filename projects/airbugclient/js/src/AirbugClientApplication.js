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

//@Export('airbug.AirbugClientApplication')
//@Autoload

//@Require('Class')
//@Require('bugapp.Application')
//@Require('bugioc.AutowiredAnnotationProcessor')
//@Require('bugioc.AutowiredScan')
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
    var AutowiredAnnotationProcessor        = bugpack.require('bugioc.AutowiredAnnotationProcessor');
    var AutowiredScan                       = bugpack.require('bugioc.AutowiredScan');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Application}
     */
    var AirbugClientApplication = Class.extend(Application, {

        _name: "airbug.AirbugClientApplication",


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
             * @type {AutowiredScan}
             */
            this.autowiredScan      = new AutowiredScan(BugMeta.context(), new AutowiredAnnotationProcessor(this.getIocContext()));
        },


        //-------------------------------------------------------------------------------
        // Application Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        preProcessApplication: function() {
            this.autowiredScan.scanAll();
            this.autowiredScan.scanContinuous();
            this.getConfigurationScan().scanAll();
            this.getModuleScan().scanAll();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.AirbugClientApplication", AirbugClientApplication);
});
