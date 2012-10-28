//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactPanelItemView')

//@Require('Class')
//@Require('ContactPanelItemTemplate')
//@Require('ContactPanelEvent')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactPanelItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: ContactPanelItemTemplate,

    /**
     * @protected
     */
    initialize: function() {
        this._super();
        var _this = this;
        this.$el.bind("click", function(event) {
            _this.handleContactClick(event);
        });
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleContactClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new ContactPanelEvent(ContactPanelEvent.EventTypes.CONTACT_SELECTED, this.model.toJSON()));
    }
});
