//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.UpdatesConversationIdForChatMessageCountersMigration')
//@Autoload

//@Require('Class')
//@Require('Flows')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('bugmigrate.Migration')
//@Require('bugmigrate.MigrationTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();
var mongoose                        = require("mongoose");


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Flows                         = bugpack.require('Flows');
var AutowiredTag             = bugpack.require('bugioc.AutowiredTag');
var PropertyTag              = bugpack.require('bugioc.PropertyTag');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var Migration                       = bugpack.require('bugmigrate.Migration');
var MigrationTag             = bugpack.require('bugmigrate.MigrationTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                       = AutowiredTag.autowired;
var bugmeta                         = BugMeta.context();
var migration                       = MigrationTag.migration;
var ObjectId                        = mongoose.Types.ObjectId;
var property                        = PropertyTag.property;
var $forEachParallel                = Flows.$forEachParallel;
var $series                         = Flows.$series;
var $task                           = Flows.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

// Migration steps
// 1) Load all ChatMessageCounters. Change conversationId from a string to an ObjectId

var UpdatesConversationIdForChatMessageCountersMigration = Class.extend(Migration, {

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
        this.logger.info("Running ", this.getName(), "...");
        var ChatMessageCounterModel = this.mongoDataStore.getMongooseModelForName("ChatMessageCounter");
        $series([
            $task(function(flow){
                ChatMessageCounterModel.find({}).lean(true).exec(function(error, results) {
                    $forEachParallel(results, function(flow, chatMessageCounter) {
                        ChatMessageCounterModel.findByIdAndUpdate(chatMessageCounter._id, {conversationId: new ObjectId(chatMessageCounter.conversationId.toString())}, function(error) {
                            flow.complete(error);
                        });
                    }).execute(function(error) {
                         flow.complete(error);
                    });
                });
            })
        ]).execute(callback);
    }
});



//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(UpdatesConversationIdForChatMessageCountersMigration).with(
    migration()
        .appName("airbug")
        .appVersion("0.0.18")
        .name("UpdatesConversationIdForChatMessageCountersMigration")
        .version("0.0.3"),
    autowired()
        .properties([
            property("logger").ref("logger"),
            property("mongoDataStore").ref("mongoDataStore")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.UpdatesConversationIdForChatMessageCountersMigration', UpdatesConversationIdForChatMessageCountersMigration);
