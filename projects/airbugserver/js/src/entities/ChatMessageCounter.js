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

//@Export('airbugserver.ChatMessageCounter')
//@Autoload

//@Require('Class')
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

    var Class           = bugpack.require('Class');
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
    var ChatMessageCounter = Class.extend(Entity, {

        _name: "airbugserver.ChatMessageCounter",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param data
         */
        _constructor: function(data) {
            this._super(data);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getConversationId: function() {
            return this.getEntityData().conversationId;
        },

        /**
         * @return {number}
         */
        getCount: function() {
            return this.getEntityData().count;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ChatMessageCounter).with(
        entity("ChatMessageCounter")
            .properties([
                property("conversationId")
                    .type("string")
                    .require(true)
                    .index(true)
                    .id(),
                property("count")
                    .type("number")
                    .require(true)
                    .default(0),
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
                    .default(Date.now)
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ChatMessageCounter', ChatMessageCounter);
});
