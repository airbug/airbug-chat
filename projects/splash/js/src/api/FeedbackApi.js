//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('splash')

//@Export('FeedbackApi')

//@Require('splash.FeedbackModel')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var FeedbackModel =   bugpack.require('splash.FeedbackModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var FeedbackApi = {

    /**
     * @param {{
     *      anythingConfusing: string,
     *      biggestConcern: string,
     *      currentPage: string,
     *      helpSolve: string,
     *      stoppingSignUp: string,
     *      whatElse: string
     * }} data
     * @param {function(Error, FeedbackModel)} callback
     */
    createFeedback: function(data, callback) {
        //TODO BRN: Add validation of params

        var feedback = {
            anythingConfusing: data.anythingConfusing,
            biggestConcern: data.biggestConcern,
            currentPage: data.currentPage,
            helpSolve: data.helpSolve,
            stoppingSignUp: data.stoppingSignUp,
            whatElse: data.whatElse
        };
        var feedbackModel = new FeedbackModel(feedback);
        feedbackModel.save(function(error, result) {
            if (error) {
                callback(new Error('feedback failed to save'));
            } else {
                callback(null, result);
            }
        });
    },

    findAllFeedbacks: function(callback) {
        var query = FeedbackModel.find();
        query.exec(function(error, feedbacks) {
            callback(error, feedbacks);
        });
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('splash.FeedbackApi', FeedbackApi);
