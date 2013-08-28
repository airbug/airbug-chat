//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugClientApplication')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.AutowiredScan')
//@Require('bugioc.ConfigurationScan')
//@Require('bugioc.IocContext')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var AutowiredScan       = bugpack.require('bugioc.AutowiredScan');
var ConfigurationScan   = bugpack.require('bugioc.ConfigurationScan');
var IocContext          = bugpack.require('bugioc.IocContext');


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
        this.autowiredScan      = new AutowiredScan(this.iocContext);

        /**
         * @private
         * @type {ConfigurationScan}
         */
        this.configurationScan  = new ConfigurationScan(this.iocContext);
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    start: function(callback) {
        this.autowiredScan.scan();
        this.configurationScan.scan();
        this.iocContext.process();
        this.iocContext.initialize(callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugClientApplication", AirbugClientApplication);
