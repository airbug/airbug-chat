//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('HomeButtonContainer')

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

var HomeButtonContainer = Class.extend(CarapaceContainer, {

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


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.buttonView = null;
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
                        .attributes({text: "Home"})
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
    initializeContainer: function() {
        this._super();
        this.buttonView.addEventListener(ButtonViewEvent.EventTypes.CLICKED, this.hearButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearButtonClickedEvent: function(event) {
        this.navigationModule.navigate("", {
            trigger: true
        });
    }
});
annotate(HomeButtonContainer).with(
    annotation("Autowired").params(
        property("navigationModule").ref("navigationModule")
    )
);