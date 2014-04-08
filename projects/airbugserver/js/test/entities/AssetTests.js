//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('airbugserver.Asset')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Asset                   = bugpack.require('airbugserver.Asset');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var assetInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testAssetData = {
            createdAt: new Date(Date.now()),
            id: "testId",
            midsizeMimeType: "testMidsizeMimeType",
            midsizeUrl: "testMidsizeUrl",
            mimeType: "testMimeType",
            name: "testName",
            thumbnailMimeType: "testThumbnailMimeType",
            thumbnailUrl: "testThumbnailUrl",
            type: "testType",
            updatedAt: new Date(Date.now()),
            url: "testUrl"
        };
        this.testAsset = new Asset(this.testAssetData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testAsset.getCreatedAt(), this.testAssetData.createdAt,
            "Assert Asset.createdAt was set correctly");
        test.assertEqual(this.testAsset.getId(), this.testAssetData.id,
            "Assert Asset.id was set correctly");
        test.assertEqual(this.testAsset.getMidsizeMimeType(), this.testAssetData.midsizeMimeType,
            "Assert Asset.midsizeMimeType was set correctly");
        test.assertEqual(this.testAsset.getMidsizeUrl(), this.testAssetData.midsizeUrl,
            "Assert Asset.midsizeUrl was set correctly");
        test.assertEqual(this.testAsset.getMimeType(), this.testAssetData.mimeType,
            "Assert Asset.mimeType was set correctly");
        test.assertEqual(this.testAsset.getName(), this.testAssetData.name,
            "Assert Asset.name was set correctly");
        test.assertEqual(this.testAsset.getSize(), this.testAssetData.size,
            "Assert Asset.size was set correctly");
        test.assertEqual(this.testAsset.getThumbnailMimeType(), this.testAssetData.thumbnailMimeType,
            "Assert Asset.thumbnailMimeType was set correctly");
        test.assertEqual(this.testAsset.getThumbnailUrl(), this.testAssetData.thumbnailUrl,
            "Assert Asset.thumbnailUrl was set correctly");
        test.assertEqual(this.testAsset.getUpdatedAt(), this.testAssetData.updatedAt,
            "Assert Asset.updatedAt was set correctly");
        test.assertEqual(this.testAsset.getUrl(), this.testAssetData.url,
            "Assert Asset.url was set correctly");
    }
};
bugmeta.annotate(assetInstantiationTest).with(
    test().name("Asset - instantiation Test")
);
