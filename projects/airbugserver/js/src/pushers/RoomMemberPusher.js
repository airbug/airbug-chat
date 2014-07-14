//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.RoomMemberPusher')
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

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var EntityPusher        = bugpack.require('airbugserver.EntityPusher');
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
    var RoomMemberPusher = Class.extend(EntityPusher, {

        _name: "airbugserver.RoomMemberPusher",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} callUuid
         * @param {RoomMember} roomMember
         * @param {function(Throwable=)} callback
         */
        meldCallWithRoomMember: function(callUuid, roomMember, callback) {
            this.meldCallWithEntity(callUuid, roomMember, callback);
        },

        /**
         * @param {string} callUuid
         * @param {Array.<RoomMember>} roomMembers
         * @param {function(Throwable=)} callback
         */
        meldCallWithRoomMembers: function(callUuid, roomMembers, callback) {
            this.meldCallWithEntities(callUuid, roomMembers, callback);
        },

        /**
         * @param {RoomMember} roomMember
         * @param {function(Throwable=)} callback
         */
        pushRemoveRoomMember: function(roomMember, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(roomMember);
            var push                = this.push();
            push
                .toAll()
                .removeDocument(meldDocumentKey)
                .exec(callback);
        },

        /**
         * @param {RoomMember} roomMember
         * @param {function(Throwable=)} callback
         */
        pushRoomMember: function(roomMember, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(roomMember);
            var data                = this.filterRoomMember(roomMember);
            var push                = this.getPushManager().push();
            push
                .toAll()
                .setDocument(meldDocumentKey, data)
                .exec(callback);
        },

        /**
         * @param {RoomMember} roomMember
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushRoomMemberToCall: function(roomMember, callUuid, callback) {
            var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(roomMember);
            var data                = this.filterRoomMember(roomMember);
            var push                = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid])
                .setDocument(meldDocumentKey, data)
                .exec(callback);
        },

        /**
         * @param {Array.<RoomMember>} roomMembers
         * @param {string} callUuid
         * @param {function(Throwable=)} callback
         */
        pushRoomMembersToCall: function(roomMembers, callUuid, callback) {
            var _this   = this;
            var push    = this.getPushManager().push();
            push
                .to([callUuid])
                .waitFor([callUuid]);
            roomMembers.forEach(function(roomMember) {
                var meldDocumentKey     = _this.generateMeldDocumentKeyFromEntity(roomMember);
                var data                = _this.filterRoomMember(roomMember);
                push.setDocument(meldDocumentKey, data)
            });
            push.exec(callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {RoomMember} roomMember
         * @return {Object}
         */
        filterRoomMember: function(roomMember) {
            return Obj.pick(roomMember.toObject(), [
                "id",
                "memberType",
                "roomId",
                "userId"
            ]);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomMemberPusher).with(
        module("roomMemberPusher")
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

    bugpack.export('airbugserver.RoomMemberPusher', RoomMemberPusher);
});
