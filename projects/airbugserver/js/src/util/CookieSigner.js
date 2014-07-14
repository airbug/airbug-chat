/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.CookieSigner')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
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
var ArgTag           = bugpack.require('bugioc.ArgTag');
var ModuleTag        = bugpack.require('bugioc.ModuleTag');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgTag.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleTag.module;


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
    // Public Methods
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

bugmeta.tag(CookieSigner).with(
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
