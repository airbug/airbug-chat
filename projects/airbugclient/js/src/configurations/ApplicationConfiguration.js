//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('ApplicationConfiguration')

//@Require('Annotate')
//@Require('AnnotateArg')
//@Require('AnnotateModule')
//@Require('AnnotateProperty')
//@Require('CarapaceApplication')
//@Require('CarapaceRouter')
//@Require('Class')
//@Require('ControllerScan')
//@Require('IConfiguration')
//@Require('NavigationModule')
//@Require('Obj')
//@Require('SessionModule')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var arg = AnnotateArg.arg;
var module = AnnotateModule.module;
var property = AnnotateProperty.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ApplicationConfiguration = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AutowiredScan}
         */
        this._autowiredScan = null;

        /**
         * @private
         * @type {CarapaceApplication}
         */
        this._carapaceApplication = null;

        /**
         * @private
         * @type {ControllerScan}
         */
        this._controllerScan = null;
    },


    //-------------------------------------------------------------------------------
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initializeConfiguration: function() {
        this._autowiredScan.scan();
        this._controllerScan.scan();
        this._carapaceApplication.start();
    },


    //-------------------------------------------------------------------------------
    // Configuration Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {AutowiredScan}
     */
    autowiredScan: function() {
        this._autowiredScan = new AutowiredScan();
        return this._autowiredScan;
    },

    /**
     * @param {CarapaceRouter} carapaceRouter
     * @return {CarapaceApplication}
     */
    carapaceApplication: function(carapaceRouter) {
        this._carapaceApplication = new CarapaceApplication(carapaceRouter);
        return this._carapaceApplication;
    },

    /**
     * @return {CarapaceRouter}
     */
    carapaceRouter: function() {
        return new CarapaceRouter();
    },

    /**
     * @param {CarapaceApplication} carapaceApplication
     * @return {ControllerScan}
     */
    controllerScan: function(carapaceApplication) {
        this._controllerScan = new ControllerScan(carapaceApplication);
        return this._controllerScan;
    },

    /**
     * @return {NavigationModule}
     */
    navigationModule: function() {
        return new NavigationModule();
    },

    /**
     * @return {SessionModule}
     */
    sessionModule: function() {
        return new SessionModule();
    }
});
Class.implement(ApplicationConfiguration, IConfiguration);
annotate(ApplicationConfiguration).with(
    annotation("Configuration").params(
        module("autowiredScan"),
        module("carapaceApplication")
            .args([
                arg().ref("carapaceRouter")
            ]),
        module("carapaceRouter"),
        module("controllerScan")
            .args([
                arg().ref("carapaceApplication")
            ]),
        module("navigationModule")
            .properties([
                property("carapaceRouter").ref("carapaceRouter")
            ]),
        module("sessionModule")
    )
);
