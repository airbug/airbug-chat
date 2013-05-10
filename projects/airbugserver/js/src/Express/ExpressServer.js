//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('ExpressServer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var http        = require('http');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Build App
//-------------------------------------------------------------------------------

var ExpressServer = Class.extend(Obj, {

    _constructor: function(){

        this.super();

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
        return http.createServer(app).listen(app.get('port'), function(){
            console.log("Express server listening on port " + app.get('port'));
        });

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


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.ExpressServer', ExpressServer);
