//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.InteractionStatusController')
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
var InteractionStatusController      = bugpack.require('airbugserver.InteractionStatusController');
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

var interactionStatusControllerInstantiationTest = {

    setup: function() {
        this.controllerManager          = {};
        this.expressApp                 = {};
        this.bugCallRouter              = {};
        this.interactionStatusService   = {};
        this.marshaller                 = {};
        this.interactionStatusController = new InteractionStatusController(this.controllerManager, this.expressApp, this.bugCallRouter, this.interactionStatusService,
            this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.interactionStatusController, EntityController),
            "Assert interactionStatusController extends EntityController");
        test.assertEqual(this.interactionStatusController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.interactionStatusController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to interactionStatusController's expressApp property");
        test.assertEqual(this.interactionStatusController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to interactionStatusController's expressApp property");
        test.assertEqual(this.interactionStatusController.getInteractionStatusService(), this.interactionStatusService,
            "Assert interactionStatusService has been set to interactionStatusController's expressApp property");
        test.assertEqual(this.interactionStatusController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to interactionStatusController's marshaller property");
        test.assertNotEqual(this.interactionStatusController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.annotate(interactionStatusControllerInstantiationTest).with(
    test().name("InteractionStatusController - instantiation Test")
);
