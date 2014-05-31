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

//@Export('airbugserver.Session')
//@Autoload

//@Require('Class')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityAnnotation')
//@Require('bugentity.PropertyAnnotation')
//@Require('bugmarsh.MarshAnnotation');
//@Require('bugmarsh.MarshPropertyAnnotation');
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Entity                      = bugpack.require('bugentity.Entity');
    var EntityAnnotation            = bugpack.require('bugentity.EntityAnnotation');
    var PropertyAnnotation          = bugpack.require('bugentity.PropertyAnnotation');
    var MarshAnnotation             = bugpack.require('bugmarsh.MarshAnnotation');
    var MarshPropertyAnnotation     = bugpack.require('bugmarsh.MarshPropertyAnnotation');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                     = BugMeta.context();
    var entity                      = EntityAnnotation.entity;
    var marsh                       = MarshAnnotation.marsh;
    var marshProperty               = MarshPropertyAnnotation.property;
    var property                    = PropertyAnnotation.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Entity}
     */
    var Session = Class.extend(Entity, {

        _name: "airbugserver.Session",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {{
         *      cookie: Cookie,
         *      data: SessionData,
         *      expires: Date,
         *      sid: string,
         *      userId: string
         * }} data
         */
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
         * @return {Cookie}
         */
        getCookie: function() {
            return this.getEntityData().cookie;
        },

        /**
         * @param {Cookie} cookie
         */
        setCookie: function(cookie) {
            this.getEntityData().cookie = cookie;
        },

        /**
         * @return {SessionData}
         */
        getData: function() {
            return this.getEntityData().data;
        },

        /**
         * @param {SessionData} sessionData
         */
        setData: function(sessionData) {
            this.getEntityData().data = sessionData;
        },

        /**
         * @return {Date}
         */
        getExpires: function() {
            return this.getCookie().getExpires();
        },

        /**
         * @return {string}
         */
        getSid: function() {
            return this.getEntityData().sid;
        },

        /**
         * @param {string} sid
         */
        setSid: function(sid) {
            this.getEntityData().sid = sid;
        },

        /**
         * @return {string}
         */
        getUserId: function() {
            return this.getEntityData().userId;
        },

        /**
         * @param {string} userId
         */
        setUserId: function(userId) {
            this.getEntityData().userId = userId;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        resetMaxAge: function() {
            this.getCookie().resetMaxAge();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(Session).with(
        entity("Session").properties([
            property("cookie")
                .type("Cookie"),
            property("createdAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("data")
                .type("SessionData"),
            property("id")
                .type("string")
                .primaryId(),
            property("sid")
                .type("string")
                .require(true)
                .index(true)
                .unique(true),
            property("updatedAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("userId")
                .type("string")
                .index(true)
                .id()
        ]),
        marsh("Session")
            .properties([
                marshProperty("cookie"),
                marshProperty("createdAt"),
                marshProperty("data"),
                marshProperty("id"),
                marshProperty("sid"),
                marshProperty("updatedAt"),
                marshProperty("userId")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.Session', Session);
});
