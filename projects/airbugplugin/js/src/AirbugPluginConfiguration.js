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

//@Export('airbugplugin.AirbugPluginConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbug.AirbugStaticConfig')
//@Require('airbug.DocumentUtil')
//@Require('airbug.MemoryCache')
//@Require('airbug.WindowUtil')
//@Require('bugcall.Call')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('socketio.BrowserSocketIoFactory')
//@Require('socketio.SocketIoClient')
//@Require('socketio.SocketIoConfig')
//@Require('sonarbugclient.SonarbugClient')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Obj                     = bugpack.require('Obj');
    var AirbugStaticConfig      = bugpack.require('airbug.AirbugStaticConfig');
    var DocumentUtil            = bugpack.require('airbug.DocumentUtil');
    var MemoryCache             = bugpack.require('airbug.MemoryCache');
    var WindowUtil              = bugpack.require('airbug.WindowUtil');
    var Call                    = bugpack.require('bugcall.Call');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var ConfigurationTag        = bugpack.require('bugioc.ConfigurationTag');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var BrowserSocketIoFactory  = bugpack.require('socketio.BrowserSocketIoFactory');
    var SocketIoClient          = bugpack.require('socketio.SocketIoClient');
    var SocketIoConfig          = bugpack.require('socketio.SocketIoConfig');
    var SonarbugClient          = bugpack.require('sonarbugclient.SonarbugClient');


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
    var AirbugPluginConfiguration = Class.extend(Obj, {

        _name: "airbugplugin.AirbugPluginConfiguration",


        //-------------------------------------------------------------------------------
        // Configuration Methods
        //-------------------------------------------------------------------------------

        /**
         * @returns {AirbugStaticConfig}
         */
        airbugStaticConfig: function() {
            return new AirbugStaticConfig(_appConfig);
        },

        /**
         * @return {BrowserSocketIoFactory}
         */
        browserSocketIoFactory: function() {
            return new BrowserSocketIoFactory();
        },

        /**
         * @param {Logger} logger
         * @return {Call}
         */
        call: function(logger) {
            return new Call(logger, "plugin");
        },

        /**
         * @return {console|Console}
         */
        console: function() {
            return console;
        },

        /**
         * @return {MemoryCache}
         */
        dialogueMemoryCache: function() {
            return new MemoryCache();
        },

        /**
         * @returns {document|*|HTMLDocument}
         */
        document: function() {
            return document;
        },

        /**
         * @param {document|*|HTMLDocument} document
         * @return {DocumentUtil}
         */
        documentUtil: function(document) {
            return new DocumentUtil(document);
        },

        /**
         * @param {ISocketFactory} socketIoFactory
         * @param {SocketIoConfig} socketIoConfig
         * @return {SocketIoClient}
         */
        socketIoClient: function(socketIoFactory, socketIoConfig) {
            return new SocketIoClient(socketIoFactory, socketIoConfig);
        },

        /**
         * @return {SocketIoConfig}
         */
        socketIoConfig: function() {
            return new SocketIoConfig({});
        },

        /**
         * @return {SonarbugClient}
         */
        sonarbugClient: function() {
            return SonarbugClient.getInstance();
        },

        /**
         * @return {window|*|window.window}
         */
        window: function() {
            return window;
        },

        /**
         * @param {window|*|window.window} window
         * @return {WindowUtil}
         */
        windowUtil: function(window) {
            return new WindowUtil(window);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(AirbugPluginConfiguration).with(
        configuration("airbugPluginConfiguration").modules([
            module("airbugStaticConfig"),
            module("browserSocketIoFactory"),
            module("call")
                .args([
                    arg().ref("logger")
                ]),
            module("console"),
            module("dialogueMemoryCache"),
            module("document"),
            module("documentUtil")
                .args([
                    arg().ref("document")
                ]),
            module("socketIoClient")
                .args([
                    arg().ref("browserSocketIoFactory"),
                    arg().ref("socketIoConfig")
                ]),
            module("socketIoConfig"),
            module("sonarbugClient"),
            module("window"),
            module("windowUtil")
                .args([
                    arg().ref("window")
                ])
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbugplugin.AirbugPluginConfiguration", AirbugPluginConfiguration);
});
