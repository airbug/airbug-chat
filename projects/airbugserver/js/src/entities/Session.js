//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Session')

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

var Session = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getData: function() {
        return this.deltaObject.getProperty("data");
    },

    /**
     * @param {Object} data
     */
    setData: function(data) {
        this.deltaObject.setProperty("data", data);
    },

    /**
     * @return {Date}
     */
    getExpires: function() {
        return this.deltaObject.getProperty("expires");
    },

    /**
     * @param {Date} expires
     */
    setExpires: function(expires) {
        this.deltaObject.setProperty("expires", expires);
    },

    /**
     * @return {string}
     */
    getSid: function() {
        return this.deltaObject.getProperty("sid");
    },

    /**
     * @param {string} sid
     */
    setSid: function(sid) {
        this.deltaObject.setProperty("sid", sid);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Session', Session);
