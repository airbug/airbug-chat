//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('HomeButtonContainer')

//@Require('ButtonViewEvent')
//@Require('CarapaceContainer')
//@Require('Class')
//@Require('HomeButtonView')
//@Require('IconView')
//@Require('NavigationMessage')
//@Require('TextView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HomeButtonContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher) {

        this._super(apiPublisher);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.buttonView = null;

        /**
         * @private
         * @type {IconView}
         */
        this.iconView = null;

        /**
         * @private
         * @type {TextView}
         */
        this.textView = null;
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

        this.buttonView = new ButtonView({type: "primary", align: "left"});
        this.iconView = new IconView({type: IconView.Type.CHEVRON_LEFT, color: IconView.Color.WHITE});
        this.textView = new TextView({text: "Home"});


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.buttonView.addViewChild(this.iconView, "#button-" + this.buttonView.cid);
        this.buttonView.addViewChild(this.textView, "#button-" + this.buttonView.cid);
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
        this.apiPublisher.publish(NavigationMessage.MessageTopics.NAVIGATE, {
            fragment: "",
            options: {
                trigger: true
            }
        });
    }
});
