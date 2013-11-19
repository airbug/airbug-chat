//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ConversationService')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Exception   = bugpack.require('Exception');
var Obj         = bugpack.require('Obj');
var BugFlow     = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $task       = BugFlow.$task;
var $series     = BugFlow.$series;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(conversationManager, meldService) {

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
         * @type {MeldService}
         */
        this.meldService            = meldService;
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
     * @param {function(Throwable, Conversation)} callback
     */
    retrieveConversation: function(requestContext, conversationId, callback) {
        var _this               = this;
        var currentUser         = requestContext.get("currentUser");
        var meldManager         = this.meldService.factoryManager();
        var conversation        = undefined;

        if (!currentUser.isAnonymous()) {
            $series([
                $task(function(flow) {
                    _this.dbRetrievePopulatedConversation(conversationId, function(throwable, returnedConversation) {

                        //TODO BRN: Is it ok for non-room members to retrieve a conversation?

                        if (currentUser.getRoomIdSet().contains(returnedConversation.getOwnerId())) {
                            conversation = returnedConversation;
                        } else {
                            new Exception("UnauthorizedAccess", {objectId: conversationId});
                        }
                    });
                }),
                $task(function(flow) {
                    _this.meldUserWithConversation(meldManager, currentUser, conversation);
                    _this.meldConversation(meldManager, conversation);
                    meldManager.commitTransaction(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (!throwable) {
                    callback(undefined, conversation);
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
     * @param {function(Throwable, Conversation)} callback
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
                callback(undefined, conversation);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {string} conversationId
     * @param {function(Throwable, Conversation)} callback
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
                callback(undefined, conversation);
            } else {
                callback(throwable);
            }
        });
    },


    // Convenience Meld Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldManager} meldManager
     * @param {Conversation} conversation
     */
    meldConversation: function(meldManager, conversation) {
        this.meldService.meldEntity(meldManager, "Conversation", "basic", conversation);
    },

    /**
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {Conversation} conversation
     * @param {string=} reason
     */
    meldUserWithConversation: function(meldManager, user, conversation, reason) {
        var conversationMeldKey     = this.meldService.generateMeldKey("Conversation", conversation.getId(), "basic");
        var meldKeys                = [conversationMeldKey];
        reason                      = reason ? reason : conversation.getId();

        this.meldService.meldUserWithKeysAndReason(meldManager, user, meldKeys, reason);
    },

    /**
     * @param {MeldManager} meldManager
     * @param {User} user
     * @param {Conversation} conversation
     * @param {string=} reason
     */
    unmeldUserWithConversation: function(meldManager, user, conversation, reason) {
        var conversationMeldKey     = this.meldService.generateMeldKey("Conversation", conversation.getId(), "basic");
        var meldKeys                = [conversationMeldKey];
        reason                      = reason ? reason : conversation.getId();

        this.meldService.unmeldUserWithKeysAndReason(meldManager, user, meldKeys, reason);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ConversationService', ConversationService);
