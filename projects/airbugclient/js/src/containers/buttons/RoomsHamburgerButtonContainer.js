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

//@Export('airbug.RoomsHamburgerButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.CommandModule')
//@Require('carapace.ButtonView')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.IconView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ButtonContainer         = bugpack.require('airbug.ButtonContainer');
var CommandModule           = bugpack.require('airbug.CommandModule');
var ButtonView              = bugpack.require('carapace.ButtonView');
var ButtonViewEvent         = bugpack.require('carapace.ButtonViewEvent');
var IconView                = bugpack.require('carapace.IconView');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var CommandType             = CommandModule.CommandType;
var view                    = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomsHamburgerButtonContainer = Class.extend(ButtonContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("RoomsHamburgerButton");


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.buttonView                 = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        view(ButtonView)
            .name("buttonView")
            .attributes({type: "primary", align: "left"})
            .children([
                view(IconView)
                    .attributes({type: IconView.Type.ALIGN_JUSTIFY, color: IconView.Color.WHITE})
                    .appendTo("#button-{{cid}}")
            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.buttonView);
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.buttonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearRoomsHamburgerButtonClickedEvent, this);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearRoomsHamburgerButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearRoomsHamburgerButtonClickedEvent: function(event) {
        this.getCommandModule().relayCommand(CommandType.TOGGLE.HAMBURGER_LEFT,      {});
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomsHamburgerButtonContainer", RoomsHamburgerButtonContainer);
