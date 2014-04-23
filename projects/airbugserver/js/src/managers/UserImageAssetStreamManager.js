//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UserImageAssetStreamManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.UserImageAssetStream')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Obj                         = bugpack.require('Obj');
    var UserImageAssetStream        = bugpack.require('airbugserver.UserImageAssetStream');
    var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
    var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                         = ArgAnnotation.arg;
    var bugmeta                     = BugMeta.context();
    var module                      = ModuleAnnotation.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var UserImageAssetStreamManager = Class.extend(Obj, {

        _name: "airbugserver.UserImageAssetStreamManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {{
         *      id: string
         * }} data
         * @return {UserImageAssetStream}
         */
        generateUserImageAssetStream: function(data) {
            var userImageAssetStream = new UserImageAssetStream(data);
            userImageAssetStream.setEntityType("UserImageAssetStream");
            return userImageAssetStream;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(UserImageAssetStreamManager).with(
        module("userImageAssetStreamManager")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.UserImageAssetStreamManager', UserImageAssetStreamManager);
});
