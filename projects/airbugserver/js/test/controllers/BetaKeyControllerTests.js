//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.BetaKeyController')
//@Require('airbugserver.EntityController')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BetaKeyController  = bugpack.require('airbugserver.BetaKeyController');
var EntityController        = bugpack.require('airbugserver.EntityController');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var betaKeyControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.betaKeyService         = {};
        this.marshaller             = {};
        this.betaKeyController = new BetaKeyController(this.controllerManager, this.expressApp, this.bugCallRouter, this.betaKeyService,
            this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.betaKeyController, EntityController),
            "Assert betaKeyController extends EntityController");
        test.assertEqual(this.betaKeyController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.betaKeyController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to betaKeyController's expressApp property");
        test.assertEqual(this.betaKeyController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to betaKeyController's expressApp property");
        test.assertEqual(this.betaKeyController.getBetaKeyService(), this.betaKeyService,
            "Assert betaKeyService has been set to betaKeyController's expressApp property");
        test.assertEqual(this.betaKeyController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to betaKeyController's marshaller property");
        test.assertNotEqual(this.betaKeyController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.annotate(betaKeyControllerInstantiationTest).with(
    test().name("BetaKeyController - instantiation Test")
);
