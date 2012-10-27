//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('LoginPageNavView')

//@Require('Class')
//@Require('LoginPageEvent')
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
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleSignupButtonClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new LoginPageEvent(LoginPageEvent.EventTypes.NAVIGATE_TO_SIGNUP));
    }
});
