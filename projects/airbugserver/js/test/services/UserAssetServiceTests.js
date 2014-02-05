//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Exception')
//@Require('Map')
//@Require('airbugserver.Asset')
//@Require('airbugserver.AssetManager')
//@Require('airbugserver.Session')
//@Require('airbugserver.User')
//@Require('airbugserver.UserAsset')
//@Require('airbugserver.UserAssetManager')
//@Require('airbugserver.UserAssetService')
//@Require('airbugserver.UserImageAssetStreamManager')
//@Require('airbugserver.UserManager')
//@Require('airbugservertest.UserAssetPusherStub')
//@Require('airbugservertest.UserImageAssetStreamPusherStub')
//@Require('bugentity.EntityManagerStore')
//@Require('bugentity.SchemaManager')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('loggerbug.Logger')
//@Require('mongo.DummyMongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Exception                       = bugpack.require('Exception');
var Map                             = bugpack.require('Map');
var Asset                           = bugpack.require('airbugserver.Asset');
var AssetManager                    = bugpack.require('airbugserver.AssetManager');
var Session                         = bugpack.require('airbugserver.Session');
var User                            = bugpack.require('airbugserver.User');
var UserAsset                       = bugpack.require('airbugserver.UserAsset');
var UserAssetManager                = bugpack.require('airbugserver.UserAssetManager');
var UserAssetService                = bugpack.require('airbugserver.UserAssetService');
var UserImageAssetStreamManager     = bugpack.require('airbugserver.UserImageAssetStreamManager');
var UserManager                     = bugpack.require('airbugserver.UserManager');
var UserAssetPusherStub             = bugpack.require('airbugservertest.UserAssetPusherStub');
var UserImageAssetStreamPusherStub  = bugpack.require('airbugservertest.UserImageAssetStreamPusherStub');
var EntityManagerStore              = bugpack.require('bugentity.EntityManagerStore');
var SchemaManager                   = bugpack.require('bugentity.SchemaManager');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation                  = bugpack.require('bugunit-annotate.TestAnnotation');
var Logger                          = bugpack.require('loggerbug.Logger');
var DummyMongoDataStore             = bugpack.require('mongo.DummyMongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var test                            = TestAnnotation.test;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Setup Methods
//-------------------------------------------------------------------------------

var setupUserAssetService = function(setupObject) {
    setupObject.entityManagerStore      = new EntityManagerStore();
    setupObject.mongoDataStore          = new DummyMongoDataStore();
    setupObject.schemaManager           = new SchemaManager();
    setupObject.assetManager            = new AssetManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.assetManager.setEntityType('Asset');
    setupObject.userManager             = new UserManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.userManager.setEntityType('User');
    setupObject.userAssetManager        = new UserAssetManager(setupObject.entityManagerStore, setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.userAssetManager.setEntityType('UserAsset');
    setupObject.userImageAssetStreamManager = new UserImageAssetStreamManager();

    setupObject.testCurrentUser     = new User({});
    setupObject.testSession         = new Session({});
    setupObject.testCall            = {
        getCallUuid: function() {
            return 'testCallUuid';
        }
    };
    setupObject.testRequestContext  = {
        get: function(key) {
            if (key === 'call') {
                return setupObject.testCall;
            }
            if (key === 'currentUser') {
                return setupObject.testCurrentUser;
            } else if (key === 'session') {
                return setupObject.testSession;
            }
            return undefined;
        },
        set: function(key, value) {

        }
    };

    var dummyUserAssetPusher            = new UserAssetPusherStub();
    var dummyUserImageAssetStreamPusher = new UserImageAssetStreamPusherStub();

    setupObject.logger                          = new Logger();
    setupObject.testUserAssetService            = new UserAssetService(setupObject.userAssetManager, dummyUserAssetPusher, setupObject.userImageAssetStreamManager, dummyUserImageAssetStreamPusher);
    setupObject.testUserAssetService.logger     = setupObject.logger;
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
        $task(function(flow) {
            _this.userManager.initializeModule(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            _this.userAssetManager.initializeModule(function(throwable) {
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
            var testUser = _this.userManager.generateUser({});
            _this.userManager.createUser(testUser, function(throwable, user) {
                if (!throwable) {
                    var id = user.getId();
                    test.assertTrue(!!id,
                        'Assert create user has an id. id = ' + id);
                    _this.testUser = user;
                    _this.testCurrentUser = user;
                }
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            setupObject.testMimeType1           = 'image/png';
            setupObject.testName1               = 'testName';
            setupObject.testThumbnailMimeType1  = 'image/png';
            setupObject.testThumbnailUrl1       = 'http://host/image_t.png';
            setupObject.testUrl1                = 'http://host/image.png';
            setupObject.testAssetData1          = {
                mimeType: setupObject.testMimeType1,
                name: setupObject.testName1,
                thumbnailMimeType: setupObject.testThumbnailMimeType1,
                thumbnailUrl: setupObject.testThumbnailUrl1,
                url: setupObject.testUrl1
            };
            setupObject.testAsset1              = new Asset(setupObject.testAssetData);
            _this.assetManager.createAsset(_this.testAsset1, function(throwable, asset) {
                if (!throwable) {
                    test.assertTrue(!! asset.getId(),
                        'Newly created Asset should have an id');
                    test.assertEqual(asset.getName(), _this.testName,
                        'Name should match test name');
                    _this.createdAsset1 = asset;
                }
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            setupObject.testMimeType2           = 'image/png';
            setupObject.testName2               = 'testName';
            setupObject.testThumbnailMimeType2  = 'image/png';
            setupObject.testThumbnailUrl2       = 'http://host/image_t.png';
            setupObject.testUrl2                = 'http://host/image.png';
            setupObject.testAssetData2          = {
                mimeType: setupObject.testMimeType2,
                name: setupObject.testName2,
                thumbnailMimeType: setupObject.testThumbnailMimeType2,
                thumbnailUrl: setupObject.testThumbnailUrl2,
                url: setupObject.testUrl2
            };
            setupObject.testAsset2             = new Asset(setupObject.testAssetData2);
            _this.assetManager.createAsset(_this.testAsset2, function(throwable, asset) {
                if (!throwable) {
                    test.assertTrue(!! asset.getId(),
                        'Newly created asset should have an id which is ' + asset.getId(), asset.getId());
                    test.assertEqual(asset.getName(), _this.testName2,
                        'Name should match test name');
                    _this.createdAsset2 = asset;
                }
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            _this.testUserAssetData1 = {
                assetId: setupObject.createdAsset1.getId(),
                userId: setupObject.testUser.getId()
            };
            var testUserAsset = _this.userAssetManager.generateUserAsset(_this.testUserAssetData1);
            _this.userAssetManager.createUserAsset(testUserAsset, function(throwable, userAsset) {
                if (!throwable) {
                    test.assertTrue(!! userAsset.getId(),
                        'Newly created UserAsset should have an id which is ' + userAsset.getId(), userAsset.getId());
                    _this.testUserAsset1 = userAsset;
                }
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            _this.testUserAssetData2 = {
                assetId: setupObject.createdAsset2.getId(),
                userId: setupObject.testUser.getId()
            };
            var testUserAsset = _this.userAssetManager.generateUserAsset(_this.testUserAssetData2);
            _this.userAssetManager.createUserAsset(testUserAsset, function(throwable, userAsset) {
                if (!throwable) {
                    test.assertTrue(!! userAsset.getId(),
                        'Newly created UserAsset should have an id which is ' + userAsset.getId(), userAsset.getId());
                    _this.testUserAsset2 = userAsset;
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
// Tests
//-------------------------------------------------------------------------------


var userAssetServiceCreateUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
        var userAssetData = {
            assetId: this.createdAsset2.getId(),
            userId: this.testCurrentUser.getId()
        };
        this.testUserAssetService.createUserAsset(this.testRequestContext, userAssetData, function(throwable, userAsset) {
            if (throwable) {
                test.error(new Error('throwable was defined on #createUserAsset. throwable = ' +
                    throwable + ' stack ' + throwable.stack));
            } else {
                test.assertTrue(!!userAsset.getId(),
                    'UserAsset id should be set properly after creation.');
                test.complete();
            }
        });
    }
};


var userAssetServiceDeleteUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
        var testUserAssetId = this.testUserAsset1.getId();
        $series([
            $task(function(flow) {
                _this.testUserAssetService.deleteUserAsset(_this.testRequestContext, testUserAssetId, function(throwable, userAsset) {
                    if (throwable) {
                        flow.error(new Error('throwable was defined on #deleteUserAsset. throwable = ' +
                            throwable + ' stack ' + throwable.stack));
                    } else {
                        test.assertEqual(userAsset.getId(), testUserAssetId,
                            'UserAsset id should be set properly after deletion.');
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.testUserAssetService.retrieveUserAsset(_this.testRequestContext, testUserAssetId, function(throwable, userAsset) {
                    if (throwable) {
                        console.log('throwable was defined on #deleteUserAsset. throwable = ' + throwable + ' stack ' + throwable.stack);
                        test.assertEqual(throwable.type, 'NotFound');
                        flow.complete();
                    } else {
                        flow.error('expected not to find this user.');
                    }
                });
            })
        ]).execute(function(throwable) {
            if (throwable) {
                test.error(throwable);
            } else {
                test.complete();
            }
        });
    }
};


var userAssetServiceRenameUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        initializeManagers(this, test);
        createEntities(this, test);
        var testUserAssetId = this.testUserAsset1.getId();
        this.testUserAssetService.renameUserAsset(this.testRequestContext, testUserAssetId, 'newUserAssetName', function(throwable, userAsset) {
            if (throwable) {
                test.error(new Error('throwable was defined on #renameUserAsset. throwable = ' +
                    throwable + ' stack ' + throwable.stack));
            } else {
                test.assertEqual(userAsset.getName(), 'newUserAssetName',
                    'UserAsset name should be set properly after rename.');
                test.complete();
            }
        });
    }
};


var userAssetServiceRetrieveUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
        var testUserAssetId = this.testUserAsset1.getId();
        this.testUserAssetService.retrieveUserAsset(this.testRequestContext, testUserAssetId, function(throwable, userAsset) {
            if (throwable) {
                test.error(new Error('throwable was defined on #retrieveUserAsset. throwable = ' +
                    throwable + ' stack ' + throwable.stack));
            } else {
                test.assertEqual(userAsset.getId(), testUserAssetId, 'UserAsset id should be set properly after retrieve.');
                console.log('UserServiceAssetTests#userAssetServiceRetrieveUserAssetTest userAsset = ', userAsset);
                test.assertEqual(userAsset.getUser().getId(), _this.testUserAsset1.getUserId(),
                    'user ids should match');
                test.complete();
            }
        });
    }
};


var userAssetServiceRetrieveUserAssetsTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
        var userAssetIds = [this.testUserAsset1.getId(), this.testUserAsset2.getId()];
        this.testUserAssetService.retrieveUserAssets(this.testRequestContext, userAssetIds, function(throwable, userAssetMap) {
            if (throwable) {
                test.error(new Error('throwable was defined on #retrieveUserAsset. throwable = ' +
                    throwable + ' stack ' + throwable.stack));
            } else {
                test.assertEqual(userAssetMap.getCount(), 2, '2 user assets should be retrieved');
                var userAsset1 = userAssetMap.get(_this.testUserAsset1.getId());
                test.assertEqual(userAsset1.getId(), _this.testUserAsset1.getId(),
                    'make sure we are getting back the right user asset');
                var userAsset2 = userAssetMap.get(_this.testUserAsset2.getId());
                test.assertEqual(userAsset2.getId(), _this.testUserAsset2.getId(),
                    'make sure we are getting back the right user asset');
                test.complete();
            }
        });
    }
};

var userAssetServiceRetrieveUserAssetsByUserIdTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
        this.testUserAssetService.retrieveUserAssetsByUserId(this.testRequestContext, this.testUser.getId(), function(throwable, userAssetList) {
            if (throwable) {
                test.error(new Error('throwable was defined on #retrieveUserAsset. throwable = ' + throwable + ' stack ' + throwable.stack));
            } else {
                test.assertEqual(userAssetList.getCount(), 2, '2 user assets should be retrieved');

                test.assertTrue(userAssetList.contains(_this.testUserAsset1),
                    'includes test user asset 1 in the returned list');

                test.assertTrue(userAssetList.contains(_this.testUserAsset2),
                    'includes test user asset 2 in the returned list');
                test.complete();
            }
        });
    }
};

var userAssetServiceRetrieveUserImageAssetsByUserIdTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(this, test);
        createEntities(this, test);
        this.testUserAssetService.retrieveUserImageAssetsByUserId(this.testRequestContext, this.testUser.getId(), function(throwable, userAssetList) {
            if (throwable) {
                test.error(new Error('throwable was defined on #retrieveUserAsset. throwable = ' + throwable + ' stack ' + throwable.stack));
            } else {
                //TODO SUNG

//                test.assertEqual(userAssetList.getCount(), 2, '2 user assets should be retrieved');

//                test.assertTrue(userAssetList.contains(_this.testUserImageAsset1),
//                    'includes test user image asset 1 in the returned list');
//
//                test.assertTrue(userAssetList.contains(_this.testUserImageAsset2),
//                    'includes test user image asset 2 in the returned list');

//                test.assertFalse(userAssetList.contains(_this.testUserAsset1),
//                    'does not include test user asset 1, which is not of type image, in the returned list');
//
//                test.assertFalse(userAssetList.contains(_this.testUserAsset2),
//                    'does not include test user asset 2, which is not of type image, in the returned list');

//                test.assertTrue(Class.doesExtend(_this.testUserImageAsset1),
//                    'test user asset 1 should be of type image');
//
//                test.assertTrue(Class.doesExtend(_this.testUserImageAsset2),
//                    'test user asset 2 should be of type image');
                test.complete();
            }
        });
    }
};


bugmeta.annotate(userAssetServiceCreateUserAssetTest).with(
    test().name('UserAssetService - Create UserAsset Test')
);

bugmeta.annotate(userAssetServiceDeleteUserAssetTest).with(
    test().name('UserAssetService - Delete UserAsset Test')
);

bugmeta.annotate(userAssetServiceRenameUserAssetTest).with(
    test().name('UserAssetService - Rename UserAsset Test')
);

bugmeta.annotate(userAssetServiceRetrieveUserAssetTest).with(
    test().name('UserAssetService - Retrieve UserAsset Test')
);

bugmeta.annotate(userAssetServiceRetrieveUserAssetsTest).with(
    test().name('UserAssetService - Retrieve UserAssets Test')
);

bugmeta.annotate(userAssetServiceRetrieveUserAssetsByUserIdTest).with(
    test().name('UserAssetService - Retrieve UserAssets By User Id Test')
);

bugmeta.annotate(userAssetServiceRetrieveUserImageAssetsByUserIdTest).with(
    test().name('UserAssetService - Retrieve UserImageAssets By User Id Test')
);