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

//@Export('airbug.MessageHandlerModule')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('Map')
//@Require('StateMachine')
//@Require('airbug.IMessageHandler')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                 = bugpack.require('Bug');
    var Class               = bugpack.require('Class');
    var Event               = bugpack.require('Event');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var Exception           = bugpack.require('Exception');
    var Map                 = bugpack.require('Map');
    var StateMachine        = bugpack.require('StateMachine');
    var IMessageHandler     = bugpack.require('airbug.IMessageHandler');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var MessageHandlerModule = Class.extend(EventDispatcher, {

        _name: "airbug.MessageHandlerModule",


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

            /**
             * @private
             * @type {StateMachine}
             */
            this.handlerStateMachine        = new StateMachine({
                initialState: MessageHandlerModule.HandlerState.NONE,
                states: [
                    MessageHandlerModule.HandlerState.EMBED_AND_SEND,
                    MessageHandlerModule.HandlerState.EMBED_ONLY,
                    MessageHandlerModule.HandlerState.NONE,
                    MessageHandlerModule.HandlerState.SEND_ONLY
                ]
            });

            /**
             * @private
             * @type {IMessageHandler}
             */
            this.registeredMessageHandler   = null;


            //-------------------------------------------------------------------------------
            // Setup
            //-------------------------------------------------------------------------------

            this.handlerStateMachine.setParentPropagator(this);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MessageHandlerModule.HandlerState|string}
         */
        getHandlerState: function() {
            return this.handlerStateMachine.getCurrentState();
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        doesSupportEmbed: function() {
            return (this.handlerState === MessageHandlerModule.HandlerState.EMBED_AND_SEND || this.handlerState === MessageHandlerModule.HandlerState.EMBED_ONLY);
        },

        /**
         * @return {boolean}
         */
        doesSupportSend: function() {
            return (this.handlerState === MessageHandlerModule.HandlerState.EMBED_AND_SEND || this.handlerState === MessageHandlerModule.HandlerState.SEND_ONLY);
        },

        /**
         * @return {boolean}
         */
        hasRegisteredMessageHandler: function() {
            return !!this.registeredMessageHandler;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {IMessageHandler} messageHandler
         */
        deregisterMessageHandler: function(messageHandler) {
            if (this.registeredMessageHandler === messageHandler) {
                this.registeredMessageHandler = null;
                this.updateHandlerState(MessageHandlerModule.HandlerState.NONE);
            }
        },

        /**
         * @param {*} messagePartObject
         */
        embedMessagePart: function(messagePartObject) {
            if (this.hasRegisteredMessageHandler()) {
                if (this.doesSupportEmbed()) {
                    this.registeredMessageHandler.embedMessagePart(messagePartObject);
                } else {
                    throw new Exception("IllegalState", {}, "The registered message handler does not support embedding messages");
                }
            } else {
                throw new Exception("IllegalState", {}, "A message handler has not been registered. Cannot embed message before handler has been registered.");
            }
        },

        /**
         * @param {IMessageHandler} messageHandler
         */
        registerMessageHandler: function(messageHandler) {
            if (Class.doesImplement(messageHandler, IMessageHandler)) {
                this.registeredMessageHandler = messageHandler;
                if (messageHandler.doesSupportEmbed()) {
                    if (messageHandler.doesSupportSend()) {
                        this.updateHandlerState(MessageHandlerModule.HandlerState.EMBED_AND_SEND);
                    } else {
                        this.updateHandlerState(MessageHandlerModule.HandlerState.EMBED_ONLY);
                    }
                } else {
                    if (messageHandler.doesSupportSend()) {
                        this.updateHandlerState(MessageHandlerModule.HandlerState.SEND_ONLY);
                    } else {
                        this.updateHandlerState(MessageHandlerModule.HandlerState.NONE);
                    }
                }
            } else {
                throw new Bug("IllegalArgument", {}, "parameter 'messageHandler' must implement IMessageHandler");
            }
        },

        /**
         * @param {*} messageObject
         */
        sendMessage: function(messageObject) {
            if (this.hasRegisteredMessageHandler()) {
                if (this.doesSupportSend()) {
                    this.registeredMessageHandler.sendMessage(messageObject);
                } else {
                    throw new Exception("IllegalState", {}, "The registered message handler does not support sending messages");
                }
            } else {
                throw new Exception("IllegalState", {}, "A message handler has not been registered. Cannot send message before handler has been registered.");
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {MessageHandlerModule.HandlerState|string} handlerState
         */
        updateHandlerState: function(handlerState) {
            this.handlerStateMachine.changeState(handlerState);
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    MessageHandlerModule.HandlerState = {
        EMBED_ONLY: "HandlerState:EmbedOnly",
        EMBED_AND_SEND : "HandlerState:EmbedAndSet",
        NONE : "HandlerState:None",
        SEND_ONLY: "HandlerState:SendOnly"
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MessageHandlerModule).with(
        module("messageHandlerModule")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.MessageHandlerModule", MessageHandlerModule);
});
