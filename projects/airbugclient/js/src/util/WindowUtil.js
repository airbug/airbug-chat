//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WindowUtil')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var WindowUtil = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(window) {

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Window}
         */
        this.window = window;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Window}
     */
    getWindow: function() {
        return this.window;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    // If URL is http://www.somedomain.com:8000/account/search?filter=a#top

    /**
     * http://www.somedomain.com:8000
     * @return {string}
     */
    getBaseUrl: function() {
        var protocol    = this.getProtocol();
        var host        = this.getHost();
        return protocol + "//" + host;
    },

    /**
     * http://www.somedomain.com:8000/account/search
     * @return {string}
     */
    getUrl: function() {
        var protocol    = this.getProtocol();
        var host        = this.getHost();
        var pathname    = this.getPathname();
        return protocol + "//" + host + pathname;
    },

    /**
     * #top
     * @return {string}
     */
    getHash: function() {
        return this.window.location.hash;
    },

    /**
     * www.somedomain.com:8000
     * @return {string}
     */
    getHost: function() {
        return this.window.location.host;
    },

    /**
     * www.somedomain.com
     * @return {string}
     */
    getHostname: function() {
        return this.window.location.hostname;
    },

    /**
     * http://www.somedomain.com:8000/account/search?filter=a#top
     * @return {string}
     */
    getHref: function() {
        return this.window.location.href.toString();
    },

    /**
     * /account/search
     * @returns {string}
     */
    getPathname: function() {
        return window.location.pathname;
    },

    /**
     * 8000
     * @returns {number}
     */
    getPort: function() {
        var windowPort  = window.location.port;
        var port        = 80;
        if (windowPort !== "") {
            port = (windowPort - 0);
        }
        return port;
    },

    /**
     * http:
     * @return {string}
     */
    getProtocol: function() {
        return this.window.location.protocol;
    },

    /**
     * ?filter=a
     * @return {string}
     */
    getQuery: function() {
        return this.window.location.search;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WindowUtil", WindowUtil);
