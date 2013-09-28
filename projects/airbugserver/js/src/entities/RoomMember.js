//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMember')

//@Require('Class')
//@Require('airbugserver.Entity')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Entity          = bugpack.require('airbugserver.Entity');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RoomMember = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {
        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        //TODO BRN
        this.user = undefined;

        //TODO BRN
        this.room = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getMemberType: function() {
        return this.deltaObject.getProperty("memberType");
    },

    /**
     * @param {string} memberType
     */
    setMemberType: function(memberType) {
        this.deltaObject.setProperty("memberType", memberType);
    },

    /**
     *
     * @return {*}
     */
    getRoomId: function() {
        return this.deltaObject.getProperty("roomId");
    },

    /**
     * @param {string} roomId
     */
    setRoomId: function(roomId) {
        this.deltaObject.setProperty("roomId", roomId);
        this.room = undefined;
    },

    /**
     *
     * @return {*}
     */
    getUserId: function() {
        return this.deltaObject.getProperty("userId");
    },

    /**
     * @param {string} userId
     */
    setUserId: function(userId) {
        this.deltaObject.setProperty("userId", userId);
        this.user = undefined;
    }


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomMember', RoomMember);
