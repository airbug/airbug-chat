//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ChatPanelView')

//@Require('ChatPanelItemView')
//@Require('ChatPanelTemplate')
//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ChatPanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: ChatPanelTemplate,

    /**
     *
     */
    initialize: function() {
        var _this = this;
        this.collection.bind('add', function(chatModel) {
            _this.handleCollectionAdd(chatModel);
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {ChatModel} chatModel
     */
    handleCollectionAdd: function(chatModel) {
        var chatPanelItemView = new ChatPanelItemView({
            model: chatModel
        });
        this.addViewChild(chatPanelItemView, "#chat-panel-body");
    }
});
