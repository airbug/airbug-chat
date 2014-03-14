//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('CookieSigner')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var TypeUtil                = bugpack.require('TypeUtil');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var CookieSigner = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {*} cookieSignatureModule
     * @param {SessionServiceConfig} config
     */
    _constructor: function(cookieSignatureModule, config) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SessionServiceConfig}
         */
        this.config                 = config;

        /**
         * @private
         * @type {*}
         */
        this.cookieSignatureModule  = cookieSignatureModule;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {SessionServiceConfig}
     */
    getConfig: function() {
        return this.config;
    },

    /**
     * @return {*}
     */
    getCookieSignatureModule: function() {
        return this.cookieSignatureModule;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} value
     * @return {string}
     */
    sign: function (value) {
        return this.cookieSignatureModule.sign(value, this.config.getCookieSecret());
    },

    /**
     * @param {string} value
     * @return {string}
     */
    unsign: function(value) {
        if (TypeUtil.isString(value) && value.length > 0) {
            return this.cookieSignatureModule.unsign(value.slice(2), this.config.getCookieSecret());
        } else {
            throw new Bug("IllegalArg", {}, "value is expected to be a non empty string");
        }
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CookieSigner).with(
    module("cookieSigner")
        .args([
            arg().ref("cookieSignature"),
            arg().ref("sessionServiceConfig")
        ])
);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.CookieSigner', CookieSigner);
