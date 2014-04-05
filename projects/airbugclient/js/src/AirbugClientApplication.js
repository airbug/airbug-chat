//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirbugClientApplication')
//@Autoload

//@Require('Class')
//@Require('bugapp.Application')
//@Require('bugioc.AutowiredAnnotationProcessor')
//@Require('bugioc.AutowiredScan')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Application                         = bugpack.require('bugapp.Application');
var AutowiredAnnotationProcessor        = bugpack.require('bugioc.AutowiredAnnotationProcessor');
var AutowiredScan                       = bugpack.require('bugioc.AutowiredScan');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Application}
 */
var AirbugClientApplication = Class.extend(Application, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AutowiredScan}
         */
        this.autowiredScan      = new AutowiredScan(BugMeta.context(), new AutowiredAnnotationProcessor(this.getIocContext()));
    },


    //-------------------------------------------------------------------------------
    // Application Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    preProcessApplication: function() {
        this.autowiredScan.scanAll();
        this.autowiredScan.scanContinuous();
        this.getConfigurationScan().scanAll();
        this.getModuleScan().scanAll();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirbugClientApplication", AirbugClientApplication);
