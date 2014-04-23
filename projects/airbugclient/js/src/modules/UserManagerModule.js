//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.UserManagerModule')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('airbug.ApiDefines')
//@Require('airbug.ManagerModule')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var ArgUtil                         = bugpack.require('ArgUtil');
    var Class                           = bugpack.require('Class');
    var ApiDefines                      = bugpack.require('airbug.ApiDefines');
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

    /**
     * @class
     * @extends {ManagerModule}
     */
    var UserManagerModule = Class.extend(ManagerModule, {

        _name: "airbug.UserManagerModule",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} userId
         * @param {function(Throwable, MeldDocument=)} callback
         */
        retrieveUser: function(userId, callback) {
            this.retrieve("User", userId, callback);
        },

        /**
         * @param {Array.<string>} userIds
         * @param {function(Throwable, Map.<string, MeldDocument>=)} callback
         */
        retrieveUsers: function(userIds, callback) {
            this.retrieveEach("User", userIds, callback);
        },

        /**
         * @param {string} userId
         * @param {Object} updateObject
         * @param {function(Throwable, MeldDocument=)} callback
         */
        updateUser: function(userId, updateObject, callback) {
            this.update("User", userId, updateObject, callback);
        },

        /**
         * @param {string} userId
         * @param {Object} updateObject
         * @param {function(Throwable, MeldDocument=)} callback
         */
        updateUserPassword: function(userId, updateObject, callback) {
            var args = ArgUtil.process(arguments, [
                {name: "userId", optional: false, type: "string"},
                {name: "updateObject", optional: false, type: "object"},
                {name: "callback", optional: false, type: "function"}
            ]);
            userId          = args.userId;
            updateObject    = args.updateObject;
            callback        = args.callback;

            var _this = this;
            var requestData = {
                userId: userId,
                updateObject: updateObject
            };
            var requestType = "updateUserPassword";
            this.getAirbugApi().sendRequest(requestType, requestData, function(throwable, callResponse) {
                if (!throwable)  {
                    var data = callResponse.getData();
                    if (callResponse.getType() === ApiDefines.Responses.SUCCESS) {
                        var returnedMeldDocumentKey     = _this.meldBuilder.generateMeldDocumentKey("User", userId);
                        var meldDocument        = _this.get(returnedMeldDocumentKey);
                        callback(null, meldDocument);
                    } else if (callResponse.getType() === ApiDefines.Responses.EXCEPTION) {
                        //TODO BRN: Handle common exceptions
                        callback(data.exception);
                    } else if (callResponse.getType() === ApiDefines.Responses.ERROR) {
                        //TODO BRN: Handle common errors
                        callback(data.error);
                    } else {
                        callback(null, callResponse);
                    }
                } else {
                    callback(throwable);
                }
            });
        },
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(UserManagerModule).with(
        module("userManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.UserManagerModule", UserManagerModule);
});
