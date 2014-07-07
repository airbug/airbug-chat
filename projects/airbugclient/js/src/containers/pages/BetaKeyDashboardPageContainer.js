//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('airbug.BetaKeyDashboardPageContainer')

//@Require('Class')
//@Require('airbug.AccountDropdownButtonContainer')
//@Require('airbug.ApplicationContainer')
//@Require('airbug.BetaKeyModel')
//@Require('carapace.ButtonViewEvent')
//@Require('carapace.ButtonView')
//@Require('carapace.FormControlGroupView')
//@Require('carapace.FormView')
//@Require('carapace.FormViewEvent')
//@Require('airbug.HomeButtonContainer')
//@Require('carapace.PageView')
//@Require('carapace.PanelWithHeaderView')
//@Require('carapace.InputView')
//@Require('carapace.NakedSubmitButtonView')
//@Require('carapace.TableDataView')
//@Require('carapace.TableHeadingView')
//@Require('carapace.TableRowView')
//@Require('carapace.TableView')
//@Require('bugmeta.BugMeta')
//@Require('bugioc.AutowiredTag')
//@Require('bugioc.PropertyTag')
//@Require('carapace.ViewBuilder')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var AccountDropdownButtonContainer      = bugpack.require('airbug.AccountDropdownButtonContainer');
    var ApplicationContainer                = bugpack.require('airbug.ApplicationContainer');
    var BetaKeyModel                        = bugpack.require('airbug.BetaKeyModel');
    var ButtonViewEvent                     = bugpack.require('carapace.ButtonViewEvent');
    var ButtonView                          = bugpack.require('carapace.ButtonView');
    var FormView                            = bugpack.require('carapace.FormView');
    var FormViewEvent                       = bugpack.require('carapace.FormViewEvent');
    var HomeButtonContainer                 = bugpack.require('airbug.HomeButtonContainer');
    var InputView                           = bugpack.require('carapace.InputView');
    var PageView                            = bugpack.require('carapace.PageView');
    var PanelWithHeaderView                 = bugpack.require('carapace.PanelWithHeaderView');
    var NakedSubmitButtonView               = bugpack.require('carapace.NakedSubmitButtonView');
    var TableDataView                       = bugpack.require('carapace.TableDataView');
    var TableHeadingView                    = bugpack.require('carapace.TableHeadingView');
    var TableRowView                        = bugpack.require('carapace.TableRowView');
    var TableView                           = bugpack.require('carapace.TableView');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var AutowiredTag                 = bugpack.require('bugioc.AutowiredTag');
    var PropertyTag                  = bugpack.require('bugioc.PropertyTag');
    var ViewBuilder                         = bugpack.require('carapace.ViewBuilder');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var autowired                           = AutowiredTag.autowired;
    var bugmeta                             = BugMeta.context();
    var property                            = PropertyTag.property;
    var view                                = ViewBuilder.view;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {ApplicationContainer}
     */
    var BetaKeyDashboardPageContainer = Class.extend(ApplicationContainer, {

        _name: "airbug.BetaKeyDashboardPageContainer",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
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

        /**
         * @protected
         */
        deinitializeContainer: function() {
    //        this.formView.removeEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmitEvent, this);
            this.submitButtonView.removeEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSubmitButtonClickedEvent, this);
        },

        /**
         * @protected
         */
        initializeContainer: function() {
            console.log("formView:", this.formView);
    //        this.formView.addEventListener(FormViewEvent.EventType.SUBMIT, this.handleFormSubmitEvent, this);
            this.submitButtonView.addEventListener(ButtonViewEvent.EventType.CLICKED, this.handleSubmitButtonClickedEvent, this);
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

    bugmeta.tag(BetaKeyDashboardPageContainer).with(
        autowired().properties([
            property("betaKeyManagerModule").ref("betaKeyManagerModule"),
            property("documentUtil").ref("documentUtil")
        ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("airbug.BetaKeyDashboardPageContainer", BetaKeyDashboardPageContainer);
});
