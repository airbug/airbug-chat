//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserManagerModule')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('airbug.ApiDefines')
//@Require('airbug.ManagerModule')
//@Require('airbug.UserList')
//@Require('airbug.UserModel')
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

var ArgUtil                         = bugpack.require('ArgUtil');
var Class                           = bugpack.require('Class');
var ApiDefines                      = bugpack.require('airbug.ApiDefines');
var ManagerModule                   = bugpack.require('airbug.ManagerModule');
var UserList                        = bugpack.require('airbug.UserList');
var UserModel                       = bugpack.require('airbug.UserModel');
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

var UserManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {IList=} dataList
     * @return {UserList}
     */
    generateUserList: function(dataList) {
        return new UserList(dataList);
    },

    /**
     * @param {Object} dataObject
     * @param {MeldDocument=} meldDocument
     * @returns {UserModel}
     */
    generateUserModel: function(dataObject, meldDocument) {
        return new UserModel(dataObject, meldDocument);
    },

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
