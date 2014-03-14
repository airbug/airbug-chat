//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AddsAssetIdsToImageChatMessagesMigration')

//@Require('Class')
//@Require('airbugserver.AssetModel')
//@Require('airbugserver.ChatMessageModel')
//@Require('airbugserver.Migration')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var mongoose                = require("mongoose");


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var AssetModel              = bugpack.require('airbugserver.AssetModel');
var ChatMessageModel        = bugpack.require('airbugserver.ChatMessageModel');
var Migration               = bugpack.require('airbugserver.Migration');
var BugFlow                 = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachParallel        = BugFlow.$forEachParallel;
var $forEachSeries          = BugFlow.$forEachSeries;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;
var $whileSeries            = BugFlow.$whileSeries;


//-------------------------------------------------------------------------------
// Migration
//-------------------------------------------------------------------------------

// Migration steps
// 1) Find all chat messages of the type image
// 2) Find the asset ids of those images using the url and add the asset id into the chat messages.

var AddsAssetIdsToImageChatMessagesMigration = Class.extend(Migration, {
    name: "AddsAssetIdsToImageChatMessagesMigration",
    app: "airbug",
    appVersion: "0.0.17",
    version: "0.0.4",
    up: function(callback) {
        console.log("Running ", this.getName(), "...");
        var _this           = this;
        var chatMessages    = null;

        $series([
            $task(function(flow){
                ChatMessageModel.find({type: "image"}).exec(function(error, chatMessageDocs){
                    chatMessages = chatMessageDocs;
                    console.log("chatMessageDocs length:", chatMessageDocs.length);
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
                        console.log("chat message of id", chatMessage.id, "did not have a url");
                        flow.complete();
                    }

                }).execute(function(error){
                        flow.complete(error);
                    });
            })
        ])
            .execute(function(error){
                if (error) {
                    console.log("Error:", error);
                    console.log("Up migration", _this.name, "failed.");
                    callback(error);
                } else {
                    console.log("Up migration", _this.name, "completed.");
                    console.log("Currently at migration version", _this.version, "for", _this.app, _this.appVersion);
                    callback();
                }
            });
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('airbugserver.AddsAssetIdsToImageChatMessagesMigration', AddsAssetIdsToImageChatMessagesMigration);
