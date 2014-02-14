//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('BetaKeyCounterManagerModule')
//@Autoload

//@Require('Class')
//@Require('airbug.BetaKeyCounterModel')
//@Require('airbug.ManagerModule')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var BetaKeyCounterModel             = bugpack.require('airbug.BetaKeyCounterModel');
var ManagerModule                   = bugpack.require('airbug.ManagerModule');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var module                          = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BetaKeyCounterManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Object} dataObject
     * @param {MeldDocument=} conversationMeldDocument
     * @returns {ConversationModel}
     */
    generateBetaKeyCounterModel: function(dataObject, conversationMeldDocument) {
        return new ConversationModel(dataObject, conversationMeldDocument);
    },

    /**
     * @param {string} betaKey
     * @param {function(Throwable, MeldDocument=)} callback
     */
    retrieveBetaKeyCounterByBetaKey: function(betaKey, callback) {
        var _this = this;
        this.request("retrieveBetaKeyCounter", {betaKey: betaKey}, function(throwable, callResponse) {
            if(!throwable) {
                var data = callResponse.getData();
                if(data.list){
                    _this.processListRetrieveResponse(throwable, callResponse, "BetaKeyCounter", callback);
                } else if(data.objectId) {
                    _this.retrieve("BetaKeyCounter", data.objectId, callback);
                }
            } else {
                callback(throwable, undefined);
            }

        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(BetaKeyCounterManagerModule).with(
    module("betaKeyCounterManagerModule")
        .args([
            arg().ref("airbugApi"),
            arg().ref("meldStore"),
            arg().ref("meldBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.BetaKeyCounterManagerModule", BetaKeyCounterManagerModule);
