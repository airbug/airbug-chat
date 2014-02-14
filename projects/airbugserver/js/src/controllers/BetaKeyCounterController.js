//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('BetaKeyCounterController')
//@Autoload

//@Require('Class')
//@Require('LiteralUtil')
//@Require('airbugserver.EntityController')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var LiteralUtil         = bugpack.require('LiteralUtil');
var EntityController    = bugpack.require('airbugserver.EntityController');
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {EntityController}
 */
var BetaKeyCounterController = Class.extend(EntityController, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {ExpressApp} expressApp
     * @param {BugCallRouter} bugCallRouter
     * @param {BetaKeyCounterService} betaKeyCounterService
     */
    _constructor: function(controllerManager, expressApp, bugCallRouter, betaKeyCounterService) {

        this._super(controllerManager, expressApp, bugCallRouter);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BetaKeyCounterService}
         */
        this.betaKeyCounterService      = betaKeyCounterService;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {BetaKeyCounterService}
     */
    getBetaKeyCounterService: function() {
        return this.betaKeyCounterService;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    configureController: function(callback) {
        var _this                   = this;
        var expressApp              = this.getExpressApp();
        var betaKeyCounterService   = this.getBetaKeyCounterService();

        // REST API
        //-------------------------------------------------------------------------------

        expressApp.get('/api/v1/betakeycounter/:id', function(request, response){
            var requestContext      = request.requestContext;
            var betaKey             = request.params.betaKey;
            betaKeyCounterService.retrieveBetaKeyCounter(requestContext, betaKey, function(throwable, entity){
                _this.processAjaxRetrieveResponse(response, throwable, entity);
            });
        });

        this.bugCallRouter.addAll({

            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable=)} callback
             */
            retrieveBetaKeyCounter:   function(request, responder, callback) {
                var data                = request.getData();
                var betaKey             = data.betaKey;
                var requestContext      = request.requestContext;

                if(betaKey === "ALL_THE_BUGS_SPECIAL_COMBO") {
                    betaKeyCounterService.retrieveAllBetaKeyCounters(requestContext, function(throwable, betaKeyCounterList) {
                        _this.processRetrieveListResponse(responder, throwable, betaKeyCounterList, callback);
                    });
                } else {
                    betaKeyCounterService.retrieveBetaKeyCounterByBetaKey(requestContext, betaKey, function(throwable, betaKeyCounter) {
                        _this.processRetrieveResponse(responder, throwable, betaKeyCounter, callback);
                    });
                }
            }
        });
        callback();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(BetaKeyCounterController).with(
    module("betaKeyCounterController")
        .args([
            arg().ref("controllerManager"),
            arg().ref("expressApp"),
            arg().ref("bugCallRouter"),
            arg().ref("betaKeyCounterService")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.BetaKeyCounterController', BetaKeyCounterController);
