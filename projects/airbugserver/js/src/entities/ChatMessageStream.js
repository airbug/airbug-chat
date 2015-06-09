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

//@Export('airbugserver.ChatMessageStream')
//@Autoload

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
    var ChatMessageStream = Class.extend(Entity, {

        _name: "airbugserver.ChatMessageStream",


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Set.<string>}
         */
        getChatMessageIdSet: function() {
            return this.getEntityData().chatMessageIdSet;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(ChatMessageStream).with(
        entity("ChatMessageStream")
            .properties([
                property("createdAt")
                    .type("date")
                    .default(Date.now),
                property("id")
                    .type("string")
                    .primaryId(),
                property("chatMessageIdSet")
                    .type("Set")
                    .collectionOf("string")
                    .id(),
                property("updatedAt")
                    .type("date")
                    .default(Date.now)
            ])
            .store(false)
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.ChatMessageStream', ChatMessageStream);
});
