//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('AirBugServer')

var express = require("express");
var fs = require("fs");


//-------------------------------------------------------------------------------
// Build App
//-------------------------------------------------------------------------------

var AirBugServer = {

    start: function() {

        var app = express();
        var port = 8000;
        var path = __dirname + "/../../../..";

        app.configure(function() {
            app.use(express.errorHandler({dumpExceptions:true,showStack:true}));
            app.use(express.logger('dev'));
            app.use(app.router);

            // TODO BRN: These are temporary static references until we can get the buildbug/client.json deployment model built
            app.use(express.static(path + '/projects/airbugclient/js/src'));
            app.use(express.static(path + '/projects/airbugclient/static'));
            app.use(express.static(path + '/temp/js'));
            app.use(express.static(path + '/temp/static'));
            app.use(express.static(path + '/../bugjs/projects/annotate/js/src'));
            app.use(express.static(path + '/../bugjs/projects/bugioc/js/src'));
            app.use(express.static(path + '/../bugjs/projects/bugjs/js/src'));
            app.use(express.static(path + '/../bugjs/projects/carapace/js/src'));
        });

        app.get('/', function(req, res) {
            fs.readFile(path + '/projects/airbugclient/template.stache', 'utf8', function(err, data){
                if (err) {
                    throw err;
                }
                res.send(data);
            });
        });

        app.listen(port);

        console.log("Express server running on port " + port);
    }
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

module.exports = AirBugServer;


