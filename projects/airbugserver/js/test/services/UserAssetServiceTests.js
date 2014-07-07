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
//@Require('bugentity.EntityManagerStore')
//@Require('bugentity.SchemaManager')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


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
var EntityManagerStore              = bugpack.require('bugentity.EntityManagerStore');
var SchemaManager                   = bugpack.require('bugentity.SchemaManager');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TestTag                  = bugpack.require('bugunit.TestTag');
var BugYarn                         = bugpack.require('bugyarn.BugYarn');
var Logger                          = bugpack.require('loggerbug.Logger');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var bugyarn                         = BugYarn.context();
var test                            = TestTag.test;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestUserAssetService", function(yarn) {
    yarn.spin([
        "setupMockSuccessPushTaskManager",
        "setupTestSessionManager",
        "setupTestAssetManager",
        "setupTestLogger",
        "setupTestUserAssetManager",
        "setupTestUserAssetPusher",
        "setupTestUserImageAssetStreamManager",
        "setupTestUserImageAssetStreamPusher"
    ]);
    yarn.wind({
        userAssetService: new UserAssetService(this.logger, this.userAssetManager, this.userAssetPusher, this.userImageAssetStreamManager, this.userImageAssetStreamPusher)
    });
});


//-------------------------------------------------------------------------------
// Setup Methods
//-------------------------------------------------------------------------------

var setupUserAssetService = function(setupObject, yarn) {
    setupObject.marshRegistry.configureModule();
    setupObject.schemaManager.configureModule();
    setupObject.mongoDataStore.configureModule();
    setupObject.testUser            = yarn.weave("testNotAnonymousUser");
    setupObject.testSession         = yarn.weave("testSession");
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
                return setupObject.testUser;
            } else if (key === 'session') {
                return setupObject.testSession;
            }
            return undefined;
        },
        set: function(key, value) {

        }
    };
};

