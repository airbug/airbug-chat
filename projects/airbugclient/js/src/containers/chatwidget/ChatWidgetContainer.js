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

//@Export('airbug.ChatWidgetContainer')

//@Require('AddChange')
//@Require('Class')
//@Require('ClearChange')
//@Require('ISet')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('ObservableList')
//@Require('RemoveChange')
//@Require('RemovePropertyChange')
//@Require('Set')
//@Require('SetPropertyChange')
//@Require('Throwable')
//@Require('airbug.BoxWithHeaderView')
//@Require('airbug.ChatMessageModel')
//@Require('airbug.ChatMessageStreamModel')
//@Require('airbug.ChatWidgetInputFormContainer')
//@Require('airbug.ChatWidgetMessagesContainer')
//@Require('airbug.ChatWidgetView')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageUploadModalContainer')
//@Require('airbug.IMessageHandler')
//@Require('airbug.ListContainer')
//@Require('airbug.MessagePartModel')
//@Require('airbug.MessagePartPreviewContainer')
//@Require('airbug.PanelView')
//@Require('bugcall.RequestFailedException')
//@Require('bugflow.BugFlow')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ModelBuilder')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var AddChange                       = bugpack.require('AddChange');
    var Class                           = bugpack.require('Class');
    var ClearChange                     = bugpack.require('ClearChange');
    var ISet                            = bugpack.require('ISet');
    var List                            = bugpack.require('List');
    var Map                             = bugpack.require('Map');
    var Obj                             = bugpack.require('Obj');
    var ObservableList                  = bugpack.require('ObservableList');
    var RemoveChange                    = bugpack.require('RemoveChange');
    var RemovePropertyChange            = bugpack.require('RemovePropertyChange');
    var Set                             = bugpack.require('Set');
    var SetPropertyChange               = bugpack.require('SetPropertyChange');
    var Throwable                       = bugpack.require('Throwable');
    var BoxWithHeaderView               = bugpack.require('airbug.BoxWithHeaderView');
    var ChatMessageModel                = bugpack.require('airbug.ChatMessageModel');
    var ChatMessageStreamModel          = bugpack.require('airbug.ChatMessageStreamModel');
    var ChatWidgetInputFormContainer    = bugpack.require('airbug.ChatWidgetInputFormContainer');
    var ChatWidgetMessagesContainer     = bugpack.require('airbug.ChatWidgetMessagesContainer');
    var ChatWidgetView                  = bugpack.require('airbug.ChatWidgetView');
    var CommandModule                   = bugpack.require('airbug.CommandModule');
    var ImageUploadModalContainer       = bugpack.require('airbug.ImageUploadModalContainer');
    var IMessageHandler                 = bugpack.require('airbug.IMessageHandler');
    var ListContainer                   = bugpack.require('airbug.ListContainer');
    var MessagePartModel                = bugpack.require('airbug.MessagePartModel');
    var MessagePartPreviewContainer     = bugpack.require('airbug.MessagePartPreviewContainer');
    var PanelView                       = bugpack.require('airbug.PanelView');
    var RequestFailedException          = bugpack.require('bugcall.RequestFailedException');
    var BugFlow                         = bugpack.require('bugflow.BugFlow');
    var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
    var ModelBuilder                    = bugpack.require('carapace.ModelBuilder');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                       = AutowiredAnnotation.autowired;
    var bugmeta                         = BugMeta.context();
    var CommandType                     = CommandModule.CommandType;
    var model                           = ModelBuilder.model;
    var property                        = PropertyAnnotation.property;
    var view                            = ViewBuilder.view;
    var $series                         = BugFlow.$series;
    var $task                           = BugFlow.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     * @implements {IMessageHandler}
     */
    var ChatWidgetContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.ChatWidgetContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ConversationModel} conversationModel
         */
        _constructor: function(conversationModel) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<string, ChatMessageModel>}
             */
            this.chatMessageIdToChatMessageModelMap         = new Map();

            /**
             * @private
             * @type {ObservableList.<ChatMessageModel>}
             */
            this.chatMessageList                            = new ObservableList();

            /**
             * @private
             * @type {Map.<string, ChatMessageModel>}
             */
            this.chatMessageTryUuidToChatMessageModelMap    = new Map();

            /**
             * @private
             * @type {boolean}
             */
            this.loadingPreviousMessages                    = false;

            /**
             * @private
             * @type {Logger}
             */
            this.logger                                     = null;


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
             * @type {MessagePartModel}
             */
            this.embeddedMessagePartModel                   = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ChatWidgetView}
             */
            this.chatWidgetView                             = null;

            /**
             * @private
             * @type {BoxWithHeaderView}
             */
            this.inputBoxView                               = null;

            /**
             * @private
             * @type {PanelView}
             */
            this.messagesPanelView                          = null;


            // Containers
            //-------------------------------------------------------------------------------

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

            /**
             * @private
             * @type {ImageUploadModalContainer}
             */
            this.imageUploadModalContainer                  = null;

            /**
             * @private
             * @type {MessagePartPreviewContainer}
             */
            this.messagePartPreviewContainer                = null;


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
             * @type {MessageHandlerModule}
             */
            this.messageHandlerModule                       = null;

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
            this.messageHandlerModule.registerMessageHandler(this);
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

            model(ChatMessageStreamModel)
                .name("chatMessageStreamModel")
                .build(this);

            model(MessagePartModel)
                .name("embeddedMessagePartModel")
                .build(this);


            // Create Views
            //-------------------------------------------------------------------------------

            view(ChatWidgetView)
                .name("chatWidgetView")
                .children([
                    view(PanelView)
                        .name("messagesPanelView")
                        .appendTo("#chat-widget-messages-{{cid}}"),
                    view(BoxWithHeaderView)
                        .name("inputBoxView")
                        .appendTo("#chat-widget-input-{{cid}}")
                        .attributes({
                            collapsed: true
                        })
                ])
                .build(this);


            // Wire Up
            //-------------------------------------------------------------------------------

            this.setViewTop(this.chatWidgetView);
            this.addModel(this.conversationModel);
            this.addModel(this.chatMessageStreamModel);
            this.addModel(this.embeddedMessagePartModel);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();
            this.chatWidgetMessagesContainer        = new ChatWidgetMessagesContainer(this.chatMessageList);
            this.addContainerChild(this.chatWidgetMessagesContainer, '#panel-body-' + this.messagesPanelView.getCid());
            this.chatWidgetInputFormContainer       = new ChatWidgetInputFormContainer(this.embeddedMessagePartModel);
            this.addContainerChild(this.chatWidgetInputFormContainer, "#box-header-" + this.inputBoxView.getCid());
            this.imageUploadModalContainer          = new ImageUploadModalContainer();
            this.addContainerChild(this.imageUploadModalContainer, "#chat-widget-modals-" + this.chatWidgetView.getCid());
            this.messagePartPreviewContainer = new MessagePartPreviewContainer(this.embeddedMessagePartModel);
            this.addContainerChild(this.messagePartPreviewContainer, "#box-body-" + this.inputBoxView.getCid())
        },

        /**
         * @protected
         * @param {Array<*>} routerArgs
         */
        deactivateContainer: function(routerArgs) {
            this._super(routerArgs);
            this.messageHandlerModule.deregisterMessageHandler(this);
        },

        /**
         * @protected
         */
        destroyContainer: function() {
            this._super();
            this.clearChatMessageList();
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
            this.embeddedMessagePartModel.unobserve(ClearChange.CHANGE_TYPE, "", this.observeMessagePartClearChange, this);
            this.embeddedMessagePartModel.unobserve(RemovePropertyChange.CHANGE_TYPE, "type", this.observeMessagePartTypeRemovePropertyChange, this);
            this.embeddedMessagePartModel.unobserve(SetPropertyChange.CHANGE_TYPE, "type", this.observeMessagePartTypeSetPropertyChange, this);
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
            this.embeddedMessagePartModel.observe(ClearChange.CHANGE_TYPE, "", this.observeMessagePartClearChange, this);
            this.embeddedMessagePartModel.observe(RemovePropertyChange.CHANGE_TYPE, "type", this.observeMessagePartTypeRemovePropertyChange, this);
            this.embeddedMessagePartModel.observe(SetPropertyChange.CHANGE_TYPE, "type", this.observeMessagePartTypeSetPropertyChange, this);
        },


        //-------------------------------------------------------------------------------
        // IMessageHandler Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        doesSupportEmbed: function() {
            return true;
        },

        /**
         * @return {boolean}
         */
        doesSupportSend: function() {
            return true;
        },

        /**
         * @param {*} messagePartObject
         */
        embedMessagePart: function(messagePartObject) {
            this.embeddedMessagePartModel.setProperties(messagePartObject);
        },

        /**
         * @param {*} messageObject
         */
        sendMessage: function(messageObject) {
            this.sendChatMessage(messageObject);
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {Object} data
         * @param {MeldDocument} chatMessageMeldDocument
         * @param {MeldDocument} senderUserMeldDocument
         * @return {ChatMessageModel}
         */
        buildChatMessageModel: function(data, chatMessageMeldDocument, senderUserMeldDocument) {
            return model(ChatMessageModel)
                .args([
                    data,
                    chatMessageMeldDocument,
                    senderUserMeldDocument
                ])
                .build();
        },

        /**
         * @protected
         * @param {Object} data
         * @param {MeldDocument} chatMessageMeldDocument
         * @param {MeldDocument} senderUserMeldDocument
         */
        buildAndAppendChatMessageModel: function(data, chatMessageMeldDocument, senderUserMeldDocument) {
            var chatMessageModel = this.buildChatMessageModel(data, chatMessageMeldDocument, senderUserMeldDocument);
            this.appendChatMessageModel(chatMessageModel);
        },

        /**
         * @protected
         * @param {ChatMessageModel} chatMessageModel
         */
        appendChatMessageModel: function(chatMessageModel) {
            if (!this.chatMessageIdToChatMessageModelMap.containsKey(chatMessageModel.getProperty("id")) && !this.chatMessageTryUuidToChatMessageModelMap.containsKey(chatMessageModel.getProperty("tryUuid"))) {
                this.chatMessageIdToChatMessageModelMap.put(chatMessageModel.getProperty("id"), chatMessageModel);
                this.chatMessageList.add(chatMessageModel);
                this.addModel(chatMessageModel);
            }
        },

        /**
         * @protected
         * @param {ChatMessageModel} chatMessageModel
         */
        prependChatMessageModel: function(chatMessageModel) {
            if (!this.chatMessageIdToChatMessageModelMap.containsKey(chatMessageModel.getProperty("id")) && !this.chatMessageTryUuidToChatMessageModelMap.containsKey(chatMessageModel.getProperty("tryUuid"))) {
                this.chatMessageIdToChatMessageModelMap.put(chatMessageModel.getProperty("id"), chatMessageModel);
                this.chatMessageList.addAt(0, chatMessageModel);
                this.addModel(chatMessageModel);
            }
        },

        /**
         * @protected
         * @param {List.<ChatMessageModel>} chatMessageModels
         */
        prependChatMessageModels: function(chatMessageModels) {
            var _this = this;
            for(var i = chatMessageModels.getCount() - 1; i >= 0; i--){
                var chatMessageModel = chatMessageModels.getAt(i);
                _this.prependChatMessageModel(chatMessageModel);
            }
        },

        /**
         * @protected
         */
        clearChatMessageList: function() {
            var _this = this;
            this.chatMessageList.forEach(function(chatMessageModel) {
                _this.removeModel(chatMessageModel);
            });
            this.chatMessageList.clear();
            this.chatMessageIdToChatMessageModelMap.clear();
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
                    _this.buildAndAppendChatMessageModel({
                        pending: false,
                        failed: false
                    }, chatMessageMeldDocument, senderUserMeldDocument);
                }
            });
        },

        /**
         * @private
         * @param {function(Throwable=)} callback
         */
        loadPreviousChatMessageBatch: function(callback) {
            var _this                       = this;
            var conversationId              = this.conversationModel.getProperty("id");
            var chatMessageMeldDocumentList = new List();
            var senderUserMeldDocumentMap   = new Map();
            var senderUserIdSet             = new Set();

            if(!conversationId) {
                callback(new Throwable("Missing data", {}, "conversationId is undefined", []));
            } else {
                this.chatWidgetMessagesContainer.showPreviousMessagesLoader();
                $series([
                    $task(function(flow) {
                        var topChatMessageModel = _this.chatMessageList.getAt(0);
                        var index = topChatMessageModel.getProperty("index");
                        _this.chatMessageManagerModule.retrieveChatMessageBatchByConversationId(conversationId, index, function(throwable, retrievedChatMessageMeldDocumentList) {
                            if (!throwable) {
                                retrievedChatMessageMeldDocumentList.forEach(function(chatMessageMeldDocument) {
                                    if (chatMessageMeldDocument) {
                                        chatMessageMeldDocumentList.add(chatMessageMeldDocument);
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
                    _this.chatWidgetMessagesContainer.hidePreviousMessagesLoader();
                    if (!throwable) {
                        var chatMessageModels = new List();
                        chatMessageMeldDocumentList.forEach(function(chatMessageMeldDocument) {
                            var senderUserMeldDocument = senderUserMeldDocumentMap.get(chatMessageMeldDocument.getData().senderUserId);
                            var chatMessageModel = _this.buildChatMessageModel({
                                pending: false,
                                failed: false
                            }, chatMessageMeldDocument, senderUserMeldDocument);

                            chatMessageModels.add(chatMessageModel);
                        });
                        _this.prependChatMessageModels(chatMessageModels);
                        callback();
                    } else {
                        callback(throwable);
                    }
                });
            }
        },

        /**
         * @protected
         * @param {string} conversationId
         */
        loadChatMessageList: function(conversationId) {
            var _this                       = this;
            var chatMessageMeldDocumentList = new List();
            var senderUserMeldDocumentMap   = new Map();
            var senderUserIdSet             = new Set();
            $series([
                $task(function(flow) {
                    var index = -1;
                   _this.chatMessageManagerModule.retrieveChatMessageBatchByConversationId(conversationId, index, function(throwable, retrievedChatMessageMeldDocumentList) {
                        if (!throwable) {
                            retrievedChatMessageMeldDocumentList.forEach(function(chatMessageMeldDocument) {
                                if (chatMessageMeldDocument) {
                                    chatMessageMeldDocumentList.add(chatMessageMeldDocument);
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
                    _this.chatWidgetMessagesContainer.hideLoader();
                    if (chatMessageMeldDocumentList.getCount() > 0) {
                        chatMessageMeldDocumentList.forEach(function(chatMessageMeldDocument) {
                            var senderUserMeldDocument = senderUserMeldDocumentMap.get(chatMessageMeldDocument.getData().senderUserId);
                            _this.buildAndAppendChatMessageModel({
                                    pending: false,
                                    failed: false
                                }, chatMessageMeldDocument, senderUserMeldDocument);
                        });
                    } else {
                        _this.chatWidgetMessagesContainer.showPlaceholder();
                    }
                    _this.startScrollStateListener();
                } else {
                    _this.logger.error(throwable);
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
                    _this.chatMessageStreamManagerModule.retrieveChatMessageStream(conversationId, function(throwable, chatMessageStreamMeldDocument) {
                        if (!throwable) {
                            _this.chatMessageStreamModel.setConversationChatMessageStreamMeldDocument(chatMessageStreamMeldDocument);
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (throwable) {
                    _this.logger.error(throwable.message, throwable.stack);
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
                this.removeModel(chatMessageModel);
            }
        },

        /**
         * @protected
         * @param {*} chatMessageData
         */
        sendChatMessage: function(chatMessageData) {
            var _this = this;

            //TODO BRN: If the conversation hasn't loaded yet, then this id will not be available. Might need to figure out a way to wait for the conversation to be ready.

            var chatMessageObject = this.chatMessageManagerModule.generateMessageObject(Obj.merge({
                conversationId: this.conversationModel.getProperty("id"),
                sentAt: new Date(),
                pending: true,
                failed: false
            }, chatMessageData));

            /** @type {ChatMessageModel} */
            var chatMessageModel =
                model(ChatMessageModel)
                    .data(chatMessageObject)
                    .build(this);
            this.chatMessageList.add(chatMessageModel);
            this.chatMessageTryUuidToChatMessageModelMap.put(chatMessageModel.getProperty("tryUuid"), chatMessageModel);

            // Animate to the new ChatMessage
            this.chatWidgetMessagesContainer.animateScrollToCarapaceModel(chatMessageModel, 600);

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
                        _this.logger.error(throwable);
                    }
                }
            });
        },

        /**
         * @protected
         */
        tryLoadPreviousMessages: function() {
            var _this = this;
            if (this.hasReachedLastMessage()) {
                return;
            }
            if (!this.loadingPreviousMessages) {
                this.loadingPreviousMessages = true;
                var lastChatMessageModel = null;
                if (this.chatMessageList.getCount() > 0) {
                    lastChatMessageModel     = this.chatMessageList.getAt(0);
                }
                this.loadPreviousChatMessageBatch(function(throwable) {
                    if (!throwable) {
                        _this.logger.info("finished loading previous chat message batch");
                        if (lastChatMessageModel) {
                            _this.chatWidgetMessagesContainer.scrollToCarapaceModel(lastChatMessageModel);
                        }
                    } else {
                        _this.logger.error(throwable);
                    }
                    _this.loadingPreviousMessages = false;
                });
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @return {boolean}
         */
        hasReachedLastMessage: function() {
            if (this.chatMessageList.getCount() > 0) {
                var topChatMessageModel = this.chatMessageList.getAt(0);
                var index = topChatMessageModel.getProperty("index");
                return (index <= 1);
            }
            return true;
        },

        /**
         * @private
         */
        startScrollStateListener: function() {
            this.chatWidgetMessagesContainer.addEventListener(ListContainer.EventTypes.SCROLL_STATE_CHANGE, this.hearScrollStateChange, this);
        },

        /**
         * @private
         */
        stopScrollStateListener: function() {
            this.chatWidgetMessagesContainer.removeEventListener(ListContainer.EventTypes.SCROLL_STATE_CHANGE, this.hearScrollStateChange, this);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearScrollStateChange: function(event) {
            var _this           = this;
            if (event.getData().scrollState === ListContainer.ScrollState.TOP) {
                this.tryLoadPreviousMessages();
            }
        },


        //-------------------------------------------------------------------------------
        // Model Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeChatMessageIdSetAddChange: function(observation) {
            var change = /** @type {AddChange} */(observation.getChange());
            this.loadChatMessage(change.getValue());
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeChatMessageIdSetRemoveChange: function(observation) {
            var change = /** @type {RemoveChange} */(observation.getChange());
            this.removeChatMessage(change.getValue());
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeChatMessageIdSetSetPropertyChange: function(observation) {
            var _this   = this;
            var change  = /** @type {SetPropertyChange} */(observation.getChange());
            if (Class.doesImplement(change.getPropertyValue(), ISet)) {
                change.getPropertyValue().forEach(function(chatMessageId) {
                    _this.loadChatMessage(chatMessageId);
                });
            }
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeConversationModelClearChange: function(observation) {
            this.clearChatMessageList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeConversationModelIdSetPropertyChange: function(observation) {
            var change = /** @type {SetPropertyChange} */(observation.getChange());
            this.clearChatMessageList();
            this.loadChatMessageList(change.getPropertyValue());
            this.loadChatMessageStream(change.getPropertyValue());
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeMessagePartClearChange: function(observation) {
            this.inputBoxView.collapse();
            this.chatWidgetView.setAttribute("inputSize", ChatWidgetView.InputSize.SMALL);
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeMessagePartTypeRemovePropertyChange: function(observation) {
            this.inputBoxView.collapse();
            this.chatWidgetView.setAttribute("inputSize", ChatWidgetView.InputSize.SMALL);
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeMessagePartTypeSetPropertyChange: function(observation) {
            this.chatWidgetView.setAttribute("inputSize", ChatWidgetView.InputSize.LARGE);
            this.inputBoxView.uncollapse();
            this.messagePartPreviewContainer.forceReflow();
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(ChatWidgetContainer, IMessageHandler);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(ChatWidgetContainer).with(
        autowired().properties([
            property("chatMessageManagerModule").ref("chatMessageManagerModule"),
            property("chatMessageStreamManagerModule").ref("chatMessageStreamManagerModule"),
            property("commandModule").ref("commandModule"),
            property("currentUserManagerModule").ref("currentUserManagerModule"),
            property("logger").ref("logger"),
            property("messageHandlerModule").ref("messageHandlerModule"),
            property("userManagerModule").ref("userManagerModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ChatWidgetContainer", ChatWidgetContainer);
});
