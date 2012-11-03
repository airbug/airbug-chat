//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SignupPageContainer')

//@Require('Class')
//@Require('LoginButtonContainer')
//@Require('PageView')
//@Require('SignupFormView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SignupPageContainer = Class.extend(ApplicationContainer, {

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
         * @type {LoginButtonContainer}
         */
        this.loginButtonContainer = null;

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView = null;

        /**
         * @protected
         * @type {SignupFormView}
         */
        this.signupFormView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();
        this.pageView = new PageView();
        this.signupFormView = new SignupFormView();
        this.applicationView.addViewChild(this.pageView, "#application-" + this.applicationView.cid);
        this.pageView.addViewChild(this.signupFormView, "#page-" + this.pageView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.loginButtonContainer = new LoginButtonContainer(this.apiPublisher);
        this.addContainerChild(this.loginButtonContainer, "#header-right");
    }
});
