//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirbugApplication')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ConfigurationScan')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Obj =               bugpack.require('Obj');
var ConfigurationScan = bugpack.require('bugioc.ConfigurationScan');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugApplication = Class.extend(Obj, {

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
         * @type {ConfigurationScan}
         */
        this.configurationScan = new ConfigurationScan();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    start: function(callback) {
        this.configurationScan.scan(callback);
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AirbugApplication', AirbugApplication);
