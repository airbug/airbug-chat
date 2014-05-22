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

//@Export('airbug.AirbugServerConfig')

//@Require('Class')
//@Require('Config')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Config      = bugpack.require('Config');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Config}
     */
    var AirbugServerConfig = Class.extend(Config, {

        _name: "airbug.AirbugServerConfig",


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string} appVersion
         */
        getAppVersion: function() {
            return this.getProperty("appVersion");
        },

        /**
         * @param {string} appVersion
         */
        setAppVersion: function(appVersion) {
            this.setProperty("appVersion", appVersion);
        },

        /**
         * @returns {string}
         */
        getGithubClientId: function() {
            return this.getProperty("github.clientId");
        },

        /**
         * @param {string} clientId
         */
        setGithubClientId: function(clientId) {
            this.setProperty("github.clientId", clientId);
        },

        /**
         * @returns {string}
         */
        getGithubClientSecret: function() {
            return this.getProperty("github.clientSecret");
        },

        /**
         * @param {string} clientSecret
         */
        setGithubClientSecret: function(clientSecret) {
            this.setProperty("github.clientSecret", clientSecret);
        },

        /**
         * @return {string}
         */
        getStaticUrl: function() {
            return this.getProperty("staticUrl");
        },

        /**
         * @param {string} staticUrl
         */
        setStaticUrl: function(staticUrl) {
            this.setProperty("staticUrl", staticUrl);
        },

        /**
         * @return {string}
         */
        getStickyStaticUrl: function() {
            return this.getProperty("stickyStaticUrl");
        },

        /**
         * @param {string} stickyStaticUrl
         */
        setStickyStaticUrl: function(stickyStaticUrl) {
            this.setProperty("stickyStaticUrl", stickyStaticUrl);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.AirbugServerConfig", AirbugServerConfig);
});
