//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('BackButtonContainer')

//@Require('Annotate')
//@Require('AnnotateProperty')
//@Require('ButtonViewEvent')
//@Require('CarapaceContainer')
//@Require('Class')
//@Require('HomeButtonView')
//@Require('IconView')
//@Require('TextView')
//@Require('ViewBuilder')


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var annotate = Annotate.annotate;
var annotation = Annotate.annotation;
var property = AnnotateProperty.property;
var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BackButtonContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule = null;

        /**
         * @private
         * @type {PageStateModule}
         */
        this.pageStateModule = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.buttonView = null;

        /**
         * @private
         * @type {number}
         */
        this.goBackId = null;
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
            view(ButtonView)
                .attributes({type: "primary", align: "left"})
                .children([
                    view(IconView)
                        .attributes({type: IconView.Type.CHEVRON_LEFT, color: IconView.Color.WHITE})
                        .appendTo('*[id|="button"]'),
                    view(TextView)
                        .attributes({text: "Back"})
                        .appendTo('*[id|="button"]')
                ])
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
        this.pageStateModule.putState(BackButtonContainer.STATE_KEY, this.goBackId);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.buttonView.addEventListener(ButtonViewEvent.EventTypes.CLICKED, this.hearButtonClickedEvent, this);

        this.goBackId = this.pageStateModule.getState(BackButtonContainer.STATE_KEY);
        if (!this.goBackId) {
            this.goBackId = this.navigationModule.markPreviousGoBack();
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearButtonClickedEvent: function(event) {
        this.navigationModule.goBack(this.goBackId, {
            trigger: true
        });
    }
});

annotate(BackButtonContainer).with(
    annotation("Autowired").params(
        property("navigationModule").ref("navigationModule"),
        property("pageStateModule").ref("pageStateModule")
    )
);


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

BackButtonContainer.STATE_KEY = "BackButtonContainer:goBackId";