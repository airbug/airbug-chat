//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('WorkspaceTrayContainer')

//@Require('Class')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.ListView')
//@Require('airbug.ListViewEvent')
//@Require('airbug.PanelWithHeaderView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var ButtonViewEvent                 = bugpack.require('airbug.ButtonViewEvent');
var CodeEditorTrayButtonContainer   = bugpack.require('airbug.CodeEditorTrayButtonContainer');
var ListItemView                    = bugpack.require('airbug.ListItemView');
var ListView                        = bugpack.require('airbug.ListView');
var PanelWithHeaderView             = bugpack.require('airbug.PanelWithHeaderView');
var CarapaceContainer               = bugpack.require('carapace.CarapaceContainer');
var ViewBuilder                     = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view        = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var WorkspaceTrayContainer = Class.extend(CarapaceContainer, {

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


        // Modules
        //-------------------------------------------------------------------------------


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {airbug.ListView}
         */
        this.listView                   = null;

        /**
         * @private
         * @type {airbug.ListItemView}
         */
        this.listItemViewOne            = null;

        /**
         * @private
         * @type {airbug.PanelWithHeaderView}
         */
        this.panelView                  = null;
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
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();


        // Create Models
        //-------------------------------------------------------------------------------


        // Create Views
        //-------------------------------------------------------------------------------

        this.panelView =
            view(PanelWithHeaderView)
                .attributes({headerTitle: "Workspace Tray"})
                .children([
                    view(ListView)
                        .id("listView")
                        .appendTo('*[id|="panel-body"]')
                        .children([
                            view(ListItemView)
                                .id("list-item-code-editor")
                            // ,view(ListItemView)
                            //     .id("")
                        ])
                ])
                .build();


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
        this.listView           = this.findViewById("listView");
        this.listItemViewOne    = this.findViewById("list-item-code-editor");
    },

    /**
     *
     */
    createContainerChildren: function() {
        this.super();
        this.codeEditorTrayButtonContainer = new CodeEditorTrayButtonContainer();
        this.addContainerChild(this.codeEditorTrayButtonContainer, "#list-item-" + this.listItemViewOne.cid);
    },

    /**
     * @protected
     */
    initializeContainer: function() {
        this._super();
        this.codeEditorTrayButtonContainer.getViewTop().addEventListener(ButtonViewEvent.EventType.CLICKED, this.hearTrayButtonClickedEvent , this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {airbug.ButtonViewEvent} event
     * NOTE: event.data @type {{buttonName: string}}
     */
    hearTrayButtonClickedEvent: function(event){
        this.panelView.dispatchEvent(event);
        var parentContainer = this.getContainerParent(); //workspaceWidget
        var grandparentContainer = parentContainer.getContainerParent();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.WorkspaceTrayContainer", WorkspaceTrayContainer);
