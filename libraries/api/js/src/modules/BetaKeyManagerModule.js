//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.BetaKeyManagerModule')
//@Autoload

//@Require('Class')
//@Require('airbug.ManagerModule')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var ManagerModule                   = bugpack.require('airbug.ManagerModule');
    var ArgTag                   = bugpack.require('bugioc.ArgTag');
    var ModuleTag                = bugpack.require('bugioc.ModuleTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                             = ArgTag.arg;
    var bugmeta                         = BugMeta.context();
    var module                          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ManagerModule}
     */
    var BetaKeyManagerModule = Class.extend(ManagerModule, {

        _name: "airbug.BetaKeyManagerModule",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} betaKey
         * @param {function(Throwable, MeldDocument=)} callback
         */
        retrieveBetaKeyByBetaKey: function(betaKey, callback) {
            var _this = this;
            this.request("retrieveBetaKey", {betaKey: betaKey}, function(throwable, callResponse) {
                if(!throwable) {
                    var data = callResponse.getData();
                    if(data.list){
                        _this.processListRetrieveResponse(throwable, callResponse, "BetaKey", callback);
                    } else if(data.objectId) {
                        _this.retrieve("BetaKey", data.objectId, callback);
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

    bugmeta.tag(BetaKeyManagerModule).with(
        module("betaKeyManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.BetaKeyManagerModule", BetaKeyManagerModule);
});
