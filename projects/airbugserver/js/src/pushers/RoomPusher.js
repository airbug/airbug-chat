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

//@Export('airbugserver.RoomPusher')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.EntityPusher')
//@Require('bugflow.BugFlow')
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

    var ArgUtil             = bugpack.require('ArgUtil');
    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var EntityPusher        = bugpack.require('airbugserver.EntityPusher');
    var BugFlow             = bugpack.require('bugflow.BugFlow');
    var ArgTag       = bugpack.require('bugioc.ArgTag');
    var ModuleTag    = bugpack.require('bugioc.ModuleTag');
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
     * @extends {EntityPusher}
     */
    var RoomPusher = Class.extend(EntityPusher, {

        _name: "airbugserver.RoomPusher",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {string} callUuid
         * @param {Room} room
         * @param {function(Throwable=)} callback
         */
        meldCallWithRoom: function(callUuid, room, callback) {
            this.meldCallWithEntity(callUuid, room, callback);
        },

        /**
         * @protected
         * @param {string} callUuid
         * @param {Array.<Room>} rooms
         * @param {function(Throwable=)} callback
         */
        meldCallWithRooms: function(callUuid, rooms, callback) {
            this.meldCallWithEntities(callUuid, rooms, callback);
        },

        /**
         * @protected
         * @param {Room} room
         * @param {(Array.<string> | function(Throwable=))} waitForCallUuids
         * @param {function(Throwable=)=} callback
         */
        pushRoom: function(room, waitForCallUuids, callback) {
            this.pushEntity(room, waitForCallUuids, callback);
        },

        /**
         * @protected
         * @param {Room} room
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushRoomToCall: function(room, callUuid, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(room);
            var data                = this.filterEntity(room);
            var push                = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid])
                .setDocument(meldDocumentKey, data)
                .exec(callback);
        },

        /**
         * @protected
         * @param {Array.<Room>} rooms
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushRoomsToCall: function(rooms, callUuid, callback) {
            var _this   = this;
            var push    = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid]);
            rooms.forEach(function(room) {
                var meldDocumentKey     = _this.generateMeldDocumentKeyFromEntity(room);
                var data                = _this.filterEntity(room);
                push.setDocument(meldDocumentKey, data)
            });
            push.exec(callback);
        },

        /**
         * @param {User} user
         * @param {Room} room
         * @param {function(Throwable=)} callback
         */
        unmeldUserWithRoom: function(user, room, callback) {
            this.unmeldUserWithEntity(user, room, callback);
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
                "conversationId",
                "id",
                "name",
                "roomMemberIdSet"
            ]);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomPusher).with(
        module("roomPusher")
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

    bugpack.export('airbugserver.RoomPusher', RoomPusher);
});
