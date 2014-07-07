//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
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
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
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
var TestTag          = bugpack.require('bugunit.TestTag');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestTag.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestUserAssetManager", function(yarn) {
    yarn.spin([
        "setupTestAssetManager",
        "setupTestUserManager",
        "setupTestEntityManagerStore",
        "setupTestSchemaManager",
        "setupDummyMongoDataStore",
        "setupTestEntityDeltaBuilder"
    ]);
    yarn.wind({
        userAssetManager: new UserAssetManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
    });
    this.userAssetManager.setEntityType("UserAsset");
});


//-------------------------------------------------------------------------------
// Declare Setup Objects
//-------------------------------------------------------------------------------

var setupUserAssetManager = function(setupObject) {
    setupObject.testUser               = new User({});
    setupObject.testAsset              = new Asset({});
};

var initializeManagers = function(setupObject, callback) {
    var _this = setupObject;
    $series([
        $task(function(flow) {
            _this.schemaManager.configureModule();
            _this.mongoDataStore.configureModule();
            flow.complete();
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
    ]).execute(callback);
};

var createEntities = function(setupObject, callback) {
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
    ]).execute(callback);
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------


var userAssetManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestEntityManagerStore",
            "setupTestSchemaManager",
            "setupDummyMongoDataStore",
            "setupTestEntityDeltaBuilder"
        ]);
        this.testUserAssetManager   = new UserAssetManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testUserAssetManager, UserAssetManager),
            "Assert instance of UserAssetManager");
        test.assertEqual(this.testUserAssetManager.getEntityManagerStore(), this.entityManagerStore,
            "Assert .entityManagerStore was set correctly");
        test.assertEqual(this.testUserAssetManager.getEntityDataStore(), this.mongoDataStore,
            "Assert .entityDataStore was set correctly");
        test.assertEqual(this.testUserAssetManager.getSchemaManager(), this.schemaManager,
            "Assert .schemaManager was set correctly");
        test.assertEqual(this.testUserAssetManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
            "Assert .entityDeltaBuilder was set correctly");
    }
};

var userAssetManagerCreateUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestUserAssetManager"
        ]);
        setupUserAssetManager(this);
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                createEntities(_this, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        })
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
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
                test.completeTest();
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
        var _this = this;
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestUserAssetManager"
        ]);
        setupUserAssetManager(this);
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                createEntities(_this, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        })
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
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
            }),
            $task(function(flow) {
                _this.userAssetManager.retrieveUserAsset(_this.testUserAsset.getId(), function(throwable, returnedUserAsset) {
                    if (!throwable) {
                        test.assertEqual(_this.testUserAsset.getId(), returnedUserAsset.getId(),
                            "Assert userAsset returned is the same userAsset sent in");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userAssetManager.deleteUserAsset(_this.testUserAsset, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userAssetManager.retrieveUserAsset(_this.testUserAsset.getId(), function(throwable, returnedUserAsset) {
                    if (!throwable) {
                        test.assertEqual(returnedUserAsset, null,
                            "Assert userAsset no longer exists");
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

var userAssetManagerRetrieveUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestUserAssetManager"
        ]);
        setupUserAssetManager(this);
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                createEntities(_this, function(throwable) {
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
            }),
            $task(function(flow) {
                _this.userAssetManager.retrieveUserAsset(_this.testUserAsset.getId(), function(throwable, returnedUserAsset) {
                    if (!throwable) {
                        test.assertEqual(_this.testUserAsset.getId(), returnedUserAsset.getId(),
                            "Assert userAsset returned is the same userAsset sent in");
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


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(userAssetManagerInstantiationTest).with(
    test().name("UserAssetManager - instantiation test")
);
bugmeta.tag(userAssetManagerCreateUserAssetTest).with(
    test().name("UserAssetManager - #createUserAsset Test")
);
bugmeta.tag(userAssetManagerDeleteUserAssetTest).with(
    test().name("UserAssetManager - #deleteUserAsset Test")
);
bugmeta.tag(userAssetManagerRetrieveUserAssetTest).with(
    test().name("UserAssetManager - #retrieveUserAsset Test")
);
