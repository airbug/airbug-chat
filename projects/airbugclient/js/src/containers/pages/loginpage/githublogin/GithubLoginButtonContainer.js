//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('GithubLoginButtonContainer')

//@Require('Class')
//@Require('Url')
//@Require('airbug.ButtonContainer')
//@Require('airbug.GithubDefines')
//@Require('airbug.GithubLoginButtonView')
//@Require('airbug.ButtonViewEvent')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Url                     = bugpack.require('Url');
var ButtonContainer         = bugpack.require('airbug.ButtonContainer');
var GithubDefines           = bugpack.require('airbug.GithubDefines');
var GithubLoginButtonView   = bugpack.require('airbug.GithubLoginButtonView');
var ButtonViewEvent         = bugpack.require('airbug.ButtonViewEvent');
var AutowiredAnnotation     = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var ViewBuilder             = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired               = AutowiredAnnotation.autowired;
var bugmeta                 = BugMeta.context();
var property                = PropertyAnnotation.property;
var view                    = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {ButtonContainer}
 */
var GithubLoginButtonContainer = Class.extend(ButtonContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super("GithubLoginButton");


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AirbugClientConfig}
         */
        this.airbugClientConfig = null;

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
    // CarapaceContainer Extensions
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
    initializeContainer: function() {
        this._super();
        this.buttonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearGithubLoginButtonClickedEvent, this);
    },

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
            path: "login/oauth/authorize"
        })
            .addUrlQuery("client_id", this.airbugClientConfig.getGithubClientId())
            .addUrlQuery("redirect_uri", githubRedirectUri)
            .addUrlQuery("scope", this.airbugClientConfig.getGithubScope())
            .addUrlQuery("state", this.airbugClientConfig.getGithubState());
        this.navigationModule.navigateToUrl(githubUrl);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(GithubLoginButtonContainer).with(
    autowired().properties([
        property("airbugClientConfig").ref("airbugClientConfig"),
        property("navigationModule").ref("navigationModule"),
        property("window").ref("window")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.GithubLoginButtonContainer", GithubLoginButtonContainer);
