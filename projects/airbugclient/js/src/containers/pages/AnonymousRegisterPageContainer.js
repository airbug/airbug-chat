//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AnonymousRegisterPageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.CreateRoomFormView')
//@Require('airbug.PageView')
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
var CreateRoomFormView      = bugpack.require('airbug.CreateRoomFormView');
var PageView                = bugpack.require('airbug.PageView');
var BugMeta = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var autowired   = AutowiredAnnotation.autowired;
var property    = PropertyAnnotation.property;
var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnonymousRegisterPageContainer = Class.extend(ApplicationContainer, {

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
         * @type {RoomManagerModule}
         */
        this.roomManagerModule      = null;


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
bugmeta.annotate(AnonymousRegisterPageContainer).with(
    autowired().properties([
        property("navigationModule").ref("navigationModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AnonymousRegisterPageContainer", AnonymousRegisterPageContainer);

