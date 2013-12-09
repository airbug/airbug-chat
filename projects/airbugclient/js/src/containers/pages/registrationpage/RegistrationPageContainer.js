//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('RegistrationPageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.BoxView')
//@Require('airbug.LoginButtonContainer')
//@Require('airbug.PageView')
//@Require('airbug.RegistrationFormContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var ApplicationContainer        = bugpack.require('airbug.ApplicationContainer');
var BoxView                     = bugpack.require('airbug.BoxView');
var PageView                    = bugpack.require('airbug.PageView');
var LoginButtonContainer        = bugpack.require('airbug.LoginButtonContainer');
var RegistrationFormContainer   = bugpack.require('airbug.RegistrationFormContainer');
var ViewBuilder                 = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view                        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {ApplicationContainer}
 */
var RegistrationPageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------


        // Containers
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


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BoxView}
         */
        this.boxView                    = null;

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
                .children([
                    view(BoxView)
                        .id("registrationBoxView")
                        .attributes({classes: "registration-box"})
                        .appendTo('*[id|="page"]')
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.getApplicationView().addViewChild(this.pageView, "#application-" + this.getApplicationView().getCid());
        this.boxView =  this.findViewById("registrationBoxView");
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.loginButtonContainer       = new LoginButtonContainer();
        this.registrationFormContainer  = new RegistrationFormContainer();
        this.addContainerChild(this.loginButtonContainer, "#header-right");
        this.addContainerChild(this.registrationFormContainer, "#" + this.boxView.getId());
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RegistrationPageContainer", RegistrationPageContainer);
