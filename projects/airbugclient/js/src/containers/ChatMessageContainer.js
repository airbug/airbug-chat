//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageContainer')

//@Require('Class')
//@Require('airbug.ChatMessageCollection')
//@Require('airbug.ChatMessageView')
//@Require('airbug.ListItemView')
//@Require('airbug.PanelView')
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
var ChatMessageCollection           = bugpack.require('airbug.ChatMessageCollection');
var ChatMessageView                 = bugpack.require('airbug.ChatMessageView');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var PanelView                       = bugpack.require('airbug.PanelView');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired   = AutowiredAnnotation.autowired;
var bugmeta     = BugMeta.context();
var CommandType = CommandModule.CommandType;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


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
         * @type {airbug.ChatMessageModel}
         */
        this.chatMessageModel           = chatMessageModel;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.ListItemView}
         */
        this.chatMessageView            = null;

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.ChatMessageManagerModule}
         */
        this.chatMessageManagerModule   = null;

        /**
         * @private
         * @type {airbug.CommandModule}
         */
        this.commandModule              = null;

        /**
         * @private
         * @type {airbug.UserManagerModule}
         */
        this.userManagerModule          = null;

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

        this.chatMessageView =
            view(ListItemView)
                .model(this.chatMessageModel)
                .attributes({size: "flex"})
                .children([
                    view(ChatMessageView)
                        .model(this.chatMessageModel)
                ])
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.chatMessageView);
    },

    /**
     * @protected
     */
    createContainerChildren: function(){
        this._super();

    },

    /**
     * @protected
     */
    initializeContainer: function() {
        var _this = this;
        this._super();
        this.chatMessageView.$el.find(".message-failed-false, .message-failed-true")
            .on("click", function(event){
                event.preventDefault();
                event.stopPropagation();
                console.log("firing chatMessage retry click event");
                _this.handleChatMessageRetry()
                // _this.chatMessageView.dispatchEvent(new Event("retry", _this.chatMessageModel.toJSON()));
                return false;
            });
        this.viewTop.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleChatMessageReply, this);
    },

    /**
     * @protected
     */
    createContainerChildren: function(){
        var type = this.chatMessageModel.get("type");
        if(type === "code"){
            this.chatMessageReplyButton = new ChatMessageReplyButtonContainer();
            this.addContainerChild(this.chatMessageReplyButton, ".message-controls")
        }
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    handleChatMessageRetry: function(){
        console.log("Inside ChatMessageContainer#handleRetry");
        var _this               = this;
        var chatMessageModel    = this.chatMessageModel;
        var chatMessage         = chatMessageModel.toJSON();
        chatMessage.retry       = true;

        this.chatMessageManagerModule.createChatMessage(chatMessage, function(error, chatMessageMeldObj){
            console.log("Inside ChatWidgetContainer#handleChatMessageRetry callback");
            console.log("error:", error, "chatMessageMeldObj:", chatMessageMeldObj);
            if(!error && chatMessageMeldObj){
                chatMessageModel.setMeldObject(chatMessageMeldObj);
                var chatMessageObj      = chatMessageMeldObj.generateObject();
                chatMessageObj.pending  = false;
                chatMessageObj.failed   = false;
                chatMessageModel.set(chatMessageObj);
                _this.userManagerModule.retrieveUser(chatMessageObj.senderUserId, function(error, senderMeldObj){
                    if(!error && senderMeldObj){
                        var sender = senderMeldObj.generateObject();
                        chatMessageObj.sentBy   = sender.firstName + sender.lastName;
                        chatMessageModel.set(chatMessageObj);
                    } else {
                        //NOTE if this error occurs it is an unforseeable edge case
                        //TODO error handling
                        //TODO error tracking
                        //Retry to get sender information which should be self
                    }
                });
            } else{
                chatMessageModel.set({failed: true, pending: false});
        });
    },

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    handleChatMessageReply: function(event){
        var chatMessageId = this.chatMessageModel.get("_id");
        if(this.chatMessageModel.get("type") === code){
            var code = chatMessageModel.get("code");
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
