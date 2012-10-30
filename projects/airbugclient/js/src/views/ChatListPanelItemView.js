//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatListPanelItemView')

//@Require('ChatListPanelEvent')
//@Require('ChatListPanelItemTemplate')
//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatListPanelItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: ChatListPanelItemTemplate,

    /**
     * @protected
     */
    initialize: function() {
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
