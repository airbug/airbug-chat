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

//@Export('airbug.HomeButtonContainer')

//@Require('Class')
//@Require('airbug.ButtonContainer')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
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
    var AutowiredTag        = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag         = bugpack.require('bugioc.PropertyTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var ButtonView          = bugpack.require('carapace.ButtonView');
    var ButtonViewEvent     = bugpack.require('carapace.ButtonViewEvent');
    var IconView            = bugpack.require('carapace.IconView');
    var TextView            = bugpack.require('carapace.TextView');
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
     * @constructor
     * @extends {ButtonContainer}
     */
    var HomeButtonContainer = Class.extend(ButtonContainer, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super("HomeButton");


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {NavigationModule}
             */
            this.navigationModule   = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ButtonView}
             */
            this.buttonView         = null;
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
                    type: "primary",
                    align: "left"
                })
                .children([
                    view(TextView)
                        .attributes({text: "Home"})
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
            this.buttonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearHomeButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearHomeButtonClickedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        hearHomeButtonClickedEvent: function(event) {
            this.navigationModule.navigate("home", {
                trigger: true
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(HomeButtonContainer).with(
        autowired().properties([
            property("navigationModule").ref("navigationModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.HomeButtonContainer", HomeButtonContainer);
});
