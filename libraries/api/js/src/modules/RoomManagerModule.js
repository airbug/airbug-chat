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

//@Export('airbug.RoomManagerModule')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('airbug.ApiDefines')
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

    var ArgUtil         = bugpack.require('ArgUtil');
    var Class           = bugpack.require('Class');
    var ApiDefines      = bugpack.require('airbug.ApiDefines');
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
    var RoomManagerModule = Class.extend(ManagerModule, {

        _name: "airbug.RoomManagerModule",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} userId
         * @param {string} roomId
         * @param {function(Throwable, MeldDocument=)} callback
         */
        addUserToRoom: function(userId, roomId, callback) {
            var requestData = {userId: userId, roomId: roomId};
            this.request("addUserToRoom", requestData, callback);
        },

        /**
         * @param {{
         *      name: string
         * }} roomObject
         * @param {function(Throwable, MeldDocument=)} callback
         */
        createRoom: function(roomObject, callback) {
            this.create("Room", roomObject, callback);
        },

        /**
         * @param {string} roomId
         * @param {function(Throwable, MeldDocument=)} callback
         */
        joinRoom: function(roomId, callback) {
            var requestData = {roomId: roomId};
            this.request("joinRoom", requestData, callback);
        },

        /**
         * @param {string} roomId
         * @param {function(Throwable=)} callback
         */
        leaveRoom: function(roomId, callback) {
            var requestData = {roomId: roomId};
            this.request("leaveRoom", requestData, callback);
        },

        /**
         * @param {string} roomId
         * @param {function(Throwable, MeldDocument=)} callback
         */
        retrieveRoom: function(roomId, callback) {
            this.retrieve("Room", roomId, callback);
        },

        /**
         * @param {Array.<string>} roomIds
         * @param {function(Throwable, Map.<string, MeldDocument>=)} callback
         */
        retrieveRooms: function(roomIds, callback) {
            this.retrieveEach("Room", roomIds, callback);
        },

        /**
         * @param {{
         *      name: string,
         *      participantEmails: Array.<string>,
         *      chatMessage: {
         *          body: {
         *              parts: Array.<*>
         *          }
         *      }
         * }} startRoomObject
         * @param {function(Throwable, MeldDocument=)} callback
         */
        startRoom: function(startRoomObject, callback) {
            var args = ArgUtil.process(arguments, [
                {name: "startRoomObject", optional: false, type: "object"},
                {name: "callback", optional: false, type: "function"}
            ]);
            startRoomObject     = args.startRoomObject;
            callback            = args.callback;

            var _this = this;
            var requestData = {startRoomObject: startRoomObject};
            var requestType = "startRoom";
            this.request(requestType, requestData, function(throwable, callResponse) {
                if (!throwable) {
                    if (callResponse.getType() === ApiDefines.Responses.SUCCESS) {
                        var data        = callResponse.getData();
                        var objectId    = data.objectId;
                        var meldDocumentKey     = _this.meldBuilder.generateMeldDocumentKey(type, objectId);
                        var meldDocument  = _this.get(meldDocumentKey);
                        if (meldDocument) {
                            callback(null, meldDocument);
                        } else {
                            callback(new Error("Could not find MeldDocument after SUCCESS response. Something went wrong."));
                        }
                    } else if (callResponse.getType() === ApiDefines.Responses.EXCEPTION) {
                        //TODO BRN: Handle common exceptions
                    } else if (callResponse.getType() === ApiDefines.Responses.ERROR) {
                        //TODO BRN: Handle common errors
                    } else {
                        callback(undefined, callResponse);
                    }
                } else {

                    //TODO BRN: Handle common Throwables. These throwables should only come from

                    callback(throwable);
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RoomManagerModule).with(
        module("roomManagerModule")
            .args([
                arg().ref("airbugApi"),
                arg().ref("meldStore"),
                arg().ref("meldBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.RoomManagerModule", RoomManagerModule);
});
