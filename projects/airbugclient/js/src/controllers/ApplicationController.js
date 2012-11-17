//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ApplicationController')

//@Require('CarapaceController')
//@Require('Class')
//@Require('NavigationMessage')
//@Require('SessionMessage')


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
        this._super();
        this.apiPublisher.subscribe(NavigationMessage.MessageTopics.GO_BACK, this.receiveNavigationMessageGoBack, this);
        this.apiPublisher.subscribe(NavigationMessage.MessageTopics.MARK_GO_BACK, this.receiveNavigationMessageMarkGoBack, this);
        this.apiPublisher.subscribe(NavigationMessage.MessageTopics.NAVIGATE, this.receiveNavigationMessageNavigate, this);
        this.apiPublisher.subscribe(SessionMessage.MessageTopics.LOGIN, this.receiveSessionMessageLogin, this);
        this.apiPublisher.subscribe(SessionMessage.MessageTopics.LOGOUT, this.receiveSessionMessageLogout, this);
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param email
     * @param password
     */
    login: function(email, password) {

    },

    /**
     * @protected
     */
    logout: function() {

    },

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
     * @private
     * @param {Message} message
     */
    receiveNavigationMessageGoBack: function(message) {

    },

    /**
     * @private
     * @param {Message} message
     */
    receiveNavigationMessageMarkGoBack: function(message) {

    },

    /**
     * @private
     * @param {Message} message
     */
    receiveNavigationMessageNavigate: function(message) {
        this.navigate(message.getData().fragment, message.getData().options);
    },

    /**
     * @private
     * @param {Message} message
     */
    receiveSessionMessageLogin: function(message) {
        this.login(message.getData().email, message.getData().password);
    },

    /**
     * @private
     * @param {Message} message
     */
    receiveSessionMessageLogout: function(message) {
        this.logout();
    }
});
