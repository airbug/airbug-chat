//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SessionService')

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('handshaker.IHand')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var cookie  = require('cookie');


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');
var BugFlow = bugpack.require('bugflow.BugFlow');
var IHand   = bugpack.require('handshaker.IHand');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

$parallel   = BugFlow.$parallel;
$series     = BugFlow.$series;
$task       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SessionService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(cookieSigner, sessionManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CookieSigner}
         */
        this.cookieSigner   = cookieSigner;

        /**
         * @private
         * @type {MeldService}
         */
        this.meldService    = meldService;

        /**
         * @private
         * @type {SessionManager}
         */
        this.sessionManager = sessionManager;
    },


    //-------------------------------------------------------------------------------
    // IHand Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {
     *    headers: req.headers       // <Object> the headers of the request
     *  , time: (new Date) +''       // <String> date time of the connection
     *  , address: socket.address()  // <Object> remoteAddress and remotePort object
     *  , xdomain: !!headers.origin  // <Boolean> was it a cross domain request?
     *  , secure: socket.secure      // <Boolean> https connection
     *  , issued: +date              // <Number> EPOCH of when the handshake was created
     *  , url: request.url           // <String> the entrance path of the request
     *  , query: data.query          // <Object> the result of url.parse().query or a empty object
     * } handshakeData
     * @param {function(Error, boolean)} callback
     */
    shakeIt: function(handshakeData, callback) {
        if (handshakeData.headers.cookie) {
            handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
            handshakeData.sessionId = this.cookieSigner.unsign(handshakeData.cookie['airbug.sid']);

            this.sessionManager.findSessionBySid(handshakeData.sessionId, function(throwable, session) {
                if (error || !session) {
                    callback(throwable, false);
                } else {
                    handshakeData.session = session;
                    callback(null, true);
                }
            });
        } else {
            callback(new Error('No cookie transmitted.'), false);
        }
    },

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} sid
     * @param {function(Throwable)} callback
     */
    regenerateSession: function(sid, req, userId, callback){
        var _this = this;
        $parallel([
            $task(function(flow){
                req.session.regenerate(function(error){
                    //NOTE: req.session.regenerate replaces req.session with a new session
                    if(!error){
                        req.session.userId = userId;
                        req.session.save(function(error){
                            flow.complete(error);
                        });
                    } else {
                        flow.complete(error);
                    }
                });
            }),
            $task(function(flow){
                // delete old session from db
                _this.sessionManager.deleteSessionBySid(sid, function(error){
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },


});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(SessionService, IHand);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.SessionService', SessionService);
