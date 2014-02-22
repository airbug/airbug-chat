//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.EntityController')
//@Require('airbugserver.UserAssetController')
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
var UserAssetController     = bugpack.require('airbugserver.UserAssetController');
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

var userAssetControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.assetService           = {};
        this.marshaller             = {};
        this.userAssetController        = new UserAssetController(this.controllerManager, this.expressApp, this.bugCallRouter,
            this.assetService, this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.userAssetController, EntityController),
            "Assert assetController extends EntityController");
        test.assertEqual(this.userAssetController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.userAssetController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to userAssetController's expressApp property");
        test.assertEqual(this.userAssetController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to userAssetController's bugCallRouter property");
        test.assertEqual(this.userAssetController.getUserAssetService(), this.assetService,
            "Assert assetService has been set to userAssetController's expressApp property");
        test.assertEqual(this.userAssetController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to userAssetController's marshaller property");
        test.assertNotEqual(this.userAssetController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};

bugmeta.annotate(userAssetControllerInstantiationTest).with(
    test().name("UserAssetController - instantiation Test")
);
