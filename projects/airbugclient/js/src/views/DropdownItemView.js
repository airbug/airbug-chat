//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('DropdownItemView')

//@Require('Class')
//@Require('DropdownViewEvent')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DropdownItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<li><a id ="dropdown-item-{{cid}}" tabindex="-1"></a></li>',


    //-------------------------------------------------------------------------------
    // CarapaceView Extensions
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
        this.$el.bind('click', function(event) {
            _this.handleDropdownItemClick(event);
        });
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleDropdownItemClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new DropdownViewEvent(DropdownViewEvent.EventTypes.DROPDOWN_SELECTED));
    }
});
