//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.RegistrationPageContainer')

//@Require('Class')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.BoxWithHeaderView')
//@Require('airbug.LoginButtonContainer')
//@Require('airbug.PageView')
//@Require('airbug.PanelView')
//@Require('airbug.RegistrationFormContainer')
//@Require('airbug.TextView')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ApplicationContainer            = bugpack.require('airbug.ApplicationContainer');
var BoxWithHeaderView               = bugpack.require('airbug.BoxWithHeaderView');
var LoginButtonContainer            = bugpack.require('airbug.LoginButtonContainer');
var PageView                        = bugpack.require('airbug.PageView');
var PanelView                       = bugpack.require('airbug.PanelView');
var RegistrationFormContainer       = bugpack.require('airbug.RegistrationFormContainer');
var TextView                        = bugpack.require('airbug.TextView');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation             = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                      = AutowiredAnnotation.autowired;
var bugmeta                        = BugMeta.context();
var property                       = PropertyAnnotation.property;
var view                            = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {ApplicationContainer}
 */
var RegistrationPageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DocumentUtil}
         */
        this.documentUtil                           = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {LoginButtonContainer}
         */
        this.loginButtonContainer       = null;

        /**
         * @protected
         * @type {RegistrationFormContainer}
         */
        this.registrationFormContainer  = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BoxWithHeaderView}
         */
        this.boxView                    = null;

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView                   = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array.<*>} routingArgs
     */
    activateContainer: function(routingArgs) {
        this._super(routingArgs);
        this.documentUtil.setTitle("Join - airbug");
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        view(PageView)
            .name("pageView")
            .children([
                view(BoxWithHeaderView)
                    .name("boxView")
                    .attributes({classes: "registration-box"})
                    .appendTo("#page-{{cid}}")
                    .children([
                        view(PanelView)
                            .appendTo('#box-header-{{cid}}')
                            .children([
                                view(TextView)
                                    .attributes({
                                        text: "Join airbug",
                                        classes: "registration-header-text"
                                    })
                                    .appendTo('#panel-body-{{cid}}')
                            ])
                    ])
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
        this.loginButtonContainer       = new LoginButtonContainer();
        this.registrationFormContainer  = new RegistrationFormContainer();
        this.addContainerChild(this.loginButtonContainer, "#header-right");
        this.addContainerChild(this.registrationFormContainer, "#box-body-" + this.boxView.getCid());
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RegistrationPageContainer).with(
    autowired().properties([
        property("documentUtil").ref("documentUtil")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.RegistrationPageContainer", RegistrationPageContainer);
