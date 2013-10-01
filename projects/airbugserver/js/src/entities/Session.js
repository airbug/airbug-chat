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
        return this.deltaDocument.getData().data;
    },

    /**
     * @param {Object} data
     */
    setData: function(data) {
        this.deltaDocument.getData().data = data;
    },

    /**
     * @return {Date}
     */
    getExpires: function() {
        return this.deltaDocument.getData().expires;
    },

    /**
     * @param {Date} expires
     */
    setExpires: function(expires) {
        this.deltaDocument.getData().expires = expires;
    },

    /**
     * @return {string}
     */
    getSid: function() {
        return this.deltaDocument.getData().sid;
    },

    /**
     * @param {string} sid
     */
    setSid: function(sid) {
        this.deltaDocument.getData().sid = sid;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Session', Session);
