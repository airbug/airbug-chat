//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationService')
//@Autoload

//@Require('Class')
//@Require('Exception')
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
var $task                   = BugFlow.$task;
var $series                 = BugFlow.$series;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationService = Class.extend(EntityService, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(conversationManager, conversationPusher) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManager}
         */
        this.conversationManager    = conversationManager;

        /**
         * @private
         * @type {ConversationPusher}
         */
        this.conversationPusher     = conversationPusher;
    },


    //-------------------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------------------

    /*
     * @param {RequestContext} requestContext
     * @param {{*}} conversation
     * @param {function(Throwable, Conversation)} callback
     */
    createConversation: function(requestContext, conversation, callback) {
        //TODO
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} conversationId
     * @param {function(Throwable)} callback
     */
    deleteConversation: function(requestContext, conversationId, callback) {
        //TODO
    },

    /**
     * @param {RequestContext} requestContext
     * @param {string} conversationId
     * @param {function(Throwable, Conversation=)} callback
     */
    retrieveConversation: function(requestContext, conversationId, callback) {
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var callManager         = requestContext.get("callManager");
        var conversation        = null;

        if (!currentUser.isAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.dbRetrievePopulatedConversation(conversationId, function(throwable, returnedConversation) {

                        //TODO BRN: Is it ok for non-room members to retrieve a conversation?
                        if (!throwable) {
                            if (returnedConversation) {
                                if (currentUser.getRoomIdSet().contains(returnedConversation.getOwnerId())) {
                                    conversation = returnedConversation;
                                    flow.complete();
                                } else {
                                    flow.error(new Exception("UnauthorizedAccess", {objectId: conversationId}));
                                }
                            } else {
                                flow.error(new Exception("NotFound"));
                            }
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    _this.conversationPusher.meldCallWithConversation(callManager.getCallUuid(), conversation, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.conversationPusher.pushConversationToCall(conversation, callManager.getCallUuid(), function(throwable) {
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
        } else {
            callback(new Exception("UnauthorizedAccess"));
        }
    },

    /*
     * @param {RequestContext} requestContext
     * @param {string} conversationId
     * @param {{*}} updates
     * @param {function(Throwable, Conversation)} callback
     */
    updateConversation: function(requestContext, conversationId, updates, callback) {
        //TODO
    },

    // Convenience Retrieve Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Conversation} conversation
     * @param {function(Throwable, Conversation=)} callback
     */
    dbPopulateConversation: function(conversation, callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.conversationManager.populateConversation(conversation, ["owner"], function(throwable) {
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
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, Conversation=)} callback
     */
    dbRetrievePopulatedConversation: function(conversationId, callback) {
        var _this               = this;
        var conversation        = undefined;
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

bugmeta.annotate(ConversationService).with(
    module("conversationService")
        .args([
            arg().ref("conversationManager"),
            arg().ref("conversationPusher")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationService', ConversationService);
