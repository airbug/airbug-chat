//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.EntityController')
//@Require('airbugserver.AssetController')
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
var AssetController         = bugpack.require('airbugserver.AssetController');
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

var assetControllerInstantiationTest = {

    setup: function() {
        this.controllerManager      = {};
        this.expressApp             = {};
        this.bugCallRouter          = {};
        this.assetService           = {};
        this.marshaller             = {};
        this.assetController        = new AssetController(this.controllerManager, this.expressApp, this.bugCallRouter,
            this.assetService, this.marshaller);
    },

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.assetController, EntityController),
            "Assert assetController extends EntityController");
        test.assertEqual(this.assetController.getControllerManager(), this.controllerManager,
            "Assert controllerManager has been set properly");
        test.assertEqual(this.assetController.getExpressApp(), this.expressApp,
            "Assert expressApp has been set to assetController's expressApp property");
        test.assertEqual(this.assetController.getBugCallRouter(), this.bugCallRouter,
            "Assert bugCallRouter has been set to assetController's bugCallRouter property");
        test.assertEqual(this.assetController.getAssetService(), this.assetService,
            "Assert assetService has been set to assetController's expressApp property");
        test.assertEqual(this.assetController.getMarshaller(), this.marshaller,
            "Assert marshaller has been set to assetController's marshaller property");
        test.assertNotEqual(this.assetController.getMarshaller(), undefined,
            "Assert marshaller is not undefined");
    }
};
bugmeta.annotate(assetControllerInstantiationTest).with(
    test().name("AssetController - instantiation Test")
);
