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
//@Require('Url')
//@Require('airbug.AirbugStaticConfig')
//@Require('airbug.DocumentUtil')
//@Require('airbug.MemoryCache')
//@Require('airbug.WindowUtil')
//@Require('bugcall.Call')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugroute:bugcall.BugCallRouter')
//@Require('carapace.ControllerScan')
//@Require('socketio:client.SocketIoClient')
//@Require('socketio:client.SocketIoConfig')
//@Require('socketio:factorybrowser.BrowserSocketIoFactory')
//@Require('sonarbugclient.SonarbugClient')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Obj                         = bugpack.require('Obj');
    var Url                         = bugpack.require('Url');
    var AirbugStaticConfig          = bugpack.require('airbug.AirbugStaticConfig');
    var DocumentUtil                = bugpack.require('airbug.DocumentUtil');
    var MemoryCache                 = bugpack.require('airbug.MemoryCache');
    var WindowUtil                  = bugpack.require('airbug.WindowUtil');
    var Call                        = bugpack.require('bugcall.Call');
    var BugFlow                     = bugpack.require('bugflow.BugFlow');
    var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
    var ConfigurationAnnotation     = bugpack.require('bugioc.ConfigurationAnnotation');
    var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
    var PropertyAnnotation          = bugpack.require('bugioc.PropertyAnnotation');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var BugCallRouter               = bugpack.require('bugroute:bugcall.BugCallRouter');
    var ControllerScan              = bugpack.require('carapace.ControllerScan');
    var SocketIoClient              = bugpack.require('socketio:client.SocketIoClient');
    var SocketIoConfig              = bugpack.require('socketio:client.SocketIoConfig');
    var BrowserSocketIoFactory      = bugpack.require('socketio:factorybrowser.BrowserSocketIoFactory');
    var SonarbugClient              = bugpack.require('sonarbugclient.SonarbugClient');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $series                     = BugFlow.$series;
    var $task                       = BugFlow.$task;
    var arg                         = ArgAnnotation.arg;
    var bugmeta                     = BugMeta.context();
    var configuration               = ConfigurationAnnotation.configuration;
    var module                      = ModuleAnnotation.module;
    var property                    = PropertyAnnotation.property;


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
         * @param {BugCallClient} bugCallRequestEventDispatcher
         * @return {BugCallRouter}
         */
        bugCallRouter: function(bugCallRequestEventDispatcher) {
            return new BugCallRouter(bugCallRequestEventDispatcher);
        },

        /**
         * @param {Logger} logger
         * @return {Call}
         */
        call: function(logger) {
            return new Call(logger);
        },

        /**
         * @return {console|Console}
         */
        console: function() {
            return console;
        },

        /**
         * @param {CarapaceApplication} carapaceApplication
         * @return {ControllerScan}
         */
        controllerScan: function(carapaceApplication) {
            return new ControllerScan(carapaceApplication);
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

    bugmeta.annotate(AirbugClientConfiguration).with(
        configuration("airbugStaticConfiguration").modules([
            module("airbugStaticConfig"),
            module("browserSocketIoFactory"),
            module("bugCallRouter")
                .args([
                    arg().ref("bugCallClient")
                ]),
            module("call")
                .args([
                    arg().ref("logger")
                ]),
            module("console"),
            module("controllerScan")
                .args([
                    arg().ref("carapaceApplication")
                ]),
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

    bugpack.export("airbug.AirbugClientConfiguration", AirbugClientConfiguration);
});
