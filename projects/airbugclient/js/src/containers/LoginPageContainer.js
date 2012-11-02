//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('LoginPageContainer')

//@Require('ApplicationContainer')
//@Require('Class')
//@Require('LoginFormView')
//@Require('PageView')
//@Require('SignupButtonContainer')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var LoginPageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher) {

        this._super(apiPublisher);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView = null;

        /**
         * @protected
         * @type {LoginFormView}
         */
        this.loginFormView = null;

        /**
         * @protected
         * @type {SignupButtonContainer}
         */
        this.signupButtonContainer = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();
        this.pageView = new PageView();
        this.loginFormView = new LoginFormView();
        this.applicationView.addViewChild(this.pageView, "#application-" + this.applicationView.cid);
        this.pageView.addViewChild(this.loginFormView, "#page-" + this.pageView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.signupButtonContainer = new SignupButtonContainer(this.apiPublisher);
        this.addContainerChild(this.signupButtonContainer, "#header-right");
    }
});
