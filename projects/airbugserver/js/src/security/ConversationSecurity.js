//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.ConversationSecurity')
//@Autoload

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugfs.Path')
//@Require('bugioc.PropertyTag')
//@Require('bugioc.ModuleTag')
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
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var Path                    = bugpack.require('bugfs.Path');
var ModuleTag        = bugpack.require('bugioc.ModuleTag');
var PropertyTag      = bugpack.require('bugioc.PropertyTag');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var module                  = ModuleTag.module;
var property                = PropertyTag.property;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var ConversationSecurity = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();

        /**
         * @private
         * @type {ConversationManager}
         */
        this.conversationManager = null;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {User} user
     * @param {Conversation} conversation
     * @param {function(Throwable=)} callback
     */
    checkConversationReadAccess: function(user, conversation, callback) {
        $task(function(flow) {
            if (!user.isAnonymous()) {
                if (conversation.getOwnerType() === "Room") {
                    if (user.getRoomIdSet().contains(conversation.getOwnerId())) {
                        flow.complete();
                    } else {
                        flow.error(new Exception("UnauthorizedAccess", {objectId: conversation.getId()}, "User is not a member of Room"));
                    }
                } else if (conversation.getOwnerType() === "Dialogue") {
                    /** @type {Dialogue} */
                    var dialogue = conversation.getOwner();
                    if (dialogue.getUserIdPair().contains(user.getId())) {
                        flow.complete();
                    } else {
                        flow.error(new Exception("UnauthorizedAccess", {objectId: conversation.getId()}, "User is not part of Dialogue"));
                    }
                } else {
                    flow.error(new Bug("InvalidDatabaseState", {}, "Conversation has unsupported ownerType '" + conversation.getOwnerType() + "'"));
                }
            } else {
                callback(new Exception("UnauthorizedAccess", {}, "Anonymous users cannot access Conversations"));
            }
        }).execute(callback);
    },

    /**
     * @param {User} user
     * @param {Conversation} conversation
     * @param {function(Throwable=)} callback
     */
    checkConversationWriteAccess: function(user, conversation, callback) {
        $task(function(flow) {
            if (!user.isAnonymous()) {
                if (conversation.getOwnerType() === "Room") {
                    if (user.getRoomIdSet().contains(conversation.getOwnerId())) {
                        flow.complete();
                    } else {
                        flow.error(new Exception("UnauthorizedAccess", {objectId: conversation.getId()}, "User is not a member of Room"));
                    }
                } else if (conversation.getOwnerType() === "Dialogue") {
                    /** @type {Dialogue} */
                    var dialogue = conversation.getOwner();
                    if (dialogue.getUserIdPair().contains(user.getId())) {
                        flow.complete();
                    } else {
                        flow.error(new Exception("UnauthorizedAccess", {objectId: conversation.getId()}, "User is not part of Dialogue"));
                    }
                } else {
                    flow.error(new Bug("InvalidDatabaseState", {}, "Conversation has unsupported ownerType '" + conversation.getOwnerType() + "'"));
                }
            } else {
                callback(new Exception("UnauthorizedAccess", {}, "Anonymous users cannot access Conversations"));
            }
        }).execute(callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(ConversationSecurity).with(
    module("conversationSecurity")
        .properties([
            property("conversationManager").ref("conversationManager")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationSecurity', ConversationSecurity);
