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
    email: {type: String, index: true, unique: true},
    firstName: String,
    lastName: String,
    anonymous: Boolean,
    roomsList: [{type: ObjectId, ref: 'Room'}],
    createdAt: Date,
    updatedAt: Date
});

//-------------------------------------------------------------------------------
// Instance Methods
//-------------------------------------------------------------------------------

/**
 * @return {boolean}
 */
UserSchema.method("isAnonymous", function(){
	return this.anonymous;
});

/**
 * @return {boolean}
 */
UserSchema.method("isNotAnonymous", function(){
	return !this.anonymous;
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UserSchema', UserSchema);
