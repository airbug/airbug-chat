//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugservertest.UserImageAssetStreamPusherStub')

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

var UserImageAssetStreamPusherStub = Class.extend(Obj, {
    pushUserImageAssetStreamToCall: function(userImageAssetStream, callUuid, callback) {
        callback(undefined);
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugservertest.UserImageAssetStreamPusherStub', UserImageAssetStreamPusherStub);
