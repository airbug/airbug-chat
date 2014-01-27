//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ChatWidgetMessagesContainer')

//@Require('AddChange')
//@Require('Class')
//@Require('ClearChange')
//@Require('Map')
//@Require('RemoveChange')
//@Require('airbug.ChatMessageCodeContainer')
//@Require('airbug.ChatMessageImageContainer')
//@Require('airbug.ChatMessageTextContainer')
//@Require('airbug.ListView')
//@Require('airbug.ListItemView')
//@Require('airbug.PanelView')
//@Require('airbug.PreviousMessagesLoaderContainer')
//@Require('airbug.ScrollEvent')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')
//@Require('jquery.JQuery')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var AddChange                       = bugpack.require('AddChange');
var Class                           = bugpack.require('Class');
var ClearChange                     = bugpack.require('ClearChange');
var Map                             = bugpack.require('Map');
var RemoveChange                    = bugpack.require('RemoveChange');
var ChatMessageCodeContainer        = bugpack.require('airbug.ChatMessageCodeContainer');
var ChatMessageImageContainer       = bugpack.require('airbug.ChatMessageImageContainer');
var ChatMessageTextContainer        = bugpack.require('airbug.ChatMessageTextContainer');
var ListView                        = bugpack.require('airbug.ListView');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var PanelView                       = bugpack.require('airbug.PanelView');
var PreviousMessagesLoaderContainer = bugpack.require('airbug.PreviousMessagesLoaderContainer');
var ScrollEvent                     = bugpack.require('airbug.ScrollEvent');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');
var JQuery                          = bugpack.require('jquery.JQuery');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $                               = JQuery;
var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatWidgetMessagesContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {ChatMessageList} chatMessageList
     */
    _constructor: function(chatMessageList) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<ChatMessageModel, ChatMessageContainer>}
         */
        this.chatMessageModelToChatMessageContainerMap  = new Map();

        /**
         * @private
         * @type {boolean}
         */
        this.resetTimer                                 = false;

        /**
         * @private
         * @type {boolean}
         */
        this.timerIsSet                                 = false;

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ChatMessageList.<ChatMessageModel>}
         */
        this.chatMessageList                            = chatMessageList;

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PanelView}
         */
        this.chatWidgetMessagesView                     = null;

        /**
         *
         * @type {}
         */
        this.previousMessagesLoaderContainer            = null;
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

        //TODO BRN: Setup a timeout to re-render messages every few seconds. This will keep the time stamps up to date.
    },

    /**
     * @protected
     */
    deactivateContainer: function() {
        this._super();
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


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

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.processChatMessageList();
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.initializeEventListeners();
        this.initializeObservers();
    },

    deinitializeContainer: function() {
        this.deinitializeEventListeners();
        this.deinitializeObservers();
    },

    initializeEventListeners: function() {
        var _this = this;
        this.getViewTop().$el.find('#messageListView').parent().scroll(function(event){
            if($('#messageListView').parent().scrollTop() === 0){
                console.log("You've scrolled to the top. Loading more messages");
                _this.getViewTop().dispatchEvent(new ScrollEvent(ScrollEvent.EventType.SCROLL_TO_TOP, {}));
            }
        });
        console.log("Scroll to top event listener initialized");
    },

    deinitializeEventListeners: function() {
        $('#messageListView').parent().off();
    },

    initializeObservers: function() {
        this.chatMessageList.observe(AddChange.CHANGE_TYPE, "", this.observeChatMessageListAdd, this);
        this.chatMessageList.observe(ClearChange.CHANGE_TYPE, "", this.observeChatMessageListClear, this);
        this.chatMessageList.observe(RemoveChange.CHANGE_TYPE, "", this.observeChatMessageListRemove, this);
    },

    deinitializeObservers: function() {
        this.chatMessageList.unobserve(AddChange.CHANGE_TYPE, "", this.observeChatMessageListAdd, this);
        this.chatMessageList.unobserve(ClearChange.CHANGE_TYPE, "", this.observeChatMessageListClear, this);
        this.chatMessageList.unobserve(RemoveChange.CHANGE_TYPE, "", this.observeChatMessageListRemove, this);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    showPreviousMessagesLoader: function() {
        if(!this.previousMessagesLoaderContainer) {
            this.previousMessagesLoaderContainer = new PreviousMessagesLoaderContainer();
        }
        this.prependContainerChild(this.previousMessagesLoaderContainer, ".list");
    },

    /**
     *
     */
    hidePreviousMessagesLoader: function() {
        if(this.previousMessagesLoaderContainer) {
            this.removeContainerChild(this.previousMessagesLoaderContainer, true);
        }
    },

    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    setAnimationTimer: function() {
        var _this = this;
        setTimeout(function() {
            _this.timerAnimationHandler();
        }, 50);
    },

    /**
     * @protected
     */
    timerAnimationHandler: function() {
        if (this.resetTimer === true) {
            this.resetTimer = false;
            this.setAnimationTimer();
        } else {
            this.timerIsSet = false;
            var panelBody = this.chatWidgetMessagesView.$el.find(".panel-body");
            panelBody.animate({scrollTop: panelBody.prop("scrollHeight")}, 600);
        }
    },

    /**
     * @protected
     */
    animateChatMessageCollectionAdd: function() {
        if (this.timerIsSet) {
            this.resetTimer = true;
        } else {
            this.timerIsSet = true;
            this.setAnimationTimer();
        }
        //TODO:
        //make the transition time dynamic to fit the length of the message and the speed of incoming messages
        //NOTE: SUNG I think we should make automatic scrolling only occur while the user is active.
        // Forcing user scrolling for messages that were recieved while away would help us as well as the user to keep track of read and unread messages.
    },

    /**
     * @protected
     * @param {ChatMessageModel} chatMessageModel
     * @return {ChatMessageContainer}
     */
    createChatMessageContainer: function(chatMessageModel) {
        if (!this.chatMessageModelToChatMessageContainerMap.containsKey(chatMessageModel)) {
            var type = chatMessageModel.getProperty("type");
            /** @type {ChatMessageContainer} */
            var chatMessageContainer = undefined;
            switch (type) {
                case "text":
                    chatMessageContainer = new ChatMessageTextContainer(chatMessageModel);
                    break;
                case "code":
                    chatMessageContainer = new ChatMessageCodeContainer(chatMessageModel);
                    break;
                case "image":
                    chatMessageContainer = new ChatMessageImageContainer(chatMessageModel);
                    break;
                default:
                    throw new Error("Unrecognized message type '" + type + "'");
            }
            this.chatMessageModelToChatMessageContainerMap.put(chatMessageModel, chatMessageContainer);
            return chatMessageContainer;
        }
    },

    /**
     *
     */
    processChatMessageList: function() {
        var _this = this;
        this.chatMessageList.forEach(function(chatMessageModel) {
            var chatMessageContainer = _this.createChatMessageContainer(chatMessageModel);
            _this.appendChatMessageContainer(chatMessageContainer);
        });
    },

    addChatMessageContainerAt: function(chatMessageContainer, index) {
        this.addContainerChildAt(chatMessageContainer, index, ".list");
    },

    /**
     *
     */
    appendChatMessageContainer: function(chatMessageContainer) {
        this.addContainerChild(chatMessageContainer, ".list");
    },

    /**
     *
     */
    prependChatMessageContainer: function(chatMessageContainer) {
        this.prependContainerChild(chatMessageContainer, ".list");
    },

    //-------------------------------------------------------------------------------
    // Model Observers
    //-------------------------------------------------------------------------------

    /**
     *
     * @param {AddAtChange} change
     */
    observeChatMessageListAdd: function(change){
        var chatMessageModel    = change.getValue();
        var index               = change.getIndex();
        var chatMessageContainer = this.createChatMessageContainer(chatMessageModel);
        if(index === 0) {
            this.prependChatMessageContainer(chatMessageContainer);
        } else {
            this.appendChatMessageContainer(chatMessageContainer);
            this.animateChatMessageCollectionAdd();
        }
    },

    /**
     * @private
     * @param {ClearChange} change
     */
    observeChatMessageListClear: function(change) {
        this.removeAllContainerChildren(true);
        this.chatMessageModelToChatMessageContainerMap.clear();
        this.processChatMessageList();
    },

    /**
     * @private
     * @param {RemoveAtChange} change
     */
    observeChatMessageListRemove: function(change) {
        var chatMessageModel = change.getValue();
        var chatMessageContainer = this.chatMessageModelToChatMessageContainerMap.get(chatMessageModel);
        this.chatMessageModelToChatMessageContainerMap.remove(chatMessageModel);
        this.removeContainerChild(chatMessageContainer, true);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ChatWidgetMessagesContainer", ChatWidgetMessagesContainer);
