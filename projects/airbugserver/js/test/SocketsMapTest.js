//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('airbugserver.SocketsMap')
//@Require('annotate.Annotate')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Annotate            = bugpack.require('annotate.Annotate');
var SocketsMap          = bugpack.require('airbugserver.SocketsMap');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var test = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var addUserToSessionsTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        var _this = this;
        this.socketsMap     = new SocketsMap().initialize();
        this.socket         = {id: "socketIdX"};
        this.session        = {id: "sessionIdX"};
        this.user           = {id: "userIdX"};
        this.testParams     = {
            session:    _this.session,
            socket:     _this.socket,
            user:       _this.user
        };
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){

        this.socketsMap.addUserToSessions(this.testParams);
        var returnedSessions      = this.socketsMap.userToSessionsMap.get(this.user);
        console.log("returnedSessions:", returnedSessions);
        test.assertEqual(returnedSessions[0], this.session,
            "Assert user has been associated with the correct session");
    }
};
annotate(addUserToSessionsTest).with(
    test().name("SocketsMap #addUserToSessionsTest Test")
);

var addSessionToUserTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        var _this = this;
        this.socketsMap = new SocketsMap().initialize();
        this.socket         = {id: "socketIdX"};
        this.session        = {id: "sessionIdX"};
        this.user           = {id: "userIdX"};
        this.testParams     = {
            session:    _this.session,
            socket:     _this.socket,
            user:       _this.user
        };
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){

        this.socketsMap.addSessionToUser(this.testParams);
        var returnedUser      = this.socketsMap.sessionToUserMap.get(this.session);
        console.log("returnedUser:", returnedUser);
        test.assertEqual(returnedUser, this.user,
            "Assert session has been associated with the correct user");
    }
};
annotate(addSessionToUserTest).with(
    test().name("SocketsMap #addSessionToUserTest Test")
);

var findSocketsBySessionTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        var _this = this;
        this.socketsMap = new SocketsMap().initialize();
        this.socket         = {id: "socketIdX"};
        this.session        = {id: "sessionIdX"};
        this.user           = {id: "userIdX"};
        this.testParams     = {
            session:    _this.session,
            socket:     _this.socket,
            user:       _this.user
        };
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){

        this.socketsMap.sessionToSocketsMap.put(this.session, this.socket);
        var returnedSocket      = this.socketsMap.findSocketsBySession(this.session);
        console.log("returnedSocket:", returnedSocket);
        test.assertEqual(returnedSocket, this.socket,
            "socket");
    }
};
annotate(findSocketsBySessionTest).with(
    test().name("SocketsMap #findSocketsBySessionTest Test")
);

var findSocketsByUserTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        var _this = this;
        this.socketsMap = new SocketsMap().initialize();
        this.socket         = {id: "socketIdX"};
        this.session        = {id: "sessionIdX"};
        this.user           = {id: "userIdX"};
        this.testParams     = {
            session:    _this.session,
            socket:     _this.socket,
            user:       _this.user
        };
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){
        this.socketsMap.userToSessionsMap.put(this.user, [this.session]);
        this.socketsMap.sessionToSocketsMap.put(this.session, [this.socket]);
        this.socketsMap.sessionToUserMap.put(this.session, this.user);

        var returnedSocket      = this.socketsMap.findSocketsByUser(this.user)[0];
        console.log("returnedSocket:", returnedSocket);
        test.assertEqual(returnedSocket, this.socket,
            "Assert that the returnedSocket is equal to {id: 'socketIdX'}");
    }
};
annotate(findSocketsByUserTest).with(
    test().name("SocketsMap #findSocketsByUser Test")
);

var findUserBySessionTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        var _this = this;
        this.socketsMap = new SocketsMap().initialize();
        this.socket         = {id: "socketIdX"};
        this.session        = {id: "sessionIdX"};
        this.user           = {id: "userIdX"};
        this.testParams     = {
            session:  _this.session,
            socket:     _this.socket,
            user:     _this.user
        };
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){

        this.socketsMap.sessionToUserMap.put(this.session, this.user);
        var returnedUser      = this.socketsMap.findUserBySession(this.session);
        console.log("returnedUser:", returnedUser);
        test.assertEqual(returnedUser, this.user,
            "Assert returnedUser is 'userIdX'");
    }
};
annotate(findUserBySessionTest).with(
    test().name("SocketsMap #findUserBySession Test")
);

var findSessionsByUserTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        var _this = this;
        this.socketsMap = new SocketsMap().initialize();
        this.socket         = {id: "socketIdX"};
        this.session        = {id: "sessionIdX"};
        this.user           = {id: "userIdX"};
        this.testParams     = {
            session:  _this.session,
            socket:     _this.socket,
            user:     _this.user
        };
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){

        this.socketsMap.userToSessionsMap.put(this.user, [this.session]);
        var returnedSessions      = this.socketsMap.findSessionsByUser(this.user);
        test.assertEqual(returnedSessions[0], this.session,
            "Assert the correct session(s) are returned");
    }
};
annotate(findSessionsByUserTest).with(
    test().name("SocketsMap #findSessionsByUser Test")
);

var associateSocketWithSessionTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        var _this = this;
        this.socketsMap = new SocketsMap().initialize();
        this.socket         = {id: "socketIdX"};
        this.session        = {id: "sessionIdX"};
        this.user           = {id: "userIdX"};
        this.testParams     = {
            session:    _this.session,
            socket:     _this.socket,
            user:       _this.user
        };
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){

        this.socketsMap.associateSocketWithSession(this.testParams);
        var returnedSockets      = this.socketsMap.findSocketsBySession(this.session);
        console.log("returnedSockets:", returnedSockets);
        test.assertEqual(returnedSockets[0], this.socket,
            "Assert socket has been associated with the session");
    }
};
annotate(associateSocketWithSessionTest).with(
    test().name("SocketsMap #associateSocketWithSessionTest Test")
);

var associateUserWithSessionTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        var _this = this;
        this.socketsMap = new SocketsMap().initialize();
        this.socket         = {id: "socketIdX"};
        this.session        = {id: "sessionIdX"};
        this.user           = {id: "userIdX"};
        this.testParams     = {
            session:    _this.session,
            socket:     _this.socket,
            user:       _this.user
        };
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){

        this.socketsMap.associateUserWithSession(this.testParams);

        var returnedUser            = this.socketsMap.findUserBySession(this.session);
        var returnedSessions        = this.socketsMap.findSessionsByUser(this.user);

        test.assertEqual(returnedSessions[0], this.session,
            "Assert the correct session has been associated with the user");
        test.assertEqual(returnedUser, this.user,
            "Assert the correct user has been associated with the session");
    }
};
annotate(associateUserWithSessionTest).with(
    test().name("SocketsMap #associateUserWithSessionTest Test")
);

var associateUserSessionAndSocketTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        var _this = this;
        this.socketsMap = new SocketsMap().initialize();
        this.socket         = {id: "socketIdX"};
        this.session        = {id: "sessionIdX"};
        this.user           = {id: "userIdX"};
        this.testParams     = {
            session:    _this.session,
            socket:     _this.socket,
            user:       _this.user
        };
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(test){

        this.socketsMap.associateUserSessionAndSocket(this.testParams);

        var returnedUser            = this.socketsMap.findUserBySession(this.session);
        var returnedSessions        = this.socketsMap.findSessionsByUser(this.user);
        var returnedSockets         = this.socketsMap.findSocketsByUser(this.user);
        var returnedSocketsTwo      = this.socketsMap.findSocketsBySession(this.session);

        test.assertEqual(returnedSessions[0], this.session,
            "Assert the correct session has been associated with the user");
        test.assertEqual(returnedUser, this.user,
            "Assert the correct user has been associated with the session");
        test.assertEqual(returnedSockets[0], this.socket,
            "Assert the correct socket has been associated with the user");
        test.assertEqual(returnedSocketsTwo[0], this.socket,
            "Assert the correct socket has been associated with the session");
        
        //TODO: Test for multiple sessions and sockets
    }
};
annotate(associateUserSessionAndSocketTest).with(
    test().name("SocketsMap #associateUserSessionAndSocketTest Test")
);
