//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('HomeButtonView')

//@Require('Class')
//@Require('Event')
//@Require('HomeButtonEvent')
//@Require('HomeButtonTemplate')
//@Require('MustacheView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HomeButtonView = Class.extend(MustacheView, {

    //-------------------------------------------------------------------------------
    // CarapaceView Implementation
    //-------------------------------------------------------------------------------

    template: HomeButtonTemplate,

    events: {
        "click #home-button": "handleHomeButtonClick"
    },


    //-------------------------------------------------------------------------------
    // View Event Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    handleHomeButtonClick: function(event) {
        event.preventDefault();
        this.dispatchEvent(new HomeButtonEvent(HomeButtonEvent.EventTypes.CLICKED));
    }
});
