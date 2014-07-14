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

//@TestFile

//@Require('Class')
//@Require('Flows')
//@Require('airbugserver.UserImageAssetStreamManager')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Flows                           = bugpack.require('Flows');
    var UserImageAssetStreamManager     = bugpack.require('airbugserver.UserImageAssetStreamManager');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var TestTag                         = bugpack.require('bugunit.TestTag');
    var BugYarn                         = bugpack.require('bugyarn.BugYarn');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                         = BugMeta.context();
    var bugyarn                         = BugYarn.context();
    var test                            = TestTag.test;
    var $series                         = Flows.$series;
    var $task                           = Flows.$task;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestUserImageAssetStreamManager", function(yarn) {
        yarn.wind({
            userImageAssetStreamManager: new UserImageAssetStreamManager()
        });
    });


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var userImageAssetStreamManagerInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            this.testUserImageAssetStreamManager   = new UserImageAssetStreamManager();
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testUserImageAssetStreamManager, UserImageAssetStreamManager),
                "Assert instance of UserImageAssetStreamManager");
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(userImageAssetStreamManagerInstantiationTest).with(
        test().name("UserImageAssetStreamManager - instantiation test")
    );
});
