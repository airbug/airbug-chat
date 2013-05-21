//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ExpressServer')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var http        = require('http');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Build App
//-------------------------------------------------------------------------------

var ExpressServer = Class.extend(Obj, {

    _constructor: function(expressApp){

        this._super();

        //-------------------------------------------------------------------------------
        // Variables
        //-------------------------------------------------------------------------------

        /*
         * @type {ExpressApp}
         **/
        this.expressApp = expressApp;

        /*
         * @type {}
         **/
        this.httpServer = null;

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /*
     **/
    start: function(callback) {

        var callback    = callback || function(){};
        var app         = this.expressApp.getApp();

        // Create Server
        //-------------------------------------------------------------------------------
        this.httpServer = http.createServer(app);

        this.httpServer.listen(app.get('port'), function(){
            console.log("Express server listening on port " + app.get('port'));
        });

        callback();
        return this;

    },


    //-------------------------------------------------------------------------------
    //  Getters and Setters
    //-------------------------------------------------------------------------------

    getHttpServer: function(){
        return this.httpServer;
    },

    getCookieParser: function(){
        return this.expressApp.getCookieParser;
    },
    getSessionStore: function(){
        return this.expressApp.getSessionStore;
    },
    getSessionKey: function(){
        return this.expressApp.getSessionKey;
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ExpressServer', ExpressServer);
