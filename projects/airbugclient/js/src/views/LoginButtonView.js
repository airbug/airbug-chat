//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('LoginButtonView')

//@Require('Class')
//@Require('Event')
//@Require('LoginButtonEvent')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var LoginButtonView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: LoginButtonTemplate,

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
        this.dispatchEvent(new LoginButtonEvent(LoginButtonEvent.EventTypes.CLICKED));
    }
});
