//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RegistrationPageContainer')

//@Require('Class')
//@Require('airbug.LoginButtonContainer')
//@Require('airbug.PageView')
//@Require('airbug.RegistrationFormContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var PageView                    = bugpack.require('airbug.PageView');
var LoginButtonContainer        = bugpack.require('airbug.LoginButtonContainer');
var RegistrationFormContainer   = bugpack.require('airbug.RegistrationFormContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RegistrationPageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {LoginButtonContainer}
         */
        this.loginButtonContainer       = null;

        /**
         * @protected
         * @type {RegistrationFormContainer}
         */
        this.registrationFormContainer  = null;

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView                   = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
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
        this.loginButtonContainer       = new LoginButtonContainer();
        this.registrationFormContainer  = new RegistrationFormContainer();
        this.addContainerChild(this.loginButtonContainer, "#header-right");
        this.addContainerChild(this.registrationFormContainer, "#page-" + this.pageView.cid);
    }
});

// bugmeta.annotate(RegistrationPageContainer).with(
//     autowired().properties([
//         property("currentUserManagerModule").ref("currentUserManagerModule")
//     ])
// );

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RegistrationPageContainer", RegistrationPageContainer);

