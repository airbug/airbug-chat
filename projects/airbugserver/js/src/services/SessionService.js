//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionService')

//@Require('Class')
//@Require('Obj')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var cookie      = require('cookie');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');
var IHand   = bugpack.require('handshaker.IHand');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(sessionManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SessionManager}
         */
        this.sessionManager = sessionManager;
    },


    //-------------------------------------------------------------------------------
    // IHand Implementation
    //-------------------------------------------------------------------------------

    shakeIt: function(handshakeData, callback) {

        //TEST
        console.log("SessionService shakeIt - handshakeData:", handshakeData);

        if (handshakeData.headers.cookie) {
            handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
            handshakeData.sessionId = handshakeData.cookie['express.sid'];
            this.sessionManager.findSessionBySid(handshakeData.sessionId, function(error, session) {

                //TEST
                console.log("sessionService shakeIt - found session:", session);

                if (error || !session) {
                    callback(error, false);
                } else {
                    // save the session handshakeData and accept the connection
                    handshakeData.session = session;
                    callback(null, true);
                }
            });
        } else {
            callback(new Error('No cookie transmitted.'), false);
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(SessionService, IHand);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SessionService', SessionService);