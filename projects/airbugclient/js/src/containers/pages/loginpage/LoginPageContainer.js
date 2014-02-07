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
//@Require('airbug.PanelView')
//@Require('airbug.SignupButtonContainer')
//@Require('airbug.TextView')
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
var BoxWithHeaderAndFooterView      = bugpack.require('airbug.BoxWithHeaderAndFooterView');
var LoginFormContainer              = bugpack.require('airbug.LoginFormContainer');
var PageView                        = bugpack.require('airbug.PageView');
var PanelView                       = bugpack.require('airbug.PanelView');
var SignupButtonContainer           = bugpack.require('airbug.SignupButtonContainer');
var TextView                        = bugpack.require('airbug.TextView');
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
         * @type {BoxWithHeaderAndFooterView}
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
                    view(BoxWithHeaderAndFooterView)
                        .id("loginBoxView")
                        .attributes({classes: "login-box"})
                        .appendTo('*[id|="page"]')
                        .children([
                            view(PanelView)
                                .appendTo('#box-header-{{cid}}')
                                .children([
                                    view(TextView)
                                        .attributes({
                                            text: "Login to airbug",
                                            classes: "login-header-text"
                                        })
                                        .appendTo("#panel-body-{{cid}}")
                                ])
                        ])
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
