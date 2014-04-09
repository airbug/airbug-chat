//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.RequestContext')

//@Require('Class')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Map             = bugpack.require('Map');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RequestContext = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {string} type
     * @param {express.Request | IncomingRequest} request
     */
    _constructor: function(type, request) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, *>}
         */
        this.contextMap = new Map();

        /**
         * @private
         * @type {string}
         */
        this.type       = type;

        /**
         * @private
         * @type {express.Request | IncomingRequest} request
         */
        this.request    = request;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} key
     */
    get: function(key) {
        return this.contextMap.get(key);
    },

    /**
     * @return {express.Request | IncomingRequest}
     */
    getRequest: function() {
        return this.request;
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.type;
    },

    /**
     *
     */
    set: function(key, value) {
        this.contextMap.put(key, value);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
RequestContext.Types = {
    EXPRESS: "RequestContext::Types:express",
    BUGCALL: "RequestContext::Types:bugcall"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.RequestContext', RequestContext);
