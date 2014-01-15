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
        this.testId                 = 'testId';
        this.testMimeType           = 'image/png';
        this.testMidsizeMimeType    = 'image/png';
        this.testMidsizeUrl         = 'http://host/image_m.png';
        this.testSize               = 12345;
        this.testThumbnailMimeType      = 'image/png';
        this.testThumbnailUrl       = 'http://host/image_t.png';
        this.testUrl                = 'http://host/image.png';
        this.testAsset = new Asset({
            id: this.testId,
            midsizeMimeType: this.testMidsizeMimeType,
            midsizeUrl: this.testMidsizeUrl,
            mimeType: this.testMimeType,
            size: this.testSize,
            thumbnailMimeType: this.testThumbnailMimeType,
            thumbnailUrl: this.testThumbnailUrl,
            url: this.testUrl
        });
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // Verify instantiation worked properly and values are available.
        test.assertEqual(this.testAsset.getId(), this.testId,
            'Assert asset id was set correctly');
        test.assertEqual(this.testAsset.getSize(), this.testSize,
            'Assert Asset.mimeType was set correctly');
        test.assertEqual(this.testAsset.getMidsizeMimeType(), this.testMidsizeMimeType,
            'Assert Asset.midsizeMimeType was set correctly');
        test.assertEqual(this.testAsset.getMidsizeUrl(), this.testMidsizeUrl,
            'Assert Asset.midsizeUrl was set correctly');
        test.assertEqual(this.testAsset.getMimeType(), this.testMimeType,
            'Assert Asset.mimeType was set correctly');
        test.assertEqual(this.testAsset.getThumbnailMimeType(), this.testThumbnailMimeType,
            'Assert Asset.mimeType was set correctly');
        test.assertEqual(this.testAsset.getThumbnailUrl(), this.testThumbnailUrl,
            'Assert Asset.thumbnailUrl was set correctly');
        test.assertEqual(this.testAsset.getUrl(), this.testUrl,
            'Assert Asset.url was set correctly');

        // Verify setters work
        this.testAsset.setMidsizeMimeType('image/jpeg');
        test.assertEqual(this.testAsset.getMidsizeMimeType(), 'image/jpeg',
            'Assert Asset.setMidsizeMimeType works correctly');
        this.testAsset.setMidsizeUrl('http://otherhost/image_m.jpg');
        test.assertEqual(this.testAsset.getMidsizeUrl(), 'http://otherhost/image_m.jpg',
            'Assert Asset.setMidsizeUrl works correctly');
        this.testAsset.setMimeType('image/jpeg');
        test.assertEqual(this.testAsset.getMimeType(), 'image/jpeg',
            'Assert Asset.setMimeType works correctly');
        this.testAsset.setMimeType('image/jpeg');
        test.assertEqual(this.testAsset.getSize(), 12345,
            'Assert Asset.setSize works correctly');
        this.testAsset.setThumbnailMimeType('image/jpeg');
        test.assertEqual(this.testAsset.getThumbnailMimeType(), 'image/jpeg',
            'Assert Asset.setThumbnailMimeType works correctly');
        this.testAsset.setThumbnailUrl('http://otherhost/image_t.jpg');
        test.assertEqual(this.testAsset.getThumbnailUrl(), 'http://otherhost/image_t.jpg',
            'Assert Asset.setThumbnailUrl works correctly');
        this.testAsset.setUrl('http://otherhost/image.jpg');
        test.assertEqual(this.testAsset.getUrl(), 'http://otherhost/image.jpg',
            'Assert Asset.setUrl works correctly');
    }
};
bugmeta.annotate(assetBasicsTest).with(
    test().name('Asset - instantiation and getter/setter Test')
);
