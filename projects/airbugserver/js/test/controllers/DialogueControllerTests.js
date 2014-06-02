//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.DialogueController')
//@Require('airbugserver.EntityController')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var DialogueController      = bugpack.require('airbugserver.DialogueController');
var EntityController        = bugpack.require('airbugserver.EntityController');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta = BugMeta.context();
var test = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var dialogueControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.dialogueService        = {};
        this.marshaller             = {};
        this.dialogueController = new DialogueController(this.controllerManager, this.expressApp, this.bugCallRouter, this.dialogueService,
            this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.dialogueController, EntityController),
            "Assert dialogueController extends EntityController");
        test.assertEqual(this.dialogueController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.dialogueController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to dialogueController's expressApp property");
        test.assertEqual(this.dialogueController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to dialogueController's expressApp property");
        test.assertEqual(this.dialogueController.getDialogueService(), this.dialogueService,
            "Assert dialogueService has been set to dialogueController's expressApp property");
        test.assertEqual(this.dialogueController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to dialogueController's marshaller property");
        test.assertNotEqual(this.dialogueController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.tag(dialogueControllerInstantiationTest).with(
    test().name("DialogueController - instantiation Test")
);
