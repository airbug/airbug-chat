//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetContainer')

//@Require('AddChange')
//@Require('Class')
//@Require('ClearChange')
//@Require('ISet')
//@Require('Map')
//@Require('Obj')
//@Require('RemoveChange')
//@Require('RemovePropertyChange')
//@Require('Set')
//@Require('SetPropertyChange')
//@Require('airbug.ChatWidgetInputFormContainer')
//@Require('airbug.ChatWidgetMessagesContainer')
//@Require('airbug.ChatWidgetView')
//@Require('airbug.CommandModule')
//@Require('airbug.PanelView')
//@Require('bugcall.RequestFailedException')
//@Require('bugflow.BugFlow')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AddChange                       = bugpack.require('AddChange');
var Class                           = bugpack.require('Class');
var ClearChange                     = bugpack.require('ClearChange');
var ISet                            = bugpack.require('ISet');
var Map                             = bugpack.require('Map');
var Obj                             = bugpack.require('Obj');
var RemoveChange                    = bugpack.require('RemoveChange');
var RemovePropertyChange            = bugpack.require('RemovePropertyChange');
var Set                             = bugpack.require('Set');
var SetPropertyChange               = bugpack.require('SetPropertyChange');
var ChatWidgetInputFormContainer    = bugpack.require('airbug.ChatWidgetInputFormContainer');
var ChatWidgetMessagesContainer     = bugpack.require('airbug.ChatWidgetMessagesContainer');
var ChatWidgetView                  = bugpack.require('airbug.ChatWidgetView');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var PanelView                       = bugpack.require('airbug.PanelView');
var RequestFailedException          = bugpack.require('bugcall.RequestFailedException');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                       = AutowiredAnnotation.autowired;
var bugmeta                         = BugMeta.context();
var CommandType                     = CommandModule.CommandType;
var property                        = PropertyAnnotation.property;
var view                            = ViewBuilder.view;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatWidgetContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {ConversationModel} conversationModel
     */
    _constructor: function(conversationModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, ChatMessageModel>}
         */
        this.chatMessageIdToChatMessageModelMap         = new Map();

        /**
         * @private
         * @type {Map.<string, ChatMessageModel>}
         */
        this.chatMessageTryUuidToChatMessageModelMap    = new Map();


        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageStreamModel}
         */
        this.chatMessageStreamModel                     = null;

        /**
         * @private
         * @type {ConversationModel}
         */
        this.conversationModel                          = conversationModel;

        /**
         * @private
         * @type {ChatMessageList}
         */
        this.chatMessageList                            = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatWidgetView}
         */
        this.chatWidgetView                             = null;

        /**
         * @private
         * @type {ChatWidgetInputFormContainer}
         */
        this.chatWidgetInputFormContainer               = null;

        /**
         * @private
         * @type {ChatWidgetMessagesContainer}
         */
        this.chatWidgetMessagesContainer                = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManagerModule}
         */
        this.chatMessageManagerModule                   = null;

        /**
         * @private
         * @type {ChatMessageStreamManagerModule}
         */
        this.chatMessageStreamManagerModule              = null;

        /**
         * @private
         * @type {CommandModule}
         */
         this.commandModule                             = null;

        /**
         * @private
         * @type {CurrentUserManagerModule}
         */
        this.currentUserManagerModule                   = null;

        /**
         * @private
         * @type {UserManagerModule}
         */
        this.userManagerModule                          = null;

    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {ChatMessageStreamModel}
     */
    getChatMessageStreamModel: function() {
        return this.chatMessageStreamModel;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        if (this.conversationModel.getProperty("id")) {
            this.loadChatMessageList(this.conversationModel.getProperty("id"));
            this.loadChatMessageStream(this.conversationModel.getProperty("id"));
        }
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Models
        //-------------------------------------------------------------------------------

        this.chatMessageStreamModel     = this.chatMessageStreamManagerModule.generateChatMessageStreamModel({});
        this.chatMessageList            = this.chatMessageManagerModule.generateChatMessageList();


        // Create Views
        //-------------------------------------------------------------------------------

        this.chatWidgetView             = view(ChatWidgetView)
                                            .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.chatWidgetView);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.chatWidgetMessagesContainer        = new ChatWidgetMessagesContainer(this.chatMessageList);
        this.addContainerChild(this.chatWidgetMessagesContainer, '#chat-widget-messages');
        this.chatWidgetInputFormContainer       = new ChatWidgetInputFormContainer();
        this.addContainerChild(this.chatWidgetInputFormContainer, "#chat-widget-input");
    },

    /**
     * @protected
     */
    deinitializeContainer: function() {
        this._super();
        this.conversationModel.unobserve(SetPropertyChange.CHANGE_TYPE, "id", this.observeConversationModelIdSetPropertyChange, this);
        this.conversationModel.unobserve(ClearChange.CHANGE_TYPE, "", this.observeConversationModelClearChange, this);
        this.chatMessageStreamModel.unobserve(AddChange.CHANGE_TYPE, "chatMessageIdSet", this.observeChatMessageIdSetAddChange, this);
        this.chatMessageStreamModel.unobserve(RemoveChange.CHANGE_TYPE, "chatMessageIdSet", this.observeChatMessageIdSetRemoveChange, this);
        this.chatMessageStreamModel.unobserve(SetPropertyChange.CHANGE_TYPE, "chatMessageIdSet", this.observeChatMessageIdSetSetPropertyChange, this);
        this.deinitializeCommandSubscriptions();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.conversationModel.observe(SetPropertyChange.CHANGE_TYPE, "id", this.observeConversationModelIdSetPropertyChange, this);
        this.conversationModel.observe(ClearChange.CHANGE_TYPE, "", this.observeConversationModelClearChange, this);
        this.chatMessageStreamModel.observe(AddChange.CHANGE_TYPE, "chatMessageIdSet", this.observeChatMessageIdSetAddChange, this);
        this.chatMessageStreamModel.observe(RemoveChange.CHANGE_TYPE, "chatMessageIdSet", this.observeChatMessageIdSetRemoveChange, this);
        this.chatMessageStreamModel.observe(SetPropertyChange.CHANGE_TYPE, "chatMessageIdSet", this.observeChatMessageIdSetSetPropertyChange, this);
        this.initializeCommandSubscriptions();
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Object} data
     * @param {MeldDocument} chatMessageMeldDocument
     * @param {MeldDocument} senderUserMeldDocument
     */
    buildChatMessageModel: function(data, chatMessageMeldDocument, senderUserMeldDocument) {
        var chatMessageModel = this.chatMessageManagerModule.generateChatMessageModel(data, chatMessageMeldDocument, senderUserMeldDocument);
        if (!this.chatMessageIdToChatMessageModelMap.containsKey(chatMessageModel.getProperty("id")) && !this.chatMessageTryUuidToChatMessageModelMap.containsKey(chatMessageModel.getProperty("tryUuid"))) {
            this.chatMessageIdToChatMessageModelMap.put(chatMessageModel.getProperty("id"), chatMessageModel);
            this.chatMessageList.add(chatMessageModel);
        }
    },

    /**
     * @protected
     */
    clearChatMessageList: function() {
        this.chatMessageList.clear();
    },

    /**
     * @protected
     */
    deinitializeCommandSubscriptions: function() {
        this.commandModule.unsubscribe(CommandType.SUBMIT.CHAT_MESSAGE, this.handleSubmitChatMessageCommand, this);
    },

    /**
     * @protected
     */
    initializeCommandSubscriptions: function() {
        this.commandModule.subscribe(CommandType.SUBMIT.CHAT_MESSAGE, this.handleSubmitChatMessageCommand, this);
    },

    /**
     * @protected
     * @param {string} chatMessageId
     */
    loadChatMessage: function(chatMessageId) {
        var _this                       = this;
        var chatMessageMeldDocument     = null;
        var senderUserMeldDocument      = null;
        var senderUserId                = null;
        $series([
            $task(function(flow) {
                _this.chatMessageManagerModule.retrieveChatMessage(chatMessageId, function(throwable, retrievedChatMessageMeldDocument) {
                    if (!throwable) {
                        chatMessageMeldDocument = retrievedChatMessageMeldDocument;
                        senderUserId            = chatMessageMeldDocument.getData().senderUserId;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManagerModule.retrieveUser(senderUserId, function(throwable, retrievedSenderUserMeldDocument) {
                    if (!throwable) {
                        senderUserMeldDocument = retrievedSenderUserMeldDocument;
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                _this.buildChatMessageModel({
                    pending: false,
                    failed: false
                }, chatMessageMeldDocument, senderUserMeldDocument);
            }
        });
    },

    /**
     * @protected
     * @param {string} conversationId
     */
    loadChatMessageList: function(conversationId) {

        var _this                       = this;
        var chatMessageMeldDocumentSet  = new Set();
        var senderUserMeldDocumentMap   = new Map();
        var senderUserIdSet             = new Set();
        $series([
            $task(function(flow) {
               _this.chatMessageManagerModule.retrieveChatMessagesByConversationId(conversationId, function(throwable, retrievedChatMessageMeldDocumentMap) {
                    if (!throwable) {
                        retrievedChatMessageMeldDocumentMap.forEach(function(chatMessageMeldDocument, id) {
                            if (chatMessageMeldDocument) {
                                chatMessageMeldDocumentSet.add(chatMessageMeldDocument);
                                senderUserIdSet.add(chatMessageMeldDocument.getData().senderUserId);
                            } else {
                                //TODO BRN: Couldn't find this meld. Make a repeat call for it. If we can't find it again, log it to the server so we know there's a problem.
                            }
                        });
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManagerModule.retrieveUsers(senderUserIdSet.toArray(), function(throwable, userMeldDocumentMap) {
                    if (!throwable) {
                        userMeldDocumentMap.forEach(function(userMeldDocument, id) {
                            if (userMeldDocument) {
                                senderUserMeldDocumentMap.put(id, userMeldDocument);
                            } else {
                                //TODO BRN: Couldn't find this meld. Make a repeat call for it. If we can't find it again, log it to the server so we know there's a problem.
                            }
                        });
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                chatMessageMeldDocumentSet.forEach(function(chatMessageMeldDocument) {
                    var senderUserMeldDocument = senderUserMeldDocumentMap.get(chatMessageMeldDocument.getData().senderUserId);
                    _this.buildChatMessageModel({
                            pending: false,
                            failed: false
                        }, chatMessageMeldDocument, senderUserMeldDocument);
                });
            }
        });
    },

    /**
     * @protected
     * @param {string} conversationId
     */
    loadChatMessageStream: function(conversationId) {
        var _this                           = this;
        $series([
            $task(function(flow) {
                _this.chatMessageStreamManagerModule.retrieveChatMessageSteam(conversationId, function(throwable, chatMessageStreamMeldDocument) {
                    if (!throwable) {
                        _this.chatMessageStreamModel.setConversationChatMessageStreamMeldDocument(chatMessageStreamMeldDocument);
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (throwable) {
                console.error(throwable.message, throwable.stack);
            }
        });
    },

    /**
     * @protected
     * @param {string} chatMessageId
     */
    removeChatMessage: function(chatMessageId) {
        var chatMessageModel = this.chatMessageIdToChatMessageModelMap.get(chatMessageId);
        if (chatMessageModel) {
            this.chatMessageIdToChatMessageModelMap.remove(chatMessageId);
            this.chatMessageList.remove(chatMessageModel);
        }
    },

    /**
     * @protected
     * @param {*} chatMessageData
     */
    sendChatMessage: function(chatMessageData) {
        var _this = this;

        //TODO BRN: If the conversation hasn't loaded yet, then this id will not be available. Might need to figure out a way to wait for the conversation to be ready.

        var chatMessageObject = this.chatMessageManagerModule.generateChatMessageObject(Obj.merge({
            conversationId: this.conversationModel.getProperty("id"),
            sentAt: new Date().toString(),
            pending: true,
            failed: false
        }, chatMessageData));

        /** @type {ChatMessageModel} */
        var chatMessageModel = this.chatMessageManagerModule.generateChatMessageModel(chatMessageObject);
        this.chatMessageList.add(chatMessageModel);

        this.chatMessageTryUuidToChatMessageModelMap.put(chatMessageModel.getProperty("tryUuid"), chatMessageModel);

        /** @type {CurrentUser} */
        var currentUser             = undefined;
        /** @type {MeldDocument} */
        var chatMessageMeldDocument = undefined;

        $series([
            $task(function(flow) {
                _this.currentUserManagerModule.retrieveCurrentUser(function(throwable, retrievedCurrentUser) {
                    if (!throwable) {
                        currentUser = retrievedCurrentUser;
                    }
                    flow.complete(throwable);
                })
            }),
            $task(function(flow) {
                _this.chatMessageManagerModule.createChatMessage(chatMessageObject, function(throwable, createdChatMessageMeldDocument) {
                    if (!throwable) {
                        chatMessageMeldDocument = createdChatMessageMeldDocument;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                chatMessageModel.setChatMessageMeldDocument(chatMessageMeldDocument);
                chatMessageModel.setSenderUserMeldDocument(currentUser.getMeldDocument());
                chatMessageModel.setProperty("failed", false);
                chatMessageModel.setProperty("pending", false);
                flow.complete();
            })
        ]).execute(function(throwable) {
            if (throwable) {
                if (Class.doesExtend(throwable, RequestFailedException)) {
                    chatMessageModel.setProperty("failed", true);
                    chatMessageModel.setProperty("pending", false);
                } else {
                    console.log("ERROR - unhandled throwable:", throwable);
                }
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Message Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {PublisherMessage} message
     */
    handleSubmitChatMessageCommand: function(message) {
        var chatMessageObject = message.getData();
        this.sendChatMessage(chatMessageObject);
    },


    //-------------------------------------------------------------------------------
    // Model Observers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {AddChange} change
     */
    observeChatMessageIdSetAddChange: function(change) {
        this.loadChatMessage(change.getValue());
    },

    /**
     * @private
     * @param {RemoveChange} change
     */
    observeChatMessageIdSetRemoveChange: function(change) {
        this.removeChatMessage(change.getValue());
    },

    /**
     * @private
     * @param {SetPropertyChange} change
     */
    observeChatMessageIdSetSetPropertyChange: function(change) {
        var _this = this;
        if (Class.doesImplement(change.getPropertyValue(), ISet)) {
            change.getPropertyValue().forEach(function(chatMessageId) {
                _this.loadChatMessage(chatMessageId);
            });
        }
    },

    /**
     * @private
     * @param {ClearChange} change
     */
    observeConversationModelClearChange: function(change) {
        this.clearChatMessageList();
    },

    /**
     * @private
     * @param {SetPropertyChange} change
     */
    observeConversationModelIdSetPropertyChange: function(change) {
        this.clearChatMessageList();
        this.loadChatMessageList(change.getPropertyValue());
        this.loadChatMessageStream(change.getPropertyValue());
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatWidgetContainer).with(
    autowired().properties([
        property("chatMessageManagerModule").ref("chatMessageManagerModule"),
        property("chatMessageStreamManagerModule").ref("chatMessageStreamManagerModule"),
        property("commandModule").ref("commandModule"),
        property("currentUserManagerModule").ref("currentUserManagerModule"),
        property("userManagerModule").ref("userManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatWidgetContainer", ChatWidgetContainer);
