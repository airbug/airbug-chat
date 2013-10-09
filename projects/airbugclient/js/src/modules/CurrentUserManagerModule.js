//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('CurrentUserManagerModule')

//@Require('Class')
//@Require('TypeUtil')
//@Require('airbug.ManagerModule')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var TypeUtil            = bugpack.require('TypeUtil');
var ManagerModule       = bugpack.require('airbug.ManagerModule');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CurrentUserManagerModule = Class.extend(ManagerModule, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(airbugApi, meldStore, userManagerModule) {

        this._super(airbugApi, meldStore);


        //-------------------------------------------------------------------------------
        // Declare Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.currentUserId      = null;

        /**
         * @private
         * @type {airbug.UserManagerModule}
         */
        this.userManagerModule  = userManagerModule;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {meldbug.MeldDocument}
     */
    getCurrentUser: function() {
        if (this.currentUserId) {
            return this.get(this.currentUserId);
        } else {
            return null;
        }
    },

    /**
     * @return {string}
     */
    getCurrentUserId: function() {
        return this.currentUserId;
    },

    /**
     * @param {{*}} user
     * @return {boolean}
     */
    userIsAnonymous: function(user){
        if(user.email && !user.anonymous){
            return true;
        } else {
            return false;
        }
    },

    /**
     * @param {?{*}=} userMeldDocument
     * @return {boolean}
     */
    userIsLoggedIn: function(userMeldDocument) {
        var currentUser = undefined;
        if (!userMeldDocument) {
            currentUser = this.getCurrentUser();
        } else {
            currentUser = userMeldDocument;
        }
        if (currentUser) {
            return this.userIsNotAnonymous(currentUser);
        } else {
            return false;
        }
    },

    /**
     * @param {{*}} user
     * @return {boolean}
     */
    userIsNotAnonymous: function(user){
        return !this.userIsAnonymous(user);
    },

    /**
     * @param {?{*}=} userObject
     * @return {boolean}
     */
    userIsNotLoggedIn: function(userObject){
        return !this.userIsLoggedIn(userObject);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable, meldbug.MeldDocument, boolean)} callback
     */
    retrieveCurrentUser: function(callback) {
        //TODO refactor this so that currentUserManagerModule checks for socket RequestFailedException
        //NOTE: can the cached currentUserId be incorrect??
        var _this       = this;
        var currentUser = this.getCurrentUser();
        if (currentUser) {
            callback(null, currentUser, this.userIsLoggedIn(currentUser));
        } else {
            this.request("retrieve", "CurrentUser", {}, function(throwable, data) {
                if (!throwable) {
                    var currentUserId   = data.objectId;
                    _this.retrieve("User", currentUserId, function(throwable, currentUserMeldDocument) {
                        callback(throwable, currentUserMeldDocument, _this.userIsLoggedIn(currentUserMeldDocument));
                    });
                } else {
                    callback(throwable);
                }
            });
        }
    },

    /**
     * @param {function(Throwable)} callback
     */
     //TODO SUNG Clean this up and rename
    retrieveCurrentUserWithAjax: function(callback){
        var _this = this;
        $.ajax({
            url: "/app/retrieveCurrentUser",
            type: "GET",
            dataType: "json",
            data: {},
            success: function(data, textStatus, req){
                console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                var error       = data.error;
                callback(error);
            },
            error: function(req, textStatus, errorThrown){
                console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                callback(errorThrown);
            }
        });
    },

    /**
     * @param {{email: string}} formData
     * @param {function(Throwable, {*})} callback
     */
    loginUser: function(formData, callback){
        var _this                   = this;
        var currentUserMeldDocument = undefined;
        this.request("login", "User", {formData: formData}, function(throwable, data){
            if (!throwable) {
                var currentUserId   = data.objectId;
                $series([
                    $task(function(flow){
                        //NOTE: TODO: SUNG Regenerate Cookie here with ajax
                        _this.retrieveCurrentUserWithAjax(function(error){
                            flow.complete(error);
                        });
                    }),
                    $task(function(flow){
                        _this.retrieve("User", currentUserId, function(throwable, returnedCurrentUserMeldDocument) {
                            if(!throwable) currentUserMeldDocument = returnedCurrentUserMeldDocument;
                            flow.complete(throwable);
                        });
                    })
                ]).execute(function(throwable){
                    callback(throwable, currentUserMeldDocument, _this.userIsLoggedIn(currentUserMeldDocument));
                });
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {function(Throwable)} callback
     */
    logout: function(callback) {
        //TODO
        // Keep this as ajax for now
        var _this = this;
        $series([
            $task(function(flow){
                $.ajax({
                    url: "/app/logout",
                    type: "POST",
                    dataType: "json",
                    data: {},
                    success: function(data, textStatus, req){
                        console.log("success. data:", data, "textStatus:", textStatus, "req:", req);
                        var error = data.error;
                        flow.complete(error);
                    },
                    error: function(req, textStatus, errorThrown){
                        console.log("error. errorThrown:", errorThrown, "textStatus:", textStatus, "req:", req);
                        flow.error(errorThrown);
                    }
                });
            })
        ]).execute(function(throwable){
            if (throwable) {
                throwable = throwable.toString();
            }
            callback(throwable);
        });
    },

    /**
     * @param {{
            email: string,
            firstName: string,
            lastName: string}
        } formData
     * @param {function(Throwable, {*})} callback
     */
    registerUser: function(formData, callback){
        var _this                   = this;
        var currentUserMeldDocument = undefined;
        this.request("register", "User", {formData: formData}, function(throwable, data){
            if (!throwable) {
                var currentUserId   = data.objectId;
                $series([
                    $task(function(flow){
                        //NOTE: TODO: SUNG Regenerate Cookie here with ajax
                        _this.retrieveCurrentUserWithAjax(function(error){
                            flow.complete(error);
                        });
                    }),
                    $task(function(flow){
                        _this.retrieve("User", currentUserId, function(throwable, returnedCurrentUserMeldDocument) {
                            if(!throwable) currentUserMeldDocument = returnedCurrentUserMeldDocument;
                            flow.complete(throwable);
                        });
                    })
                ]).execute(function(throwable){
                    callback(throwable, currentUserMeldDocument, _this.userIsLoggedIn(currentUserMeldDocument));
                });
            } else {
                callback(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.CurrentUserManagerModule", CurrentUserManagerModule);
