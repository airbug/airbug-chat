//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AssetModel')
//@Autoload

//@Require('airbugserver.AssetSchema')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var AssetSchema  = bugpack.require('airbugserver.AssetSchema');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AssetModel = mongoose.model("Asset", AssetSchema);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AssetModel', AssetModel);