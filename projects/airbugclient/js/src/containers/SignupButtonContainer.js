//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SignupButtonContainer')

//@Require('ButtonView')
//@Require('ButtonViewEvent')
//@Require('CarapaceContainer')
//@Require('Class')
//@Require('NavigationMessage')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SignupButtonContainer = Class.extend(CarapaceContainer, {

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
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Extensions
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();
        this.buttonView = new ButtonView({text: "Signup", type: "primary", align: "right"});
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
            fragment: "signup",
            options: {
                trigger: true
            }
        });
    }
});
