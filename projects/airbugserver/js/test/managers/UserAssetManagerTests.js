//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Set')
//@Require('airbugserver.Asset')
//@Require('airbugserver.AssetManager')
//@Require('airbugserver.User')
//@Require('airbugserver.UserManager')
//@Require('airbugserver.UserAsset')
//@Require('airbugserver.UserAssetManager')
//@Require('bugentity.EntityManagerStore')
//@Require('bugentity.SchemaManager')
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

var Set                     = bugpack.require('Set');
var Asset                   = bugpack.require('airbugserver.Asset');
var AssetManager            = bugpack.require('airbugserver.AssetManager');
var User                    = bugpack.require('airbugserver.User');
var UserManager             = bugpack.require('airbugserver.UserManager');
var UserAsset               = bugpack.require('airbugserver.UserAsset');
var UserAssetManager        = bugpack.require('airbugserver.UserAssetManager');
var EntityManagerStore      = bugpack.require('bugentity.EntityManagerStore');
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


//-------------------------------------------------------------------------------
// Declare Setup Objects
//-------------------------------------------------------------------------------

var setupUserAssetManager = function(setupObject) {
    setupObject.testUser               = new User({});
    setupObject.testAsset              = new Asset({});
    setupObject.entityManagerStore     = new EntityManagerStore();
    setupObject.mongoDataStore         = new DummyMongoDataStore();
    setupObject.schemaManager          = new SchemaManager();
    setupObject.assetManager           = new AssetManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.assetManager.setEntityType("Asset");
    setupObject.userManager            = new UserManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.userManager.setEntityType("User");
    setupObject.userAssetManager       = new UserAssetManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.userAssetManager.setEntityType("UserAsset");
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
            _this.userAssetManager.initializeModule(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            _this.assetManager.initializeModule(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            _this.userManager.initializeModule(function(throwable) {
                flow.complete(throwable);
            });
        })
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
            _this.userManager.createUser(_this.testUser, function(throwable, user) {
                if (!throwable) {
                    _this.testUserId = user.getId();
                    flow.complete();
                } else {
                    flow.complete(throwable);
                }
            });
        }),
        $task(function(flow) {
            _this.assetManager.createAsset(_this.testAsset, function(throwable, asset) {
                if (!throwable) {
                    _this.testAssetId = asset.getId();
                    flow.complete();
                } else {
                    flow.complete(throwable);
                }
            });
        }),
        $task(function(flow) {
            _this.testUserAsset = _this.userAssetManager.generateUserAsset({
                assetId: _this.testAssetId,
                userId: _this.testUserId
            });
            flow.complete();
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

var userAssetManagerCreateUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetManager(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
        $series([
            $task(function(flow) {
                _this.userAssetManager.createUserAsset(_this.testUserAsset, function(throwable, userAsset) {
                    if (!throwable) {
                        test.assertEqual(_this.testUserAsset, userAsset,
                            "Assert userAsset returned is the same userAsset sent in");
                        var id = userAsset.getId();
                        test.assertTrue(!!id,
                            "Assert create UserAsset has an id. id = " + id);
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

var userAssetManagerDeleteUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetManager(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
    }
};

var userAssetManagerGenerateUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetManager(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
    }
};

var userAssetManagerPopulateUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetManager(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
    }
};

var userAssetManagerRetrieveUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetManager(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
    }
};

var userAssetManagerRetrieveUserAssetsTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetManager(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
    }
};

var userAssetManagerRetrieveUserAssetsByUserIdTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetManager(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
    }
};

var userAssetManagerUpdateUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetManager(this);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
    }
};

bugmeta.annotate(userAssetManagerCreateUserAssetTest).with(
    test().name("UserAssetManager - #createUserAsset Test")
);
