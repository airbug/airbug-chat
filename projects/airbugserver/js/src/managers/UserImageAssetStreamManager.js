/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UserImageAssetStreamManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbugserver.UserImageAssetStream')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Obj                     = bugpack.require('Obj');
    var UserImageAssetStream    = bugpack.require('airbugserver.UserImageAssetStream');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;


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

    bugmeta.tag(UserImageAssetStreamManager).with(
        module("userImageAssetStreamManager")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.UserImageAssetStreamManager', UserImageAssetStreamManager);
});
