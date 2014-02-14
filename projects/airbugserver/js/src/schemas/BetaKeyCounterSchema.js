//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('BetaKeyCounterSchema')
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

var BetaKeyCounterSchema = new Schema({
    isBaseKey:              {type: Boolean, required: true, default: false,     index: true},
    betaKey:                {type: String,  required: true,                     index: true},
    createdAt:              {type: Date,    required: true, default: Date.now},
    count:                  {type: Number,  required: true, default: 0},
    updatedAt:              {type: Date,    required: true, default: Date.now}
});

/**
 * @param {string} betaKey
 * @param {function(?Error, number=)} callback
 */
BetaKeyCounterSchema.statics.incrementCountForBetaKey = function(betaKey, callback) {
    this.findOneAndUpdate(
        { betaKey: betaKey },
        { $inc: { count: 1 } },
        { new: true, upsert: true},
        function(error, betaKeyCounter){
            if(error){
                callback(error);
            } else {
                if(betaKeyCounter){
                    callback(null, betaKeyCounter.count);
                } else {
                    callback(new Error("No betaKeyCounter found"));
                }
            }
        }
    );
};

/**
 * @param {string} betaKey
 * @param {function(?Error, number=} callback
 */
BetaKeyCounterSchema.statics.getCountByBetaKey = function(betaKey, callback) {
    this.find(
        { betaKey: betaKey },
        function(error, betaKeyCounter) {
            callback(error, betaKeyCounter.count);
        }
    );
};

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BetaKeyCounterSchema', BetaKeyCounterSchema);
