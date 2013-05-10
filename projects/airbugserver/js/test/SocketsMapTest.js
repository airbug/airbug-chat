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

var Annotate =          bugpack.require('annotate.Annotate');
var TestAnnotation =    bugpack.require('bugunit-annotate.TestAnnotation');


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
        this.socketsMap = new SocketsMap()initialize();
        this.socketsMap.findSocketsBySessionIdTest
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------
    test: function(){
        this.socketsMap.associateSocketWithSessionTest();
        findSocketsBySessionIdTest
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
        this.socketsMap = new SocketsMap()initialize();
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
        this.socketsMap = new SocketsMap()initialize();
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
        this.socketsMap = new SocketsMap()initialize();
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
        this.socketsMap = new SocketsMap()initialize();
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

var updateLogEventManagersTest = {

    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function() {
        var _this = this;
        this.callCount = 0;
        this.logsManager = new LogsManager();
        this.logsManager.moveCompletedFolderToToPackageFolderAndRemoveLogEventManager = function(folderName, callback){
            callback();
        };
        this.logsManager.logEventManagers = {
            "completed-1": {
                getMoveCount: function(){
                    _this.callCount++;
                    return this.moveCount
                },
                moveCount: 0,
                onceOn: function(eventName, callback){
                    callback();
                }
            },
            "completed-2": {
                getMoveCount: function(){
                    _this.callCount++;
                    return this.moveCount
                },
                moveCount: 3,
                onceOn: function(eventName, callback){
                    callback();
                }
            }
        };
        this.logsManager.packagedFolderPath = "packaged";
    },


    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        console.log(this);
        this.logsManager.updateLogEventManagers(function(){});
        test.assertEqual(this.callCount, 2,
            "Assert that all of the logEventManagers have been called once.");
    }
};
annotate(updateLogEventManagersTest).with(
    test().name("LogsManager #updateLogEventManagers Test")
);
