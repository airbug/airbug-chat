//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var Obj = require('../../lib/Obj');
var TypeUtil = require('../../lib/TypeUtil');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var ObjTest = {
    /**
     * This tests
     * 1) Instantiation of a basic Obj
     * 2) That the getClass() value is Obj when an Obj is instantiated
     */
    objInstantiationTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var testObject1 = new Obj();
        var testObject2 = new Obj();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertEqual(testObject1.getClass(), Obj,
            "Assert object1's class is Obj");
        this.assertEqual(testObject2.getClass(), Obj,
            "Assert object2's class is Obj");
        this.assertNotEqual(testObject1.getId(), testObject2.getId(),
            "Assert id of both objects are different");

    }).with('@Test("Obj instantiation test")'),

    /**
     * This tests
     * 1) The hashCode method of an instantiated Obj
     * 2) The static hashCode method of the Obj class
     * 3) That the hashCode is the same when run multiple times
     * 4) That the Obj.hashCode and the instantiated object hashCode match
     */
    objHashCodeTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var testObject = new Obj();
        var testObjectHashCode = testObject.hashCode();
        var testStaticObjectHashCode = Obj.hashCode(testObject);


        // Run Test
        //-------------------------------------------------------------------------------

        // NOTE BRN: There is no guarantee that the hash codes of two different objects are different. But we can
        // verify that they are numeric at least.

        this.assertTrue(TypeUtil.isNumber(testObjectHashCode),
            "Assert object's hash code is numeric");
        this.assertTrue(TypeUtil.isNumber(testObjectHashCode),
            "Assert value returned from Obj.hashCode is numeric");
        this.assertEqual(testObject.hashCode(), testObjectHashCode,
            "Assert object's hash code is the same when run multiple times");
        this.assertEqual(testObjectHashCode, testStaticObjectHashCode,
            "Assert Obj.hashCode and the instantiated object hashCode match");

    }).with('@Test("Obj hashCode test")'),

    /**
     * This tests
     * 1) The static equals method of the Obj class
     */
    objEqualsTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var testObject1 = new Obj();
        var testObject2 = new Obj();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertTrue(Obj.equals("value1", "value1"),
            "Assert equals returns true for two matching strings");
        this.assertTrue(Obj.equals(123, 123),
            "Assert equals returns true for two matching numbers");
        this.assertTrue(Obj.equals(0, 0),
            "Assert equals returns true for two 0 numbers");
        this.assertTrue(Obj.equals(null, null),
            "Assert equals returns true for two null values");
        this.assertTrue(Obj.equals(undefined, undefined),
            "Assert equals returns true for two undefined values");
        this.assertTrue(Obj.equals(testObject1, testObject1),
            "Assert two of the same Obj instance are equal");

        //TODO BRN (QUESTION): Do these assertions make sense? Should we do some sort of auto conversion for these values?
        this.assertFalse(Obj.equals(new String("abc123"), "abc123"),
            "Assert equals returns false for a string object and string literal that are the same string");
        this.assertFalse(Obj.equals(new Number(123), 123),
            "Assert equals returns false for number object and number literal that are the same number");
        this.assertFalse(Obj.equals(new Number(123), new Number(123)),
            "Assert equals returns false for two number objects that are the same number");



        this.assertFalse(Obj.equals(testObject1, testObject2),
            "Assert two different Obj instances are not equal");

    }).with('@Test("Obj equals test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = ObjTest;
