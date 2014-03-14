//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AddsBetaKeysToExistingUsersMigration')
//@Autoload

//@Require('Class')
//@Require('bugflow.BugFlow')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugmigrate.Migration')
//@Require('bugmigrate.MigrationAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var Migration                       = bugpack.require('bugmigrate.Migration');
var MigrationAnnotation             = bugpack.require('bugmigrate.MigrationAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                       = AutowiredAnnotation.autowired;
var bugmeta                         = BugMeta.context();
var migration                       = MigrationAnnotation.migration;
var property                        = PropertyAnnotation.property;
var $forEachParallel                = BugFlow.$forEachParallel;
var $forEachSeries                  = BugFlow.$forEachSeries;
var $forInParallel                  = BugFlow.$forInParallel;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AddsBetaKeysToExistingUsersMigration = Class.extend(Migration, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} appName
     * @param {string} appVersion
     * @param {string} name
     * @param {string} version
     */
    _constructor: function(appName, appVersion, name, version) {

        this._super(appName, appVersion, name, version);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Logger}
         */
        this.logger                 = null;

        /**
         * @private
         * @type {MongoDataStore}
         */
        this.mongoDataStore         = null
    },


    //-------------------------------------------------------------------------------
    // Migration Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    up: function(callback) {
        var BetaKeyModel                = this.mongoDataStore.getMongooseModelForName("BetaKey");
        var UserModel                   = this.mongoDataStore.getMongooseModelForName("User");
        var baseBetaKeyCounters         = {};
        var currentUsersAndNewBetaKeys  = [
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
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AddsBetaKeysToExistingUsersMigration).with(
    migration()
        .appName("airbug")
        .appVersion("0.0.17")
        .name("AddsBetaKeysToExistingUsersMigration")
        .version("0.0.2"),
    autowired()
        .properties([
            property("logger").ref("logger"),
            property("mongoDataStore").ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AddsBetaKeysToExistingUsersMigration', AddsBetaKeysToExistingUsersMigration);
