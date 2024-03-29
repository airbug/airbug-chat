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

//@Export('airbug.AirbugClientConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('airbug.AirbugStaticConfig')
//@Require('bugcall.Call')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.DocumentUtil')
//@Require('carapace.MemoryCache')
//@Require('carapace.WindowUtil')
//@Require('socketio.BrowserSocketIoFactory')
//@Require('socketio.SocketIoClient')
//@Require('socketio.SocketIoConfig')


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
    var Call                    = bugpack.require('bugcall.Call');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var ConfigurationTag        = bugpack.require('bugioc.ConfigurationTag');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var DocumentUtil            = bugpack.require('carapace.DocumentUtil');
    var MemoryCache             = bugpack.require('carapace.MemoryCache');
    var WindowUtil              = bugpack.require('carapace.WindowUtil');
    var BrowserSocketIoFactory  = bugpack.require('socketio.BrowserSocketIoFactory');
    var SocketIoClient          = bugpack.require('socketio.SocketIoClient');
    var SocketIoConfig          = bugpack.require('socketio.SocketIoConfig');


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
    var AirbugClientConfiguration = Class.extend(Obj, {

        _name: "airbug.AirbugClientConfiguration",


        //-------------------------------------------------------------------------------
        // Configuration Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {AirbugStaticConfig}
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
            return new Call(logger, "client");
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
         * @return {document|*|HTMLDocument}
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
         * @return {MetaContext}
         */
        metaContext: function() {
            return BugMeta.context();
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

    bugmeta.tag(AirbugClientConfiguration).with(
        configuration("airbugClientConfiguration").modules([
            module("airbugStaticConfig"),
            module("browserSocketIoFactory"),
            module("call")
                .args([
                    arg().ref("logger")
                ]),
            module("console"),
            module("controllerTagScan")
                .args([
                    arg().ref("carapaceApplication")
                ]),
            module("dialogueMemoryCache"),
            module("document"),
            module("documentUtil")
                .args([
                    arg().ref("document")
                ]),
            module("metaContext"),
            module("socketIoClient")
                .args([
                    arg().ref("browserSocketIoFactory"),
                    arg().ref("socketIoConfig")
                ]),
            module("socketIoConfig"),
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

    bugpack.export("airbug.AirbugClientConfiguration", AirbugClientConfiguration);
});
