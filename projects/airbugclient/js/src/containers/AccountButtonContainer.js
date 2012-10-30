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
         * @type {AccountButtonView}
         */
        this.accountButtonView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this.accountButtonView = new AccountButtonView();
        this.setViewTop(this.accountButtonView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this.accountButtonView.addEventListener(ButtonViewEvent.EventTypes.CLICKED, this.hearAccountButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} Event
     */
    hearAccountButtonClickedEvent: function(event) {
        //TODO BRN: Open account drop down.
    }
});
