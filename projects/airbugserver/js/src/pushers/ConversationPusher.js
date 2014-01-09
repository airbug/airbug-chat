//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationPusher')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.EntityPusher')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var EntityPusher        = bugpack.require('airbugserver.EntityPusher');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationPusher = Class.extend(EntityPusher, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------


    /**
     * @protected
     * @param {string} callUuid
     * @param {Conversation} conversation
     * @param {function(Throwable)} callback
     */
    meldCallWithConversation: function(callUuid, conversation, callback) {
        this.meldCallWithEntity(callUuid, conversation, callback);
    },

    /**
     * @protected
     * @param {string} callUuid
     * @param {Array.<Conversation>} conversations
     * @param {function(Throwable)} callback
     */
    meldCallWithConversations: function(callUuid, conversations, callback) {
        this.meldCallWithEntities(callUuid, conversations, callback);
    },

    /**
     * @protected
     * @param {Conversation} conversation
     * @param {function(Throwable)} callback
     */
    pushConversation: function(conversation, callback) {
        var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(conversation);
        var data                = this.filterConversation(conversation);
        var push                = this.getPushManager().push();
        push
            .toAll()
            .setDocument(meldDocumentKey, data)
            .exec(callback);
    },

    /**
     * @protected
     * @param {Conversation} conversation
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    pushConversationToCall: function(conversation, callUuid, callback) {
        var meldDocumentKey     = this.generateMeldDocumentKeyFromEntity(conversation);
        var data                = this.filterConversation(conversation);
        var push                = this.getPushManager().push();
        push
            .to([callUuid])
            .waitFor([callUuid])
            .setDocument(meldDocumentKey, data)
            .exec(callback);
    },

    /**
     * @protected
     * @param {Array.<Conversation>} conversations
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    pushConversationsToCall: function(conversations, callUuid, callback) {
        var _this   = this;
        var push    = this.getPushManager().push();
        push
            .to([callUuid])
            .waitFor([callUuid]);
        conversations.forEach(function(conversation) {
            var meldDocumentKey     = _this.generateMeldDocumentKeyFromEntity(conversation);
            var data                = _this.filterConversation(conversation);
            push.setDocument(meldDocumentKey, data)
        });
        push.exec(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Conversation} conversation
     * @return {Object}
     */
    filterConversation: function(conversation) {
        return Obj.pick(conversation.toObject(), [
            "id",
            "ownerId"
        ]);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ConversationPusher).with(
    module("conversationPusher")
        .args([
            arg().ref("meldBuilder"),
            arg().ref("meldManager"),
            arg().ref("pushManager"),
            arg().ref("userManager"),
            arg().ref("meldSessionManager")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationPusher', ConversationPusher);
