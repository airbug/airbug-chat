//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('UuidGenerator')
//@Require('airbugserver.User')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('mongo.MongoDataStore')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var UuidGenerator           = bugpack.require('UuidGenerator');
var User                    = bugpack.require('airbugserver.User');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MongoDataStore          = bugpack.require('mongo.MongoDataStore');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var userInstantiationTests = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testPasswordHash = "$2a$10$UCNxW7UFww9z97eijL8QhewpxjqNCjv0CoPO/PKOyjdnMdoRSnlMe";
        this.testUser = new User({
            passwordHash: this.testPasswordHash
        });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testUser.getPasswordHash(), this.testPasswordHash,
            "Assert User.passwordHash was set correctly");
        test.complete();
    }
};

var userGetterSetterTests = {
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testUser = new User({});
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testUser.setPasswordHash("testPasswordHash");
        test.assertEqual(this.testUser.getPasswordHash(), "testPasswordHash",
            "Assert User.setPasswordHash works correctly");
        test.complete();
    }

};

bugmeta.annotate(userInstantiationTests).with(
    test().name("User instantiation Tests")
);
bugmeta.annotate(userGetterSetterTests).with(
    test().name("User getter/setter Tests")
);
