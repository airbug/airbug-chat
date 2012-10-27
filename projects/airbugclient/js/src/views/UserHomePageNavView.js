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

    template: UserHomePageNavTemplate,

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