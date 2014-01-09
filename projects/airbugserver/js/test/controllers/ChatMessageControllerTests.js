//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.ChatMessageController')
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
var ChatMessageController   = bugpack.require('airbugserver.ChatMessageController');
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

var chatMessageControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.chatMessageService     = {};
        this.chatMessageController  = new ChatMessageController(this.controllerManager, this.expressApp, this.bugCallRouter, this.chatMessageService);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.chatMessageController, EntityController),
            "Assert chatMessageController extends EntityController");
        test.assertEqual(this.chatMessageController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.chatMessageController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to chatMessageController's expressApp property");
        test.assertEqual(this.chatMessageController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to chatMessageController's expressApp property");
        test.assertEqual(this.chatMessageController.getChatMessageService(), this.chatMessageService,
            "Assert chatMessageService has been set to chatMessageController's expressApp property");
    }
};
bugmeta.annotate(chatMessageControllerInstantiationTest).with(
    test().name("ChatMessageController - instantiation Test")
);
