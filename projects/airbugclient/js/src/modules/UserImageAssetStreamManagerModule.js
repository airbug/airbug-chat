//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.UserImageAssetStreamManagerModule')
//@Autoload

//@Require('Class')
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

    var Class                           = bugpack.require('Class');
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
    var UserImageAssetStreamManagerModule = Class.extend(ManagerModule, {

        _name: "airbug.UserImageAssetStreamManagerModule",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

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
});
