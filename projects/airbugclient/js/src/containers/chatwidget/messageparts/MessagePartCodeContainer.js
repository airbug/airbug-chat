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

//@Export('airbug.MessagePartCodeContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.ChatMessageTinkerButtonContainer')
//@Require('airbug.CommandModule')
//@Require('airbug.MessagePartCodeView')
//@Require('airbug.MessagePartContainer')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
    var ChatMessageTinkerButtonContainer    = bugpack.require('airbug.ChatMessageTinkerButtonContainer');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var MessagePartCodeView                 = bugpack.require('airbug.MessagePartCodeView');
    var MessagePartContainer                = bugpack.require('airbug.MessagePartContainer');
    var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredAnnotation.autowired;
    var bugmeta                             = BugMeta.context();
    var CommandType                         = CommandModule.CommandType;
    var property                            = PropertyAnnotation.property;
    var view                                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MessagePartContainer}
     */
    var MessagePartCodeContainer = Class.extend(MessagePartContainer, {

        _name: "airbug.MessagePartCodeContainer'",


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

            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ChatMessageTinkerButtonContainer}
             */
            this.chatMessageTinkerButtonContainer       = null;


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

            view(MessagePartCodeView)
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
        createContainerChildren: function() {
            this.chatMessageTinkerButtonContainer = new ChatMessageTinkerButtonContainer();
            this.addContainerChild(this.chatMessageTinkerButtonContainer, "#message-part-controls-" + this.getMessagePartView().getCid());
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.getViewTop().removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleChatMessageTinker, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleChatMessageTinker, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        handleChatMessageTinker: function(event) {
            var code = this.getMessagePartModel().getProperty("code");
            var codeLanguage = this.getMessagePartModel().getProperty("codeLanguage");
            if (code && codeLanguage) {
                this.commandModule.relayCommand(CommandType.DISPLAY.CODE_EDITOR, {});
                this.commandModule.relayCommand(CommandType.CODE_EDITOR.SET_MODE, {mode: "ace/mode/" + codeLanguage});
                this.commandModule.relayCommand(CommandType.DISPLAY.CODE, {code: code});
            }
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(MessagePartCodeContainer).with(
        autowired().properties([
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MessagePartCodeContainer", MessagePartCodeContainer);
});
