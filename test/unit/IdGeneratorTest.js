//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var annotate = require('../../lib/annotate/Annotate').annotate;
var IdGenerator = require('../../lib/IdGenerator');


//-------------------------------------------------------------------------------
// Declare Test
//-------------------------------------------------------------------------------

var IdGeneratorTest = {

    /**
     * This tests...
     * 1) Generating a new id is always a different id.
     */
    generateIdTest: annotate(function() {

        // Setup Test
        //-------------------------------------------------------------------------------

        var id1 = IdGenerator.generateId();
        var id2 = IdGenerator.generateId();
        var id3 = IdGenerator.generateId();


        // Run Test
        //-------------------------------------------------------------------------------

        this.assertNotEqual(id1, id2,
            "Assert the first id generated and the second id generated are not equal");
        this.assertNotEqual(id2, id3,
            "Assert the second id generated and the third id generated are not equal");
        this.assertNotEqual(id1, id3,
            "Assert the third id generated and the first id generated are not equal");

    }).with('@Test(" IdGenerator generate id test")')


    /*IdGenerator.generateId = function() {
    return IdGenerator.lastId++;
};

IdGenerator.injectId = function(obj) {
    if (obj !== null && obj !== undefined) {
        if (!obj._internalId) {
            Object.defineProperty(obj, "_internalId", {
                value : IdGenerator.generateId(),
                writable : false,
                enumerable : false,
                configurable : false
            });
        } else {
            throw new Error("Trying to inject an id in to a object that already has one.");
        }
    }
};

IdGenerator.ensureId = function(obj) {
    if (obj !== null && obj !== undefined) {
        if (!obj._internalId) {
            IdGenerator.injectId(obj);
        }
    }
}; */
};


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = IdGeneratorTest;
