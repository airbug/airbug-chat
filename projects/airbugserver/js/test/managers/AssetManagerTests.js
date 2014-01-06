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
//@Require('mongo.DummyMongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


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
var DummyMongoDataStore     = bugpack.require('mongo.DummyMongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


var setupAssetTests = function(setupObject) {
    setupObject.entityManagerStore     = new EntityManagerStore();
    setupObject.mongoDataStore         = new DummyMongoDataStore();
    setupObject.schemaManager          = new SchemaManager();
    setupObject.entityProcessor        = new EntityProcessor(setupObject.schemaManager);
    setupObject.entityScan             = new EntityScan(setupObject.entityProcessor);
    setupObject.entityScan.scanClass(Asset);
    setupObject.assetManager           = new AssetManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.assetManager.setEntityType("Asset");

    setupObject.testMimeType           = "image/png";
    setupObject.testName               = "testName";
    setupObject.testThumbMimeType      = "image/png";
    setupObject.testThumbUrl           = "http://host/image_t.png";
    setupObject.testUrl                = "http://host/image.png";
    setupObject.testAssetData          = {
        mimeType: setupObject.testMimeType,
        name: setupObject.testName,
        thumbMimeType: setupObject.testThumbMimeType,
        thumbUrl: setupObject.testThumbUrl,
        url: setupObject.testUrl
    };
    setupObject.testAsset              = new Asset(setupObject.testAssetData);

    setupObject.testAssetData2         = {
        mimeType: 'image/jpeg',
        name: 'testJpeg',
        thumbMimeType: 'image/jpeg',
        thumbUrl: 'http://host/image_t.jpg',
        url: 'http://host/image.jpg'
    };
    setupObject.testAsset2             = new Asset(setupObject.testAssetData2);

};

var initializeManagers = function(setupObject, test) {
    var _this = setupObject;
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
    ]).execute(function(throwable) {
        if (throwable) {
            test.error(throwable);
        }
    });
};

var createEntities = function(setupObject, test) {
    var _this = setupObject;
    $series([
        $task(function(flow) {
            _this.assetManager.createAsset(_this.testAsset, function(throwable, asset) {
                if (!throwable) {
                    test.assertTrue(!! asset.getId(),
                        'Newly created asset should have an id');
                    test.assertEqual(asset.getName(), _this.testName,
                        'Name should match test name');
                    _this.createdAsset = asset;
                }
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            _this.assetManager.createAsset(_this.testAsset2, function(throwable, asset) {
                if (!throwable) {
                    test.assertTrue(!! asset.getId(),
                        'Newly created asset should have an id which is ' + asset.getId(), asset.getId());
                    test.assertEqual(asset.getName(), "testJpeg",
                        'Name should match test name');
                    _this.createdAsset2 = asset;
                }
                flow.complete(throwable);
            });
        })
    ]).execute(function(throwable) {
        if (throwable) {
            test.error(throwable);
        }
    });
};
//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var assetManagerCreateAssetTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetTests(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
        var asset = _this.createdAsset;
        test.assertTrue(!! asset.getId(),
            'Newly created asset should have an id');
        test.assertEqual(asset.getName(), _this.testName,
            'Name should match test name');
        test.complete();
    }
};

var assetManagerDeleteAssetTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetTests(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
        var asset = _this.createdAsset;
        var assetId = asset.getId();
        $series([
            $task(function(flow) {
                _this.assetManager.deleteAsset(asset, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.assetManager.retrieveAsset(assetId, function(throwable, retrievedAsset) {
                    if (! throwable) {
                        test.assertTrue(retrievedAsset === null,
                            "attempting to retrieve a deleted asset should return null.");
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.complete();
            } else {
                test.error(throwable);
            }
        });
    }
};

var assetManagerGenerateAssetTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetTests(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(_this, test);
        var asset = _this.assetManager.generateAsset(_this.testAssetData);
        test.assertEqual(asset.getMimeType(), 'image/png',
            'mime type should match on generated asset');
        test.assertEqual(asset.getName(), 'testName',
            'name should match on generated asset');
        test.assertEqual(asset.getThumbMimeType(), 'image/png',
            'thumb mime type should match on generated asset');
        test.assertEqual(asset.getThumbUrl(), 'http://host/image_t.png',
            'thumb url should match on generated asset');
        test.assertEqual(asset.getUrl(), 'http://host/image.png',
            'url should match on generated asset');
        test.complete();
    }
};

var assetManagerPopulateAssetTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetTests(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(_this, test);
        createEntities(this, test);
        var createdAsset = _this.createdAsset;
        _this.assetManager.populateAsset(createdAsset, [], function(throwable, asset) {
            // dkk - since no properties are populated we don't get an asset back. Should we?
            if (throwable) {
                test.error();
            } else {
                test.complete();
            }
        });
    }
};

var assetManagerRetrieveAssetTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetTests(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(_this, test);
        createEntities(this, test);
        var createdAsset = _this.createdAsset;
        var createdAsset2 = _this.createdAsset2;
        _this.assetManager.retrieveAsset(createdAsset.getId(), function(throwable, asset) {
            if (throwable) {
                test.error();
            } else {
                test.assertEqual(asset.getMimeType(), 'image/png',
                    'mime type should match on generated asset');
                test.assertEqual(asset.getName(), 'testName',
                    'name should match on generated asset');
                test.assertEqual(asset.getThumbMimeType(), 'image/png',
                    'thumb mime type should match on generated asset');
                test.assertEqual(asset.getThumbUrl(), 'http://host/image_t.png',
                    'thumb url should match on generated asset');
                test.assertEqual(asset.getUrl(), 'http://host/image.png',
                    'url should match on generated asset');
                test.complete();
            }
        });
    }
};

var assetManagerRetrieveAssetsTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetTests(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(_this, test);
        createEntities(this, test);
        var createdAsset = _this.createdAsset;
        var createdAsset2 = _this.createdAsset2;
        var createdAssetIds = [createdAsset.getId(), createdAsset2.getId()];
        _this.assetManager.retrieveAssets(createdAssetIds, function(throwable, assetsMap) {
            /*
            console.log("assetsMap: " + assetsMap);
            console.log("assetsMap: ", assetsMap.getValueArray());
            console.log("assetsMap.containsKey() ", assetsMap.containsKey(createdAsset.getId()));
            var asset = assetsMap.get(createdAsset.getId());
            console.log("asset = ", asset);
            assertEqual(asset.getName(), "testName",
                "name should match expected name on retrieved asset");
            asset = assetsMap.get(createdAsset2.getId());
            assertEqual(asset.getName(), "testJpeg",
                "name should match expected name on retrieved asset");
            */
            test.complete();
        });
    }
};

var assetManagerUpdateAssetTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupAssetTests(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(_this, test);
        createEntities(this, test);
        var createdAsset = _this.createdAsset;
        createdAsset.setMimeType('image/gif');
        createdAsset.setName('newTestName');
        createdAsset.setThumbMimeType('image/gif');
        createdAsset.setThumbUrl('http://host/image_t.gif');
        createdAsset.setUrl('http://host/image.gif');
        _this.assetManager.updateAsset(createdAsset, function(throwable, asset) {
            if (throwable) {
                test.error();
            } else {
                test.assertEqual(asset.getMimeType(), 'image/gif',
                    'mime type should match on updated asset');
                test.assertEqual(asset.getName(), 'newTestName',
                    'name should match on updated asset');
                test.assertEqual(asset.getThumbMimeType(), 'image/gif',
                    'thumb mime type should match on updated asset');
                test.assertEqual(asset.getThumbUrl(), 'http://host/image_t.gif',
                    'thumb url should match on updated asset');
                test.assertEqual(asset.getUrl(), 'http://host/image.gif',
                    'url should match on updated asset');
                test.complete();
            }
        });
    }
};


bugmeta.annotate(assetManagerCreateAssetTest).with(
    test().name("AssetManager - createAsset Test")
);

bugmeta.annotate(assetManagerDeleteAssetTest).with(
    test().name("AssetManager - deleteAsset Test")
);

bugmeta.annotate(assetManagerGenerateAssetTest).with(
    test().name("AssetManager - generateAsset Test")
);

bugmeta.annotate(assetManagerPopulateAssetTest).with(
    test().name("AssetManager - populateAsset Test")
);

bugmeta.annotate(assetManagerRetrieveAssetTest).with(
    test().name("AssetManager - retrieveAsset Test")
);

bugmeta.annotate(assetManagerRetrieveAssetsTest).with(
    test().name("AssetManager - retrieveAssets Test")
);

bugmeta.annotate(assetManagerUpdateAssetTest).with(
    test().name("AssetManager - updateAsset Test")
);
