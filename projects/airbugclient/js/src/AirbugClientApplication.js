//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugClientApplication')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.AutowiredAnnotationProcessor')
//@Require('bugioc.AutowiredScan')
//@Require('bugioc.ConfigurationAnnotationProcessor')
//@Require('bugioc.ConfigurationScan')
//@Require('bugioc.ModuleAnnotationProcessor')
//@Require('bugioc.ModuleScan')
//@Require('bugioc.IocContext')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Obj                                 = bugpack.require('Obj');
var AutowiredAnnotationProcessor        = bugpack.require('bugioc.AutowiredAnnotationProcessor');
var AutowiredScan                       = bugpack.require('bugioc.AutowiredScan');
var ConfigurationAnnotationProcessor    = bugpack.require('bugioc.ConfigurationAnnotationProcessor');
var ConfigurationScan                   = bugpack.require('bugioc.ConfigurationScan');
var IocContext                          = bugpack.require('bugioc.IocContext');
var ModuleAnnotationProcessor           = bugpack.require('bugioc.ModuleAnnotationProcessor');
var ModuleScan                          = bugpack.require('bugioc.ModuleScan');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugClientApplication = Class.extend(Obj, {

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
         * @type {IocContext}
         */
        this.iocContext         = new IocContext();

        /**
         * @private
         * @type {AutowiredScan}
         */
        this.autowiredScan      = new AutowiredScan(new AutowiredAnnotationProcessor(this.iocContext));

        /**
         * @private
         * @type {ConfigurationScan}
         */
        this.configurationScan  = new ConfigurationScan(new ConfigurationAnnotationProcessor(this.iocContext));

        /**
         * @private
         * @type {ModuleScan}
         */
        this.moduleScan         = new ModuleScan(new ModuleAnnotationProcessor(this.iocContext));
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    start: function(callback) {
        this.autowiredScan.scanAll();
        this.autowiredScan.scanContinuous();
        this.configurationScan.scanAll();
        this.moduleScan.scanAll();
        this.iocContext.process();
        this.iocContext.initialize(callback);
    }
});



//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugClientApplication", AirbugClientApplication);
