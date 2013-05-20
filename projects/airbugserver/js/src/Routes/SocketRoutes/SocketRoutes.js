//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SocketRoutes')

//@Require('bugroutes.Routes')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();

var Routes          = bugpack.require('bugroutes.Routes');

var routes          = [];
var SocketRoutes    = new Routes(routes);

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SocketRoutes', SocketRoutes);
