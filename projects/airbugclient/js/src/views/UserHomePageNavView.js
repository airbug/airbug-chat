//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserHomePageNavView')

//@Require('Class')
//@Require('Event')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserHomePageNavView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: userhomepagenavTemplate,

    events: {
        "click #account-button": "handleAccountButtonClick"
    },


    //-------------------------------------------------------------------------------
    // Event Dispatchers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleAccountButtonClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new Event(UserHomePageNavView.EventTypes.ACCOUNT_BUTTON_CLICKED));
    }
});

/**
 * @enum {string}
 */
UserHomePageNavView.EventTypes = {
    ACCOUNT_BUTTON_CLICKED: "UserHomePageNavView:AccountButtonClicked"
};
