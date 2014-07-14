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

//@Export('airbug.CodeEditorFullscreenButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('airbug.CommandModule')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.IconView')
//@Require('carapace.NakedButtonView')
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
    var ButtonViewEvent     = bugpack.require('carapace.ButtonViewEvent');
    var IconView            = bugpack.require('carapace.IconView');
    var NakedButtonView     = bugpack.require('carapace.NakedButtonView');
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
     * @constructor
     * @extends {ButtonContainer}
     */
    var CodeEditorFullscreenButtonContainer = Class.extend(ButtonContainer, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super("code-editor-fullscreen-button");


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ButtonGroupView}
             */
            this.buttonView         = null;
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

            view(NakedButtonView)
                .name("buttonView")
                .attributes({
                    size: NakedButtonView.Size.SMALL,
                    type: NakedButtonView.Type.LINK
                })
                .children([
                    view(IconView)
                        .attributes({
                            type: IconView.Type.FULLSCREEN
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
            this.buttonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearButtonClickedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        hearButtonClickedEvent: function(event) {

        }
    });

    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CodeEditorFullscreenButtonContainer", CodeEditorFullscreenButtonContainer);
});
