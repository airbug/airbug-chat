//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AssetSchema')
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

var AssetSchema = new Schema({
    type: {type: String},
    createdAt: Date,
    midsizeMimeType: {type: String},
    midsizeUrl: {type: String},
    mimeType: {type: String},
    name: {type: String},
    thumbMimeType: {type: String},
    thumbnailUrl: {type: String},
    updatedAt: Date,
    url: {type: String, index: true, unique: true, required: true}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AssetSchema', AssetSchema);
