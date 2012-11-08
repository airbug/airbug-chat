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
         * @type {PanelView}
         */
        this.panelView = null;

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

        this.messageCollection = new MessageCollection();


        // Create Views
        //-------------------------------------------------------------------------------

        this.chatWidgetView = new ChatWidgetView({});
        this.messageListView = new ListView({});
        this.panelView = new PanelView({});
        this.textAreaView = new TextAreaView({rows: 1});


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.panelView.addViewChild(this.messageListView, "#panel-body-" + this.panelView.cid);
        this.chatWidgetView.addViewChild(this.panelView, "#chat-widget-messages-" + this.chatWidgetView.cid);
        this.chatWidgetView.addViewChild(this.textAreaView, "#chat-widget-input-" + this.chatWidgetView.cid);
        this.setViewTop(this.chatWidgetView);
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
                sentAtUtc: (new Date()).getTime()
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
