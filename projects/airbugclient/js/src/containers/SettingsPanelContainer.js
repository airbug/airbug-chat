//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('SettingsPanelContainer')

//@Require('Annotate')
//@Require('AnnotateProperty')
//@Require('CarapaceContainer')
//@Require('Class')
//@Require('ListView')
//@Require('ListViewEvent')
//@Require('PanelWithHeaderView')
//@Require('RoomCollection')
//@Require('RoomModel')
//@Require('RoomNameView')
//@Require('SelectableListItemView')
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

var SettingsPanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Models
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {UserModel}
         */
        this.currentUserModel = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {NavigationModule}
         */
        this.navigationModule = null;

        /**
         * @private
         * @type {SessionModule}
         */
        this.sessionModule = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceController Implementation
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array<*>} routerArgs
     */
    activateContainer: function(routerArgs) {
        this._super(routerArgs);
        //TODO BRN:

    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------

        this.currentUserModel = this.sessionModule.getCurrentUserModel();


        // Create Views
        //-------------------------------------------------------------------------------

        this.panelView =
            view(PanelWithHeaderView)
                .attributes({headerTitle: "Settings"})
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
    }


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------




    //-------------------------------------------------------------------------------
    // Model Event Handlers
    //-------------------------------------------------------------------------------


});

annotate(SettingsPanelContainer).with(
    annotation("Autowired").params(
        property("navigationModule").ref("navigationModule"),
        property("sessionModule").ref("sessionModule")
    )
);
