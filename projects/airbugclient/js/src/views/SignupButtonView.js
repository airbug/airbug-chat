//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SignupButtonView')

//@Require('Class')
//@Require('MustacheView')
//@Require('SignupButtonEvent')
//@Require('SignupButtonTemplate')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SignupButtonView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: SignupButtonTemplate,

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
        this.dispatchEvent(new SignupButtonEvent(SignupButtonEvent.EventTypes.CLICKED));
    }
});
