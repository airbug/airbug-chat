//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('LoginPageContainer')

//@Require('Class')
//@Require('airbug.AlternateLoginPanelContainer')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.BoxWithFooterView')
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

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var AlternateLoginPanelContainer    = bugpack.require('airbug.AlternateLoginPanelContainer');
var ApplicationContainer            = bugpack.require('airbug.ApplicationContainer');
var BoxWithFooterView               = bugpack.require('airbug.BoxWithFooterView');
var LoginFormContainer              = bugpack.require('airbug.LoginFormContainer');
var PageView                        = bugpack.require('airbug.PageView');
var SignupButtonContainer           = bugpack.require('airbug.SignupButtonContainer');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var autowired                       = AutowiredAnnotation.autowired;
var property                        = PropertyAnnotation.property;
var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var LoginPageContainer = Class.extend(ApplicationContainer, {

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
        this.navigationModule               = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BoxWithFooterView}
         */
        this.boxView                        = null;

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView                       = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {AlternateLoginPanelContainer}
         */
        this.alternateLoginPanelContainer     = null;

        /**
         * @protected
         * @type {LoginFormContainer}
         */
        this.loginFormContainer             = null;

        /**
         * @protected
         * @type {SignupButtonContainer}
         */
        this.signupButtonContainer          = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function(routingArgs) {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        this.pageView =
            view(PageView)
                .children([
                    view(BoxWithFooterView)
                        .id("loginBoxView")
                        .attributes({classes: "login-box"})
                        .appendTo('*[id|="page"]')
                ])
                .build();



        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.getApplicationView().addViewChild(this.pageView, "#application-" + this.getApplicationView().getCid());

        this.boxView =  this.findViewById("loginBoxView");
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();

        this.alternateLoginPanelContainer   = new AlternateLoginPanelContainer();
        this.loginFormContainer             = new LoginFormContainer();
        this.signupButtonContainer          = new SignupButtonContainer();
        this.addContainerChild(this.signupButtonContainer, "#header-right");
        this.addContainerChild(this.loginFormContainer, "#box-body-" + this.boxView.getCid());
        this.addContainerChild(this.alternateLoginPanelContainer, "#box-footer-" + this.boxView.getCid());
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(LoginPageContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.LoginPageContainer", LoginPageContainer);
