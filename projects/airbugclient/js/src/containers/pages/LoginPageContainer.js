//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('LoginPageContainer')

//@Require('Annotate')
//@Require('AutowiredAnnotation')
//@Require('ApplicationContainer')
//@Require('Class')
//@Require('LoginFormView')
//@Require('PageView')
//@Require('PropertyAnnotation')
//@Require('SignupButtonContainer')
//@Require('ViewBuilder')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var autowired = AutowiredAnnotation.autowired;
var property = PropertyAnnotation.property;
var view = ViewBuilder.view;


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
        this.navigationModule = null;

        /**
         * @private
         * @type {SessionModule}
         */
        this.sessionModule = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {LoginFormView}
         */
        this.loginFormView = null;

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView = null;

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
