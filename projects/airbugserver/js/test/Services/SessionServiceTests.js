//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('airbugserver.SessionService')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var mongoose                = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var SessionService          = bugpack.require('airbugserver.SessionService');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var sessionServiceShakeItTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        this.testCookie = "testCookie";
        this.testUnsignedCookie = "testUnsignedCookie";
        this.dummyCookieSigner = {
            unsign: function(cookie) {
                test.assertEqual(cookie, this.testCookie,
                    "Assert we passed in the testCookie");
                return _this.testUnsignedCookie;
            }
        };
        this.testSessionService = new SessionService(this.dummyCookieSigner, {});
        this.testHandShakeData = {
            headers: {
                cookie: this.testCookie
            }
        };
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testSessionService.shakeIt(this.testHandShakeData, function(throwable, result) {
            test.assertEqual(result, true,
                "Assert that returned result was true");
            test.assertEqual(_this.testHandShakeData.sessionId, _this.testUnsignedCookie,
                "Assert that the sessionId was set to the unsigned cookie");
            test.complete();
        });
    }
};
bugmeta.annotate(sessionServiceShakeItTest).with(
    test().name("SessionService #shakeIt Test")
);
