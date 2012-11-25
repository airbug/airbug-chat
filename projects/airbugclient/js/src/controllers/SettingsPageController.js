//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SettingsPageController')

//@Require('Annotate')
//@Require('ApplicationController')
//@Require('Class')
//@Require('ControllerAnnotation')
//@Require('LoginPageContainer')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var controller = ControllerAnnotation.controller;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SettingsPageController = Class.extend(ApplicationController, {

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
         * @type {SettingsPageContainer}
         */
        this.settingsPageContainer = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createController: function() {
        this._super();
        this.settingsPageContainer = new SettingsPageContainer();
        this.setContainerTop(this.settingsPageContainer);
    }
});
annotate(SettingsPageController).with(
    controller().route("settings")
);
