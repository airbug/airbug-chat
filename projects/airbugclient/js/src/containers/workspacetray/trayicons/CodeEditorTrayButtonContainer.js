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

//@Export('airbug.CodeEditorTrayButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.CommandModule')
//@Require('carapace.ButtonView')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.IconView')
//@Require('carapace.TextView')
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
    var TextView            = bugpack.require('carapace.TextView');
    var ViewBuilder         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var CommandType         = CommandModule.CommandType;
    var view                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extend {ButtonContainer}
     */
    var CodeEditorTrayButtonContainer = Class.extend(ButtonContainer, {

        _name: "airbug.CodeEditorTrayButtonContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super("CodeEditorTrayButton");


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
         */
        createContainer: function() {
            this._super();

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
                            type: IconView.Type.CHEVRON_LEFT,
                            color: IconView.Color.WHITE
                        })
                        .appendTo("#button-{{cid}}"),
                    view(TextView)
                        .attributes({
                            text: "c/"
                        })
                        .appendTo("#button-{{cid}}"),
                    view(IconView)
                        .attributes({
                            type: IconView.Type.CHEVRON_RIGHT,
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
            this.buttonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearCodeEditorTrayButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearCodeEditorTrayButtonClickedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        hearCodeEditorTrayButtonClickedEvent: function(event) {
            this.getCommandModule().relayCommand(CommandType.TOGGLE.CODE_WORKSPACE, {});
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CodeEditorTrayButtonContainer", CodeEditorTrayButtonContainer);
});
