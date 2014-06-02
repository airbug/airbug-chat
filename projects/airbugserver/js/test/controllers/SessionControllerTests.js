//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.EntityController')
//@Require('airbugserver.SessionController')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var EntityController        = bugpack.require('airbugserver.EntityController');
var SessionController       = bugpack.require('airbugserver.SessionController');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var sessionControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.sessionService         = {};
        this.marshaller             = {};
        this.sessionController      = new SessionController(this.controllerManager, this.expressApp, this.bugCallRouter,
            this.sessionService, this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.sessionController, EntityController),
            "Assert sessionController extends EntityController");
        test.assertEqual(this.sessionController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.sessionController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to sessionController's expressApp property");
        test.assertEqual(this.sessionController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to sessionController's bugCallRouter property");
        test.assertEqual(this.sessionController.getSessionService(), this.sessionService,
            "Assert sessionService has been set to sessionController's expressApp property");
        test.assertEqual(this.sessionController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to sessionController's marshaller property");
        test.assertNotEqual(this.sessionController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.tag(sessionControllerInstantiationTest).with(
    test().name("SessionController - instantiation Test")
);
