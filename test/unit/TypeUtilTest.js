//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var TypeUtil = require('../../lib/TypeUtil');
var TypeValueSetsHelper = require('./TypeValueSetsHelper');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var TypeUtilTest = {

    /**
     *
     */
    isArrayTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------


        // Run Test
        //-------------------------------------------------------------------------------

        TypeUtilTest.runTypeTest("array", this);

    }).with('@Test("TypeUtil isArray test")'),

    /**
     *
     */
    isBooleanTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------


        // Run Test
        //-------------------------------------------------------------------------------

        TypeUtilTest.runTypeTest("boolean", this);

    }).with('@Test("TypeUtil isBoolean test")'),

    /**
     *
     */
    isFunctionTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------


        // Run Test
        //-------------------------------------------------------------------------------

        TypeUtilTest.runTypeTest("function", this);

    }).with('@Test("TypeUtil isFunction test")'),

    /**
     *
     */
    isNullTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------


        // Run Test
        //-------------------------------------------------------------------------------

        TypeUtilTest.runTypeTest("null", this);

    }).with('@Test("TypeUtil isNull test")'),

    /**
     *
     */
    isNumberTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------


        // Run Test
        //-------------------------------------------------------------------------------

        TypeUtilTest.runTypeTest("string", this);

    }).with('@Test("TypeUtil isNumber test")'),

    /**
     *
     */
    isObjectTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------


        // Run Test
        //-------------------------------------------------------------------------------

        TypeUtilTest.runTypeTest("object", this);

    }).with('@Test("TypeUtil isObject test")'),

    /**
     *
     */
    isStringTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------


        // Run Test
        //-------------------------------------------------------------------------------

        TypeUtilTest.runTypeTest("string", this);

    }).with('@Test("TypeUtil isString test")'),

    /**
     *
     */
    isUndefinedTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------


        // Run Test
        //-------------------------------------------------------------------------------

        TypeUtilTest.runTypeTest("undefined", this);

    }).with('@Test("TypeUtil isNumber test")'),

    runTypeTest: function(typeToTest, runningTest) {
        var typeValueSets = TypeValueSetsHelper.getTypeValueSets();
        for (var type in typeValueSets) {
            var typeValueSet = typeValueSets[type];
            typeValueSet.forEach(function(typeValue) {
                if (type === typeToTest) {
                    runningTest.assertTrue(TypeUtilTest.testIsType(typeToTest, typeValue.value), "Assert " + typeValue.name + " is " + typeToTest);
                } else {
                    runningTest.assertFalse(TypeUtilTest.testIsType(typeToTest, typeValue.value), "Assert " + typeValue.name + " is NOT " + typeToTest)
                }
            });
        }
    },

    testIsType: function(type, value) {
        if (type === "array") {
            return TypeUtil.isArray(value);
        } else if (type === "boolean") {
            return TypeUtil.isBoolean(value);
        } else if (type === "function") {
            return TypeUtil.isFunction(value);
        } else if (type === "null") {
            return TypeUtil.isNull(value);
        } else if (type === "number") {
            return TypeUtil.isNumber(value);
        } else if (type === "object") {
            return TypeUtil.isObject(value);
        } else if (type === "string") {
            return TypeUtil.isString(value);
        } else if (type === "undefined") {
            return TypeUtil.isUndefined(value);
        }
    }
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = TypeUtilTest;
