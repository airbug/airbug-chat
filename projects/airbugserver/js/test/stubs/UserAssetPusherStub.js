//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugservertest.UserAssetPusherStub')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Stub
//-------------------------------------------------------------------------------

var UserAssetPusherStub = Class.extend(Obj, {
    meldCallWithUserAsset: function(callUuid, userAsset, callback) {
        callback(undefined);
    },
    meldCallWithUserAssets: function(callUuid, userAssets, callback) {
        callback(undefined);
    },
    pushUserAssetToCall: function(userAsset, callUuid, callback) {
        callback(undefined);
    },
    pushUserAssetsToCall: function(userAsset, callUuid, callback) {
        callback(undefined);
    },
    streamUserImageAsset: function(userImageAssetStream, userImageAsset, callback) {
        callback(undefined);
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugservertest.UserAssetPusherStub', UserAssetPusherStub);
