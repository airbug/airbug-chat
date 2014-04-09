//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChatMessageCodeContainer')

//@Require('Class')
//@Require('airbug.ChatMessageContainer')
//@Require('airbug.MessageContentCodeView')
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
var MessageContentCodeView          = bugpack.require('airbug.MessageContentCodeView');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatMessageCodeContainer = Class.extend(ChatMessageContainer, {

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
         * @type {MessageContentCodeView}
         */
        this.messageContentCodeView            = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {MessageContentCodeView}
     */
    getMessageContentCodeView: function() {
        return this.messageContentCodeView;
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
        var codeBlock = this.getChatMessageView().$el.find("pre").get()[0];
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

        this.messageContentCodeView =
            view(MessageContentCodeView)
                .model(this.getChatMessageModel())
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.getChatMessageView().addViewChild(this.messageContentCodeView, "#message-body-" + this.getChatMessageView().getCid());
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatMessageCodeContainer", ChatMessageCodeContainer);
