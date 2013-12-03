//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomMemberManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')
//@Require('airbug.RoomMemberList')
//@Require('airbug.RoomMemberModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ManagerModule       = bugpack.require('airbug.ManagerModule');
var RoomMemberList      = bugpack.require('airbug.RoomMemberList');
var RoomMemberModel     = bugpack.require('airbug.RoomMemberModel');


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
     * @returns {RoomMemberModel}
     */
    generateRoomMemberModel: function(dataObject, roomMemberMeldDocument) {
        return new RoomMemberModel(dataObject, roomMemberMeldDocument);
    },

    /**
     * @param {string} roomMemberId
     * @param {function(Throwable, Meld=)} callback
     */
    retrieveRoomMember: function(roomMemberId, callback) {
        this.retrieve("RoomMember", roomMemberId, callback);
    },

    /**
     * @param {Array.<string>} roomMemberIds
     * @param {function(Throwable, Map.<string, Meld>=)} callback
     */
    retrieveRoomMembers: function(roomMemberIds, callback) {
        this.retrieveEach("RoomMember", roomMemberIds, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberManagerModule", RoomMemberManagerModule);
