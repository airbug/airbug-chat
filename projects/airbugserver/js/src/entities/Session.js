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
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Entity              = bugpack.require('bugentity.Entity');
    var EntityTag           = bugpack.require('bugentity.EntityTag');
    var PropertyTag         = bugpack.require('bugentity.PropertyTag');
    var MarshPropertyTag    = bugpack.require('bugmarsh.MarshPropertyTag');
    var MarshTag            = bugpack.require('bugmarsh.MarshTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var entity              = EntityTag.entity;
    var marsh               = MarshTag.marsh;
    var marshProperty       = MarshPropertyTag.property;
    var property            = PropertyTag.property;


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

    bugmeta.tag(Session).with(
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
