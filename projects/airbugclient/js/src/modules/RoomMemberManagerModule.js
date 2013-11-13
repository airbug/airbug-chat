//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RoomMemberManagerModule')

//@Require('Class')
//@Require('airbug.ManagerModule')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var ManagerModule   = bugpack.require('airbug.ManagerModule');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMemberManagerModule = Class.extend(ManagerModule, {


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} roomMemberId
     * @param {function(Throwable, meldbug.MeldDocument)} callback
     */
    retrieveRoomMember: function(roomMemberId, callback){
        this.retrieve("RoomMember", roomMemberId, callback);
    },

    /**
     * @param {Array.<string>} roomMemberIds
     * @param {function(Throwable, Map.<string, meldbug.MeldDocument>)} callback
     */
    retrieveRoomMembers: function(roomMemberIds, callback){
        this.retrieveEach("RoomMember", roomMemberIds, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberManagerModule", RoomMemberManagerModule);
