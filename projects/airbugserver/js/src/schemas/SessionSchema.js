//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionSchema')
//@Autoload


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var Mixed       = mongoose.Schema.Types.Mixed;
var ObjectId    = mongoose.Schema.Types.ObjectId;
var Schema      = mongoose.Schema;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionSchema = new Schema({
    cookie: {type: Mixed, required: true},
    createdAt: Date,
    data: {type: Mixed, required: true},
    sid: {type: String, required: true, index: true, unique: true},
    updatedAt: Date,
    userId: {type: ObjectId, index: true}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SessionSchema', SessionSchema);
