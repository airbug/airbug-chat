//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('LoginPageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.LoginFormView')
//@Require('airbug.PageView')
//@Require('airbug.SignupButtonContainer')
//@Require('annotate.Annotate')
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
var LoginFormView           = bugpack.require('airbug.LoginFormView');
var PageView                = bugpack.require('airbug.PageView');
var SignupButtonContainer   = bugpack.require('airbug.SignupButtonContainer');
var Annotate                = bugpack.require('annotate.Annotate');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate    = Annotate.annotate;
var autowired   = AutowiredAnnotation.autowired;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


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
                .children([
                    view(LoginFormView)
                        .id("loginFormView")
                        .appendTo("*[id|=page]")
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.loginFormView = this.findViewById("loginFormView");
        this.applicationView.addViewChild(this.pageView, "#application-" + this.applicationView.cid);
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.signupButtonContainer = new SignupButtonContainer();
        this.addContainerChild(this.signupButtonContainer, "#header-right");
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.loginFormView.addEventListener(FormViewEvent.EventType.SUBMIT, this.hearLoginFormViewSubmitEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {FormViewEvent} event
     */
    hearLoginFormViewSubmitEvent: function(event) {

    }
});
annotate(LoginPageContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.LoginPageContainer", LoginPageContainer);

