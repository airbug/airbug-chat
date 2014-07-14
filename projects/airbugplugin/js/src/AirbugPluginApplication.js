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

//@Export('airbugplugin.AirbugPluginApplication')
//@Autoload

//@Require('Class')
//@Require('bugapp.Application')
//@Require('bugioc.BugIoc')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Application     = bugpack.require('bugapp.Application');
    var BugIoc          = bugpack.require('bugioc.BugIoc');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Application}
     */
    var AirbugPluginApplication = Class.extend(Application, {

        _name: "airbugplugin.AirbugPluginApplication",


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
             * @type {AutowiredTagScan}
             */
            this.autowiredScan      = BugIoc.autowiredScan(BugMeta.context());
        },


        //-------------------------------------------------------------------------------
        // Application Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        preConfigureApplication: function() {
            this.autowiredScan.scanAll();
            this.autowiredScan.scanContinuous();
            this.getModuleTagScan().scanAll();
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbugplugin.AirbugPluginApplication", AirbugPluginApplication);
});
