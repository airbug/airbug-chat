//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatListPanelItemView')

//@Require('ChatListPanelEvent')
//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatListPanelItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div class="panel-item panel-item-large clickable-box">' +
                    '<div class="panel-item-left">' +
                        '<span id="chat-list-unread-message-count-{{uid}}" class="chat-unread-message-count">{{unreadMessageCount}}</span>' +
                    '</div>' +
                    '<div class="panel-item-center">' +
                        '<span id="chat-name-{{uid}}" class="panel-item-text chat-name">{{name}}</span>' +
                        '<span id="chat-unread-message-preview-{{uid}}" class="panel-item-text chat-unread-message-preview">{{unreadMessagePreview}}</span>' +
                    '</div>' +
                '</div>',


    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    initializeView: function() {
        this._super();
        var _this = this;
        this.$el.bind("click", function(event) {
            _this.handleChatClick(event);
        });
    },


    //-------------------------------------------------------------------------------
    // MustacheView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    generateTemplateData: function() {
        var data = this._super();

        //TODO BRN: This is a good unit test candidate.

        if (data.unreadMessageCount > 99) {
            data.unreadMessageCount = "99+";
        }
        return data;
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleChatClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new ChatListPanelEvent(ChatListPanelEvent.EventTypes.CHAT_SELECTED, this.model.toJSON()));
    }
});
