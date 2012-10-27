//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SignupPageNavView')

//@Require('Class')
//@Require('Event')
//@Require('MustacheView')
//@Require('SignupPageEvent')


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
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleLoginButtonClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new SignupPageEvent(SignupPageEvent.EventTypes.NAVIGATE_TO_LOGIN));
    }
});
