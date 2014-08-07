/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbugserver.AirbugServerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbug.AirbugStaticConfig')
//@Require('airbugserver.AirbugServerConfig')
//@Require('airbugserver.GithubApi')
//@Require('airbugserver.SessionServiceConfig')
//@Require('bugaws.AwsConfig')
//@Require('bugaws.AwsUploader')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('express.ExpressApp')
//@Require('express.ExpressServer')
//@Require('socketio.SocketIoManager')
//@Require('socketio.SocketIoServer')
//@Require('socketio.SocketIoServerConfig')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var connect                 = require('connect');
    var cookie                  = require('cookie');
    var cookie_signature        = require('cookie-signature');
    var express                 = require('express');
    var github                  = require('github');
    var http                    = require('http');
    var https                   = require('https');
    var imagemagick             = require('imagemagick');
    var mongoose                = require('mongoose');
    var mu2express              = require('mu2express');
    var path                    = require('path');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Obj                     = bugpack.require('Obj');
    var AirbugStaticConfig      = bugpack.require('airbug.AirbugStaticConfig');
    var AirbugServerConfig      = bugpack.require('airbugserver.AirbugServerConfig');
    var GithubApi               = bugpack.require('airbugserver.GithubApi');
    var SessionServiceConfig    = bugpack.require('airbugserver.SessionServiceConfig');
    var AwsConfig               = bugpack.require('bugaws.AwsConfig');
    var AwsUploader             = bugpack.require('bugaws.AwsUploader');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var ConfigurationTag        = bugpack.require('bugioc.ConfigurationTag');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ExpressApp              = bugpack.require('express.ExpressApp');
    var ExpressServer           = bugpack.require('express.ExpressServer');
    var SocketIoManager         = bugpack.require('socketio.SocketIoManager');
    var SocketIoServer          = bugpack.require('socketio.SocketIoServer');
    var SocketIoServerConfig    = bugpack.require('socketio.SocketIoServerConfig');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var configuration           = ConfigurationTag.configuration;
    var module                  = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var AirbugServerConfiguration = Class.extend(Obj, {

        _name: "airbugserver.AirbugServerConfiguration",


        //-------------------------------------------------------------------------------
        // Config Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {AirbugStaticConfig}
         */
        airbugStaticConfig: function() {
            return new AirbugStaticConfig();
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
         * @return {console|Console}
         */
        console: function() {
            return console;
        },

        /**
         * @return {*}
         */
        cookie: function() {
            return cookie;
        },

        /**
         * @return {*}
         */
        cookieSignature: function() {
            return cookie_signature;
        },

        /**
         * @return {Express}
         */
        express: function() {
            return express;
        },

        /**
         * @param {Express} express
         * @return {ExpressApp}
         */
        expressApp: function(express) {
            return new ExpressApp(express);
        },

        /**
         * @param {http} http
         * @param {ExpressApp} expressApp
         * @return {ExpressServer}
         */
        expressServer: function(http, expressApp) {
            return new ExpressServer(http, expressApp);
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
         * @return {*}
         */
        http: function() {
            return http;
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
         * @return {MetaContext}
         */
        metaContext: function() {
            return BugMeta.context();
        },

        /**
         * @return {*}
         */
        mongoose: function() {
            return mongoose;
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

    bugmeta.tag(AirbugServerConfiguration).with(
        configuration("airbugServerConfiguration").modules([
            module("airbugServerConfig"),
            module("airbugStaticConfig"),
            module('awsUploader'),
            module("console"),
            module("cookie"),
            module("cookieSignature"),
            module("express"),
            module("expressApp")
                .args([
                    arg().ref("express")
                ]),
            module("expressServer")
                .args([
                    arg().ref("http"),
                    arg().ref("expressApp")
                ]),
            module("githubApi")
                .args([
                    arg().ref("https"),
                    arg().ref("github"),
                    arg().ref("airbugServerConfig")
                ]),
            module("http"),
            module("https"),
            module("imagemagick"),
            module("github"),
            module("metaContext"),
            module("mongoose"),
            module("sessionServiceConfig"),
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
            module("socketIoServerConfig")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbugserver.AirbugServerConfiguration", AirbugServerConfiguration);
});
