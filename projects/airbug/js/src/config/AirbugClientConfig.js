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

//@Export('airbug.AirbugClientConfig')

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
    var AirbugClientConfig = Class.extend(Config, {

        _name: "airbug.AirbugClientConfig",


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getDebug: function() {
            return this.getProperty("debug");
        },

        /**
         * @param {boolean} debug
         */
        setDebug: function(debug) {
            this.setProperty("debug", debug);
        },

        /**
         * @return {boolean}
         */
        getEnableTracking: function() {
            return this.getProperty("enableTracking");
        },

        /**
         * @param {boolean} enableTracking
         */
        setEnableTracking: function(enableTracking) {
            this.setProperty("enableTracking", enableTracking);
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
         * @returns {*}
         */
        getGithubEmails: function() {
            return this.getProperty("github.emails");
        },

        /**
         * @param {array} emails
         */
        setGithubEmails: function(emails) {
            this.setProperty('github.emails', emails);
        },

        /**
         * @returns {string}
         */
        getGithubScope: function() {
            return this.getProperty("github.scope");
        },

        /**
         * @param {string} scope
         */
        setGithubScope: function(scope) {
            this.setProperty("github.scope", scope);
        },

        /**
         * @returns {string}
         */
        getGithubState: function() {
            return this.getProperty("github.state");
        },

        /**
         * @param {string} state
         */
        setGithubState: function(state) {
            this.setProperty("github.state", state);
        },

        /**
         * @return {string}
         */
        getGoogleAnalyticsId: function() {
            return this.getProperty("googleAnalyticsId");
        },

        /**
         * @param {string} googleAnalyticsId
         */
        setGoogleAnalyticsId: function(googleAnalyticsId) {
            this.setProperty("googleAnalyticsId", googleAnalyticsId);
        },

        /**
         * @return {boolean}
         */
        getJsConcat: function() {
            return this.getProperty("js.concat");
        },

        /**
         * @param {boolean} concat
         */
        setJsConcat: function(concat) {
            return this.setProperty("js.concat", concat);
        },

        /**
         * @return {boolean}
         */
        getJsMinify: function() {
            return this.getProperty("js.minify");
        },

        /**
         * @param {boolean} minify
         */
        setJsMinify: function(minify) {
            return this.setProperty("js.minify", minify);
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

    bugpack.export("airbug.AirbugClientConfig", AirbugClientConfig);
});
