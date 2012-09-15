//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var Class = require('../../lib/Class');
var IHashCode = require('../../lib/IHashCode');
var Interface = require('../../lib/Interface');
var Obj = require('../../lib/Obj');
var TypeUtil = require('../../lib/TypeUtil');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var ClassTest = {

    /**
     *
     */
    extendObjTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var NewClass = Class.extend(Obj, {
            someTestFunction1: function() {

            },
            someTestFunction2: function() {

            }
        });
        var instance = new NewClass();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertTrue(TypeUtil.isFunction(NewClass.prototype.someTestFunction1),
            "Assert function added to class is function and is present in class prototype");
        this.assertTrue(TypeUtil.isFunction(NewClass.prototype.someTestFunction2),
            "Assert second function added to class is function and is present in class prototype");
        this.assertTrue(TypeUtil.isFunction(instance.someTestFunction1),
            "Assert function added to class is present in class instance");
        this.assertTrue(TypeUtil.isFunction(instance.someTestFunction2),
            "Assert second function added to class is present in class instance");
        this.assertTrue(Class.doesExtend(instance, Obj),
            "Assert instance of new class extends base level Object class");
        this.assertTrue(Class.doesImplement(instance, IHashCode),
            "Assert instance of new class implements IHashCode");

    }).with('@Test("Class extend Obj test")'),

    /**
     *
     */
    extendTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var ParentClass = Class.extend(Obj, {
            someTestFunction1: function() {

            },
            someTestFunction2: function() {

            }
        });
        var ChildClass = Class.extend(ParentClass, {
            someTestFunction1: function() {

            },
            someTestFunction3: function() {

            }
        });
        var instanceChildClass = new ChildClass();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertTrue(TypeUtil.isFunction(ChildClass.prototype.someTestFunction1),
            "Assert override function added to child class is function and is present in child class prototype");
        this.assertTrue(TypeUtil.isFunction(ChildClass.prototype.someTestFunction2),
            "Assert function of parent class is function and is present in child class prototype");
        this.assertTrue(TypeUtil.isFunction(ChildClass.prototype.someTestFunction2),
            "Assert function added to child class is function and is present in child class prototype");
        this.assertTrue(TypeUtil.isFunction(instanceChildClass.someTestFunction1),
            "Assert override function added to child class is present in child class instance");
        this.assertTrue(TypeUtil.isFunction(instanceChildClass.someTestFunction2),
            "Assert function of parent class is present in child class instance");
        this.assertTrue(TypeUtil.isFunction(instanceChildClass.someTestFunction3),
            "Assert function added to child class is present in child class instance");

        this.assertTrue(Class.doesExtend(instanceChildClass, Obj),
            "Assert child class extends base level Object class");
        this.assertTrue(Class.doesExtend(instanceChildClass, Obj),
            "Assert child class extends parent class");

    }).with('@Test("Class extend test")'),

    /**
     *
     */
    implementTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var TestInterface = Interface.declare({
            someInterfaceFunction: function() {

            }
        });
        var TestClass = Class.extend(Obj, {
            someInterfaceFunction: function() {

            },
            someFunction: function() {

            }
        });
        Class.implement(TestClass, TestInterface);
        var instance = new TestClass();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertTrue(TypeUtil.isFunction(TestClass.prototype.someFunction),
            "Assert function added to class is function and is present in class prototype");
        this.assertTrue(TypeUtil.isFunction(TestClass.prototype.someInterfaceFunction),
            "Assert interface function added to class is function and is present in class prototype");
        this.assertEqual(TestClass.getInterfaces().length, 2,
            "Assert we have 2 interfaces listed on TestClass (IHashCode and TestInterface)");
        this.assertEqual(TestClass.getInterfaces()[1], TestInterface,
            "Assert test interface is listed in TestClass interfaces");
        this.assertTrue(TypeUtil.isFunction(instance.someFunction),
            "Assert function added to class is present in class instance");
        this.assertTrue(TypeUtil.isFunction(instance.someInterfaceFunction),
            "Assert interface function added to class is present in class instance");
        this.assertEqual(instance.getClass().getInterfaces().length, 2,
            "Assert we have 2 interfaces listed in instance of TestClass through getClass()");
        this.assertEqual(instance.getClass().getInterfaces()[1], TestInterface,
            "Assert TestInterface is listed in interfaces on instance of TestClass through getClass()");
        this.assertTrue(Class.doesImplement(instance, TestInterface),
            "Assert Class.doesImplement returns true for instance implementing TestInterface");

    }).with('@Test("Class implement test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = ClassTest;
