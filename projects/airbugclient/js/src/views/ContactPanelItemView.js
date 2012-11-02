//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ContactPanelItemView')

//@Require('Class')
//@Require('ContactPanelEvent')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactPanelItemView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // Template
    //-------------------------------------------------------------------------------

    template:   '<div id="contact-{{uid}}" class="panel-item clickable-box">' +
                    '<span id="contact-status-indicator-{{uid}}" class="user-status-indicator user-status-indicator-{{status}}"></span>' +
                    '<span id="contact-name-{{uid}}" class="panel-item-text contact-name">{{firstName}} {{lastName}}</span>' +
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
