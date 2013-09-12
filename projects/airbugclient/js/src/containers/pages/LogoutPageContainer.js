//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('LogoutPageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.LoginFormContainer')
//@Require('airbug.PageView')
//@Require('airbug.SignupButtonContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var ApplicationContainer    = bugpack.require('airbug.ApplicationContainer');
var LoginFormContainer      = bugpack.require('airbug.LoginFormContainer');
var PageView                = bugpack.require('airbug.PageView');
var SignupButtonContainer   = bugpack.require('airbug.SignupButtonContainer');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta     = BugMeta.context();
var autowired   = AutowiredAnnotation.autowired;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var LogoutPageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule       = null;

        /**
         * @private
         * @type {SessionModule}
         */
        this.sessionModule          = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {LoginFormView}
         */
        this.loginFormView          = null;

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView               = null;

        /**
         * @protected
         * @type {SignupButtonContainer}
         */
        this.signupButtonContainer  = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        this.pageView =
            view(PageView)
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.applicationView.addViewChild(this.pageView, "#application-" + this.applicationView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.loginFormContainer     = new LoginFormContainer();
        this.signupButtonContainer  = new SignupButtonContainer();
        this.addContainerChild(this.signupButtonContainer, "#header-right");
        this.addContainerChild(this.loginFormContainer, "#page-" + this.pageView.cid);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------


});
bugmeta.annotate(LoginPageContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.LogoutPageContainer", LogoutPageContainer);
