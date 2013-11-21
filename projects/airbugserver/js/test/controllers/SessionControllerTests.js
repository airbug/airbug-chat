//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.EntityController')
//@Require('airbugserver.SessionController')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


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
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var sessionControllerInstantiationTest = {

    setup: function() {
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.sessionService            = {};
        this.sessionController      = new SessionController(this.expressApp, this.bugCallRouter, this.sessionService);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.sessionController, EntityController),
            "Assert sessionController extends EntityController");
        test.assertEqual(this.sessionController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to sessionController's expressApp property");
        test.assertEqual(this.sessionController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to sessionController's bugCallRouter property");
        test.assertEqual(this.sessionController.getSessionService(), this.sessionService,
            "Assert sessionService has been set to sessionController's expressApp property");
    }
};
bugmeta.annotate(sessionControllerInstantiationTest).with(
    test().name("SessionController - instantiation Test")
);
