//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMember')

//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Entity                  = bugpack.require('bugentity.Entity');
var EntityAnnotation        = bugpack.require('bugentity.EntityAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var entity                  = EntityAnnotation.entity;
var property                = PropertyAnnotation.property;


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
         * @type {Room}
         */
        this.room   = undefined;

        /**
         * @private
         * @type {User}
         */
        this.user   = undefined;


    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getMemberType: function() {
        return this.deltaDocument.getData().memberType;
    },

    /**
     * @param {string} memberType
     */
    setMemberType: function(memberType) {
        this.deltaDocument.getData().memberType = memberType;
    },

    /**
     * @return {string}
     */
    getRoomId: function() {
        return this.deltaDocument.getData().roomId;
    },

    /**
     * @param {string} roomId
     */
    setRoomId: function(roomId) {
        this.deltaDocument.getData().roomId = roomId;
    },

    /**
     * @return {string}
     */
    getUserId: function() {
        return this.deltaDocument.getData().userId;
    },

    /**
     * @param {string} userId
     */
    setUserId: function(userId) {
        this.deltaDocument.getData().userId = userId;
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
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomMember).with(
    entity("RoomMember").properties([
        property("createdAt")
            .type("date"),
        property("memberType")
            .type("string"),
        property("room")
            .type("Room")
            .populates(true),
        property("roomId")
            .type("string"),
        property("updatedAt")
            .type("date"),
        property("user")
            .type("User")
            .populates(true),
        property("userId")
            .type("string")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomMember', RoomMember);
