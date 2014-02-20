//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('BetaKeySchema')
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

var BetaKeySchema = new Schema({
    baseKey:                {type: String,      required: true,                     index: true},
    betaKey:                {type: String,      required: true,                     index: true, unique: true},
    cap:                    {type: Number,      required: false},
    createdAt:              {type: Date,        required: true, default: Date.now},
    count:                  {type: Number,      required: true, default: 0},
    hasCap:                 {type: Boolean,     required: true, default: false},
    isBaseKey:              {type: Boolean,     required: true, default: false,     index: true},
    secondaryKeys:          {type: [String],    required: false},
    updatedAt:              {type: Date,        required: true, default: Date.now},
    version:                {type: String,      required: true, default: "0.0.1"}
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BetaKeySchema', BetaKeySchema);
