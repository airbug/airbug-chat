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

    _constructor: function(){

        this._super();

        //-------------------------------------------------------------------------------
        // Variables
        //-------------------------------------------------------------------------------

        /*
         * @type {ExpressApp}
         **/
        this.expressApp = null;

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /*
     * @return {http.Server}
     **/
    start: function() {

        // Create Server
        //-------------------------------------------------------------------------------
        var server = http.createServer(app);
        server.listen(app.get('port'), function(){
            console.log("Express server listening on port " + app.get('port'));
        });

        return server;

    },


    //-------------------------------------------------------------------------------
    //  Getters and Setters
    //-------------------------------------------------------------------------------

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
