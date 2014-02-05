//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('AirbugServerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbug.AirbugClientConfig')
//@Require('airbugserver.GithubApi')
//@Require('airbugserver.RequestContextBuilder')
//@Require('airbugserver.SessionServiceConfig')
//@Require('aws.AwsConfig')
//@Require('aws.AwsUploader')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugroute:bugcall.BugCallRouter')
//@Require('configbug.Configbug')
//@Require('cookies.CookieSigner')
//@Require('express.ExpressApp')
//@Require('express.ExpressServer')
//@Require('handshaker.Handshaker')
//@Require('mongo.MongoDataStore')
//@Require('socketio:server.SocketIoManager')
//@Require('socketio:server.SocketIoServer')
//@Require('socketio:server.SocketIoServerConfig')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();
var connect                         = require('connect');
var express                         = require('express');
var github                          = require('github');
var https                           = require('https');
var imagemagick                     = require('imagemagick');
var mongoose                        = require('mongoose');
var mu2express                      = require('mu2express');
var path                            = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var AirbugClientConfig              = bugpack.require('airbug.AirbugClientConfig');
var AirbugServerConfig              = bugpack.require('airbug.AirbugServerConfig');
var GithubApi                       = bugpack.require('airbugserver.GithubApi');
var RequestContextBuilder           = bugpack.require('airbugserver.RequestContextBuilder');
var SessionServiceConfig            = bugpack.require('airbugserver.SessionServiceConfig');
var AwsConfig                       = bugpack.require('aws.AwsConfig');
var AwsUploader                     = bugpack.require('aws.AwsUploader');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var BugFs                           = bugpack.require('bugfs.BugFs');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation         = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration                  = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var BugCallRouter                   = bugpack.require('bugroute:bugcall.BugCallRouter');
var Configbug                       = bugpack.require('configbug.Configbug');
var CookieSigner                    = bugpack.require('cookies.CookieSigner');
var ExpressApp                      = bugpack.require('express.ExpressApp');
var ExpressServer                   = bugpack.require('express.ExpressServer');
var Handshaker                      = bugpack.require('handshaker.Handshaker');
var MongoDataStore                  = bugpack.require('mongo.MongoDataStore');
var SocketIoManager                 = bugpack.require('socketio:server.SocketIoManager');
var SocketIoServer                  = bugpack.require('socketio:server.SocketIoServer');
var SocketIoServerConfig            = bugpack.require('socketio:server.SocketIoServerConfig');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var configuration           = ConfigurationAnnotation.configuration;
var module                  = ModuleAnnotation.module;
var property                = PropertyAnnotation.property;
var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AirbugServerConfiguration = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Config Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {AirbugClientConfig}
     */
    airbugClientConfig: function() {
        return new AirbugClientConfig();
    },

    /**
     * @return {AirbugServerConfig}
     */
    airbugServerConfig: function() {
        return new AirbugServerConfig();
    },

    /**
     * @return {AwsUploader}
     */
    awsUploader: function() {
        var configPath = path.resolve(__dirname, '..') + '/resources/config/aws-config.json';
        // TODO - dkk - check to see if configPath exists
        // TODO - dkk - figure out a better way of configuring this
        return new AwsUploader(configPath);
    },

    /**
     * @return {BugCallRouter}
     */
    bugCallRouter: function() {
        return new BugCallRouter();
    },

    /**
     * @return {Configbug}
     */
    configbug: function() {
        return new Configbug(BugFs.resolvePaths([__dirname, '../resources/config']));
    },

    /**
     * @return {CookieSigner}
     */
    cookieSigner: function() {
        return new CookieSigner();
    },

    /**
     * @return {ExpressServer}
     */
    expressApp: function() {
        return new ExpressApp();
    },

    /**
     * @param {ExpressApp} expressApp
     * @return {ExpressServer}
     */
    expressServer: function(expressApp) {
        return new ExpressServer(expressApp);
    },

    /**
     * @return {*}
     */
    github: function() {
        return github;
    },

    /**
     * @param {https} https
     * @param {github} github
     * @param {AirbugServerConfig} airbugServerConfig
     * @return {GithubApi}
     */
    githubApi: function(https, github, airbugServerConfig) {
        return new GithubApi(https, github, airbugServerConfig);
    },

    /**
     * @return {Handshaker}
     */
    handshaker: function() {
        return new Handshaker([]);
    },

    /**
     * @return {*}
     */
    https: function() {
        return https;
    },

    /**
     * @return {*}
     */
    imagemagick: function() {
        return imagemagick;
    },

    /**
     * @return {Mongoose}
     */
    mongoose: function() {
        return mongoose;
    },

    /**
     * @param {Mongoose} mongoose
     * @return {MongoDataStore}
     */
    mongoDataStore: function(mongoose) {
        return new MongoDataStore(mongoose);
    },

    /**
     * @return {requestContextBuilder}
     */
    requestContextBuilder: function() {
        return new RequestContextBuilder();
    },

    /**
     * @return {SessionServiceConfig}
     */
    sessionServiceConfig: function() {
        return new SessionServiceConfig({});
    },

    /**
     * @param {SocketIoServer} socketIoServer
     * @return {SocketIoManager}
     */
    socketIoManager: function(socketIoServer) {
        return new SocketIoManager(socketIoServer, '/api/airbug');
    },

    /**
     * @param {SocketIoServerConfig} config
     * @param {ExpressServer} expressServer
     * @param {Handshaker} handshaker
     * @return {SocketIoServer}
     */
    socketIoServer: function(config, expressServer, handshaker) {
        return new SocketIoServer(config, expressServer, handshaker);
    },

    /**
     * @return {SocketIoServerConfig}
     */
    socketIoServerConfig: function() {
        return new SocketIoServerConfig({});
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(AirbugServerConfiguration).with(
    configuration("airbugServerConfiguration").modules([

        //-------------------------------------------------------------------------------
        // AirBugServer
        //-------------------------------------------------------------------------------

        module("https"),
        module("imagemagick"),
        module("github"),
        module("mongoose"),
        module("mongoDataStore")
            .args([
                arg().ref("mongoose")
            ]),
        module("requestContextBuilder"),


        //-------------------------------------------------------------------------------
        // Config
        //-------------------------------------------------------------------------------

        module("configbug"),
        module("airbugClientConfig"),
        module("airbugServerConfig"),
        module("sessionServiceConfig"),


        //-------------------------------------------------------------------------------
        // Express
        //-------------------------------------------------------------------------------

        module("expressApp"),
        module("expressServer")
            .args([
                arg().ref("expressApp")
            ]),



        //-------------------------------------------------------------------------------
        // BugJs
        //-------------------------------------------------------------------------------

        module('awsUploader'),



        //-------------------------------------------------------------------------------
        // Util
        //-------------------------------------------------------------------------------

        module("cookieSigner"),
        module("handshaker"),
        module("githubApi")
            .args([
                arg().ref("https"),
                arg().ref("github"),
                arg().ref("airbugServerConfig")
            ]),


        //-------------------------------------------------------------------------------
        // Sockets
        //-------------------------------------------------------------------------------

        module("socketIoManager")
            .args([
                arg().ref("socketIoServer")
            ]),
        module("socketIoServer").
            args([
                arg().ref("socketIoServerConfig"),
                arg().ref("expressServer"),
                arg().ref("handshaker")
            ]),
        module("socketIoServerConfig"),


        //-------------------------------------------------------------------------------
        // BugCall
        //-------------------------------------------------------------------------------

        module("bugCallRouter")

    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbugserver.AirbugServerConfiguration", AirbugServerConfiguration);
