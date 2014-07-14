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

//@Export('airbugserver.ChatMessagePusher')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.EntityPusher')
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

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var EntityPusher    = bugpack.require('airbugserver.EntityPusher');
    var ArgTag          = bugpack.require('bugioc.ArgTag');
    var ModuleTag       = bugpack.require('bugioc.ModuleTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg             = ArgTag.arg;
    var bugmeta         = BugMeta.context();
    var module          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityPusher}
     */
    var ChatMessagePusher = Class.extend(EntityPusher, {

        _name: "airbugserver.ChatMessagePusher",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} callUuid
         * @param {ChatMessage} chatMessage
         * @param {function(Throwable=)} callback
         */
        meldCallWithChatMessage: function(callUuid, chatMessage, callback) {
            this.meldCallWithEntity(callUuid, chatMessage, callback);
        },

        /**
         * @param {string} callUuid
         * @param {Array.<ChatMessage>} chatMessages
         * @param {function(Throwable)} callback
         */
        meldCallWithChatMessages: function(callUuid, chatMessages, callback) {
            this.meldCallWithEntities(callUuid, chatMessages, callback);
        },

        /**
         * @param {ChatMessage} chatMessage
         * @param {(Array.<string> | function(Throwable=))} waitForCallUuids
         * @param {function(Throwable=)} callback
         */
        pushChatMessage: function(chatMessage, waitForCallUuids, callback) {
            this.pushEntity(chatMessage, waitForCallUuids, callback);
        },

        /**
         * @param {ChatMessage} chatMessage
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushChatMessageToCall: function(chatMessage, callUuid, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(chatMessage);
            var data                = this.filterChatMessage(chatMessage);
            var push                = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid])
                .setDocument(meldDocumentKey, data)
                .exec(callback);
        },

        /**
         * @param {Array.<ChatMessage>} chatMessages
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushChatMessagesToCall: function(chatMessages, callUuid, callback) {
            var _this   = this;
            var push    = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid]);
            chatMessages.forEach(function(chatMessage) {
                var meldDocumentKey     = _this.generateMeldDocumentKeyFromEntity(chatMessage);
                var data                = _this.filterChatMessage(chatMessage);
                push.setDocument(meldDocumentKey, data)
            });
            push.exec(callback);
        },

        /**
         * @param {ChatMessageStream} chatMessageStream
         * @param {ChatMessage} chatMessage
         * @param {function(Throwable=)} callback
         */
        streamChatMessage: function(chatMessageStream, chatMessage, callback) {
            var chatMessageStreamKey    = this.generateMeldDocumentKeyFromEntity(chatMessageStream);
            var push                    = this.getPushManager().push();
            push
                .toAll()
                .addToSet(chatMessageStreamKey, "chatMessageIdSet", chatMessage.getId())
                .exec(callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ChatMessage} chatMessage
         * @return {Object}
         */
        filterChatMessage: function(chatMessage) {
            return Obj.pick(chatMessage.toObject(), [
                "body",
                "conversationId",
                "id",
                "index",
                "senderUserId",
                "sentAt",
                "tryUuid",
                "type"
            ]);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ChatMessagePusher).with(
        module("chatMessagePusher")
            .args([
                arg().ref("logger"),
                arg().ref("meldBuilder"),
                arg().ref("meldManager"),
                arg().ref("pushManager"),
                arg().ref("userManager"),
                arg().ref("meldSessionManager")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ChatMessagePusher', ChatMessagePusher);
});
