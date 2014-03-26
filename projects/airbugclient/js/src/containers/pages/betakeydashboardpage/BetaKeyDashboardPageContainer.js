//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbug')

//@Export('BetaKeyDashboardPageContainer')

//@Require('Class')
//@Require('airbug.AccountDropdownButtonContainer')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.BetaKeyModel')
//@Require('airbug.ButtonViewEvent')
//@Require('airbug.ButtonView')
//@Require('airbug.FormControlGroupView')
//@Require('airbug.FormView')
//@Require('airbug.FormViewEvent')
//@Require('airbug.HomeButtonContainer')
//@Require('airbug.PageView')
//@Require('airbug.PanelWithHeaderView')
//@Require('airbug.InputView')
//@Require('airbug.NakedSubmitButtonView')
//@Require('airbug.TableDataView')
//@Require('airbug.TableHeadingView')
//@Require('airbug.TableRowView')
//@Require('airbug.TableView')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var AccountDropdownButtonContainer      = bugpack.require('airbug.AccountDropdownButtonContainer');
var ApplicationContainer                = bugpack.require('airbug.ApplicationContainer');
var BetaKeyModel                        = bugpack.require('airbug.BetaKeyModel');
var ButtonViewEvent                     = bugpack.require('airbug.ButtonViewEvent');
var ButtonView                          = bugpack.require('airbug.ButtonView');
var FormView                            = bugpack.require('airbug.FormView');
var FormViewEvent                       = bugpack.require('airbug.FormViewEvent');
var HomeButtonContainer                 = bugpack.require('airbug.HomeButtonContainer');
var InputView                           = bugpack.require('airbug.InputView');
var PageView                            = bugpack.require('airbug.PageView');
var PanelWithHeaderView                 = bugpack.require('airbug.PanelWithHeaderView');
var NakedSubmitButtonView               = bugpack.require('airbug.NakedSubmitButtonView');
var TableDataView                       = bugpack.require('airbug.TableDataView');
var TableHeadingView                    = bugpack.require('airbug.TableHeadingView');
var TableRowView                        = bugpack.require('airbug.TableRowView');
var TableView                           = bugpack.require('airbug.TableView');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var AutowiredAnnotation                 = bugpack.require('bugioc.AutowiredAnnotation');
var PropertyAnnotation                  = bugpack.require('bugioc.PropertyAnnotation');
var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var autowired                           = AutowiredAnnotation.autowired;
var bugmeta                             = BugMeta.context();
var property                            = PropertyAnnotation.property;
var view                                = ViewBuilder.view;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BetaKeyDashboardPageContainer = Class.extend(ApplicationContainer, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------



        // Containers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {AccountDropdownButtonContainer}
         */
        this.accountDropdownButtonContainer = null;

        /**
         * @private
         * @type {HomeButtonContainer}
         */
        this.homeButtonContainer            = null;


        // Views
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @type {FormView}
         */
        this.formView                       = null;

        /**
         * @protected
         * @type {PageView}
         */
        this.pageView                       = null;

        /**
         * @protected
         * @type {NakedSubmitButtonView}
         */
        this.submitButtonView               = null;

        /**
         * @protected
         * @type {TableView}
         */
        this.tableView                      = null;


        // Modules
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BetaKeyManagerModule}
         */
        this.betaKeyManagerModule            = null;

        /**
         * @private
         * @type {DocumentUtil}
         */
        this.documentUtil                   = null;
    },


    //-------------------------------------------------------------------------------
    // CarapaceContainer Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Array.<*>} routingArgs
     */
    activateContainer: function(routingArgs) {
        this._super(routingArgs);
        this.documentUtil.setTitle("Beta Key Dashboard - airbug");
    },

    /**
     * @protected
     */
    createContainer: function() {
        this._super();

        // Create Views
        //-------------------------------------------------------------------------------

        view(PageView)
            .name("pageView")
            .children([
                view(PanelWithHeaderView)
                    .attributes({headerTitle: "Beta Key Dashboard"})
                    .children([
                        view(FormView)
                            .name("formView")
                            .id("beta-key-form")
                            .attributes({
                                classes: "form-inline"
                            })
                            .appendTo("#panel-body-{{cid}}")
                            .children([
                                view(InputView)
                                    .id("beta-key-input-field")
                                    .attributes({
                                        placeholder: "Beta Key",
                                        name: "betaKey",
                                        type: "text"
                                    })
                                    .appendTo("#beta-key-form"),
                                view(NakedSubmitButtonView)
                                    .name("submitButtonView")
                                    .attributes({
                                        size: ButtonView.Size.NORMAL,
                                        type: ButtonView.Type.PRIMARY,
                                        buttonName: "Search"
                                    })
                                    .appendTo("#beta-key-form")
                            ]),
                        view(TableView)
                            .name("tableView")
                            .appendTo("#panel-body-{{cid}}")
                            .children([
                                view(TableRowView)
                                    .children([
                                        view(TableHeadingView)
                                            .attributes({text: "Beta Key"}),
                                        view(TableHeadingView)
                                            .attributes({text: "Count"})
                                    ])
                            ])
                    ])
            ])
            .build(this);


        // Wire Up Views
        //-------------------------------------------------------------------------------

        this.getApplicationView().addViewChild(this.pageView, "#application-{{cid}}");

    },

    /**
     * @protected
     */
    createContainerChildren: function() {
        this._super();
        this.homeButtonContainer                = new HomeButtonContainer();
        this.accountDropdownButtonContainer     = new AccountDropdownButtonContainer();
        this.addContainerChild(this.homeButtonContainer,   "#header-left");
        this.addContainerChild(this.accountDropdownButtonContainer, '#header-right');
    },

    initializeContainer: function() {
        console.log("formView:", this.formView);
//        this.formView.addEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmitEvent, this);
        this.submitButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSubmitButtonClickedEvent, this);
    },

    deinitializeContainer: function() {
//        this.formView.removeEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmitEvent, this);
        this.submitButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSubmitButtonClickedEvent, this);
    },

    handleSubmitButtonClickedEvent: function() {
        console.log("handleSubmitButtonClickedEvent");
        var formData = this.formView.getFormData();
        var betaKey = formData.betaKey;
        console.log("formData:", formData);
        console.log("betaKey:", betaKey);
        this.loadBetaKeysByBetaKey(betaKey);
    },

    handleFormSubmitEvent: function(event) {
        var formData = event.getData().formData;
        var betaKey = formData.betaKey;
        console.log("formData:", formData);
        console.log("betaKey:", betaKey);
        this.loadBetaKeysByBetaKey(betaKey);
    },

    loadBetaKeysByBetaKey: function(betaKey) {
        var _this = this;
        this.betaKeyManagerModule.retrieveBetaKeyByBetaKey(betaKey, function(throwable, meldDocument){
            if(!throwable) {
                if(meldDocument) {
                    _this.clearTable();
                    if(Class.doesExtend(meldDocument, List)){
                        meldDocument.forEach(function(meldDocument){
                            _this.addBetaKeyToTable(meldDocument);
                        });
                    } else if (meldDocument){
                        _this.addBetaKeyToTable(meldDocument);
                    }
                } else {
                    console.log("There are no beta keys by the name", betaKey);
                }
            } else {
                console.log("failed to load beta key counter for", betaKey, "throwable:", throwable);
            }
        });
    },

    addBetaKeyToTable: function(meldDocument) {
        console.log("addBetaKeyToTable");
        var betaKeyModel = new BetaKeyModel({}, meldDocument);
        var tableRowView = view(TableRowView)
            .children([
                view(TableDataView)
                    .attributes({text: betaKeyModel.getProperty("betaKey")}),
                view(TableDataView)
                    .attributes({text: betaKeyModel.getProperty("count")})
            ])
            .build();

        this.getViewTop().addViewChild(tableRowView, "#table-" + this.tableView.getCid());
    },

    clearTable: function() {
        this.tableView.$el.find("tr").each(function(index, row){
            if(index !== 0) {
                row.remove();
            }
        });
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(BetaKeyDashboardPageContainer).with(
    autowired().properties([
        property("betaKeyManagerModule").ref("betaKeyManagerModule"),
        property("documentUtil").ref("documentUtil")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("airbug.BetaKeyDashboardPageContainer", BetaKeyDashboardPageContainer);
