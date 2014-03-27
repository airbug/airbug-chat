//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirbugServerApplication')
//@Autoload

//@Require('Class')
//@Require('bugapp.Application')
//@Require('bugentity.EntityManagerAnnotationProcessor')
//@Require('bugentity.EntityManagerScan')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Application                         = bugpack.require('bugapp.Application');
var EntityManagerAnnotationProcessor    = bugpack.require('bugentity.EntityManagerAnnotationProcessor');
var EntityManagerScan                   = bugpack.require('bugentity.EntityManagerScan');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Application}
 */
var AirbugServerApplication = Class.extend(Application, {

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
         * @type {EntityManagerScan}
         */
        this.entityManagerScan  = new EntityManagerScan(new EntityManagerAnnotationProcessor(this.getIocContext()));
    },


    //-------------------------------------------------------------------------------
    // Application Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    preProcessApplication: function() {
        this.getConfigurationScan().scanBugpacks([
            "airbugserver.AirbugServerConfiguration",
            "meldbugserver.MeldbugServerConfiguration"
        ]);
        this.entityManagerScan.scanAll();
        this.getModuleScan().scanAll({
            excludes: [
                "bugmigrate.MigrationInitializer",
                "bugmigrate.MigrationManager"
            ]
        });

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AirbugServerApplication', AirbugServerApplication);
