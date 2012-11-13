//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatWidgetContainer')

//@Require('BoxWithFooterView')
//@Require('CarapaceContainer')
//@Require('ChatWidgetView')
//@Require('Class')
//@Require('ListItemView')
//@Require('MessageCollection')
//@Require('PanelView')
//@Require('TextAreaView')
//@Require('ViewBuilder')


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

    _constructor: function(apiPublisher, conversationModel) {

        this._super(apiPublisher);


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
        // TODO BRN: This is where we make an apiPublisher call and send both the conversationUuid and the messageCollection.
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
        var listItemView = new ListItemView({
            model: messageModel
        });
        var messageView = new MessageView({
            model: messageModel
        });
        listItemView.addViewChild(messageView);
        this.messageListView.addViewChild(listItemView);
    }
});
