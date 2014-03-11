//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('BetaKeyModel')
//@Autoload

//@Require('airbugserver.BetaKeySchema')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var BetaKeySchema  = bugpack.require('airbugserver.BetaKeySchema');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BetaKeyModel = mongoose.model("BetaKey", BetaKeySchema);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BetaKeyModel', BetaKeyModel);