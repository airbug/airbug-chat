//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.ConversationController')
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
var ConversationController  = bugpack.require('airbugserver.ConversationController');
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

var conversationControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.conversationService     = {};
        this.conversationController  = new ConversationController(this.controllerManager, this.expressApp, this.bugCallRouter, this.conversationService);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.conversationController, EntityController),
            "Assert conversationController extends EntityController");
        test.assertEqual(this.conversationController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.conversationController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to conversationController's expressApp property");
        test.assertEqual(this.conversationController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to conversationController's expressApp property");
        test.assertEqual(this.conversationController.getConversationService(), this.conversationService,
            "Assert conversationService has been set to conversationController's expressApp property");
    }
};
bugmeta.annotate(conversationControllerInstantiationTest).with(
    test().name("ConversationController - instantiation Test")
);
