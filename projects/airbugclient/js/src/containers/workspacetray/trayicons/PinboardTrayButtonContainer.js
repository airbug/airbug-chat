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

//@Export('airbug.PinboardTrayButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.CommandModule')
//@Require('carapace.ButtonView')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.IconView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var ButtonContainer     = bugpack.require('airbug.ButtonContainer');
    var CommandModule       = bugpack.require('airbug.CommandModule');
    var ButtonView          = bugpack.require('carapace.ButtonView');
    var ButtonViewEvent     = bugpack.require('carapace.ButtonViewEvent');
    var IconView            = bugpack.require('carapace.IconView');
    var ViewBuilder         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var view                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ButtonContainer}
     */
    var PinboardTrayButtonContainer = Class.extend(ButtonContainer, {

        _name: "airbug.PinboardTrayButtonContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super("PinboardTrayButton");


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
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Array<*>} routerArgs
         */
        activateContainer: function(routerArgs) {
            this._super(routerArgs);

        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();


            // Create Models
            //-------------------------------------------------------------------------------


            // Create Views
            //-------------------------------------------------------------------------------

            view(ButtonView)
                .name("buttonView")
                .attributes({
                    size: ButtonView.Size.LARGE,
                    type: "primary",
                    align: "center",
                    block: true
                })
                .children([
                    view(IconView)
                        .attributes({
                            type: IconView.Type.PUSHPIN,
                            color: IconView.Color.WHITE
                        })
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
            this.buttonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearPinboardTrayButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearPinboardTrayButtonClickedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        hearPinboardTrayButtonClickedEvent: function(event) {

        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.PinboardTrayButtonContainer", PinboardTrayButtonContainer);
});
