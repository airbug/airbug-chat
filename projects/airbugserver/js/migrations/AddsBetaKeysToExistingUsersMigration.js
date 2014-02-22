//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AddsBetaKeysToExistingUsersMigration')

//@Require('Class')
//@Require('airbugserver.BetaKeyModel')
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
var UserModel               = bugpack.require("airbugserver.UserModel");
var Migration               = bugpack.require('airbugserver.Migration');
var BugFlow                 = bugpack.require('bugflow.BugFlow');

var $forEachParallel        = BugFlow.$forEachParallel;
var $forInParallel          = BugFlow.$forInParallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


var AddsBetaKeysToExistingUsersMigration = Class.extend(Migration, {
    name: "AddsBetaKeysToExistingUsersMigration",
    app: "airbug",
    appVersion: "0.0.17",
    version: "0.0.2",
    up: function(callback) {
        var baseBetaKeyCounters = {};
        var currentUsersAndNewBetaKeys = [
            [{"email": "matthew.mcneely@gmail.com", "firstName" : "Matthew", "lastName" : "McNeely" },      {betaKey: "GO_AIRBUG#BN14"}],
            [{"email": "meganr3@gmail.com", "firstName" : "Megan", "lastName" : "Neisler" },                {betaKey: "GO_AIRBUG#BN14"}],
            [{"email": "dane@parklet.co", "firstName" : "Dane", "lastName" : "Hurtubise" },                 {betaKey: "GO_AIRBUG#BN14"}],
            [{"email": "extar2@gmail.com", "firstName" : "Lance", "lastName" : "Belluomini" },              {betaKey: "GO_AIRBUG#BN14"}],
            [{"email": "johnleejacobs+airbug@gmail.com", "firstName" : "john", "lastName" : "jacobs" },     {betaKey: "GO_AIRBUG#BN14"}],
            [{"email": "landoncarterva@gmail.com", "firstName" : "Landon", "lastName" : "Carter" } ,        {betaKey: "GO_AIRBUG#TP14"}],
            [{"email": "aspec00@hotmail.com", "firstName" : "Adam", "lastName" : "Spector" } ,              {betaKey: "GO_AIRBUG#TP14"}],
            [{"email": "scotty@appmonsta.com", "firstName" : "Scotty", "lastName" : "Allen" } ,             {betaKey: "GO_AIRBUG#TP14"}],
            [{"email": "keith@nearlyfree.org", "firstName" : "Keith", "lastName" : "Grennan" } ,            {betaKey: "GO_AIRBUG#TP14"}],
            [{"email": "matt@lebel.io", "firstName" : "matt", "lastName" : "lebel" } ,                      {betaKey: "GO_AIRBUG#SC14"}],
            [{"email": "walter.lee@gmail.com", "firstName" : "Walter", "lastName" : "Lee" } ,               {betaKey: "GO_AIRBUG#TP14"}],
            [{"email": "salar@turnclick.com", "firstName" : "Salar", "lastName" : "Salahshoor" } ,          {betaKey: "GO_AIRBUG#TP14"}],
            [{"email": "iam@codingbean.com", "firstName" : "Noah", "lastName" : "Buscher" } ,               {betaKey: "GO_AIRBUG#TP14"}],
            [{"email": "phopkins@gmail.com", "firstName" : "Pete", "lastName" : "Hopkins" } ,               {betaKey: "GO_AIRBUG#TP14"}],
            [{"email": "andrew@parklet.co", "firstName" : "Andrew", "lastName" : "Hubbs" } ,                {betaKey: "GO_AIRBUG#BN14"}],
            [{"email": "kristin.junk@hengedocks.com", "firstName" : "Kristin", "lastName" : "Junk" } ,      {betaKey: "GO_AIRBUG#BN14"}],
            [{"email": "twelsh.proxy@gmail.com", "firstName" : "Tanner", "lastName" : "Welsh" },            {betaKey: "AIRBUG_AND_DBC_FOR_THE_WIN+NYC"}],
            [{"email": "bryan@archetris.com", "firstName" : "Bryan", "lastName" : "Almquist" } ,            {betaKey: "GO_AIRBUG#TP14"}]
        ];
        $series([
            $forEachParallel(currentUsersAndNewBetaKeys, function(flow, currentUserAndNewBetaKey){
                var betaKey = currentUserAndNewBetaKey[1].betaKey;
                var baseKey = betaKey.split("+")[0];
                if(baseBetaKeyCounters[baseKey]){
                    baseBetaKeyCounters[baseKey] = baseBetaKeyCounters[baseKey] + 1;
                } else {
                    baseBetaKeyCounters[baseKey] = 1;
                }
                UserModel.findOneAndUpdate(currentUserAndNewBetaKey[0], currentUserAndNewBetaKey[1], function(error, returnedUserDoc){
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                UserModel.count({anonymous: null, betaKey: null}, function(error, count){
                    baseBetaKeyCounters["GO_TEAM_AIRBUG!"] = count;
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                UserModel.update({anonymous: null, betaKey: null}, {betaKey: "GO_TEAM_AIRBUG!"}, {multi: true}, function(error, numberAffected, raw){
                    flow.complete(error);
                });
            }),
            $forInParallel(baseBetaKeyCounters, function(flow, baseKey, count){
                BetaKeyModel.update({betaKey: baseKey}, {$inc: {count: count}}, function(error, numberAffected, raw){
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

bugpack.export('airbugserver.AddsBetaKeysToExistingUsersMigration', AddsBetaKeysToExistingUsersMigration);
