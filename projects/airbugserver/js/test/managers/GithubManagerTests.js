//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.Github')
//@Require('airbugserver.GithubManager')
//@Require('bugentity.EntityManagerStore')
//@Require('bugentity.EntityProcessor')
//@Require('bugentity.SchemaManager')
//@Require('bugentity.SchemaProperty')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Github                  = bugpack.require('airbugserver.Github');
var GithubManager           = bugpack.require('airbugserver.GithubManager');
var EntityManagerStore      = bugpack.require('bugentity.EntityManagerStore');
var EntityProcessor         = bugpack.require('bugentity.EntityProcessor');
var SchemaManager           = bugpack.require('bugentity.SchemaManager');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestGithubManager", function(yarn) {
    yarn.spin([
        "setupTestEntityManagerStore",
        "setupTestSchemaManager",
        "setupDummyMongoDataStore",
        "setupTestEntityDeltaBuilder"
    ]);
    yarn.wind({
        githubManager: new GithubManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder)
    });
    this.githubManager.setEntityType("Github");
});


//-------------------------------------------------------------------------------
// Declare Setup Objects
//-------------------------------------------------------------------------------

var setupGithubManager = function(setupObject) {
    setupObject.testUserId              = '528ad6c3859c7f16a4000001';
    setupObject.testGithubAuthCode      = 'a1b75646f9ec91dee2dd4270f76e49ef2ebb9575';
    setupObject.testGithubId            = '12345';
    setupObject.testGithubLogin         = 'dicegame';
    setupObject.testGithub              = new Github({
        userId: setupObject.testUserId,
        githubAuthCode: setupObject.testGithubAuthCode,
        githubId: setupObject.testGithubId,
        githubLogin: setupObject.testGithubLogin
    });
};

var initializeManagers = function(setupObject, callback) {
    $series([
        $task(function(flow) {
            setupObject.schemaManager.processModule();
            setupObject.mongoDataStore.processModule();
            flow.complete();
        }),
        $task(function(flow) {
            setupObject.githubManager.initializeModule(function(throwable) {
                flow.complete(throwable);
            });
        })
    ]).execute(callback);
};

var setupGithubEntity = function(setupObject, callback) {
    $series([
        $task(function(flow) {
            setupObject.githubManager.createGithub(setupObject.testGithub, function(throwable) {
                flow.complete(throwable);
            });
        })
    ]).execute(callback);
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var githubManagerInstantiationTest = {

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
        this.testGithubManager   = new GithubManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore, this.entityDeltaBuilder);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testGithubManager, GithubManager),
            "Assert instance of GithubManager");
        test.assertEqual(this.testGithubManager.getEntityManagerStore(), this.entityManagerStore,
            "Assert .entityManagerStore was set correctly");
        test.assertEqual(this.testGithubManager.getEntityDataStore(), this.mongoDataStore,
            "Assert .entityDataStore was set correctly");
        test.assertEqual(this.testGithubManager.getSchemaManager(), this.schemaManager,
            "Assert .schemaManager was set correctly");
        test.assertEqual(this.testGithubManager.getEntityDeltaBuilder(), this.entityDeltaBuilder,
            "Assert .entityDeltaBuilder was set correctly");
    }
};
bugmeta.annotate(githubManagerInstantiationTest).with(
    test().name("GithubManager - instantiation test")
);


var githubManagerRetrieveGithubByGithubIdTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this   = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestGithubManager"
        ]);
        setupGithubManager(this);
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupGithubEntity(_this, function(throwable) {
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
        $task(function(flow) {
            _this.githubManager.retrieveGithubByGithubId(_this.testGithubId, function(throwable, github) {
                if (!throwable) {
                    test.assertEqual(github.getGithubAuthCode(), _this.testGithubAuthCode,
                        "retrieveGithubByGithubId should return proper entity object");
                }
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};

var githubManagerRetrieveGithubTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestGithubManager"
        ]);
        setupGithubManager(this);
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupGithubEntity(_this, function(throwable) {
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
        $task(function(flow) {
            _this.githubManager.retrieveGithub(_this.testGithub.getId(), function(throwable, github) {
                if (!throwable) {
                    test.assertEqual(github.getGithubAuthCode(), _this.testGithubAuthCode,
                        "retrieveGithub should return proper entity object");
                }
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};

var githubManagerDeleteGithubTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestGithubManager"
        ]);
        setupGithubManager(this);
        $series([
            $task(function(flow) {
                initializeManagers(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                setupGithubEntity(_this, function(throwable) {
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
        _this.testGithubObjectId = _this.testGithub.getId();
        $series([
            $task(function(flow) {
                _this.githubManager.deleteGithub(_this.testGithub, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.githubManager.retrieveGithub(_this.testGithubObjectId, function(throwable, github) {
                    if (!throwable) {
                        test.assertTrue(github === null,
                            "retrieveGithub should return null after we delete github object");
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

bugmeta.annotate(githubManagerRetrieveGithubByGithubIdTest).with(
    test().name("GithubManager - Retrieve Github by Id Test")
);

bugmeta.annotate(githubManagerRetrieveGithubTest).with(
    test().name("GithubManager - Retrieve Github Test")
);

bugmeta.annotate(githubManagerDeleteGithubTest).with(
    test().name("GithubManager - Delete Github Test")
);
