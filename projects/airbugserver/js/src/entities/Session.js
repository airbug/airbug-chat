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

    _constructor: function(data) {

        this._super(data);


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
        return this.deltaDocument.getCurrentData().data;
    },

    /**
     * @param {Object} data
     */
    setData: function(data) {
        this.deltaDocument.getCurrentData().data = data;
    },

    /**
     * @return {Date}
     */
    getExpires: function() {
        return this.deltaDocument.getCurrentData().expires;
    },

    /**
     * @param {Date} expires
     */
    setExpires: function(expires) {
        this.deltaDocument.getCurrentData().expires = expires;
    },

    /**
     * @return {string}
     */
    getSid: function() {
        return this.deltaDocument.getCurrentData().sid;
    },

    /**
     * @param {string} sid
     */
    setSid: function(sid) {
        this.deltaDocument.getCurrentData().sid = sid;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Session', Session);
