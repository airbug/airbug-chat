//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ApplicationController')

//@Require('Annotate')
//@Require('AnnotateProperty')
//@Require('CarapaceController')
//@Require('Class')
//@Require('NavigationMessage')
//@Require('SessionMessage')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var property = AnnotateProperty.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ApplicationController = Class.extend(CarapaceController, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule = null;

        /**
         * @private
         * @type {SessionModule}
         */
        this.sessionModule = null;
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
        this.navigationModule.navigate(message.getData().fragment, message.getData().options);
    },

    /**
     * @private
     * @param {Message} message
     */
    receiveSessionMessageLogin: function(message) {
        this.sessionModule.login(message.getData().email, message.getData().password);
    },

    /**
     * @private
     * @param {Message} message
     */
    receiveSessionMessageLogout: function(message) {
        this.sessionModule.logout();
    }
});
annotate(ApplicationController).with(
    annotation("Autowired").params(
        property("navigationModule").ref("navigationModule"),
        property("sessionModule").ref("sessionModule")
    )
);
