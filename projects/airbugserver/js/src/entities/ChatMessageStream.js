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
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Set                     = bugpack.require('Set');
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

var ChatMessageStream = Class.extend(Entity, {

    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {Set.<string>}
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
