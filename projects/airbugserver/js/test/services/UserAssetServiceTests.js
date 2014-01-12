//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Exception')
//@Require('airbugserver.UserAsset')
//@Require('airbugserver.UserAssetService')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('loggerbug.Logger')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var Session             = bugpack.require('airbugserver.Session');
var UserAsset           = bugpack.require('airbugserver.UserAsset');
var UserAssetService    = bugpack.require('airbugserver.UserAssetService');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');
var Logger              = bugpack.require('loggerbug.Logger');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


// Setup Methods
//-------------------------------------------------------------------------------

var setupUserAssetService = function(setupObject) {
    var dummyUserAssetManager = {
        createUserAsset: function(userAsset, callback) {
            callback(userAsset);
        },
        deleteUserAsset: function(userAsset, callback) {
            callback();
        },
        generateUserAsset: function(userAssetObject) {
            return new UserAsset(userAssetObject);
        },
        retrieveUserAsset: function(userAssetId, callback) {
            var userAsset = new UserAsset({
                id: userAssetId
            });
            callback(throwable, userAsset);
        },
        updateUserAsset: function(userAsset, callback) {
            callback(throwable, userAsset);
        }
    };
    var dummyUserAssetPusher = {

    };
    setupObject.logger                          = new Logger();
    setupObject.testUserAssetService            = new UserAssetService(dummyUserAssetManager,
        dummyUserAssetPusher);
    setupObject.testUserAssetService.logger     = setupObject.logger;
};

var userAssetServiceCreateUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // TODO - dkk - implement
        test.complete();
    }
};


var userAssetServiceDeleteUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // TODO - dkk - implement
        test.complete();
    }
};


var userAssetServiceUploadUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // TODO - dkk - implement
        test.complete();
    }
};

var userAssetServiceRenameUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // TODO - dkk - implement
        test.complete();
    }
};


var userAssetServiceRetrieveUserAssetTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // TODO - dkk - implement
        test.complete();
    }
};


var userAssetServiceRetrieveUserAssetsTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // TODO - dkk - implement
        test.complete();
    }
};

var userAssetServiceRetrieveUserAssetsByUserIdTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        setupUserAssetService(this);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        // TODO - dkk - implement
        test.complete(throwable);
    }
};

bugmeta.annotate(userAssetServiceCreateUserAssetTest).with(
    test().name("UserAssetService - Create UserAsset Test")
);

bugmeta.annotate(userAssetServiceDeleteUserAssetTest).with(
    test().name("UserAssetService - Delete UserAsset Test")
);

bugmeta.annotate(userAssetServiceRenameUserAssetTest).with(
    test().name("UserAssetService - Rename UserAsset Test")
);

bugmeta.annotate(userAssetServiceRetrieveUserAssetTest).with(
    test().name("UserAssetService - Retrieve UserAsset Test")
);

bugmeta.annotate(userAssetServiceRetrieveUserAssetsTest).with(
    test().name("UserAssetService - Retrieve UserAssets Test")
);

bugmeta.annotate(userAssetServiceRetrieveUserAssetsByUserIdTest).with(
    test().name("UserAssetService - Retrieve UserAssets By User Id Test")
);


