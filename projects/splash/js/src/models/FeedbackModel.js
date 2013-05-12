//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('FeedbackModel')

//@Require('splash.FeedbackModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var mongoose = require('mongoose');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var FeedbackSchema = new mongoose.Schema({
    anythingConfusing: String,
    biggestConcern: String,
    currentPage: String,
    helpSolve: String,
    stoppingSignUp: String,
    whatElse: String
});

var FeedbackModel = mongoose.model("Feedback", FeedbackSchema);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.FeedbackModel', FeedbackModel);
