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
//@Require('Set')
//@Require('UuidGenerator')
//@Require('airbugserver.Room')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Set                     = bugpack.require('Set');
var UuidGenerator           = bugpack.require('UuidGenerator');
var Room                    = bugpack.require('airbugserver.Room');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var roomInstantiationTests = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    // testPasswordHash will validate against password 'lastpass' no quotes.
    setup: function(test) {
        this.testConversationId     = "testConversationId";
        this.testName               = "testName";
        this.testRoomMemberIdSet    = new Set();
        this.testRoom               = new Room({
            conversationId: this.testConversationId,
            name: this.testName,
            roomMemberIdSet: this.testRoomMemberIdSet
        });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testRoom.getName(), this.testName,
            "Assert Room.name was set correctly");
        test.assertEqual(this.testRoom.getConversationId(), this.testConversationId,
            "Assert Room.conversationId was set correctly");
        test.assertEqual(this.testRoom.getRoomMemberIdSet(), this.testRoomMemberIdSet,
            "Assert Room.roomMemberIdSet was set correctly");
    }
};

var roomGetterSetterTests = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testConversationId     = "testConversationId";
        this.testName               = "testName";
        this.testRoomMemberIdSet    = new Set();
        this.testRoom               = new Room();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testRoom.getConversationId(), undefined,
            "Assert Room#getConversationId returns undefined");
        test.assertEqual(this.testRoom.getName(), undefined,
            "Assert Room#getName returns undefined");
        test.assertEqual(this.testRoom.getRoomMemberIdSet(), undefined,
            "Assert Room#getRoomMemberIdSet returns undefined");

        this.testRoom.setConversationId(this.testConversationId);
        test.assertEqual(this.testRoom.getConversationId(), this.testConversationId,
            "Assert #setConversationId correctly set the conversationId");

        this.testRoom.setName(this.testName);
        test.assertEqual(this.testRoom.getName(), this.testName,
            "Assert #setName correctly set the name");

        this.testRoom.setRoomMemberIdSet(this.testRoomMemberIdSet);
        test.assertEqual(this.testRoom.getRoomMemberIdSet(), this.testRoomMemberIdSet,
            "Assert #setRoomMemberIdSet correctly sets the roomMemberIdSet");
    }

};

bugmeta.tag(roomInstantiationTests).with(
    test().name("Room - instantiation Tests")
);
bugmeta.tag(roomGetterSetterTests).with(
    test().name("Room - getter/setter Tests")
);
