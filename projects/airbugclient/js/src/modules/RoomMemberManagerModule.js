//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.RoomMemberManagerModule')
//@Autoload

//@Require('Class')
//@Require('airbug.ManagerModule')
//@Require('airbug.RoomMemberList')
//@Require('airbug.RoomMemberModel')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ManagerModule                   = bugpack.require('airbug.ManagerModule');
var RoomMemberList                  = bugpack.require('airbug.RoomMemberList');
var RoomMemberModel                 = bugpack.require('airbug.RoomMemberModel');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {ManagerModule}
 */
var RoomMemberManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {List=} list
     * @return {RoomMemberList}
     */
    generateRoomMemberList: function(list) {
        return new RoomMemberList(list);
    },

    /**
     * @param {Object} dataObject
     * @param {MeldDocument} roomMemberMeldDocument
     * @param {MeldDocument} userMeldDocument
     * @returns {RoomMemberModel}
     */
    generateRoomMemberModel: function(dataObject, roomMemberMeldDocument, userMeldDocument) {
        return new RoomMemberModel(dataObject, roomMemberMeldDocument, userMeldDocument);
    },

    /**
     * @param {string} roomMemberId
     * @param {function(Throwable, MeldDocument=)} callback
     */
    retrieveRoomMember: function(roomMemberId, callback) {
        this.retrieve("RoomMember", roomMemberId, callback);
    },

    /**
     * @param {Array.<string>} roomMemberIds
     * @param {function(Throwable, Map.<string, Melddocument>=)} callback
     */
    retrieveRoomMembers: function(roomMemberIds, callback) {
        this.retrieveEach("RoomMember", roomMemberIds, callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomMemberManagerModule).with(
    module("roomMemberManagerModule")
        .args([
            arg().ref("airbugApi"),
            arg().ref("meldStore"),
            arg().ref("meldBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberManagerModule", RoomMemberManagerModule);
