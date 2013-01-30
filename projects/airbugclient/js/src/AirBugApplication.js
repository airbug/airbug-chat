//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('AirBugApplication')

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

var AirBugApplication = Class.extend(Obj, {

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
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    start: function() {
        this.configurationScan.scan();
    }
});


//-------------------------------------------------------------------------------
// Bootstrap
//-------------------------------------------------------------------------------

var airBugApplication = new AirBugApplication();

// NOTE BRN: Don't think this setTimeout is needed for now. However, this may be required when we start using the
// Autoload annotation to load this class since we have no control over the order in which Autoload classes are loaded.
// This would be required because all configuration classes also load using Autoload and the configuration classes
// need to load before we start the application and perform the configuration scan. Another way to do this might be
// to create a new file level "Configuration" annotation that indicates the file contains configurations (instead
// of using Autoload). Then the ConfigurationScan could perform a registry scan for files that contain the
// Configuration annotation and load those files.

//setTimeout(function(){
    airBugApplication.start();
//}, 0);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.AirBugApplication", AirBugApplication);