var initializeManagers = function(setupObject, callback) {
    var _this = setupObject;
    $series([
        $task(function(flow) {
            setupObject.blockingRedisClient.connect(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            _this.redisClient.connect(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            setupObject.subscriberRedisClient.connect(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            setupObject.redisPubSub.initialize(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            setupObject.pubSub.initializeModule(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            _this.assetManager.initializeModule(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            _this.sessionManager.initializeModule(function(throwable) {
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
    ]).execute(callback);
};

var createEntities = function(setupObject, test, callback) {
    var _this = setupObject;
    $series([
        $task(function(flow) {
            _this.userManager.createUser(setupObject.testUser, function(throwable, user) {
                if (!throwable) {
                    var id = user.getId();
                    test.assertTrue(!!id,
                        'Assert create user has an id. id = ' + id);
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
                        'Newly created asset should have an id which is ' + asset.getId());
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
                        'Newly created UserAsset should have an id which is ' + userAsset.getId());
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
                    test.assertTrue(!!userAsset.getId(),
                        'Newly created UserAsset should have an id which is ' + userAsset.getId());
                    _this.testUserAsset2 = userAsset;
                }
                flow.complete(throwable);
            });
        })
    ]).execute(callback);
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
        var yarn = bugyarn.yarn(this);
        yarn.spin("setupTestUserAssetService");
        setupUserAssetService(this, yarn);
        var _this = this;
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                createEntities(_this, test, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                var userAssetData = {
                    assetId: _this.createdAsset2.getId(),
                    userId: _this.testUser.getId()
                };
                _this.userAssetService.createUserAsset(_this.testRequestContext, userAssetData, function(throwable, userAsset) {
                    if (!throwable) {
                        test.assertTrue(!!userAsset.getId(),
                            'UserAsset id should be set properly after creation.');
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
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
        var yarn = bugyarn.yarn(this);
        yarn.spin("setupTestUserAssetService");
        setupUserAssetService(this, yarn);
        var _this = this;
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                createEntities(_this, test, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this           = this;
        var testUserAssetId = null;
        $series([
            $task(function(flow) {
                testUserAssetId = _this.testUserAsset1.getId();
                _this.userAssetService.deleteUserAsset(_this.testRequestContext, testUserAssetId, function(throwable, userAsset) {
                    if (throwable) {
                        flow.error(throwable);
                    } else {
                        test.assertEqual(userAsset.getId(), testUserAssetId,
                            'UserAsset id should be set properly after deletion.');
                        flow.complete();
                    }
                });
            }),
            $task(function(flow) {
                _this.userAssetService.retrieveUserAsset(_this.testRequestContext, testUserAssetId, function(throwable, userAsset) {
                    test.assertTrue(!!throwable,
                        "Assert throwable was returned");
                    if (throwable) {
                        console.log('throwable was defined on #deleteUserAsset. throwable = ' + throwable + ' stack ' + throwable.stack);
                        test.assertEqual(throwable.type, "NotFound",
                            "Assert that UserAsset was deleted");
                    }
                    flow.complete();
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};


var userAssetServiceRenameUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin("setupTestUserAssetService");
        setupUserAssetService(this, yarn);
        var _this = this;
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                createEntities(_this, test, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this           = this;
        var testUserAssetId = this.testUserAsset1.getId();
        $series([
            $task(function(flow) {
                _this.userAssetService.renameUserAsset(_this.testRequestContext, testUserAssetId, 'newUserAssetName', function(throwable, userAsset) {
                    if (!throwable) {
                        test.assertEqual(userAsset.getName(), 'newUserAssetName',
                            'UserAsset name should be set properly after rename.');
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
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
        var yarn = bugyarn.yarn(this);
        yarn.spin("setupTestUserAssetService");
        setupUserAssetService(this, yarn);
        var _this = this;
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                createEntities(_this, test, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        var testUserAssetId = this.testUserAsset1.getId();
        $series([
            $task(function(flow) {
                _this.userAssetService.retrieveUserAsset(_this.testRequestContext, testUserAssetId, function(throwable, userAsset) {
                    if (!throwable) {
                        test.assertEqual(userAsset.getId(), testUserAssetId, 'UserAsset id should be set properly after retrieve.');
                        console.log('UserServiceAssetTests#userAssetServiceRetrieveUserAssetTest userAsset = ', userAsset);
                        test.assertEqual(userAsset.getUserId(), _this.testUserAsset1.getUserId(),
                            'user ids should match');
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
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
        var yarn = bugyarn.yarn(this);
        yarn.spin("setupTestUserAssetService");
        setupUserAssetService(this, yarn);
        var _this = this;
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                createEntities(_this, test, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this           = this;
        var userAssetIds    = [this.testUserAsset1.getId(), this.testUserAsset2.getId()];
        $series([
            $task(function(flow) {
                _this.userAssetService.retrieveUserAssets(_this.testRequestContext, userAssetIds, function(throwable, userAssetMap) {
                    if (!throwable) {
                        test.assertEqual(userAssetMap.getCount(), 2, '2 user assets should be retrieved');
                        var userAsset1 = userAssetMap.get(_this.testUserAsset1.getId());
                        test.assertEqual(userAsset1.getId(), _this.testUserAsset1.getId(),
                            'make sure we are getting back the right user asset');
                        var userAsset2 = userAssetMap.get(_this.testUserAsset2.getId());
                        test.assertEqual(userAsset2.getId(), _this.testUserAsset2.getId(),
                            'make sure we are getting back the right user asset');
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
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
        var yarn = bugyarn.yarn(this);
        yarn.spin("setupTestUserAssetService");
        setupUserAssetService(this, yarn);
        var _this = this;
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                createEntities(_this, test, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.userAssetService.retrieveUserAssetsByUserId(_this.testRequestContext, _this.testUser.getId(), function(throwable, userAssetList) {
                    if (!throwable) {
                        test.assertEqual(userAssetList.getCount(), 2,
                            "2 user assets should be retrieved");
                        test.assertTrue(userAssetList.contains(_this.testUserAsset1),
                            "includes test user asset 1 in the returned list");
                        test.assertTrue(userAssetList.contains(_this.testUserAsset2),
                            "includes test user asset 2 in the returned list");
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
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
        var yarn = bugyarn.yarn(this);
        yarn.spin("setupTestUserAssetService");
        setupUserAssetService(this, yarn);
        var _this = this;
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                createEntities(_this, test, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.userAssetService.retrieveUserImageAssetsByUserId(_this.testRequestContext, _this.testUser.getId(), function(throwable, userAssetList) {
                    if (!throwable) {

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
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};


bugmeta.tag(userAssetServiceCreateUserAssetTest).with(
    test().name('UserAssetService - Create UserAsset Test')
);

bugmeta.tag(userAssetServiceDeleteUserAssetTest).with(
    test().name('UserAssetService - Delete UserAsset Test')
);

bugmeta.tag(userAssetServiceRenameUserAssetTest).with(
    test().name('UserAssetService - Rename UserAsset Test')
);

bugmeta.tag(userAssetServiceRetrieveUserAssetTest).with(
    test().name('UserAssetService - Retrieve UserAsset Test')
);

bugmeta.tag(userAssetServiceRetrieveUserAssetsTest).with(
    test().name('UserAssetService - Retrieve UserAssets Test')
);

bugmeta.tag(userAssetServiceRetrieveUserAssetsByUserIdTest).with(
    test().name('UserAssetService - Retrieve UserAssets By User Id Test')
);

bugmeta.tag(userAssetServiceRetrieveUserImageAssetsByUserIdTest).with(
    test().name('UserAssetService - Retrieve UserImageAssets By User Id Test')
);