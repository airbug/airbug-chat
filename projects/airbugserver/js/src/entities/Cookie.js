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

//@Export('airbugserver.Cookie')
//@Autoload

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityTag')
//@Require('bugentity.PropertyTag')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var cookie                      = require('cookie');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var TypeUtil                    = bugpack.require('TypeUtil');
    var Entity                      = bugpack.require('bugentity.Entity');
    var EntityTag            = bugpack.require('bugentity.EntityTag');
    var PropertyTag          = bugpack.require('bugentity.PropertyTag');
    var MarshTag             = bugpack.require('bugmarsh.MarshTag');
    var MarshPropertyTag     = bugpack.require('bugmarsh.MarshPropertyTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                     = BugMeta.context();
    var entity                      = EntityTag.entity;
    var marsh                       = MarshTag.marsh;
    var marshProperty               = MarshPropertyTag.property;
    var property                    = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Entity}
     */
    var Cookie = Class.extend(Entity, {

        _name: "airbugserver.Cookie",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {{
         *      domain: string,
         *      expires: Date,
         *      httpOnly: boolean,
         *      originalMaxAge: number,
         *      path: string,
         *      secure: boolean
         * }} data
         */
        _constructor: function(data) {

            this._super(data);


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            if (!TypeUtil.isString(data.domain)) {
                this.setDomain("");
            }
            if (!TypeUtil.isBoolean(data.httpOnly)) {
                this.setHttpOnly(true);
            }
            if (!TypeUtil.isDate(data.expires)) {
                this.setExpires(new Date(Date.now() + 1000 * 60 * 60 * 24));
            }
            if (!TypeUtil.isString(data.path)) {
                this.setPath("/");
            }
            if (!TypeUtil.isBoolean(data.secure)) {
                this.setSecure(false);
            }
            this.setOriginalMaxAge(!TypeUtil.isNumber(data.originalMaxAge) ? this.getMaxAge() : data.originalMaxAge);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getDomain: function() {
            return this.getEntityData().domain;
        },

        /**
         * @param {string} domain
         */
        setDomain: function(domain) {
            this.getEntityData().domain = domain;
        },

        /**
         * @return {Date}
         */
        getExpires: function() {
            return this.getEntityData().expires;
        },

        /**
         * @param {Date} expires
         */
        setExpires: function(expires) {
            this.getEntityData().expires        = expires;
            this.setOriginalMaxAge(this.getMaxAge());
        },

        /**
         * @return {boolean}
         */
        getHttpOnly: function() {
            return this.getEntityData().httpOnly;
        },

        /**
         * @param {boolean} httpOnly
         */
        setHttpOnly: function(httpOnly) {
            this.getEntityData().httpOnly = httpOnly;
        },

        /**
         * Set expires via max-age in `ms`.
         *
         * @param {number} ms
         */
        setMaxAge: function(ms) {
            if (TypeUtil.isNumber(ms)) {
                this.getEntityData().expires = new Date(Date.now() + ms);
            } else {
                this.getEntityData().expires = ms;
            }
        },

        /**
         * @return {number}
         */
        getMaxAge: function() {
            return (this.getExpires().valueOf() - Date.now());
        },

        /**
         * @return {number}
         */
        getOriginalMaxAge: function() {
            return this.getEntityData().originalMaxAge;
        },

        /**
         * @param {number} originalMaxAge
         */
        setOriginalMaxAge: function(originalMaxAge) {
            this.getEntityData().originalMaxAge = originalMaxAge;
        },

        /**
         * @return {string}
         */
        getPath: function() {
            return this.getEntityData().path;
        },

        /**
         * @param {string} path
         */
        setPath: function(path) {
            this.getEntityData().path = path;
        },

        /**
         * @return {boolean}
         */
        getSecure: function() {
            return this.getEntityData().secure;
        },

        /**
         * @param {boolean} secure
         */
        setSecure: function(secure) {
            this.getEntityData().secure = secure;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isSecure: function() {
            return this.getSecure();
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
            return cookie.serialize(name, val, this.getEntityData());
        },

        /**
         * @return {Object}
         */
        toJSON: function() {
            return this.getEntityData();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(Cookie).with(
        entity("Cookie")
            .properties([
                property("domain")
                    .type("string")
                    .default(""),
                property("expires")
                    .type("date")
                    .require(true),
                property("httpOnly")
                    .type("boolean")
                    .require(true),
                property("path")
                    .type("string")
                    .require(true),
                property("secure")
                    .type("boolean")
                    .require(true)
            ])
            .embed(true),
        marsh("Cookie")
            .properties([
                marshProperty("domain"),
                marshProperty("expires"),
                marshProperty("httpOnly"),
                marshProperty("path"),
                marshProperty("secure")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbugserver.Cookie", Cookie);
});
