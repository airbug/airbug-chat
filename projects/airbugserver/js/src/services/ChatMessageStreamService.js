//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ChatMessageStreamService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('MappedThrowable')
//@Require('Obj')
//@Require('airbugserver.EntityService')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
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
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
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

    _constructor: function(chatMessageStreamManager, conversationManager, chatMessageStreamPusher) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageStreamManager}
         */
        this.chatMessageStreamManager   = chatMessageStreamManager;

        /**
         * @private
         * @type {ChatMessageStreamPusher}
         */
        this.chatMessageStreamPusher    = chatMessageStreamPusher;

        /**
         * @private
         * @type {ConversationManager}
         */
        this.conversationManager        = conversationManager;
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
        callback(new Exception("UnauthorizedAccess"));
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} entityId
     * @param {function(Throwable} callback
     */
    deleteChatMessageStream: function(requestContext, entityId, callback) {
        //TODO
        callback(new Exception("UnauthorizedAccess"));
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} entityId
     * @param {function(Throwable=)} callback
     */
    retrieveChatMessageStream: function(requestContext, entityId, callback) {
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var callManager         = requestContext.get("callManager");
        var chatMessageStream   = null;

        if (currentUser.isNotAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.dbRetrievePopulatedConversation(entityId, function(throwable, returnedConversation) {

                        //TODO BRN: Is it ok for non-room members to retrieve a conversation?
                        if (!throwable) {
                            if (currentUser.getRoomIdSet().contains(returnedConversation.getOwnerId())) {
                                flow.complete();
                            } else {
                                flow.error(new Exception("UnauthorizedAccess", {objectId: entityId}));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    chatMessageStream = _this.chatMessageStreamManager.generateChatMessageStream({
                        id: entityId
                    });
                    _this.chatMessageStreamPusher.meldCallWithChatMessageStream(callManager.getCallUuid(), chatMessageStream, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.chatMessageStreamPusher.pushChatMessageStreamToCall(chatMessageStream, callManager.getCallUuid(), function(throwable) {
                        flow.complete(throwable);
                    })
                })
            ]).execute(function(throwable) {
                    if (!throwable) {
                        callback();
                    } else {
                        callback(throwable);
                    }
                });
        } else {
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} chatMessageId
     * @param {{*}} updates
     * @param {function(Throwable, ChatMessage} callback
     */
    updateChatMessageStream: function(requestContext, chatMessageId, updates, callback) {
        callback(new Exception("UnauthorizedAccess"));
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} conversationId
     * @param {function(Throwable, Conversation=)} callback
     */
    dbRetrievePopulatedConversation: function(conversationId, callback) {
        var _this               = this;
        var conversation        = null;
        var conversationManager = this.conversationManager;
        $series([
            $task(function(flow) {
                conversationManager.retrieveConversation(conversationId, function(throwable, returnedConversation) {
                    if (!throwable) {
                        if (returnedConversation) {
                            conversation = returnedConversation;
                        } else {
                            throwable = new Exception("NotFound", {objectId: conversationId});
                        }
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.dbPopulateConversation(conversation, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
                if (!throwable) {
                    callback(null, conversation);
                } else {
                    callback(throwable);
                }
            });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatMessageStreamService).with(
    module("chatMessageStreamService")
        .args([
            arg().ref("chatMessageStreamManager"),
            arg().ref("conversationManager"),
            arg().ref("chatMessageStreamPusher")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ChatMessageStreamService', ChatMessageStreamService);
