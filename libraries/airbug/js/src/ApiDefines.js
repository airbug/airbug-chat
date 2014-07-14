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

//@Export('airbug.ApiDefines')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class   = bugpack.require('Class');
    var Obj     = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var ApiDefines = Class.extend(Obj, {
        _name: "airbug.ApiDefines"
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    ApiDefines.Responses = {
        ERROR: "Error",
        EXCEPTION: "Exception",
        LIST_SUCCESS: "ListSuccess",
        MAPPED_EXCEPTION: "MappedException",
        MAPPED_SUCCESS: "MappedSuccess",
        MAPPED_SUCCESS_WITH_EXCEPTION: "MappedSuccessWithException",
        SUCCESS: "Success",
        SUCCESS_WITH_EXCEPTION: "SuccessWithException"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.ApiDefines", ApiDefines);
});
