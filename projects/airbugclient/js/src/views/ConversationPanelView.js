//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ConversationPanelView')

//@Require('Class')
//@Require('ConversationPanelItemView')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ConversationPanelView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: ConversationPanelTemplate,

    /**
     *
     */
    initialize: function() {
        var _this = this;
        this.collection.bind('add', function(conversationModel) {
            _this.handleCollectionAdd(conversationModel);
        });
    },


    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @param {ConversationModel} conversationModel
     */
    handleCollectionAdd: function(conversationModel) {
        var conversationPanelItemView = new ConversationPanelItemView({
            model: conversationModel
        });
        this.addViewChild(conversationPanelItemView, "#conversation-panel-body");
    }
});
