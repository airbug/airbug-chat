//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('SignupPageContainer')

//@Require('Class')
//@Require('airbug.LoginButtonContainer')
//@Require('airbug.PageView')
//@Require('airbug.SignupFormView')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var LoginButtonContainer =  bugpack.require('airbug.LoginButtonContainer')
var PageView =              bugpack.require('airbug.PageView')
var SignupFormView =        bugpack.require('airbug.SignupFormView')
var ViewBuilder =           bugpack.require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SignupPageContainer = Class.extend(ApplicationContainer, {

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
        this.loginButtonContainer = null;

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView = null;
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
                    view(SignupFormView)
                        .appendTo('*[id|="page"]')
                ])
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
        this.loginButtonContainer = new LoginButtonContainer();
        this.addContainerChild(this.loginButtonContainer, "#header-right");
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.SignupPageContainer", SignupPageContainer);

