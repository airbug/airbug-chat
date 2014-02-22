//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.EntityController')
//@Require('airbugserver.UserController')
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
var UserController          = bugpack.require('airbugserver.UserController');
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

var userControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.userService            = {};
        this.marshaller             = {};
        this.userController         = new UserController(this.controllerManager, this.expressApp, this.bugCallRouter, this.userService,
            this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.userController, EntityController),
            "Assert userController extends EntityController");
        test.assertEqual(this.userController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.userController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to userController's expressApp property");
        test.assertEqual(this.userController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to userController's bugCallRouter property");
        test.assertEqual(this.userController.getUserService(), this.userService,
            "Assert userService has been set to userController's expressApp property");
        test.assertEqual(this.userController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to userController's marshaller property");
        test.assertNotEqual(this.userController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.annotate(userControllerInstantiationTest).with(
    test().name("UserController - instantiation Test")
);
