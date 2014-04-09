//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.ChatMessageStreamService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('airbugserver.EntityService')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var MappedThrowable         = bugpack.require('MappedThrowable');
var Obj                     = bugpack.require('Obj');
var EntityService           = bugpack.require('airbugserver.EntityService');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var property                = PropertyAnnotation.property;
var $iterableParallel       = BugFlow.$iterableParallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EntityService}
 */
var ChatMessageStreamService = Class.extend(EntityService, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageStreamManager}
         */
        this.chatMessageStreamManager   = null;

        /**
         * @private
         * @type {ChatMessageStreamPusher}
         */
        this.chatMessageStreamPusher    = null;

        /**
         * @private
         * @type {ConversationManager}
         */
        this.conversationManager        = null;

        /**
         * @private
         * @type {ConversationSecurity}
         */
        this.conversationSecurity       = null;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {RequestContext} requestContext
     * @param {{
     *      conversationId: ObjectId
     * }} entityObject
     * @param {function(Throwable, ChatMessage=)} callback
     */
    createChatMessageStream: function(requestContext, entityObject, callback) {
        //TODO
        callback(new Exception("UnauthorizedAccess", {}, "Not implemented"));
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} entityId
     * @param {function(Throwable, Entity=} callback
     */
    deleteChatMessageStream: function(requestContext, entityId, callback) {
        //TODO
        callback(new Exception("UnauthorizedAccess", {}, "Not implemented"));
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} entityId
     * @param {function(Throwable, ChatMessageStream=)} callback
     */
    retrieveChatMessageStream: function(requestContext, entityId, callback) {
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var call                = requestContext.get("call");
        var chatMessageStream   = null;
        var conversation        = null;

        $series([
            $task(function(flow) {
                _this.conversationManager.retrieveConversation(entityId, function(throwable, returnedConversation) {
                    if (!throwable) {
                        conversation = returnedConversation;
                        flow.complete(throwable);
                    } else {
                        flow.error(new Exception("NotFound", {}, "Could not find Conversation with the id '" + conversationId + "'"))
                    }
                });
            }),
            $task(function(flow) {
                _this.conversationManager.populateConversation(conversation, ["owner"], function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.conversationSecurity.checkConversationReadAccess(currentUser, conversation, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                chatMessageStream = _this.chatMessageStreamManager.generateChatMessageStream({
                    id: entityId
                });
                _this.chatMessageStreamPusher.meldCallWithChatMessageStream(call.getCallUuid(), chatMessageStream, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.chatMessageStreamPusher.pushChatMessageStreamToCall(chatMessageStream, call.getCallUuid(), function(throwable) {
                    flow.complete(throwable);
                })
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, chatMessageStream);
            } else {
                callback(throwable);
            }
        });
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} chatMessageId
     * @param {{*}} updates
     * @param {function(Throwable, ChatMessage} callback
     */
    updateChatMessageStream: function(requestContext, chatMessageId, updates, callback) {
        callback(new Exception("UnauthorizedAccess", {}, "Not implemented"));
    }


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatMessageStreamService).with(
    module("chatMessageStreamService")
        .properties([
            property("chatMessageStreamManager").ref("chatMessageStreamManager"),
            property("chatMessageStreamPusher").ref("chatMessageStreamPusher"),
            property("conversationManager").ref("conversationManager"),
            property("conversationSecurity").ref("conversationSecurity")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageStreamService', ChatMessageStreamService);
