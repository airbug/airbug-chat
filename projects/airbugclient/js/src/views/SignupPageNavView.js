//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SignupPageNavView')

//@Require('Class')
//@Require('Event')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SignupPageNavView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: SignupPageNavTemplate,

    events: {
        "click #login-button": "handleLoginButtonClick"
    },


    //-------------------------------------------------------------------------------
    // Event Dispatchers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleLoginButtonClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new Event(SignupPageNavView.EventTypes.NAVIGATE_TO_LOGIN));
    }
});

/**
 * @enum {string}
 */
SignupPageNavView.EventTypes = {
    NAVIGATE_TO_LOGIN: "SignupPageNavView:NavigateToLogin"
};



