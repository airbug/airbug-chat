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
var ChatMessageModel                = bugpack.require('airbug.ChatMessageModel');
var ListView                        = bugpack.require('airbug.ListView');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var MessageView                     = bugpack.require('airbug.MessageView');
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
    // Instance Methods
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

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
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(ChatMessageContainer).with(
    autowired().properties([
        property("chatMessageManagerModule").ref("chatMessageManagerModule"),
        property("userManagerModule").ref("userManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageContainer", ChatMessageContainer);
