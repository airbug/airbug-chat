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

//@Export('airbug.ButtonContainer')

//@Require('Class')
//@Require('airbug.CommandModule')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
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

    var Class               = bugpack.require('Class');
    var CommandModule       = bugpack.require('airbug.CommandModule');
    var AutowiredTag        = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag         = bugpack.require('bugioc.PropertyTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var ButtonViewEvent     = bugpack.require('carapace.ButtonViewEvent');
    var CarapaceContainer   = bugpack.require('carapace.CarapaceContainer');
    var ViewBuilder         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired           = AutowiredTag.autowired;
    var bugmeta             = BugMeta.context();
    var property            = PropertyTag.property;
    var view                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var ButtonContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.ButtonContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} buttonName
         */
        _constructor: function(buttonName) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.buttonName         = buttonName;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule      = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getButtonName: function() {
            return this.buttonName;
        },

        /**
         * @return {CommandModule}
         */
        getCommandModule: function() {
            return this.commandModule;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isActive: function() {
            return this.active;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.getViewTop().removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearViewTopButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearViewTopButtonClickedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} active
         */
        setActive: function(active) {
            this.getViewTop().setAttribute("active", active);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        hearViewTopButtonClickedEvent: function(event) {
            this.commandModule.relayMessage(CommandModule.MessageType.BUTTON_CLICKED, {buttonName: this.buttonName});
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ButtonContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ButtonContainer", ButtonContainer);
});
