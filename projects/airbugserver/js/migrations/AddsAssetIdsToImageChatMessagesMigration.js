//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.AddsAssetIdsToImageChatMessagesMigration')
//@Autoload

//@Require('Class')
//@Require('Flows')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('bugmigrate.Migration')
//@Require('bugmigrate.MigrationTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack
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
    var property                        = PropertyTag.property;
    var $forEachParallel                = Flows.$forEachParallel;
    var $forEachSeries                  = Flows.$forEachSeries;
    var $series                         = Flows.$series;
    var $task                           = Flows.$task;


    //-------------------------------------------------------------------------------
    // Migration
    //-------------------------------------------------------------------------------

    // Migration steps
    // 1) Find all chat messages of the type image
    // 2) Find the asset ids of those images using the url and add the asset id into the chat messages.


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    var AddsAssetIdsToImageChatMessagesMigration = Class.extend(Migration, {

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

        up: function(callback) {
            this.logger.info("Running ", this.getName(), "...");
            var _this           = this;
            var chatMessages    = null;

            var AssetModel          = this.mongoDataStore.getMongooseModelForName("Asset");
            var ChatMessageModel    = this.mongoDataStore.getMongooseModelForName("ChatMessage");

            $series([
                $task(function(flow){
                    ChatMessageModel.find({type: "image"}).exec(function(error, chatMessageDocs){
                        chatMessages = chatMessageDocs;
                        _this.logger.info("chatMessageDocs length:", chatMessageDocs.length);
                        flow.complete(error);
                    });
                }),
                $task(function(flow){
                    $forEachSeries(chatMessages, function(flow, chatMessage){
                        if(chatMessage.body.parts[0].url){
                            AssetModel.findOne({url: chatMessage.body.parts[0].url}, function(error, asset){
                                if(!error) {
                                    if(!asset){
                                        flow.error(new Error("asset what with url: " +  chatMessage.body.parts[0].url + " was not found"));
                                    } else {
                                        chatMessage.body.parts[0].assetId = asset.id;
                                        ChatMessageModel.findByIdAndUpdate(chatMessage.id, {body: chatMessage.body}, function(error, savedChatMessage){
                                            if(!error) {
                                                if(savedChatMessage) {
                                                    flow.complete();
                                                } else {
                                                    flow.error(new Error("chatMessage what not found"));
                                                }
                                            } else {
                                                flow.error(error);
                                            }
                                        });
                                    }
                                } else {
                                    flow.error(error);
                                }
                            });
                        } else {
                            _this.logger.info("chat message of id", chatMessage.id, "did not have a url");
                            flow.complete();
                        }

                    }).execute(function(error){
                        flow.complete(error);
                    });
                })
            ]).execute(function(error){
                if (error) {
                    _this.logger.info("Error:", error);
                    _this.logger.info("Up migration", _this.name, "failed.");
                    callback(error);
                } else {
                    _this.logger.info("Up migration", _this.name, "completed.");
                    _this.logger.info("Currently at migration version", _this.version, "for", _this.app, _this.appVersion);
                    callback();
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(AddsAssetIdsToImageChatMessagesMigration).with(
        migration()
            .appName("airbug")
            .appVersion("0.0.17")
            .name("AddsAssetIdsToImageChatMessagesMigration")
            .version("0.0.4"),
        autowired()
            .properties([
                property("logger").ref("logger"),
                property("mongoDataStore").ref("mongoDataStore")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('airbugserver.AddsAssetIdsToImageChatMessagesMigration', AddsAssetIdsToImageChatMessagesMigration);
});
