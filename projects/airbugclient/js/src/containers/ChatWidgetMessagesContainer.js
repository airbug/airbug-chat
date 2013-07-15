//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetMessagesContainer')

//@Require('Class')
//@Require('airbug.ChatMessageCollection')
//@Require('airbug.ChatMessageModel')
//@Require('airbug.ListView')
//@Require('airbug.ListItemView')
//@Require('airbug.MessageView')
//@Require('airbug.PanelView')
//@Require('airbug.TextAreaView')
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
var ChatWidgetView                  = bugpack.require('airbug.ChatWidgetView');
var ListView                        = bugpack.require('airbug.ListView');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var MessageView                     = bugpack.require('airbug.MessageView');
var PanelView                       = bugpack.require('airbug.PanelView');
var TextAreaView                    = bugpack.require('airbug.TextAreaView');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatWidgetMessagesContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(conversationModel) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ConversationModel}
         */
        this.conversationModel              = conversationModel;

        /**
         * @private
         * @type {ChatMessageCollection}
         */
        this.chatMessageCollection          = null;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ListView}
         */
        this.chatWidgetMessagesView                = null;

        // Modules
        //

        this.chatMessageManagerModule       = null;
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

        this.chatMessageCollection = new ChatMessageCollection([], "chatMessageCollection");
        this.addCollection(this.chatMessageCollection);


        // Create Views
        //-------------------------------------------------------------------------------

        this.chatWidgetMessagesView =
            view(PanelView)
                .children([
                    view(ListView)
                        .id("messageListView")
                        .appendTo('*[id|="panel-body"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.chatWidgetMessagesView);
    },

    createContainerChildren: function(){
        this._super();

    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();

    }


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------


});

annotate(ChatWidgetMessagesContainer).with(
    autowired().properties([
        property("chatMessageManagerModule").ref("chatMessageManagerModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatWidgetMessagesContainer", ChatWidgetMessagesContainer);
