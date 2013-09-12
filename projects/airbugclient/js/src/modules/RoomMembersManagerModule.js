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
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {AirbugApi} airbugApi
     * @param {MeldObjectManager} meldObjectManagerModule
     */
    _constructor: function(airbugApi, meldObjectManagerModule) {

        this._super(airbugApi, meldObjectManagerModule);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

    },

    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} roomMemberId
     * @param {function(error, meldbug.MeldObject)} callback
     */
    retrieveRoomMember: function(roomMemberId, callback){
        this.retrieve("RoomMember", roomMemberId, callback);
    },

    /**
     * @param {Array.<string>} roomMemberIds
     * @param {function(error, Array.<meldbug.MeldObject>)} callback
     */
    retrieveRoomMembers: function(roomMemberIds, callback){
        this.retrieveEach("RoomMember", roomMemberIds, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RoomMemberManagerModule", RoomMemberManagerModule);
