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
// Declare Tests
//-------------------------------------------------------------------------------

var githubManagerCreateGithubTest = {
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.entityManagerStore     = new EntityManagerStore();
        this.mongoDataStore         = new DummyMongoDataStore();
        this.schemaManager          = new SchemaManager();
        this.entityProcessor        = new EntityProcessor(this.schemaManager);
        this.entityScan             = new EntityScan(this.entityProcessor);
        this.entityScan.scanClass(Github);
        this.githubManager           = new GithubManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore);
        this.githubManager.setEntityType("Github");
        this.testUserId = '528ad6c3859c7f16a4000001';
        this.testGithubAuthCode = 'a1b75646f9ec91dee2dd4270f76e49ef2ebb9575';
        this.testGithubId = '12345';
        this.testGithubLogin = 'dicegame';
        this.testGithub = new Github({
            userId: this.testUserId,
            githubAuthCode: this.testGithubAuthCode,
            githubId: this.testGithubId,
            githubLogin: this.testGithubLogin
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
                _this.githubManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.githubManager.createGithub(_this.testGithub, function(throwable) {
                    if (!throwable) {
                        test.assertTrue(!! _this.testGithub.getId(),
                            "Newly created github should have an id");
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.githubManager.retrieveGithubByGithubId(_this.testGithubId, function(throwable, github) {
                    console.log("retrieveGithubByGithubId github object = ", github);
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

bugmeta.annotate(githubManagerCreateGithubTest).with(
    test().name("GithubManager - createGithub Test")
);
