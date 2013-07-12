//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatMessageContainer')

//@Require('Class')
//@Require('airbug.ChatMessageCollection')
//@Require('airbug.ChatMessageModel')
//@Require('airbug.ListView')
//@Require('airbug.ListItemView')
//@Require('airbug.MessageView')
//@Require('airbug.PanelView')
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
var ChatMessageModel                = bugpack.require('airbug.ChatMessageModel');
var ListView                        = bugpack.require('airbug.ListView');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var MessageView                     = bugpack.require('airbug.MessageView');
var PanelView                       = bugpack.require('airbug.PanelView');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


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

        this.chatMessageModel           = chatMessageModel;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ListItemView}
         */
        this.chatMessageView            = null;

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageManagerModule}
         */
        this.chatMessageManagerModule   = null;

        /**
         * @private
         * @type {UserManagerModule}
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
                    view(MessageView)
                        .model(this.chatMessageModel)
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.chatMessageView);
    },

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

    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    handleChatMessageRetry: function(){
        console.log("Inside ChatMessageContainer#handleRetry");
        var _this = this;
        var chatMessage     = this.chatMessageModel.toJSON();
        chatMessage.retry   = true;

        this.chatMessageManagerModule.createChatMessage(chatMessage, function(error, chatMessageObj){
            console.log("Inside ChatWidgetContainer#handleInputFormSubmit callback");
            console.log("error:", error, "chatMessageObj:", chatMessageObj);
            var chatMessageModel = _this.chatMessageModel;

            if(!error && chatMessageObj){
                var sender              = _this.userManagerModule.get(chatMessageObj.senderUserId);
                chatMessageObj.sentBy   = sender.firstName + sender.lastName;
                chatMessageObj.sentAt   = chatMessageObj.createdAt;
                chatMessageObj.pending  = false;
                chatMessageObj.failed   = false;

                chatMessageModel.set(chatMessageObj);
            } else {
                //TEST This
                chatMessage.failed = true;
                chatMessageModel.set(chatMessage);
            }
        });
    },

});

annotate(ChatMessageContainer).with(
    autowired().properties([
        property("chatMessageManagerModule").ref("chatMessageManagerModule"),
        property("userManagerModule").ref("userManagerModule")
    ])
);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageContainer", ChatMessageContainer);
