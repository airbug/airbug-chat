//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var Interface = require('../../lib/Interface');
var TypeUtil = require('../../lib/TypeUtil');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var InterfaceTest = {

    /**
     *
     */
    declareTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var NewInterface = Interface.declare({
            someFunction1: function() {

            },
            someFunction2: function() {

            }
        });

        // Run Test
        //-------------------------------------------------------------------------------

        this.assertTrue(TypeUtil.isFunction(NewInterface.prototype.someFunction1),
            "Assert function added to interface is function and is present in interface prototype");
        this.assertTrue(TypeUtil.isFunction(NewInterface.prototype.someFunction2),
            "Assert second function added to interface is function and is present in interface prototype");

    }).with('@Test("Interface declare test")')
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = InterfaceTest;
