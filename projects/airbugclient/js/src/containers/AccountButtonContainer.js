//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('AccountButtonContainer')

//@Require('AccountButtonView')
//@Require('CarapaceContainer')
//@Require('Class')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AccountButtonContainer = Class.extend(CarapaceContainer, {

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

        this.buttonView = new ButtonView({type: "primary", align: "right"});
        this.iconView = new IconView({type: IconView.Type.USER, color: IconView.Color.WHITE});


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.buttonView.addViewChild(this.iconView, "#button-" + this.buttonView.cid);
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
        //TODO BRN: Open account drop down.
    }
});
