//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.Cookie')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Cookie                  = bugpack.require('airbugserver.Cookie');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var cookieInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testCookieData = {
            domain: "testDomain",
            expires: new Date(Date.now() + 1000),
            httpOnly: true,
            originalMaxAge: 2000,
            path: "testPath",
            secure: true
        };
        this.testCookie = new Cookie(this.testCookieData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testCookie.getDomain(), this.testCookieData.domain,
            "Assert Cookie.domain was set correctly");
        test.assertEqual(this.testCookie.getExpires(), this.testCookieData.expires,
            "Assert Cookie.expires was set correctly");
        test.assertEqual(this.testCookie.getHttpOnly(), this.testCookieData.httpOnly,
            "Assert Cookie.httpOnly was set correctly");
        test.assertEqual(this.testCookie.getOriginalMaxAge(), this.testCookieData.originalMaxAge,
            "Assert Cookie.originalMaxAge was set correctly");
        test.assertEqual(this.testCookie.getPath(), this.testCookieData.path,
            "Assert Cookie.path was set correctly");
        test.assertEqual(this.testCookie.getSecure(), this.testCookieData.secure,
            "Assert Cookie.secure was set correctly");

        test.assertTrue((this.testCookie.getMaxAge() <= 1000 && this.testCookie.getMaxAge() > 0),
            "Assert #getMaxAge returns a number that's within the range of the expires");
    }
};

var cookieInstantiationNoValuesTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testCookieData = {};
        this.testCookie = new Cookie(this.testCookieData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testCookie.getDomain(), "",
            "Assert Cookie.domain defaulted to ''");
        test.assertTrue(this.testCookie.getExpires() > new Date(Date.now()),
            "Assert Cookie.expires was set correctly");
        test.assertEqual(this.testCookie.getHttpOnly(), true,
            "Assert Cookie.httpOnly defaulted to true");
        test.assertTrue(this.testCookie.getOriginalMaxAge() > 0 ,
            "Assert Cookie.originalMaxAge was set correctly");
        test.assertEqual(this.testCookie.getPath(), "/",
            "Assert Cookie.path defaulted to '/'");
        test.assertEqual(this.testCookie.getSecure(), false,
            "Assert Cookie.secure defaulted to false");
    }
};

var cookieCloneDeepTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testCookieData = {
            domain: "testDomain",
            expires: new Date(Date.now() + 1000),
            httpOnly: true,
            id: "testId",
            originalMaxAge: 2000,
            path: "testPath",
            secure: true
        };
        this.testCookie = new Cookie(this.testCookieData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var clone = this.testCookie.clone(true);
        test.assertEqual(clone.getDomain(), this.testCookieData.domain,
            "Assert that #getDonain is equal to testCookieData.domain");
        test.assertEqual(clone.getExpires(), this.testCookieData.expires,
            "Assert that #getExpires is equal to testCookieData.expires");
        test.assertEqual(clone.getHttpOnly(), this.testCookieData.httpOnly,
            "Assert that #getHttpOnly is equal to testCookieData.httpOnly");
        test.assertEqual(clone.getOriginalMaxAge(), this.testCookieData.originalMaxAge,
            "Assert that #getOriginalMaxAge is equal to testCookieData.originalMaxAge");
        test.assertEqual(clone.getPath(), this.testCookieData.path,
            "Assert that #getPath is equal to testCookieData.path");
        test.assertEqual(clone.getSecure(), this.testCookieData.secure,
            "Assert that #getSecure is equal to testCookieData.secure");

        test.assertTrue(Class.doesExtend(clone, Cookie),
            "Assert clone is an instance of Cookie");
        test.assertTrue(clone !== this.testCookie,
            "Assert that Cookie instances are not the same");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(cookieInstantiationTest).with(
    test().name("Cookie - instantiation Test")
);
bugmeta.annotate(cookieInstantiationNoValuesTest).with(
    test().name("Cookie - instantiation with no values Test")
);
bugmeta.annotate(cookieCloneDeepTest).with(
    test().name("Cookie - #clone deep Test")
);

