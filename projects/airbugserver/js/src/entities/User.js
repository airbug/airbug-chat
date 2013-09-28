//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('User')

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

var User = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<Room>}
         */
        this.roomSet = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getAnonymous: function() {
        return this.deltaObject.getProperty("anonymous");
    },

    /**
     * @param {boolean} anonymous
     */
    setAnonymous: function(anonymous) {
        this.deltaObject.setProperty("anonymous" ,anonymous);
    },

    /**
     * @return {*}
     */
    getEmail: function() {
        return this.deltaObject.getProperty("email");
    },

    /**
     * @param {string} email
     */
    setEmail: function(email) {
        this.deltaObject.setProperty("email", email);
    },

    /**
     * @return {string}
     */
    getFirstName: function() {
        return this.deltaObject.getProperty("firstName");
    },

    /**
     * @param {string} firstName
     */
    setFirstName: function(firstName) {
        this.deltaObject.setProperty("firstName", firstName);
    },

    /**
     * @return {string}
     */
    getLastName: function() {
        return this.deltaObject.getProperty("lastName");
    },

    /**
     * @param {string} lastName
     */
    setLastName: function(lastName) {
        this.deltaObject.setProperty("lastName", lastName);
    },

    /**
     * @return {Set.<string>}
     */
    getRoomIdSet: function() {
        return this.deltaObject.getProperty("roomIdSet");
    },

    /**
     * @param {Set.<string>} roomIdSet
     */
    setRoomIdSet: function(roomIdSet) {
        this.deltaObject.setProperty("roomIdSet", roomIdSet);
    },

    /**
     * @return {Set.<Room>}
     */
    getRoomSet: function() {
        return this.roomSet;
    },

    /**
     * @param {Set.<Room>} roomSet
     */
    setRoomSet: function(roomSet) {
        this.roomSet = roomSet;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    addRoom: function(room) {
        //TODO
    },

    containsRoom: function(room) {
        //TODO
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
    },

    removeRoom: function(room) {
        //TODO
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.User', User);
