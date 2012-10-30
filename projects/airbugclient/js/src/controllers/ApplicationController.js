//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ApplicationController')

//@Require('CarapaceController')
//@Require('Class')
//@Require('NavigationMessage')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ApplicationController = Class.extend(CarapaceController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(router) {

        this._super(router);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    initializeController: function() {
        this.apiPublisher.subscribe(NavigationMessage.MessageTopics.NAVIGATE, this.receiveNavigationMessageNavigate, this)
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} fragment
     * @param {Object} options
     */
    navigate: function(fragment, options) {
        this.router.navigate(fragment, options);
    },


    //-------------------------------------------------------------------------------
    // Publisher Subscription Receivers
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     */
    receiveNavigationMessageNavigate: function(message) {
        this.navigate(message.getData().fragment, message.getData().options);
    }
});
