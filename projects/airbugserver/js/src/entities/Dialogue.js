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

//@Export('airbugserver.Dialogue')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Pair')
//@Require('bugentity.Entity')
//@Require('bugentity.EntityTag')
//@Require('bugentity.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Bug                     = bugpack.require('Bug');
var Class                   = bugpack.require('Class');
var Pair                    = bugpack.require('Pair');
var Entity                  = bugpack.require('bugentity.Entity');
var EntityTag        = bugpack.require('bugentity.EntityTag');
var PropertyTag      = bugpack.require('bugentity.PropertyTag');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var entity                  = EntityTag.entity;
var property                = PropertyTag.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Entity}
 */
var Dialogue = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(data) {

        this._super(data);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Conversation}
         */
        this.conversation   = undefined;

        /**
         * @private
         * @type {Pair.<User, User>}
         */
        this.userPair       = undefined;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Conversation}
     */
    getConversation: function() {
        return this.conversation;
    },

    /**
     * @return {string}
     */
    getConversationId: function() {
        return this.deltaDocument.getData().conversationId;
    },

    /**
     * @param {string} conversationId
     */
    setConversationId: function(conversationId) {
        this.deltaDocument.getData().conversationId = conversationId;
    },

    /**
     * @return {Pair.<string, string>}
     */
    getUserIdPair: function() {
        return this.deltaDocument.getData().userIdPair;
    },

    /**
     * @param {Pair.<string, string>} userIdPair
     */
    setUserIdPair: function(userIdPair) {
        this.deltaDocument.getData().userIdPair = userIdPair;
    },

    /**
     * @return {Pair.<User, User>}
     */
    getUserPair: function() {
        return this.userPair;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Conversation} conversation
     */
    setConversation: function(conversation) {
        if (conversation.getId()) {
            this.conversation = conversation;
            this.setConversationId(conversation.getId());
        } else {
            throw new Bug("IllegalState", {}, "Conversation must have an id first");
        }
    },

    /**
     * @param {Pair.<User, User>} userPair
     */
    setUserPair: function(userPair) {
        this.userPair = userPair;
        //TODO BRN:
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(Dialogue).with(
    entity("Dialogue").properties([
        property("conversation")
            .type("Conversation")
            .populates(true)
            .store(false),
        property("conversationId")
            .type("string")
            .require(true)
            .index(true)
            .id(),
        property("createdAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("id")
            .type("string")
            .primaryId(),
        property("updatedAt")
            .type("date")
            .require(true)
            .default(Date.now),
        property("userIdPair")
            .type("Pair")
            .require(true)
            .index(true)
            .collectionOf("string")
            .id(),
        property("userPair")
            .type("Pair")
            .populates(true)
            .store(false)
    ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Dialogue', Dialogue);
