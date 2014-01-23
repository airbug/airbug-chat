//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('UserImageAssetStreamManagerModule')
//@Autoload

//@Require('Class')
//@Require('airbug.UserImageAssetStreamModel')
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
var UserImageAssetStreamModel       = bugpack.require('airbug.UserImageAssetStreamModel');
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

var UserImageAssetStreamManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Object} dataObject
     * @param {MeldDocument=} meldDocument
     * @returns {UserImageAssetStreamModel}
     */
    generateUserImageAssetStreamModel: function(dataObject, meldDocument) {
        return new UserImageAssetStreamModel(dataObject, meldDocument);
    },

    /**
     * @param {string} userId
     * @param {function(Throwable, MeldDocument=)} callback
     */
    retrieveUserImageAssetStream: function(userId, callback) {
        this.retrieve("UserImageAssetStream", userId, callback);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(UserImageAssetStreamManagerModule).with(
    module("userImageAssetStreamManagerModule")
        .args([
            arg().ref("airbugApi"),
            arg().ref("meldStore"),
            arg().ref("meldBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.UserImageAssetStreamManagerModule", UserImageAssetStreamManagerModule);
