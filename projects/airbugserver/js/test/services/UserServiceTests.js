//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('airbugserver.UserService')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var UserService         = bugpack.require('airbugserver.UserService');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------


var userServiceMeldCurrentUserWithCurrentUserTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {

        //_constructor: function(sessionManager, userManager, meldService, sessionService)
        var _this = this;
        this.testId = "testId";
        this.testCurrentUser = {
            getId: function() {
                return _this.testId;
            }
        };
        this.testCalled = false;
        this.testMeldManager = {};
        this.testMeldKey = {};
        this.dummyMeldService   = {
            generateMeldKey: function() {
                return _this.testMeldKey;
            },
            meldUserWithKeysAndReason: function(meldManager, currentUser, keyArray, reason) {
                _this.testCalled = true;
                test.assertEqual(meldManager, _this.testMeldManager,
                    "Assert meldManager is testMeldManager");
                test.assertEqual(currentUser, _this.testCurrentUser,
                    "Assert currentUser is testCurrentUser");
                test.assertEqual(keyArray[0], _this.testMeldKey,
                    "Assert keyArray had testMeldKey");
                test.assertEqual(reason, "currentUser",
                    "Assert reason was currentUser");
            }
        };
        this.testUserService    = new UserService({}, {}, this.dummyMeldService, {});
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testUserService.meldCurrentUserWithCurrentUser(this.testMeldManager, this.testCurrentUser);
        test.assertTrue(this.testCalled,
            "Assert test function was called");
    }
};
bugmeta.annotate(userServiceMeldCurrentUserWithCurrentUserTest).with(
    test().name("UserService #meldCurrentUserWithCurrentUser Test")
);
