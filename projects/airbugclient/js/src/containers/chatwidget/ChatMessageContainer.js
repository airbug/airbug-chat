//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChatMessageContainer')

//@Require('AddChange')
//@Require('Bug')
//@Require('Class')
//@Require('ClearChange')
//@Require('Map')
//@Require('ObservableList')
//@Require('RemoveChange')
//@Require('RemovePropertyChange')
//@Require('SetPropertyChange')
//@Require('TypeUtil')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.ChatMessageTinkerButtonContainer')
//@Require('airbug.ChatMessageView')
//@Require('airbug.CommandModule')
//@Require('airbug.ImageViewEvent')
//@Require('airbug.ListItemView')
//@Require('airbug.MessagePartCodeView')
//@Require('airbug.MessagePartImageView')
//@Require('airbug.MessagePartModel')
//@Require('airbug.MessagePartTextView')
//@Require('airbug.PanelView')
//@Require('bugcall.RequestFailedException')
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

    var AddChange                           = bugpack.require('AddChange');
    var Bug                                 = bugpack.require('Bug');
    var Class                               = bugpack.require('Class');
    var ClearChange                         = bugpack.require('ClearChange');
    var Map                                 = bugpack.require('Map');
    var ObservableList                      = bugpack.require('ObservableList');
    var RemoveChange                        = bugpack.require('RemoveChange');
    var RemovePropertyChange                = bugpack.require('RemovePropertyChange');
    var SetPropertyChange                   = bugpack.require('SetPropertyChange');
    var TypeUtil                            = bugpack.require('TypeUtil');
    var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
    var ChatMessageTinkerButtonContainer    = bugpack.require('airbug.ChatMessageTinkerButtonContainer');
    var ChatMessageView                     = bugpack.require('airbug.ChatMessageView');
    var CommandModule                       = bugpack.require('airbug.CommandModule');
    var ImageViewEvent                      = bugpack.require('airbug.ImageViewEvent');
    var ListItemView                        = bugpack.require('airbug.ListItemView');
    var MessagePartCodeView                 = bugpack.require('airbug.MessagePartCodeView');
    var MessagePartImageView                = bugpack.require('airbug.MessagePartImageView');
    var MessagePartModel                    = bugpack.require('airbug.MessagePartModel');
    var MessagePartTextView                 = bugpack.require('airbug.MessagePartTextView');
    var PanelView                           = bugpack.require('airbug.PanelView');
    var RequestFailedException              = bugpack.require('bugcall.RequestFailedException');
    var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
    var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var CarapaceContainer                   = bugpack.require('carapace.CarapaceContainer');
    var ModelBuilder                        = bugpack.require('carapace.ModelBuilder');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredAnnotation.autowired;
    var bugmeta                             = BugMeta.context();
    var CommandType                         = CommandModule.CommandType;
    var model                               = ModelBuilder.model;
    var property                            = PropertyAnnotation.property;
    var view                                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {CarapaceContainer}
     */
    var ChatMessageContainer = Class.extend(CarapaceContainer, {

        _name: "airbug.ChatMessageContainer'",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ChatMessageModel} chatMessageModel
         */
        _constructor: function(chatMessageModel) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ObservableList.<MessagePartModel>}
             */
            this.messagePartList                        = new ObservableList();

            /**
             * @private
             * @type {Map.<MessagePartModel, MessagePartView>}
             */
            this.messagePartModelToMessagePartViewMap   = new Map();


            // Models
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ChatMessageModel}
             */
            this.chatMessageModel                       = chatMessageModel;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ChatMessageView}
             */
            this.chatMessageView                        = null;

            /**
             * @private
             * @type {ListItemView}
             */
            this.listItemView                           = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ChatMessageTinkerButtonContainer}
             */
            this.chatMessageTinkerButtonContainer       = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ChatMessageManagerModule}
             */
            this.chatMessageManagerModule               = null;

            /**
             * @private
             * @type {CommandModule}
             */
            this.commandModule                          = null;

            /**
             * @private
             * @type {UserManagerModule}
             */
            this.userManagerModule                      = null;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @returns {ChatMessageModel}
         */
        getChatMessageModel: function() {
            return this.chatMessageModel;
        },

        /**
         * @returns {ChatMessageView}
         */
        getChatMessageView: function() {
            return this.chatMessageView;
        },

        /**
         * @returns {ListItemView}
         */
        getListItemView: function() {
            return this.listItemView;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            view(ListItemView)
                .name("listItemView")
                .model(this.chatMessageModel)
                .attributes({
                    size: "flex"
                })
                .children([
                    view(ChatMessageView)
                        .name("chatMessageView")
                        .model(this.chatMessageModel)
                ])
                .build(this);

            var messageBody = this.chatMessageModel.getProperty("body");
            if (messageBody) {
                this.createMessageBody(messageBody);
            }

            // Wire Up
            //-------------------------------------------------------------------------------

            this.setViewTop(this.listItemView);
            this.addModel(this.chatMessageModel);
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            var type = this.chatMessageModel.getProperty("type");

            //TODO BRN: This will no longer work since all message types are "multi-part"
            if (type === "code") {
                this.chatMessageTinkerButtonContainer = new ChatMessageTinkerButtonContainer();
                this.addContainerChild(this.chatMessageTinkerButtonContainer, ".message-controls");
            }
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.chatMessageView.$el.find(".message-failed-false, .message-failed-true").off();
            this.getViewTop().removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleChatMessageTinker, this);
            this.chatMessageView.removeEventListener(ImageViewEvent.EventType.CLICKED_SAVE, this.handleSaveImageToListButtonClickedEvent, this);

            //TODO BRN: Should listen for changes to body.parts array (need to add observable parts for arrays)

            this.chatMessageModel.unobserve(ClearChange.CHANGE_TYPE, "", this.observeChatMessageClearChange, this);
            this.chatMessageModel.unobserve(SetPropertyChange.CHANGE_TYPE, "body", this.observeChatMessageBodySetPropertyChange, this);
            this.chatMessageModel.unobserve(RemovePropertyChange.CHANGE_TYPE, "body", this.observeChatMessageBodyRemovePropertyChange, this);

            this.messagePartList.unobserve(AddChange.CHANGE_TYPE, "", this.observeMessagePartListAdd, this);
            this.messagePartList.unobserve(ClearChange.CHANGE_TYPE, "", this.observeMessagePartListClear, this);
            this.messagePartList.unobserve(RemoveChange.CHANGE_TYPE, "", this.observeMessagePartListRemove, this);
        },

        /**
         * @protected
         */
        destroyContainer: function() {
            this._super();
            this.clearMessagePartList();
            this.destroyAllMessagePartViews();
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            var _this = this;

            //TODO BRN: This is super hacky. Should not be using classes like this to listen for events since we can't
            // guarantee that the classes will still be there if the message is successful. Fix this...

            this.chatMessageView.$el.find(".message-failed-false, .message-failed-true")
                .on("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log("firing chatMessage retry click event");
                    _this.handleChatMessageRetry();
                    return false;
                });
            this.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleChatMessageTinker, this);
            this.chatMessageView.addEventListener(ImageViewEvent.EventType.CLICKED_SAVE, this.handleSaveImageToListButtonClickedEvent, this);

            //TODO BRN: Add observers to the model body.parts
            this.chatMessageModel.observe(ClearChange.CHANGE_TYPE, "", this.observeChatMessageClearChange, this);
            this.chatMessageModel.observe(SetPropertyChange.CHANGE_TYPE, "body", this.observeChatMessageBodySetPropertyChange, this);
            this.chatMessageModel.observe(RemovePropertyChange.CHANGE_TYPE, "body", this.observeChatMessageBodyRemovePropertyChange, this);

            this.messagePartList.observe(AddChange.CHANGE_TYPE, "", this.observeMessagePartListAdd, this);
            this.messagePartList.observe(ClearChange.CHANGE_TYPE, "", this.observeMessagePartListClear, this);
            this.messagePartList.observe(RemoveChange.CHANGE_TYPE, "", this.observeMessagePartListRemove, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Object} messagePart
         */
        buildMessagePartModel: function(messagePart) {
            var messagePartModel    =
                model(MessagePartModel)
                    .data(messagePart)
                    .build(this);
            this.messagePartList.add(messagePartModel);
        },

        /**
         * @private
         * @param {MessagePartModel} messagePartModel
         */
        buildMessagePartView: function(messagePartModel) {
            var messagePartView     = null;
            switch (messagePartModel.getProperty("type")) {
                case "code":
                    messagePartView =
                        view(MessagePartCodeView)
                            .model(messagePartModel)
                            .build();
                    break;
                case "image":
                    messagePartView =
                        view(MessagePartImageView)
                            .model(messagePartModel)
                            .build();
                    break;
                case "text":
                    messagePartView =
                        view(MessagePartTextView)
                            .model(messagePartModel)
                            .build();
                    break;
                default:
                    throw new Bug("UnsupportedMessagePart", {}, "Unsupported message part type '" + messagePartModel.getProperty("type") + "'");
            }
            this.chatMessageView.addViewChild(messagePartView, "#message-body-{{cid}}");
            this.messagePartModelToMessagePartViewMap.put(messagePartModel, messagePartView);
        },

        /**
         * @private
         */
        clearMessagePartList: function() {
            var _this = this;
            this.messagePartList.forEach(function(roomMemberModel) {
                _this.removeModel(roomMemberModel);
            });
            this.messagePartList.clear();
        },

        /**
         * @private
         * @param {{
         *      parts: Array.<Object>
         * }} messageBody
         */
        createMessageBody: function(messageBody) {
            this.processMessageBody(messageBody);
            this.processMessagePartList();
        },

        /**
         * @private
         */
        destroyAllMessagePartViews: function() {
            var _this = this;
            this.messagePartModelToMessagePartViewMap.forEach(function(messagePartView) {
                _this.chatMessageView.removeViewChild(messagePartView);
                messagePartView.destroy();
            });
            this.messagePartModelToMessagePartViewMap.clear();
        },

        /**
         * @private
         * @param {MessagePartModel} messagePartModel
         */
        destroyMessagePartView: function(messagePartModel) {
            var messagePartView = this.messagePartModelToMessagePartViewMap.remove(messagePartModel);
            if (messagePartView) {
                this.chatMessageView.removeViewChild(messagePartView);
                messagePartView.destroy();
            }
        },

        /**
         * @private
         * @param {{
         *      parts: Array.<Object>
         * }} messageBody
         */
        processMessageBody: function(messageBody) {
            var _this = this;
            if (TypeUtil.isArray(messageBody.parts)) {
                messageBody.parts.forEach(function(messagePart) {
                    _this.buildMessagePartModel(messagePart);
                });
            }
        },

        /**
         * @private
         */
        processMessagePartList: function() {
            var _this = this;
            this.messagePartList.forEach(function(messagePartModel) {
                _this.buildMessagePartView(messagePartModel);
            });
        },


        //-------------------------------------------------------------------------------
        // Model Event Handlers
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        handleChatMessageRetry: function() {

            //TODO BRN: This retry handling should actually be sent off to the message processor and not created here
            //TODO BRN: This retry needs to be fixed. Doesn't seem like a good idea to store the data we want to send in the model.

            var _this               = this;
            var chatMessageModel    = this.chatMessageModel;

            //TODO BRN: This needs to figure out the type of chat message


            var chatMessage         = this.chatMessageManagerModule.generateMessageObject(chatMessageModel.toLiteral());

            //TODO BRN: Rework this to use BugFlow
            this.chatMessageManagerModule.createChatMessage(chatMessage, function(throwable, chatMessageMeldDocument) {
                if (!throwable) {
                    chatMessageModel.setProperties({
                        pending: false,
                        failed: false
                    });
                    _this.userManagerModule.retrieveUser(chatMessageModel.getProperty("senderUserId"), function(throwable, userMeldDocument) {
                        if (!throwable) {

                            //NOTE BRN: We want to set both of these at the same time so that we don't do a partial update of the message display

                            chatMessageModel.setChatMessageMeldDocument(chatMessageMeldDocument);
                            chatMessageModel.setSenderUserMeldDocument(userMeldDocument)
                        } else {
                            if (Class.doesExtend(throwable, RequestFailedException)) {

                                //TODO BRN: Need to add a retry mechanism here for loading the user

                                console.error(throwable);
                            } else {
                                console.error(throwable);
                            }
                        }
                    });
                } else {
                    if (Class.doesExtend(throwable, RequestFailedException)) {
                        chatMessageModel.setProperties({
                            failed: true, pending: false
                        });
                    } else {
                        console.error(throwable);
                    }
                }
            });
        },

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        handleChatMessageTinker: function(event) {
            console.log("handleChatMessageTinker");
            if (this.chatMessageModel.getProperty("type") === "code") {
                var code = this.chatMessageModel.getProperty("code");
                var codeLanguage = this.getChatMessageModel().getProperty("codeLanguage");
                this.commandModule.relayCommand(CommandType.DISPLAY.CODE_EDITOR, {});
                this.commandModule.relayCommand(CommandType.CODE_EDITOR.SET_MODE, {mode: "ace/mode/" + codeLanguage});
                this.commandModule.relayCommand(CommandType.DISPLAY.CODE, {code: code});
                //TODO Future Feature Figure out a way to remember the reference to the original chatMessage
                //Display Code command will overwrite whatever is currently inside the ace editor
                //May want to provide a warning or option to create a new code editor tab/workspace
                //Or at least explain it in the demo video
            }
        },

        /**
         * @private
         * @param {ImageViewEvent} event
         */
        handleSaveImageToListButtonClickedEvent: function(event) {
            var data            = event.getData();
            var assetId         = data.assetId;
            this.commandModule.relayCommand(CommandType.SAVE.TO_IMAGE_LIST, {assetId: assetId});
        },


        //-------------------------------------------------------------------------------
        // Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeChatMessageClearChange: function(observation) {
            this.clearMessagePartList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeChatMessageBodyRemovePropertyChange: function(observation) {
            this.clearMessagePartList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeChatMessageBodySetPropertyChange: function(observation) {
            var change = /** @type {SetPropertyChange} */(observation.getChange());
            this.clearMessagePartList();
            if (change.getPropertyValue()) {
                this.processMessageBody(change.getPropertyValue());
            }
        },


        // MessagePartList Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeMessagePartListAdd: function(observation) {
            var change  = /** @type {AddChange} */(observation.getChange());
            var model   = change.getValue();
            this.buildMessagePartView(model);
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeMessagePartListClear: function(observation) {
            this.destroyAllMessagePartViews();
            this.messagePartModelToMessagePartViewMap.clear();
            this.processMessagePartList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeMessagePartListRemove: function(observation) {
            var change  = /** @type {RemoveChange} */(observation.getChange());
            var model   = change.getValue();
            this.destroyMessagePartView(model);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(ChatMessageContainer).with(
        autowired().properties([
            property("chatMessageManagerModule").ref("chatMessageManagerModule"),
            property("userManagerModule").ref("userManagerModule"),
            property("commandModule").ref("commandModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ChatMessageContainer", ChatMessageContainer);
});
