//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var express = require("express");


//-------------------------------------------------------------------------------
// Build App
//-------------------------------------------------------------------------------

var app = express();
var port = 8080;
var path = process.cwd();

app.use(express.logger('dev'));

app.use(express.static(path + '/projects/airbugclient/src'));
app.use(express.static(path + '/projects/airbugclient/static'));
app.use(express.static(path + '/projects/airbugclient/temp'));
app.use(express.static(path + '/projects/airbugserver/static'));

app.use(app.router);
app.listen(port);

console.log("Express server running on port " + port);

