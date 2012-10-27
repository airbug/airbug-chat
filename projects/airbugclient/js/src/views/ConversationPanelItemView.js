//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ConversationPanelItemView')

//@Require('Class')
//@require('ConversationPanelEvent')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationPanelItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: ConversationPanelItemTemplate,

    /**
     * @protected
     */
    initialize: function() {
        this._super();
        var _this = this;
        this.$el.bind("click", function(event) {
            _this.handleConversationClick(event);
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
    handleConversationClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new ConversationPanelEvent(ConversationPanelEvent.EventTypes.CONVERSATION_SELECTED, this.model.toJSON()));
    }
});
