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

var associateSocketWithSessionTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        this.socketsMap = new SocketsMap().initialize();
        this.socketsMap.findSocketsBySessionIdTest
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(){
        var socket    = {id: "socketIdX"};
        var session     = "sessionX";
        this.socketsMap.associateSocketWithSessionTest(socket, session);
        var returnedSocket = this.socketMap.findSocketsBySessionIdTest(socket.id);
        
        test.assertEqual(socket, returnedSocket,
            "");
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
        this.socketsMap = new SocketsMap().initialize();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(){
        
    }
};
annotate(associateUserWithSessionTest).with(
    test().name("SocketsMap #associateUserWithSessionTest Test")
);

var findSocketsBySessionIdTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        this.socketsMap = new SocketsMap().initialize();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(){
        
    }
};
annotate(findSocketsBySessionIdTest).with(
    test().name("SocketsMap #findSocketsBySessionIdTest Test")
);

var findSocketsBySessionIdTest = {
    
    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        this.socketsMap = new SocketsMap().initialize();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(){
        
    }
};
annotate(findSocketsBySessionIdTest).with(
    test().name("SocketsMap #findSocketsBySessionIdTest Test")
);

var findSocketsByUserIdTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------
    setup: function(){
        this.socketsMap = new SocketsMap().initialize();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(){
        
    }
};
annotate(findSocketsByUserIdTest).with(
    test().name("SocketsMap #findSocketsByUserIdTest Test")
);
