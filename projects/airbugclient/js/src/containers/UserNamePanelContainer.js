//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('UserNamePanelContainer')

//@Require('CarapaceContainer')
//@Require('Class')
//@Require('PanelView')
//@Require('UserNameView')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var UserNamePanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(apiPublisher, userModel) {

        this._super(apiPublisher);


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {UserModel}
         */
        this.userModel = userModel;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView = null;

        /**
         * @private
         * @type {UserNameView}
         */
        this.userNameView = null;

        /**
         * @private
         * @type {UserStatusIndicatorView}
         */
        this.userStatusIndicatorView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Views
        //-------------------------------------------------------------------------------

        this.panelView = new PanelView({});
        this.userNameView = new UserNameView({
            model: this.userModel
        });
        this.userStatusIndicatorView = new UserStatusIndicatorView({
            model: this.userModel
        });

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.panelView.addViewChild(this.userStatusIndicatorView, "#panel-body-" + this.panelView.cid);
        this.panelView.addViewChild(this.userNameView, "#panel-body-" + this.panelView.cid);
        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    destroyContainer: function() {
        this._super();
        this.userModel = null;
    }
});
