//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('airbugserver.Github')
//@Require('airbugserver.GithubManager')
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

var Github                  = bugpack.require('airbugserver.Github');
var GithubManager           = bugpack.require('airbugserver.GithubManager');
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


//-------------------------------------------------------------------------------
// Declare Setup Objects
//-------------------------------------------------------------------------------

var setupGithubManager = function(setupObject) {
    setupObject.entityManagerStore     = new EntityManagerStore();
    setupObject.mongoDataStore         = new DummyMongoDataStore();
    setupObject.schemaManager          = new SchemaManager();
    setupObject.entityProcessor        = new EntityProcessor(setupObject.schemaManager);
    setupObject.entityScan             = new EntityScan(setupObject.entityProcessor);
    setupObject.entityScan.scanClass(Github);
    setupObject.githubManager           = new GithubManager(setupObject.entityManagerStore,
        setupObject.schemaManager, setupObject.mongoDataStore);
    setupObject.githubManager.setEntityType("Github");
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

var initializeManagers = function(setupObject, test) {
    $series([
        $task(function(flow) {
            setupObject.schemaManager.initializeModule(function(throwable) {
                flow.complete(throwable);
            });
        }),
        $task(function(flow) {
            setupObject.githubManager.initializeModule(function(throwable) {
                flow.complete(throwable);
            });
        })
    ]).execute(function(throwable) {
            if (throwable) {
                test.error(throwable);
            }
        });

};

var setupGithubEntity = function(setupObject, test) {
    $series([
        $task(function(flow) {
            setupObject.githubManager.createGithub(setupObject.testGithub, function(throwable) {
                if (!throwable) {
                    test.assertTrue(!! setupObject.testGithub.getId(),
                        "Newly created github should have an id");
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

var githubManagerRetrieveGithubByGithubIdTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupGithubManager(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(_this, test);
        setupGithubEntity(_this, test);
        $series([
            $task(function(flow) {
                _this.githubManager.retrieveGithubByGithubId(_this.testGithubId, function(throwable, github) {
                    if (!throwable) {
                        test.assertEqual(github.getGithubAuthCode(), _this.testGithubAuthCode,
                            "retrieveGithubByGithubId should return proper entity object");
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

var githubManagerRetrieveGithubTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupGithubManager(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(_this, test);
        setupGithubEntity(_this, test);
        $series([
            $task(function(flow) {
                _this.githubManager.retrieveGithub(_this.testGithub.getId(), function(throwable, github) {
                    if (!throwable) {
                        test.assertEqual(github.getGithubAuthCode(), _this.testGithubAuthCode,
                            "retrieveGithub should return proper entity object");
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

var githubManagerDeleteGithubTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupGithubManager(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        initializeManagers(_this, test);
        setupGithubEntity(_this, test);
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
                test.complete();
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
