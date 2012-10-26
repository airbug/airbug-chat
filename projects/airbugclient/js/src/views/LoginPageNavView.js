//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('LoginPageNavView')

//@Require('Class')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var LoginPageNavView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: LoginPageNavTemplate,

    events: {
        "click #signup-button": "handleSignupButtonClick"
    },


    //-------------------------------------------------------------------------------
    // Event Dispatchers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleSignupButtonClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new Event(LoginPageNavView.EventTypes.NAVIGATE_TO_SIGNUP));
    }
});

/**
 * @enum {string}
 */
LoginPageNavView.EventTypes = {
    NAVIGATE_TO_SIGNUP: "LoginPageNavView:NavigateToSignup"
};
