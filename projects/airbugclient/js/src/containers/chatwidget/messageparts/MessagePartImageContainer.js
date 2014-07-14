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

//@Export('airbug.MessagePartImageContainer')

//@Require('Class')
//@Require('airbug.CommandModule')
//@Require('airbug.MessagePartContainer')
//@Require('airbug.MessagePartImageView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ImageViewEvent')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var CommandModule           = bugpack.require('airbug.CommandModule');
    var MessagePartContainer    = bugpack.require('airbug.MessagePartContainer');
    var MessagePartImageView    = bugpack.require('airbug.MessagePartImageView');
    var AutowiredTag            = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ImageViewEvent          = bugpack.require('carapace.ImageViewEvent');
    var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired               = AutowiredTag.autowired;
    var bugmeta                 = BugMeta.context();
    var CommandType             = CommandModule.CommandType;
    var property                = PropertyTag.property;
    var view                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MessagePartContainer}
     */
    var MessagePartImageContainer = Class.extend(MessagePartContainer, {

        _name: "airbug.MessagePartImageContainer'",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MessagePartModel} messagePartModel
         */
        _constructor: function(messagePartModel) {

            this._super(messagePartModel);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                          = null;
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

            view(MessagePartImageView)
                .name("messagePartView")
                .model(this.getMessagePartModel())
                .build(this);


            // Wire Up
            //-------------------------------------------------------------------------------

            this.setViewTop(this.getMessagePartView());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.getMessagePartView().removeEventListener(ImageViewEvent.EventType.CLICKED_SAVE, this.handleSaveImageToListButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.getMessagePartView().addEventListener(ImageViewEvent.EventType.CLICKED_SAVE, this.handleSaveImageToListButtonClickedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ImageViewEvent} event
         */
        handleSaveImageToListButtonClickedEvent: function(event) {
            var data            = event.getData();
            var assetId         = data.assetId;
            this.commandModule.relayCommand(CommandType.SAVE.TO_IMAGE_LIST, {assetId: assetId});
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MessagePartImageContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MessagePartImageContainer", MessagePartImageContainer);
});
