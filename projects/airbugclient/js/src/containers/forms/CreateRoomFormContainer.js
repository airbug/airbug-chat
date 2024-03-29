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

//@Export('airbug.CreateRoomFormContainer')

//@Require('Class')
//@Require('Exception')
//@Require('airbug.CommandModule')
//@Require('airbug.CreateRoomFormView')
//@Require('airbug.IMessageHandler')
//@Require('airbug.MessagePartModel')
//@Require('airbug.MessagePartPreviewContainer')
//@Require('airbug.RoomModel')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.FormViewEvent')
//@Require('carapace.ModelBuilder')
//@Require('carapace.PanelView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Exception                       = bugpack.require('Exception');
    var CommandModule                   = bugpack.require('airbug.CommandModule');
    var CreateRoomFormView              = bugpack.require('airbug.CreateRoomFormView');
    var IMessageHandler                 = bugpack.require('airbug.IMessageHandler');
    var MessagePartModel                = bugpack.require('airbug.MessagePartModel');
    var MessagePartPreviewContainer     = bugpack.require('airbug.MessagePartPreviewContainer');
    var RoomModel                       = bugpack.require('airbug.RoomModel');
    var AutowiredTag                    = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                     = bugpack.require('bugioc.PropertyTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
    var FormViewEvent                   = bugpack.require('carapace.FormViewEvent');
    var ModelBuilder                    = bugpack.require('carapace.ModelBuilder');
    var PanelView                       = bugpack.require('carapace.PanelView');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                       = AutowiredTag.autowired;
    var bugmeta                         = BugMeta.context();
    var CommandType                     = CommandModule.CommandType;
    var model                           = ModelBuilder.model;
    var property                        = PropertyTag.property;
    var view                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     * @implements {IMessageHandler}
     */
    var CreateRoomFormContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.CreateRoomFormContainer",


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


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MessagePartPreviewContainer}
             */
            this.messagePartPreviewContainer    = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                  = null;

            /**
             * @private
             * @type {MessageHandlerModule}
             */
            this.messageHandlerModule           = null;

            /**
             * @private
             * @type {NavigationModule}
             */
            this.navigationModule               = null;

            /**
             * @private
             * @type {RoomManagerModule}
             */
            this.roomManagerModule              = null;


            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MessagePartModel}
             */
            this.embeddedMessagePartModel       = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CreateRoomFormView}
             */
            this.createRoomFormView             = null;

            /**
             * @private
             * @type {PanelView}
             */
            this.createRoomPanelView            = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        activateContainer: function() {
            this._super();
            this.createRoomFormView.$el.find("input")[0].focus();
            this.messageHandlerModule.registerMessageHandler(this);
        },

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Models
            //-------------------------------------------------------------------------------

            model(MessagePartModel)
                .name("embeddedMessagePartModel")
                .build(this);


            // Create Views
            //-------------------------------------------------------------------------------

            view(PanelView)
                .name("createRoomPanelView")
                .children([
                    view(CreateRoomFormView)
                        .name("createRoomFormView")
                        .appendTo("#panel-body-{{cid}}")
                ])
                .build(this);


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.createRoomPanelView);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.messagePartPreviewContainer = new MessagePartPreviewContainer(this.embeddedMessagePartModel);
            this.addContainerChild(this.messagePartPreviewContainer, "#embedded-message-part-preview-" + this.createRoomFormView.getCid());
        },

        /**
         * @protected
         * @param {Array<*>} routerArgs
         */
        deactivateContainer: function(routerArgs) {
            this._super(routerArgs);
            this.messageHandlerModule.deregisterMessageHandler(this);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.createRoomFormView.removeEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.createRoomFormView.addEventListener(FormViewEvent.EventType.SUBMIT, this.hearFormSubmittedEvent, this);
        },



        //-------------------------------------------------------------------------------
        // IMessageHandler Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        doesSupportEmbed: function() {
            return true;
        },

        /**
         * @return {boolean}
         */
        doesSupportSend: function() {
            return false;
        },

        /**
         * @param {*} messagePartObject
         */
        embedMessagePart: function(messagePartObject) {
            this.embeddedMessagePartModel.setProperties(messagePartObject);
        },

        /**
         * @param {*} messageObject
         */
        sendMessage: function(messageObject) {
            //do nothing
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        hearFormSubmittedEvent: function(event) {
            var _this       = this;
            var formData    = event.getData().formData;

            //TODO BRN: Add embedded message here if one exists



            this.roomManagerModule.startRoom(formData, function(throwable, roomMeldDocument) {
                if (!throwable) {
                    var roomId  = roomMeldDocument.getData().id;
                    _this.navigationModule.navigate("conversation/" + roomId, {
                        trigger: true
                    });
                } else {

                    //TODO BRN: Need to introduce some sort of error handling system that can take any error and figure out what to do with it and what to show the user

                    if (Class.doesExtend(throwable, Exception)) {
                        _this.commandModule.relayCommand(CommandType.FLASH.EXCEPTION, {message: throwable.getMessage()});
                    } else {
                        _this.commandModule.relayCommand(CommandType.FLASH.ERROR, {message: "Sorry an error has occurred" + throwable});
                    }
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(CreateRoomFormContainer, IMessageHandler);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CreateRoomFormContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule"),
            property("messageHandlerModule").ref("messageHandlerModule"),
            property("navigationModule").ref("navigationModule"),
            property("roomManagerModule").ref("roomManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.CreateRoomFormContainer", CreateRoomFormContainer);
});
