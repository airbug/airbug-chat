//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('airbugserver.Asset')
//@Require('airbugserver.AssetManager')
//@Require('bugentity.EntityManagerStore')
//@Require('bugentity.EntityProcessor')
//@Require('bugentity.EntityScan')
//@Require('bugentity.SchemaManager')
//@Require('bugentity.SchemaProperty')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.MongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var mongoose                = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Asset                   = bugpack.require('airbugserver.Asset');
var AssetManager            = bugpack.require('airbugserver.AssetManager');
var EntityManagerStore      = bugpack.require('bugentity.EntityManagerStore');
var EntityProcessor         = bugpack.require('bugentity.EntityProcessor');
var EntityScan              = bugpack.require('bugentity.EntityScan');
var SchemaManager           = bugpack.require('bugentity.SchemaManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;

//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

/*var assetManagerTests = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        mongoose.connect('mongodb://localhost/airbugtest');

        this.entityManagerStore     = new EntityManagerStore();
        this.mongoDataStore         = new MongoDataStore(mongoose);
        this.schemaManager          = new SchemaManager();
        this.entityProcessor        = new EntityProcessor(this.schemaManager);
        this.entityScan             = new EntityScan(this.entityProcessor);
        this.entityScan.scanClass(Asset);
        this.assetManager           = new AssetManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore);
        this.assetManager.setEntityType("Asset");
        this.testMimeType           = "image/png";
        this.testThumbMimeType      = "image/png";
        this.testThumbUrl           = "http://host/image_t.png";
        this.testUrl                = "http://host/image.png";
        this.testAsset              = new Asset({
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
        var _this = this;
        $series([
            $task(function(flow) {
                _this.schemaManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.assetManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                console.log("Creating an asset");
                _this.assetManager.createAsset(_this.testAsset, function(throwable) {
                    console.log("inside createAsset callback");
                    if (!throwable) {
                        test.assertTrue(!! _this.testAsset.getId(),
                            "Newly created asset should have an id");
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.complete();
            } else {
                rest.error(throwable);
            }
        });
        //test.assertTrue(true, "making sure true is true");
    }
};

bugmeta.annotate(assetManagerTests).with(
    test().name("AssetManager Tests")
);
*/