//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.ChatMessageReplyButtonContainer')
//@Require('airbug.ChatMessageView')
//@Require('airbug.CommandModule')
//@Require('airbug.ListItemView')
//@Require('airbug.PanelView')
//@Require('bugcall.RequestFailedException')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ButtonViewEvent                 = bugpack.require('airbug.ButtonViewEvent');
var ChatMessageReplyButtonContainer = bugpack.require('airbug.ChatMessageReplyButtonContainer');
var ChatMessageView                 = bugpack.require('airbug.ChatMessageView');
var CommandModule                   = bugpack.require('airbug.CommandModule');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var PanelView                       = bugpack.require('airbug.PanelView');
var RequestFailedException          = bugpack.require('bugcall.RequestFailedException');
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


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(chatMessageModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageModel}
         */
        this.chatMessageModel           = chatMessageModel;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageView}
         */
        this.chatMessageView            = null;

        /**
         * @private
         * @type {ListItemView}
         */
        this.listItemView               = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManagerModule}
         */
        this.chatMessageManagerModule   = null;

        /**
         * @private
         * @type {CommandModule}
         */
        this.commandModule              = null;

        /**
         * @private
         * @type {UserManagerModule}
         */
        this.userManagerModule          = null;
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
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        var codeBlock = this.chatMessageView.$el.find("pre").get()[0];
        hljs.highlightBlock(codeBlock);
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.listItemView =
            view(ListItemView)
                .model(this.chatMessageModel)
                .attributes({size: "flex"})
                .children([
                    view(ChatMessageView)
                        .id("chatMessageView")
                        .model(this.chatMessageModel)
                ])
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.listItemView);
        this.chatMessageView = this.findViewById("chatMessageView");
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        var type = this.chatMessageModel.getProperty("type");
        if (type === "code") {
            this.chatMessageReplyButton = new ChatMessageReplyButtonContainer();
            this.addContainerChild(this.chatMessageReplyButton, ".message-controls");
        }
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        var _this = this;
        this._super();
        this.chatMessageView.$el.find(".message-failed-false, .message-failed-true")
            .on("click", function(event) {
                event.preventDefault();
                event.stopPropagation();
                console.log("firing chatMessage retry click event");
                _this.handleChatMessageRetry();
                return false;
            });
        this.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleChatMessageReply, this);
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    handleChatMessageRetry: function() {

        //TODO BRN: This retry needs to be fixed. Doesn't seem like a good idea to store the data we want to send in the model.

        var _this               = this;
        var chatMessageModel    = this.chatMessageModel;

        //TODO BRN: This needs to figure out the type of chat message


        var chatMessage         = this.chatMessageManagerModule.generateChatMessageObject(chatMessageModel.toLiteral());

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
    handleChatMessageReply: function(event) {
        var chatMessageId = this.chatMessageModel.getProperty("id");
        if (this.chatMessageModel.getProperty("type") === "code") {
            var code = this.chatMessageModel.getProperty("code");
            this.commandModule.relayCommand(CommandType.DISPLAY.CODE_EDITOR, {});
            this.commandModule.relayCommand(CommandType.DISPLAY.CODE, {code: code});
            //TODO Future Feature Figure out a way to remember the reference to the original chatMessage
            //Diplay Code command will overwrite whatever is currently inside the ace editor
            //May want to provide a warning or option to create a new code editor tab/workspace
            //Or at least explain it in the demo video
        }
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