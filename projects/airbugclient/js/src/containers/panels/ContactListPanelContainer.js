//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('ContactListPanelContainer')

//@Require('Class')
//@Require('airbug.ButtonView')
//@Require('airbug.ContactListContainer')
//@Require('airbug.PanelWithHeaderView')
//@Require('airbug.TextView')
//@Require('carapace.CarapaceContainer')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =                 bugpack.require('Class');
var ButtonView =            bugpack.require('airbug.ButtonView');
var ContactListContainer =  bugpack.require('airbug.ContactListContainer');
var PanelWithHeaderView =   bugpack.require('airbug.PanelWithHeaderView');
var TextView =              bugpack.require('airbug.TextView');
var CarapaceContainer =     bugpack.require('carapace.CarapaceContainer');
var ViewBuilder =           bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var view = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var ContactListPanelContainer = Class.extend(CarapaceContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        // Views
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ButtonView}
         */
        this.addContactButtonView = null;

        /**
         * @private
         * @type {PanelView}
         */
        this.panelView = null;


        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {ContactListContainer}
         */
        this.contactListContainer = null;
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

        this.panelView =
            view(PanelWithHeaderView)
                .attributes({headerTitle: "Contacts"})
                .children([
                    view(ButtonView)
                        .attributes({size: ButtonView.Size.SMALL})
                        .id("addContactButtonView")
                        .appendTo('*[id|="panel-header-nav"]')
                        .children([
                            view(TextView)
                                .attributes({text: "+"})
                                .appendTo('*[id|="button"]')
                        ])
                ])
                .build();

        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.setViewTop(this.panelView);
        this.addContactButtonView = this.findViewById("addContactButtonView");
    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.contactListContainer = new ContactListContainer();
        this.addContainerChild(this.contactListContainer, "#panel-body-" + this.panelView.cid);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.ContactListPanelContainer", ContactListPanelContainer);
