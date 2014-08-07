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

//@Export('airbug.GithubLoginButtonContainer')

//@Require('Class')
//@Require('Url')
//@Require('airbug.ButtonContainer')
//@Require('airbug.GithubDefines')
//@Require('airbug.GithubLoginButtonView')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Url                     = bugpack.require('Url');
    var ButtonContainer         = bugpack.require('airbug.ButtonContainer');
    var GithubDefines           = bugpack.require('airbug.GithubDefines');
    var GithubLoginButtonView   = bugpack.require('airbug.GithubLoginButtonView');
    var AutowiredTag            = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag             = bugpack.require('bugioc.PropertyTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var ButtonViewEvent         = bugpack.require('carapace.ButtonViewEvent');
    var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired               = AutowiredTag.autowired;
    var bugmeta                 = BugMeta.context();
    var property                = PropertyTag.property;
    var view                    = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ButtonContainer}
     */
    var GithubLoginButtonContainer = Class.extend(ButtonContainer, {

        _name: "airbug.GithubLoginButtonContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super("GithubLoginButton");


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {AirbugStaticConfig}
             */
            this.airbugStaticConfig = null;

            /**
             * @private
             * @type {Window}
             */
            this.window             = null;


            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {NavigationModule}
             */
            this.navigationModule   = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {ButtonView}
             */
            this.buttonView         = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceContainer Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainer: function() {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            this.buttonView =
                view(GithubLoginButtonView)
                    .build();


            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.setViewTop(this.buttonView);
        },

        /**
         * @protected
         */
        deinitializeContainer: function() {
            this._super();
            this.buttonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.hearGithubLoginButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            this._super();
            this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearGithubLoginButtonClickedEvent, this);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @return {string}
         */
        buildGithubRedirectUri: function() {
            var host        = this.window.location.host
            var hrefString  = this.window.location.href.toString();
            var redirectUrl = hrefString.split(host)[0] + host;
            redirectUrl += GithubDefines.RedirectUris.LOGIN;
            return redirectUrl;
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {ButtonViewEvent} event
         */
        hearGithubLoginButtonClickedEvent: function(event) {
            var githubRedirectUri   = this.buildGithubRedirectUri();

            //TODO BRN: Use the Url.parse method here instead

            var githubUrl = new Url({
                protocol: "https",
                host: "github.com",
                path: "/login/oauth/authorize",
                query: {
                    client_id: this.airbugStaticConfig.getGithubClientId(),
                    redirect_uri: githubRedirectUri,
                    scope: this.airbugStaticConfig.getGithubScope(),
                    state: this.airbugStaticConfig.getGithubState()
                }
            });
            this.navigationModule.navigateToUrl(githubUrl);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(GithubLoginButtonContainer).with(
        autowired().properties([
            property("airbugStaticConfig").ref("airbugStaticConfig"),
            property("navigationModule").ref("navigationModule"),
            property("window").ref("window")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.GithubLoginButtonContainer", GithubLoginButtonContainer);
});
