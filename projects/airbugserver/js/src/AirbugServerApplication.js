//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirbugServerApplication')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugentity.EntityManagerAnnotationProcessor')
//@Require('bugentity.EntityManagerScan')
//@Require('bugioc.ConfigurationAnnotationProcessor')
//@Require('bugioc.ConfigurationScan')
//@Require('bugioc.ModuleAnnotationProcessor')
//@Require('bugioc.ModuleScan')
//@Require('bugioc.IocContext')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Obj                                 = bugpack.require('Obj');
var EntityManagerAnnotationProcessor    = bugpack.require('bugentity.EntityManagerAnnotationProcessor');
var EntityManagerScan                   = bugpack.require('bugentity.EntityManagerScan');
var IocContext                          = bugpack.require('bugioc.IocContext');
var ConfigurationAnnotationProcessor    = bugpack.require('bugioc.ConfigurationAnnotationProcessor');
var ConfigurationScan                   = bugpack.require('bugioc.ConfigurationScan');
var ModuleAnnotationProcessor           = bugpack.require('bugioc.ModuleAnnotationProcessor');
var ModuleScan                          = bugpack.require('bugioc.ModuleScan');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugServerApplication = Class.extend(Obj, {

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
         * @type {ConfigurationScan}
         */
        this.configurationScan  = new ConfigurationScan(new ConfigurationAnnotationProcessor(this.iocContext));

        /**
         * @private
         * @type {EntityManagerScan}
         */
        this.entityManagerScan  = new EntityManagerScan(new EntityManagerAnnotationProcessor(this.iocContext));

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
        this.configurationScan.scanAll();
        this.entityManagerScan.scanAll();
        this.moduleScan.scanAll();
        this.iocContext.process();
        this.iocContext.initialize(callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AirbugServerApplication', AirbugServerApplication);
