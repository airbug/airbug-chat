//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Class = require('./Class');
var List = require('./List');
var Obj = require('./Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ServerApplication = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.deployed = false;

        this.initialized = false;

        this.moduleList = new List();
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    // TODO BRN (QUESTION): Can a module be added more than once? Is there need to add the same module multiple times configured differently?

    addModule: function(module) {
        this.moduleList.add(module);
    },

    // TODO BRN: Deployment like this should be able to be abstracted in to a description of the application and it's
    // necessary architecture. The deployment system should be able to ensure that all necessary binaries are installed
    // and then handle starting up of the appropriate servers. It should also be responsible for passing along the
    // ip, port, and credentials of each running instance.

    deploy: function() {
        if (!this.deployed) {
            this.deployed = true;
            this.deployApplication();
        }
    },

    deployApplication: function() {
        this.moduleList.forEach(function(module) {
            module.deploy();
        });
    },

    initialize: function() {
        if (!this.initialized) {
            this.initialized = true;
            this.initializeApplication();
        }
    },

    initializeApplication: function() {
        this.moduleList.forEach(function(module) {
            module.initialize();
        });
    },

    start: function() {
        this.initialize();
    }
});


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = ServerApplication;
