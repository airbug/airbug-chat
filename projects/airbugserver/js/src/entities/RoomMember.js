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

    _constructor: function(data) {

        this._super(data);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {User}
         */
        this.user   = undefined;

        /**
         * @private
         * @type {Room}
         */
        this.room   = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getMemberType: function() {
        return this.deltaDocument.getCurrentData().memberType;
    },

    /**
     * @param {string} memberType
     */
    setMemberType: function(memberType) {
        this.deltaDocument.getCurrentData().memberType = memberType;
    },

    /**
     * @return {string}
     */
    getRoomId: function() {
        return this.deltaDocument.getCurrentData().roomId;
    },

    /**
     * @param {string} roomId
     */
    setRoomId: function(roomId) {
        this.deltaDocument.getCurrentData().roomId = roomId;
    },

    /**
     * @return {string}
     */
    getUserId: function() {
        return this.deltaDocument.getCurrentData().userId;
    },

    /**
     * @param {string} userId
     */
    setUserId: function(userId) {
        this.deltaDocument.getCurrentData().userId = userId;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Room}
     */
    getRoom: function() {
        return this.room;
    },

    /**
     * @param {Room} room
     */
    setRoom: function(room) {
        if (room.getId()) {
            this.room = room;
            this.setRoomId(room.getId());
        } else {
            throw new Error("room must have an id first");
        }
    },

    /**
     * @return {User}
     */
    getUser: function() {
        return this.user;
    },

    /**
     * @param {User} user
     */
    setUser: function(user) {
        if (user.getId()) {
            this.user = user;
            this.setUserId(user.getId());
        } else {
            throw new Error("user must have an id first");
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomMember', RoomMember);
