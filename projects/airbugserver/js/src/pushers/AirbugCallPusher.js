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

//@Export('airbugserver.AirbugCallPusher')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.EntityPusher')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil             = bugpack.require('ArgUtil');
    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var EntityPusher        = bugpack.require('airbugserver.EntityPusher');
    var BugFlow             = bugpack.require('bugflow.BugFlow');
    var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
    var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgAnnotation.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleAnnotation.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EntityPusher}
     */
    var AirbugCallPusher = Class.extend(EntityPusher, {

        _name: "airbugserver.AirbugCallPusher",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} callUuid
         * @param {AirbugCall} airbugCall
         * @param {function(Throwable=)} callback
         */
        meldCallWithAirbugCall: function(callUuid, airbugCall, callback) {
            this.meldCallWithEntity(callUuid, airbugCall, callback);
        },

        /**
         * @protected
         * @param {string} callUuid
         * @param {Array.<AirbugCall>} airbugCalls
         * @param {function(Throwable=)} callback
         */
        meldCallWithAirbugCalls: function(callUuid, airbugCalls, callback) {
            this.meldCallWithEntities(callUuid, airbugCalls, callback);
        },

        /**
         * @protected
         * @param {AirbugCall} airbugCall
         * @param {(Array.<string> | function(Throwable=))} waitForCallUuids
         * @param {function(Throwable=)=} callback
         */
        pushAirbugCall: function(airbugCall, waitForCallUuids, callback) {
            this.pushEntity(airbugCall, waitForCallUuids, callback);
        },

        /**
         * @protected
         * @param {AirbugCall} airbugCall
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushAirbugCallToCall: function(airbugCall, callUuid, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(airbugCall);
            var data                = this.filterEntity(airbugCall);
            var push                = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid])
                .setDocument(meldDocumentKey, data)
                .exec(callback);
        },

        /**
         * @protected
         * @param {Array.<AirbugCall>} airbugCalls
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushAirbugCallsToCall: function(airbugCalls, callUuid, callback) {
            var _this   = this;
            var push    = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid]);
            airbugCalls.forEach(function(airbugCall) {
                var meldDocumentKey     = _this.generateMeldDocumentKeyFromEntity(airbugCall);
                var data                = _this.filterEntity(airbugCall);
                push.setDocument(meldDocumentKey, data)
            });
            push.exec(callback);
        },

        /**
         * @param {User} user
         * @param {AirbugCall} airbugCall
         * @param {function(Throwable=)} callback
         */
        unmeldUserWithAirbugCall: function(user, airbugCall, callback) {
            this.unmeldUserWithEntity(user, airbugCall, callback);
        },


        //-------------------------------------------------------------------------------
        // EntityPusher Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Entity} entity
         * @return {Object}
         */
        filterEntity: function(entity) {
            return Obj.pick(entity.toObject(), [
                "callType",
                "callUuid",
                "id",
                "open",
                "sessionId",
                "userId"
            ]);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(AirbugCallPusher).with(
        module("airbugCallPusher")
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

    bugpack.export('airbugserver.AirbugCallPusher', AirbugCallPusher);
});
