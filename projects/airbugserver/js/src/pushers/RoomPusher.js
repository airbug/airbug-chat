//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomPusher')
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
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


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

var RoomPusher = Class.extend(EntityPusher, {

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

bugmeta.annotate(RoomPusher).with(
    module("roomPusher")
        .args([
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
