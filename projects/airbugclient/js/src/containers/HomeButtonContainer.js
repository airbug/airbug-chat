//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('HomeButtonContainer')

//@Require('ButtonViewEvent')
//@Require('CarapaceContainer')
//@Require('Class')
//@Require('HomeButtonView')
//@Require('NavigationMessage')


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
         * @type {HomeButtonView}
         */
        this.homeButtonView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this.homeButtonView = new HomeButtonView();
        this.setViewTop(this.homeButtonView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this.homeButtonView.addEventListener(ButtonViewEvent.EventTypes.CLICKED, this.hearHomeButtonClickedEvent, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {ButtonViewEvent} event
     */
    hearHomeButtonClickedEvent: function(event) {
        this.apiPublisher.publish(NavigationMessage.MessageTopics.NAVIGATE, {
            fragment: "",
            options: {
                trigger: true
            }
        });
    }
});
