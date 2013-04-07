//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('BetaSignUpModel')

//@Require('splash.BetaSignUpModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var mongoose = require('mongoose');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BetaSignUpSchema = new mongoose.Schema({
    company: String,
    companySize: String,
    email: String,
    name: String,
    phoneNumber: String,
    position: String,
    wishList: [String]
});

var BetaSignUpModel = mongoose.model("BetaSignUp", BetaSignUpSchema);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.BetaSignUpModel', BetaSignUpModel);
