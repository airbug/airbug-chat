//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('airbugserver.RequestContext')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var RequestContext          = bugpack.require('airbugserver.RequestContext');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWeaver("testRequestContext", function(yarn, args) {
    return new RequestContext(args[0], args[1]);
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var requestContextInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testType               = "testType";
        this.testRequest            = {};
        this.testRequestContext     = new RequestContext(this.testType, this.testRequest)
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testRequestContext, RequestContext),
            "Assert instance of RequestContext");
        test.assertEqual(this.testRequestContext.getType(), this.testType,
            "Assert that .type was set correctly");
        test.assertEqual(this.testRequestContext.getRequest(), this.testRequest,
            "Assert that .request was set correctly");
    }
};
bugmeta.annotate(requestContextInstantiationTest).with(
    test().name("RequestContext - instantiation test")
);
