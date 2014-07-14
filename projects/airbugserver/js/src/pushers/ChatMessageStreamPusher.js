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

//@Export('airbugserver.ChatMessageStreamPusher')
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
    var ChatMessageStreamPusher = Class.extend(EntityPusher, {

        _name: "airbugserver.ChatMessageStreamPusher",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} callUuid
         * @param {ChatMessageStream} chatMessageStream
         * @param {function(Throwable=)} callback
         */
        meldCallWithChatMessageStream: function(callUuid, chatMessageStream, callback) {
            this.meldCallWithEntity(callUuid, chatMessageStream, callback);
        },

        /**
         * @param {ChatMessageStream} chatMessageStream
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushChatMessageStreamToCall: function(chatMessageStream, callUuid, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(chatMessageStream);
            var push                = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid])
                .mergeDocument(meldDocumentKey, {})
                .exec(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ChatMessageStreamPusher).with(
        module("chatMessageStreamPusher")
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

    bugpack.export('airbugserver.ChatMessageStreamPusher', ChatMessageStreamPusher);
});
