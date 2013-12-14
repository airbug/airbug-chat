//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Exception')
//@Require('airbugserver.Asset')
//@Require('airbugserver.AssetService')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var Session             = bugpack.require('airbugserver.Session');
var Asset               = bugpack.require('airbugserver.Asset');
var AssetService        = bugpack.require('airbugserver.AssetService');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');
var Logger              = bugpack.require('loggerbug.Logger');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


// Setup Methods
//-------------------------------------------------------------------------------

var setupAssetService = function(setupObject) {
    var dummyAssetManager = {
        createAsset: function(asset, callback) {
            callback(asset);
        },
        deleteAsset: function(asset, callback) {
            callback();
        },
        generateAsset: function(assetObject) {
            return new User(assetObject);
        },
        retrieveAsset: function(assetId, callback) {
            var asset = new Asset({
                id: assetId
            })
            callback(throwable, asset);
        }
    };
    setupObject.logger                      = new Logger();
    setupObject.testAssetService            = new AssetService(dummyAssetManager);
    setupObject.testAssetService.logger     = setupObject.logger;
};

var userServiceUploadAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // TODO - dkk - implement
        test.complete();
    }
};

var userServiceAddAssetFromUrlTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // TODO - dkk - implement
        test.complete();
    }
};

var userServiceDeleteAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testAssetService.deleteAsset(this.testRequestContext, "testAssetId", function(throwable, asset) {
            // TODO - dkk - implement
            test.complete(throwable);
        });
    }
};

bugmeta.annotate(userServiceUploadAssetTest).with(
    test().name("AssetService - Upload Asset Test")
);

bugmeta.annotate(userServiceAddAssetFromUrlTest).with(
    test().name("AssetService - Add Asset From Url Test")
);

bugmeta.annotate(userServiceDeleteAssetTest).with(
    test().name("AssetService - Delete Asset Test")
);
