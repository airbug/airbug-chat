//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatPanelItemView')

//@Require('ChatPanelEvent')
//@Require('ChatPanelItemTemplate')
//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatPanelItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: ChatPanelItemTemplate,

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
        var data = this.model ? this.model.toJSON() : {};

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
        this.dispatchEvent(new ChatPanelEvent(ChatPanelEvent.EventTypes.CHAT_SELECTED, this.model.toJSON()));
    }
});
