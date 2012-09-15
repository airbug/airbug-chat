//TODO BRN: This should be moved to a resources folder and consumed by the compiler which will add it in to any code it compiles

//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var Class = require('../Class');
var List = require('../List');
var Obj = require('../Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Annotation = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(reference, type, paramList) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.paramList = paramList;

        this.reference = reference;

        this.type = type;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    getReference: function() {
        return this.reference;
    },

    getType: function() {
        return this.type;
    },

    getParamList: function() {
        return this.paramList;
    }
});


//-------------------------------------------------------------------------------
// Module Export
//-------------------------------------------------------------------------------

module.exports = Annotation;
