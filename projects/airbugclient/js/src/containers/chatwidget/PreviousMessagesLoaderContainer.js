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

//@Export('airbug.PreviousMessagesLoaderContainer')

//@Require('Class')
//@Require('airbug.PreviousMessagesLoaderView')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var PreviousMessagesLoaderView  = bugpack.require('airbug.PreviousMessagesLoaderView');
    var ButtonViewEvent             = bugpack.require('carapace.ButtonViewEvent');
    var CarapaceContainer           = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var view                        = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var PreviousMessagesLoaderContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.PreviousMessagesLoaderContainer",


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

            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {PreviousMessagesLoaderView}
             */
            this.previousMessagesLoaderView = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        activateContainer: function() {
            this._super();
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            this.previousMessagesLoaderView =
                view(PreviousMessagesLoaderView)
                    .build();

            // Wire Up
            //-------------------------------------------------------------------------------

            this.setViewTop(this.previousMessagesLoaderView);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.PreviousMessagesLoaderContainer", PreviousMessagesLoaderContainer);
});
