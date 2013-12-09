//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Set')
//@Require('airbugserver.CallService')
//@Require('airbugserver.MeldService')
//@Require('airbugserver.Session')
//@Require('airbugserver.User')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.MeldKey')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Set                 = bugpack.require('Set');
var CallService         = bugpack.require('airbugserver.CallService');
var MeldService         = bugpack.require('airbugserver.MeldService');
var Session             = bugpack.require('airbugserver.Session');
var User                = bugpack.require('airbugserver.User');
var BugDouble           = bugpack.require('bugdouble.BugDouble');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');
var MeldKey             = bugpack.require('meldbug.MeldKey');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var spyOnObject         = BugDouble.spyOnObject;
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------


var meldServiceMeldUserWithKeysAndReasonTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.dummyBugCallServer     = {
            on: function() {}
        };
        this.dummyCallManager       =  {};
        this.testCallService        = new CallService(this.dummyBugCallServer);
        this.testMeldService        = new MeldService({}, {}, this.testCallService);
        this.dummyMeldManager       = {
            meldCallManagerWithKeyAndReason: function(callManager, meldKey, reason) {
                test.assertEqual(callManager, _this.dummyCallManager,
                    "Assert callManager is dummyCallManager");
                test.assertEqual(meldKey, _this.testMeldKey,
                    "Assert meldKey is testMeldKey");
                test.assertEqual(reason, _this.testReason,
                    "Assert reason was testReason");
            }
        };
        this.dummyMeldManagerSpy    = spyOnObject(this.dummyMeldManager);
        this.testUser               = new User({});
        this.testSid                = "testSid";
        this.testSession            = new Session({sid: this.testSid});
        this.testMeldKey            = new MeldKey("dataType", "id");
        this.testReason             = "testReason";
        this.testUser.setSessionSet(new Set([this.testSession]));
        this.testCallService.registerCallManager(this.testSession.getSid(), this.dummyCallManager);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMeldService.meldUserWithKeysAndReason(this.dummyMeldManager, this.testUser, [this.testMeldKey], this.testReason);
        test.assertTrue(this.dummyMeldManagerSpy.getSpy("meldCallManagerWithKeyAndReason").wasCalled(),
            "Assert meldCallManagerWithKeyAndReason method was called");
    }
};
bugmeta.annotate(meldServiceMeldUserWithKeysAndReasonTest).with(
    test().name("MeldService #meldUserWithKeysAndReason Test")
);
