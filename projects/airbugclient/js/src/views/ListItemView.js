//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ListItemView')

//@Require('Class')
//@Require('ListViewEvent')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ListItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template: '<div class="list-item clickable-box">' +
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
            _this.handleListItemClick(event);
        });
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleListItemClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new ListViewEvent(ListViewEvent.EventTypes.ITEM_SELECTED, this.model.toJSON()));
    }
});