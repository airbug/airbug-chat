/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */

//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('TypeUtil')
//@Require('airbug.PasswordUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var TypeUtil        = bugpack.require('TypeUtil');
    var PasswordUtil    = bugpack.require('airbug.PasswordUtil');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TestAnnotation  = bugpack.require('bugunit.TestAnnotation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta         = BugMeta.context();
    var test            = TestAnnotation.test;


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var PasswordUtilIsValidTest = {

        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(PasswordUtil.isValid("happy!"),
                "Ensure that a valid password is valid");
            test.assertFalse(PasswordUtil.isValid(undefined),
                "Ensure that undefined passwords are not valid");
            test.assertFalse(PasswordUtil.isValid(null),
                "Ensure that null passwords are not valid");
            test.assertFalse(PasswordUtil.isValid(""),
                "Ensure that empty passwords are not valid");
        }
    };

    var PasswordUtilRequirementsStringTest = {
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(TypeUtil.isString(PasswordUtil.requirementsString),
                "Ensure requirementsString is a string");
            test.assertTrue(PasswordUtil.requirementsString.length > 0,
                "Ensure requirementsString has a length > 0");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(PasswordUtilIsValidTest).with(
        test().name("PasswordUtil #isValid tests")
    );
    bugmeta.annotate(PasswordUtilRequirementsStringTest).with(
        test().name("PasswordUtil requirementsString tests")
    );
});
