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

//@Export('airbug.RoomMemberManagerModule')
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

    var Class           = bugpack.require('Class');
    var ManagerModule   = bugpack.require('airbug.ManagerModule');
    var ArgTag          = bugpack.require('bugioc.ArgTag');
    var ModuleTag       = bugpack.require('bugioc.ModuleTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg             = ArgTag.arg;
    var bugmeta         = BugMeta.context();
    var module          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ManagerModule}
     */
    var RoomMemberManagerModule = Class.extend(ManagerModule, {

        _name: "airbug.RoomMemberManagerModule",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} roomMemberId
         * @param {function(Throwable, MeldDocument=)} callback
         */
        retrieveRoomMember: function(roomMemberId, callback) {
            this.retrieve("RoomMember", roomMemberId, callback);
        },

        /**
         * @param {Array.<string>} roomMemberIds
         * @param {function(Throwable, Map.<string, MeldDocument>=)} callback
         */
        retrieveRoomMembers: function(roomMemberIds, callback) {
            this.retrieveEach("RoomMember", roomMemberIds, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomMemberManagerModule).with(
        module("roomMemberManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomMemberManagerModule", RoomMemberManagerModule);
});
