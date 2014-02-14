//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('BaseBetaKeySchema')
//@Autoload


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var Schema      = mongoose.Schema;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BaseBetaKeySchema = new Schema({
    betaKey:                {type: String, required: true, index: true},
    cap:                    {type: Number, required: false},
    createdAt:              {type: Date,   required: true, default: Date.now},
    updatedAt:              {type: Date,   required: true, default: Date.now}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BaseBetaKeySchema', BaseBetaKeySchema);
