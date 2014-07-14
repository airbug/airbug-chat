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

//@Export('airbugserver.Conversation')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Set')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityTag')
//@Require('bugentity.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Set             = bugpack.require('Set');
    var Entity          = bugpack.require('bugentity.Entity');
    var EntityTag       = bugpack.require('bugentity.EntityTag');
    var PropertyTag     = bugpack.require('bugentity.PropertyTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var entity          = EntityTag.entity;
    var property        = PropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Entity}
     */
    var Conversation = Class.extend(Entity, {

        _name: "airbugserver.Conversation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param data
         */
        _constructor: function(data) {

            this._super(data);


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Set.<ChatMessage>}
             */
            this.chatMessageSet     = new Set();

            /**
             * @private
             * @type {(Dialogue | Room)}
             */
            this.owner              = undefined;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getOwnerId: function() {
            return this.getEntityData().ownerId;
        },

        /**
         * @param {string} ownerId
         */
        setOwnerId: function(ownerId) {
            this.getEntityData().ownerId = ownerId;
        },

        /**
         * @return {string}
         */
        getOwnerType: function() {
            return this.getEntityData().ownerType;
        },

        /**
         * @param {string} ownerType
         */
        setOwnerType: function(ownerType) {
            this.getEntityData().ownerType = ownerType;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<ChatMessage>}
         */
        getChatMessageSet: function() {
            return this.chatMessageSet;
        },

        /**
         * @param {Set.<ChatMessage>} chatMessageSet
         */
        setChatMessageSet: function(chatMessageSet) {
            this.chatMessageSet = chatMessageSet;
        },

        /**
         * @return {(Dialogue | Room)}
         */
        getOwner: function() {
            return this.owner;
        },

        /**
         * @param {(Dialogue | Room)} owner
         */
        setOwner: function(owner) {
            if (owner.getId()) {
                this.owner = owner;
                this.setOwnerId(owner.getId());
            } else {
                throw new Bug("IllegalState", {}, "owner must have an id first");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(Conversation).with(
        entity("Conversation").properties([
            property("chatMessageSet")
                .type("Set")
                .collectionOf("ChatMessage")
                .populates(true)
                .store(false),
            property("createdAt")
                .type("date")
                .require(true)
                .default(Date.now),
            property("id")
                .type("string")
                .primaryId(),
            property("ownerId")
                .type("string")
                .require(true)
                .index(true)
                .unique(true)
                .id(),
            property("ownerType")
                .type("string")
                .require(true),
            property("owner")
                .populates(true)
                .store(false),
            property("updatedAt")
                .type("date")
                .require(true)
                .default(Date.now)
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.Conversation', Conversation);
});
