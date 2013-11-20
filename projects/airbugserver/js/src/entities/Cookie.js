//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Cookie')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var cookie                  = require('cookie');

//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var TypeUtil                = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Cookie = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {{
         *     domain: string,
         *     expires: Date,
         *     httpOnly: boolean,
         *     originalMaxAge: number,
         *     path: string,
         *     secure: boolean
         * }}
         */
        this.data               = data;

        /**
         * @private
         * @type {boolean}
         */
        this.secure             = false;

        if (!TypeUtil.isBoolean(this.getHttpOnly())) {
            this.setHttpOnly(true);
        }
        if (!TypeUtil.isNumber(this.getMaxAge())) {
            this.setMaxAge(1000 * 60 * 60 * 24);
        }
        if (!TypeUtil.isString(this.getPath())) {
            this.setPath("/");
        }
        if (!TypeUtil.isBoolean(this.isSecure())) {
            this.setSecure(false);
        }
        this.setOriginalMaxAge(!TypeUtil.isNumber(this.data.originalMaxAge) ? this.getMaxAge() : this.data.originalMaxAge);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    getData: function() {
        return this.data;
    },

    /**
     * @return {Date}
     */
    getExpires: function() {
        return this.data.expires;
    },

    /**
     * @param {Date} expires
     */
    setExpires: function(expires) {
        this.data.expires        = expires;
        this.data.originalMaxAge = this.getMaxAge();
    },

    /**
     * @return {boolean}
     */
    getHttpOnly: function() {
        return this.data.httpOnly;
    },

    /**
     * @param {boolean} httpOnly
     */
    setHttpOnly: function(httpOnly) {
        this.data.httpOnly = httpOnly;
    },

    /**
     * Set expires via max-age in `ms`.
     *
     * @param {number} ms
     */
    setMaxAge: function(ms) {
        if (TypeUtil.isNumber(ms)) {
            this.data.expires = new Date(Date.now() + ms);
        } else {
            this.data.expires = ms;
        }
    },

    /**
     * @return {number}
     */
    getMaxAge: function() {
        return this.data.expires instanceof Date
            ? this.data.expires.valueOf() - Date.now()
            : this.data.expires;
    },

    /**
     * @return {number}
     */
    getOriginalMaxAge: function() {
        return this.data.originalMaxAge;
    },

    /**
     * @param {number} originalMaxAge
     */
    setOriginalMaxAge: function(originalMaxAge) {
        this.originalMaxAge = originalMaxAge;
    },

    /**
     * @return {string}
     */
    getPath: function() {
        return this.data.path;
    },

    /**
     * @param {string} path
     */
    setPath: function(path) {
        this.data.path = path;
    },

    /**
     * @return {boolean}
     */
    isSecure: function() {
        return this.data.secure;
    },

    /**
     * @param {boolean} secure
     */
    setSecure: function(secure) {
        this.data.secure = secure;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    hasLongExpires: function() {
        var week = 604800000;
        return this.getMaxAge() > (4 * week);
    },

    /**
     *
     */
    resetMaxAge: function() {
        this.setMaxAge(this.getOriginalMaxAge());
    },

    /**
     * @return {string}
     */
    serialize: function(name, val) {
        return cookie.serialize(name, val, this.data);
    },

    /**
     * @return {Object}
     */
    toJSON: function() {
        return this.getData();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.Cookie", Cookie);
