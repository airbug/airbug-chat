//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('User')

//@Require('Class')
//@Require('Set')
//@Require('bugentity.CollectionAnnotation')
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

var Class                   = bugpack.require('Class');
var Set                     = bugpack.require('Set');
var CollectionAnnotation    = bugpack.require('bugentity.CollectionAnnotation');
var Entity                  = bugpack.require('bugentity.Entity');
var EntityAnnotation        = bugpack.require('bugentity.EntityAnnotation');
var PropertyAnnotation      = bugpack.require('bugentity.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var collection              = CollectionAnnotation.collection;
var entity                  = EntityAnnotation.entity;
var property                = PropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var User = Class.extend(Entity, {

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
         * @type {Set.<Room>}
         */
        this.roomSet    = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getAnonymous: function() {
        return this.deltaDocument.getData().anonymous;
    },

    /**
     * @param {boolean} anonymous
     */
    setAnonymous: function(anonymous) {
        this.deltaDocument.getData().anonymous = anonymous;
    },

    /**
     * @return {*}
     */
    getEmail: function() {
        return this.deltaDocument.getData().email;
    },

    /**
     * @param {string} email
     */
    setEmail: function(email) {
        this.deltaDocument.getData().email = email;
    },

    /**
     * @return {string}
     */
    getFirstName: function() {
        return this.deltaDocument.getData().firstName;
    },

    /**
     * @param {string} firstName
     */
    setFirstName: function(firstName) {
        this.deltaDocument.getData().firstName = firstName;
    },

    /**
     * @return {string}
     */
    getLastName: function() {
        return this.deltaDocument.getData().lastName;
    },

    /**
     * @param {string} lastName
     */
    setLastName: function(lastName) {
        this.deltaDocument.getData().lastName = lastName;
    },

    /**
     * @return {Set.<string>}
     */
    getRoomIdSet: function() {
        return this.deltaDocument.getData().roomIdSet;
    },

    /**
     * @param {Set.<string>} roomIdSet
     */
    setRoomIdSet: function(roomIdSet) {
        this.deltaDocument.getData().roomIdSet = roomIdSet;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} roomId
     */
    addRoomId: function(roomId) {
        var roomIdSet = this.getRoomIdSet();
        if (!roomIdSet) {
            roomIdSet = new Set();
            this.setRoomIdSet(roomIdSet);
        }
        roomIdSet.add(roomId);
    },

    /**
     * @param {string} roomId
     */
    removeRoomId: function(roomId) {
        var roomIdSet = this.getRoomIdSet();
        if (!roomIdSet) {
            roomIdSet = new Set();
            this.setRoomIdSet(roomIdSet);
        }
        roomIdSet.remove(roomId);
    },

    /**
     * @param {Room} room
     */
    addRoom: function(room) {
        if (room.getId()) {
            this.roomSet.add(room);
            this.addRoomId(room.getId());
        } else {
            throw new Error("room must have an id before it can be added");
        }
    },

    /**
     * @param {Room} room
     * @return {boolean}
     */
    containsRoom: function(room) {
        return this.roomIdSet.contains(room.getId());
    },

    /**
     * @return {Set.<Room>}
     */
    getRoomSet: function() {
        return this.roomSet;
    },

    /**
     * @param {Room} room
     */
    removeRoom: function(room) {
        if (room.getId()) {
            this.roomSet.remove(room);
            this.removeRoomId(room.getId());
        } else {
            throw new Error("room must have an id before it can be removed");
        }
    },


    /**
     * @return {boolean}
     */
    isAnonymous: function() {
        return this.getAnonymous();
    },

    /**
     * @return {boolean}
     */
    isNotAnonymous: function() {
        return !this.getAnonymous();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(User).with(
    entity("User").properties([
        property("anonymous").type("boolean"),
        property("createdAt").type("date"),
        property("email").type("string"),
        property("firstName").type("string"),
        property("lastName").type("string"),
        property("roomIdSet").type(collection().type("Set").of("string")),
        property("roomSet").type(collection().type("Set").of("Room")),
        property("status").type("string"),
        property("updatedAt").type("date")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.User', User);
