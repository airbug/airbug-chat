//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AddsSignupsForExistingUsersMigration')

//@Require('Class')
//@Require('airbugserver.BetaKeyModel')
//@Require('airbugserver.SignupModel')
//@Require('airbugserver.UserModel')
//@Require('airbugserver.Migration')
//@Require('bugflow.BugFlow')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require("mongoose");

//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BetaKeyModel            = bugpack.require('airbugserver.BetaKeyModel');
var SignupModel             = bugpack.require('airbugserver.SignupModel');
var UserModel               = bugpack.require("airbugserver.UserModel");
var Migration               = bugpack.require('airbugserver.Migration');
var BugFlow                 = bugpack.require('bugflow.BugFlow');

var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


var AddsSignupsForExistingUsersMigration = Class.extend(Migration, {
    name: "AddsSignupsForExistingUsersMigration",
    app: "airbug",
    appVersion: "0.0.17",
    version: "0.0.3",
    up: function(callback) {
        var users = null;
        var signups = [];
        $series([
            $task(function(flow){
                UserModel.find({anonymous: null}, function(error, returnedUserDocs){
                    users = returnedUserDocs;
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                users.forEach(function(user){
                    signups.push({
                        createdAt: user.createdAt,
                        baseBetaKey: user.betaKey.split("+")[0],
                        betaKey: user.betaKey,
                        airbugVersion: '<0.0.17',
                        version: "0.0.0"})
                });

                SignupModel.create(signups, function(error){
                    flow.complete(error);
                });
            })
        ])
        .execute(function(throwable){
            callback(throwable);
        });

    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AddsSignupsForExistingUsersMigration', AddsSignupsForExistingUsersMigration);
