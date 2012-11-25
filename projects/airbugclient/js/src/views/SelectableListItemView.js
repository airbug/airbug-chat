//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SelectableListItemView')

//@Require('Class')
//@Require('ListItemView')
//@Require('ListViewEvent')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SelectableListItemView = Class.extend(ListItemView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="list-item-{{cid}}" class="list-item list-item-{{attributes.size}} clickable-box">' +
                '</div>',


    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    deinitializeView: function() {
        this._super();
        this.$el.unbind();
    },

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
        var modelData = this.model ? this.model.toJSON() : {};
        this.dispatchEvent(new ListViewEvent(ListViewEvent.EventType.ITEM_SELECTED, modelData));
    }
});