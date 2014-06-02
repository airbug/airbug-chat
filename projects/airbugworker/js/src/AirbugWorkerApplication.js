//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugworker.AirbugWorkerApplication')
//@Autoload

//@Require('Class')
//@Require('bugapp.Application')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Application                         = bugpack.require('bugapp.Application');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Application}
 */
var AirbugWorkerApplication = Class.extend(Application, {

    //-------------------------------------------------------------------------------
    // Application Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    preProcessApplication: function() {
        this.getConfigurationTagScan().scanBugpack('airbugworker.AirbugWorkerConfiguration');
        this.getModuleTagScan().scanBugpacks([
            "bugmarsh.MarshRegistry",
            "bugmarsh.Marshaller",
            "bugwork.WorkerCommandFactory",
            "bugwork.WorkerContextFactory",
            "bugwork.WorkerManager",
            "bugwork.WorkerProcessFactory",
            "bugwork.WorkerRegistry",
            "loggerbug.Logger",
            "airbugworker.AirbugWorkerInitializer"
        ]);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugworker.AirbugWorkerApplication', AirbugWorkerApplication);
