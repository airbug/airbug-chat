//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Set')
//@Require('airbugserver.User')
//@Require('airbugserver.UserManager')
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
var User                    = bugpack.require('airbugserver.User');
var UserManager             = bugpack.require('airbugserver.UserManager');
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
// Declare Tests
//-------------------------------------------------------------------------------

var userManagerCreateUserTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.entityManagerStore     = new EntityManagerStore();
        this.mongoDataStore         = new DummyMongoDataStore();
        this.schemaManager          = new SchemaManager();
        this.userManager            = new UserManager(this.entityManagerStore, this.schemaManager, this.mongoDataStore);
        this.userManager.setEntityType("User");

        this.testEmail              = makeEmail();
        this.testUser               = this.userManager.generateUser({
            email: this.testEmail
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
                _this.userManager.initializeModule(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.userManager.createUser(_this.testUser, function(throwable, user) {
                    if (!throwable) {
                        test.assertEqual(_this.testUser, user,
                            "Assert user returned is the same user sent in");
                        var id = user.getId();
                        test.assertTrue(!!id,
                            "Assert create user has an id. id = " + id);
                        test.assertEqual(user.getEmail(), _this.testEmail,
                            "Assert user.getEmail returns the testEmail");
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

function makeEmail() {
    var email = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 20; i++ ) {
        email += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    email += "@email.com";
    return email;
}

bugmeta.annotate(userManagerCreateUserTest).with(
    test().name("UserManager - #createUser Test")
);
