//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('Session')

//@Require('airbugserver.SessionSchema')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var SessionSchema  = bugpack.require('airbugserver.SessionSchema');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Session = mongoose.model("Session", SessionSchema);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.Session', Session);
