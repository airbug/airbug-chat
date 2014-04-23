//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.ChatWidgetMessagesContainer')

//@Require('AddChange')
//@Require('Bug')
//@Require('Class')
//@Require('ClearChange')
//@Require('Map')
//@Require('RemoveChange')
//@Require('airbug.ChatMessageContainer')
//@Require('airbug.ListContainer')
//@Require('airbug.PreviousMessagesLoaderContainer')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var AddChange                       = bugpack.require('AddChange');
    var Bug                             = bugpack.require('Bug');
    var Class                           = bugpack.require('Class');
    var ClearChange                     = bugpack.require('ClearChange');
    var Map                             = bugpack.require('Map');
    var RemoveChange                    = bugpack.require('RemoveChange');
    var ChatMessageContainer            = bugpack.require('airbug.ChatMessageContainer');
    var ListContainer                   = bugpack.require('airbug.ListContainer');
    var PreviousMessagesLoaderContainer = bugpack.require('airbug.PreviousMessagesLoaderContainer');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ListContainer}
     */
    var ChatWidgetMessagesContainer = Class.extend(ListContainer, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {ObservableList.<ChatMessageModel>} chatMessageList
         */
        _constructor: function(chatMessageList) {

            this._super("No messages in this conversation");


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ObservableList.<ChatMessageModel>}
             */
            this.chatMessageList                            = chatMessageList;

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


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {PreviousMessagesLoaderContainer}
             */
            this.previousMessagesLoaderContainer            = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

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
        deinitializeContainer: function() {
            this._super();
            this.chatMessageList.unobserve(AddChange.CHANGE_TYPE, "", this.observeChatMessageListAdd, this);
            this.chatMessageList.unobserve(ClearChange.CHANGE_TYPE, "", this.observeChatMessageListClear, this);
            this.chatMessageList.unobserve(RemoveChange.CHANGE_TYPE, "", this.observeChatMessageListRemove, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.chatMessageList.observe(AddChange.CHANGE_TYPE, "", this.observeChatMessageListAdd, this);
            this.chatMessageList.observe(ClearChange.CHANGE_TYPE, "", this.observeChatMessageListClear, this);
            this.chatMessageList.observe(RemoveChange.CHANGE_TYPE, "", this.observeChatMessageListRemove, this);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         *
         */
        hidePreviousMessagesLoader: function() {
            if(this.previousMessagesLoaderContainer) {
                this.removeContainerChild(this.previousMessagesLoaderContainer, true);
            }
        },

        /**
         *
         */
        showPreviousMessagesLoader: function() {
            if(!this.previousMessagesLoaderContainer) {
                this.previousMessagesLoaderContainer = new PreviousMessagesLoaderContainer();
            }
            this.prependContainerChild(this.previousMessagesLoaderContainer, "#list-" + this.getListView().getCid());
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
            }, 0);
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
                this.animateScrollToCarapaceModel(this.chatMessageList.getAt(this.chatMessageList.getCount() - 1), 600);
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
            // Forcing user scrolling for messages that were received while away would help us as well as the user to keep track of read and unread messages.
        },

        /**
         * @protected
         * @param {ChatMessageModel} chatMessageModel
         * @return {ChatMessageContainer}
         */
        createChatMessageContainer: function(chatMessageModel) {
            if (!this.hasCarapaceModel(chatMessageModel)) {
                /** @type {ChatMessageContainer} */
                var chatMessageContainer = new ChatMessageContainer(chatMessageModel);
                this.mapModelToContainer(chatMessageModel, chatMessageContainer);
                return chatMessageContainer;
            }
            return null;
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
            this.addContainerChildAt(chatMessageContainer, index, "#list-" + this.getListView().getCid());
        },

        /**
         *
         */
        appendChatMessageContainer: function(chatMessageContainer) {
            this.hidePlaceholder();
            this.addContainerChild(chatMessageContainer, "#list-" + this.getListView().getCid());
        },

        /**
         *
         */
        prependChatMessageContainer: function(chatMessageContainer) {
            this.hidePlaceholder();
            this.prependContainerChild(chatMessageContainer, "#list-" + this.getListView().getCid());
        },


        //-------------------------------------------------------------------------------
        // Model Observers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Observation} observation
         */
        observeChatMessageListAdd: function(observation) {
            var change              = /** @type {AddAtChange} */(observation.getChange());
            var chatMessageModel    = change.getValue();
            var index               = change.getIndex();
            var chatMessageContainer = this.createChatMessageContainer(chatMessageModel);
            if (index === 0) {
                this.prependChatMessageContainer(chatMessageContainer);
            } else {
                var scrollState = this.getScrollState();
                this.appendChatMessageContainer(chatMessageContainer);

                // NOTE BRN: Only scroll if we're already at the bottom of the message list. This way it doesn't jump back
                // if the room is busy and you're reading older messages

                if (scrollState === ListContainer.ScrollState.BOTTOM || scrollState === ListContainer.ScrollState.NO_SCROLL) {
                    this.animateChatMessageCollectionAdd();
                }
            }
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeChatMessageListClear: function(observation) {
            this.removeAllContainerChildren(true);
            this.clearModelMap();
            this.processChatMessageList();
        },

        /**
         * @private
         * @param {Observation} observation
         */
        observeChatMessageListRemove: function(observation) {
            var change                  = /** @type {RemoveAtChange} */(observation.getChange());
            var chatMessageModel        = change.getValue();
            var chatMessageContainer    = this.getContainerForModel(chatMessageModel);
            this.unmapModel(chatMessageModel);
            this.removeContainerChild(chatMessageContainer, true);
        },


        //-------------------------------------------------------------------------------
        // Event Listener
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearScrollStateChange: function(event) {

        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ChatWidgetMessagesContainer", ChatWidgetMessagesContainer);
});
