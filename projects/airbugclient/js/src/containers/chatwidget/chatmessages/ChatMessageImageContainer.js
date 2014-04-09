//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChatMessageImageContainer')

//@Require('Class')
//@Require('airbug.ChatMessageContainer')
//@Require('airbug.MessageContentImageView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ChatMessageContainer            = bugpack.require('airbug.ChatMessageContainer');
var MessageContentImageView         = bugpack.require('airbug.MessageContentImageView');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageImageContainer = Class.extend(ChatMessageContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(chatMessageModel) {

        this._super(chatMessageModel);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MessageContentImageView}
         */
        this.messageContentImageView            = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {MessageContentImageView}
     */
    getMessageContentImageView: function() {
        return this.messageContentImageView;
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

        this.messageContentImageView =
            view(MessageContentImageView)
                .model(this.getChatMessageModel())
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.getChatMessageView().addViewChild(this.messageContentImageView, "#message-body-" + this.getChatMessageView().getCid());
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageImageContainer", ChatMessageImageContainer);
