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

//@Export('airbugserver.AirbugCall')
//@Autoload

//@Require('Bug')
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

    var Bug                         = bugpack.require('Bug');
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
    var AirbugCall = Class.extend(Entity, {

        _name: "airbugserver.AirbugCall",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {{
         *      callType: string,
         *      callUuid: string,
         *      createdAt: Date,
         *      id: string,
         *      open: boolean,
         *      sessionId: string,
         *      updatedAt: Date,
         *      userId: string
         * }} data
         */
        _constructor: function(data) {

            this._super(data);


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Session}
             */
            this.session    = null;

            /**
             * @private
             * @type {User}
             */
            this.user       = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @returns {string}
         */
        getCallType: function() {
            return this.getEntityData().callType;
        },

        /**
         * @param {string} callType
         */
        setCallType: function(callType) {
            this.getEntityData().callType = callType;
        },

        /**
         * @returns {string}
         */
        getCallUuid: function() {
            return this.getEntityData().callUuid;
        },

        /**
         * @param {string} callUuid
         */
        setCallUuid: function(callUuid) {
            this.getEntityData().callUuid = callUuid;
        },

        /**
         * @return {boolean}
         */
        getOpen: function() {
            return this.getEntityData().open;
        },

        /**
         * @param {boolean} open
         */
        setOpen: function(open) {
            this.getEntityData().open = open;
        },

        /**
         * @return {string}
         */
        getSessionId: function() {
            return this.getEntityData().sessionId;
        },

        /**
         * @param {string} sessionId
         */
        setSessionId: function(sessionId) {
            this.getEntityData().sessionId = sessionId;
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
         * @return {Session}
         */
        getSession: function() {
            return this.session;
        },

        /**
         * @param {Session} session
         */
        setSession: function(session) {
            if (session.getId()) {
                this.session = session;
                this.setSessionId(session.getId());
            } else {
                throw new Bug("IllegalState", {}, "Session must have an id first");
            }
        },

        /**
         * @return {User}
         */
        getUser: function() {
            return this.user;
        },

        /**
         * @param {User} user
         */
        setUser: function(user) {
            if (user.getId()) {
                this.user = user;
                this.setUserId(user.getId());
            } else {
                throw new Bug("IllegalState", {}, "User must have an id first");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(AirbugCall).with(
        entity("AirbugCall").properties([
            property("callType")
                .type("string")
                .require(true)
                .index(true),
            property("callUuid")
                .type("string")
                .require(true)
                .index(true)
                .unique(true),
            property("createdAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("id")
                .type("string")
                .primaryId(),
            property("open")
                .type("boolean")
                .require(true)
                .default(false),
            property("session")
                .type("Session")
                .populates(true)
                .store(false),
            property("sessionId")
                .type("string")
                .index(true)
                .id(),
            property("updatedAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("user")
                .type("User")
                .populates(true)
                .store(false),
            property("userId")
                .type("string")
                .index(true)
                .id()
        ]),
        marsh("AirbugCall")
            .properties([
                marshProperty("callType"),
                marshProperty("callUuid"),
                marshProperty("createdAt"),
                marshProperty("id"),
                marshProperty("open"),
                marshProperty("sessionId"),
                marshProperty("updatedAt"),
                marshProperty("userId")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.AirbugCall', AirbugCall);
});
