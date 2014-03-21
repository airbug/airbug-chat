//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('RoomMember')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityAnnotation')
//@Require('bugentity.PropertyAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Entity                  = bugpack.require('bugentity.Entity');
var EntityAnnotation        = bugpack.require('bugentity.EntityAnnotation');
var PropertyAnnotation      = bugpack.require('bugentity.PropertyAnnotation');
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

/**
 * @class
 * @extends {Entity}
 */
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
            throw new Bug("IllegalState", {}, "room must have an id first");
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
            throw new Bug("IllegalState", {}, "user must have an id first");
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RoomMember).with(
    entity("RoomMember").properties([
        property("createdAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("id")
            .type("string")
            .primaryId(),
        property("memberType")
            .type("string"),
        property("room")
            .type("Room")
            .populates(true)
            .store(false),
        property("roomId")
            .type("string")
            .require(true)
            .index(true)
            .id(),
        property("updatedAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("user")
            .type("User")
            .populates(true)
            .store(false),
        property("userId")
            .type("string")
            .require(true)
            .index(true)
            .id()
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RoomMember', RoomMember);
