//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetContainer')

//@Require('Class')
//@Require('airbug.ChatWidgetView')
//@Require('airbug.ListItemView')
//@Require('airbug.MessageCollection')
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

var Class =             bugpack.require('Class');
var ChatWidgetView =    bugpack.require('airbug.ChatWidgetView');
var ListItemView =      bugpack.require('airbug.ListItemView');
var MessageCollection = bugpack.require('airbug.MessageCollection');
var MessageView =       bugpack.require('airbug.MessageView');
var PanelView =         bugpack.require('airbug.PanelView');
var TextAreaView =      bugpack.require('airbug.TextAreaView');
var CarapaceContainer = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder =       bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatWidgetContainer = Class.extend(CarapaceContainer, {

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
        this.conversationModel = conversationModel;

        /**
         * @private
         * @type {MessageCollection}
         */
        this.messageCollection = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatWidgetView}
         */
        this.chatWidgetView = null;

        /**
         * @private
         * @type {ListView}
         */
        this.messageListView = null;

        /**
         * @private
         * @type {TextAreaView}
         */
        this.textAreaView = null;
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
        this.textAreaView.focus();
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Models
        //-------------------------------------------------------------------------------

        this.messageCollection = new MessageCollection([], "messageCollection");
        this.addCollection(this.messageCollection);


        // Create Views
        //-------------------------------------------------------------------------------

        this.chatWidgetView =
            view(ChatWidgetView)
                .children([
                    view(PanelView)
                        .appendTo('*[id|="chat-widget-messages"]')
                        .children([
                            view(ListView)
                                .id("messageListView")
                                .appendTo('*[id|="panel-body"]')
                        ]),
                    view(TextAreaView)
                        .id("textAreaView")
                        .attributes({rows: 1})
                        .appendTo('*[id|="chat-widget-input"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.chatWidgetView);
        this.messageListView = this.findViewById("messageListView");
        this.textAreaView = this.findViewById("textAreaView");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.conversationModel.bind('change:uuid', this.handleConversationModelChangeUuid, this);
        this.messageCollection.bind('add', this.handleMessageCollectionAdd, this);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} conversationUuid
     */
    loadMessageCollection: function(conversationUuid) {
        // TODO BRN: This is where we make an api call and send both the conversationUuid and the messageCollection.
        // The api call would then be responsible for adding MessageModels to the messageCollection.

        //TEST
        if (conversationUuid === "1aRtls0") {
            this.messageCollection.add(new MessageModel({
                message: "Hey bro!",
                sentBy: "Tim Pote",
                sentAtUtc: (new Date()).getTime() - (1000 * 30)
            }));
        } else if (conversationUuid === "bn6LPsd") {
            this.messageCollection.add(new MessageModel({
                message: "I hope we get our first customer today.",
                sentBy: "Adam Nisenbaum",
                sentAtUtc: (new Date()).getTime() - (1000 * 60 * 60 * 2)
            }));
            this.messageCollection.add(new MessageModel({
                message: "We have our first customer! Also, this is a really long message that should eventually overflow the preview because i just kept typing and typing and typing and typing and typing and typing and typing and typing and typing...",
                sentBy: "Brian Neisler",
                sentAtUtc: (new Date()).getTime() - (1000 * 60 * 20)
            }));
            this.messageCollection.add(new MessageModel({
                message: "That's awesome!",
                sentBy: "Tim Pote",
                sentAtUtc: (new Date()).getTime() - (1000 * 60 * 18)
            }));
        } else if (conversationUuid === "PLn865D") {
            this.messageCollection.add(new MessageModel({
                message: "Can someone checkout bug air-542?",
                sentBy: "Brian Neisler",
                sentAtUtc: (new Date()).getTime() - (1000 * 60 * 60 * 24)
            }));
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    handleConversationModelChangeUuid: function() {
        this.loadMessageCollection(this.conversationModel.get('uuid'));
    },

    /**
     * @private
     * @param {MessageModel} messageModel
     */
    handleMessageCollectionAdd: function(messageModel) {
        var listItemView =
            view(ListItemView)
                .model(messageModel)
                .attributes({size: "flex"})
                .children([
                    view(MessageView)
                        .model(messageModel)
                ])
                .build();

        this.messageListView.addViewChild(listItemView);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatWidgetContainer", ChatWidgetContainer);
