//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('UuidGenerator')
//@Require('airbugserver.Asset')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.MongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var UuidGenerator           = bugpack.require('UuidGenerator');
var Asset                   = bugpack.require('airbugserver.Asset');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var assetBasicsTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMimeType = "image/png";
        this.testThumbMimeType = "image/png";
        this.testThumbUrl = "http://host/image_t.png";
        this.testUrl = "http://host/image.png";
        this.testAsset = new Asset({
            mimeType: this.testMimeType,
            thumbMimeType: this.testThumbMimeType,
            thumbUrl: this.testThumbUrl,
            url: this.testUrl
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // Verify instantiation worked properly and values are available.
        test.assertEqual(this.testAsset.getMimeType(), this.testMimeType,
            "Assert Asset.mimeType was set correctly");
        test.assertEqual(this.testAsset.getThumbMimeType(), this.testThumbMimeType,
            "Assert Asset.mimeType was set correctly");
        test.assertEqual(this.testAsset.getThumbUrl(), this.testThumbUrl,
            "Assert Asset.thumbUrl was set correctly");
        test.assertEqual(this.testAsset.getUrl(), this.testUrl,
            "Assert Asset.url was set correctly");

        // Verify setters work
        this.testAsset.setMimeType("image/jpeg");
        test.assertEqual(this.testAsset.getMimeType(), "image/jpeg",
            "Assert Asset.setMimeType works correctly");
        this.testAsset.setThumbMimeType("image/jpeg");
        test.assertEqual(this.testAsset.getThumbMimeType(), "image/jpeg",
            "Assert Asset.setThumbMimeType works correctly");
        this.testAsset.setThumbUrl("http://otherhost/image_t.jpg");
        test.assertEqual(this.testAsset.getThumbUrl(), "http://otherhost/image_t.jpg",
            "Assert Asset.setThumbUrl works correctly");
        this.testAsset.setUrl("http://otherhost/image.jpg");
        test.assertEqual(this.testAsset.getUrl(), "http://otherhost/image.jpg",
            "Assert Asset.setUrl works correctly");
    }
};
bugmeta.annotate(assetBasicsTest).with(
    test().name("Asset - instantiation and getter/setter Test")
);
