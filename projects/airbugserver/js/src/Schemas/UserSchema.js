//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('UserSchema')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var Schema      = mongoose.Schema;
var ObjectId    = mongoose.Schema.Types.ObjectId;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserSchema = new Schema({
    anonymous: Boolean,
    createdAt: Date,

    // NOTE BRN: Cannot make email unique since anonymous users have a 'null' value for their email and we can't have
    // more than one null. We'll have to validate uniqueness at the application level instead.
    // More info http://stackoverflow.com/questions/7955040/mongodb-mongoose-unique-if-not-null

    email: {type: String, index: true, unique: false},
    firstName: String,
    lastName: String,
    roomIdList: [{type: ObjectId, ref: 'Room'}],
    updatedAt: Date
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserSchema', UserSchema);
