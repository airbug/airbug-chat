//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('AccountButtonView')

//@Require('AccountButtonTemplate')
//@Require('Class')
//@Require('Event')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AccountButtonView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: AccountButtonTemplate,

    events: {
        "click #account-button": "handleAccountButtonClick"
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleAccountButtonClick: function(event) {
        event.preventDefault();

        //TODO BRN: Open up the drop down menu here
    }
});
