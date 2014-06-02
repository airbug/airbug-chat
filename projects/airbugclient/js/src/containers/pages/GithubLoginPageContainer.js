//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.GithubLoginPageContainer')

//@Require('Class')
//@Require('airbug.AlternateLoginPanelContainer')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.BoxWithFooterView')
//@Require('airbug.GithubLoginFormContainer')
//@Require('airbug.PageView')
//@Require('airbug.SignupButtonContainer')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var AlternateLoginPanelContainer    = bugpack.require('airbug.AlternateLoginPanelContainer');
    var ApplicationContainer            = bugpack.require('airbug.ApplicationContainer');
    var BoxWithFooterView               = bugpack.require('airbug.BoxWithFooterView');
    var GithubLoginFormContainer        = bugpack.require('airbug.GithubLoginFormContainer');
    var PageView                        = bugpack.require('airbug.PageView');
    var SignupButtonContainer           = bugpack.require('airbug.SignupButtonContainer');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var AutowiredTag             = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag              = bugpack.require('bugioc.PropertyTag');
    var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                         = BugMeta.context();
    var autowired                       = AutowiredTag.autowired;
    var property                        = PropertyTag.property;
    var view                            = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationContainer}
     */
    var GithubLoginPageContainer = Class.extend(ApplicationContainer, {

        _name: "airbug.GithubLoginPageContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            // Modules
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {NavigationModule}
             */
            this.navigationModule               = null;


            // Views
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BoxWithFooterView}
             */
            this.boxView                        = null;

            /**
             * @protected
             * @type {PageView}
             */
            this.pageView                       = null;


            // Containers
            //-------------------------------------------------------------------------------

            /**
             * @protected
             * @type {GithubLoginFormContainer}
             */
            this.githubLoginFormContainer             = null;

            /**
             * @protected
             * @type {SignupButtonContainer}
             */
            this.signupButtonContainer          = null;
        },


        //-------------------------------------------------------------------------------
        // CarapaceController Extensions
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        createContainer: function(routingArgs) {
            this._super();

            // Create Views
            //-------------------------------------------------------------------------------

            view(PageView)
                .name("pageView")
                .children([
                    view(BoxWithFooterView)
                        .name("boxView")
                        .attributes({classes: "login-box"})
                        .appendTo("#page-{{cid}}")
                ])
                .build(this);



            // Wire Up Views
            //-------------------------------------------------------------------------------

            this.getApplicationView().addViewChild(this.pageView, "#application-{{cid}}");
        },

        /**
         * @protected
         */
        createContainerChildren: function() {
            this._super();

            this.githubLoginFormContainer       = new GithubLoginFormContainer();
            this.signupButtonContainer          = new SignupButtonContainer();
            this.addContainerChild(this.signupButtonContainer, "#header-right");
            this.addContainerChild(this.githubLoginFormContainer, "#box-body-" + this.boxView.getCid());
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(GithubLoginPageContainer).with(
        autowired().properties([
            property("navigationModule").ref("navigationModule")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.GithubLoginPageContainer", GithubLoginPageContainer);
});
