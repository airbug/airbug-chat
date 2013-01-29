//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ApplicationConfiguration')

//@Require('Class')
//@Require('Obj')
//@Require('airbug.NavigationModule')
//@Require('airbug.PageStateModule')
//@Require('airbug.SessionModule')
//@Require('annotate.Annotate')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('carapace.CarapaceApplication')
//@Require('carapace.CarapaceRouter')
//@Require('carapace.ControllerScan')
//@Require('bugioc.PropertyAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                     bugpack.require('Class');
var Obj =                       bugpack.require('Obj');
var NavigationModule =          bugpack.require('airbug.NavigationModule');
var PageStateModule =           bugpack.require('airbug.PageStateModule');
var SessionModule =             bugpack.require('airbug.SessionModule');
var Annotate =                  bugpack.require('annotate.Annotate');
var ArgAnnotation =             bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation =   bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration =            bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation =          bugpack.require('bugioc.ModuleAnnotation');
var CarapaceApplication =       bugpack.require('carapace.CarapaceApplication');
var CarapaceRouter =            bugpack.require('carapace.CarapaceRouter');
var ControllerScan =            bugpack.require('carapace.ControllerScan');
var PropertyAnnotation =        bugpack.require('bugioc.PropertyAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var arg = ArgAnnotation.arg;
var configuration = ConfigurationAnnotation.configuration;
var module = ModuleAnnotation.module;
var property = PropertyAnnotation.property;


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
     * @return {PageStateModule}
     */
    pageStateModule: function() {
        return new PageStateModule();
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
    configuration().modules([
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
        module("pageStateModule")
            .properties([
                property("carapaceRouter").ref("carapaceRouter")
            ]),
        module("sessionModule")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ApplicationConfiguration", ApplicationConfiguration);
