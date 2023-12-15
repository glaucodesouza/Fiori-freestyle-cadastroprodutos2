sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter"
], function (BaseController, JSONModel, History, formatter) {
    "use strict";

    return BaseController.extend("fiorinet.cadastroprodutos3.controller.Object", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                    busy : true,
                    delay : 0
                });
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");
        },
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched : function (oEvent) {
            var sObjectId =  oEvent.getParameter("arguments").objectId;
            this._bindView("/Z270CADPRODUTOSSet" + sObjectId);
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView : function (sObjectPath) {
            var oViewModel = this.getModel("objectView");

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange : function () {
            var oView = this.getView(),
                oViewModel = this.getModel("objectView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }

            var oResourceBundle = this.getResourceBundle(),
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.Codigo,
                sObjectName = oObject.Z270CADPRODUTOSSet;

                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/shareSendEmailSubject",
                    oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
                oViewModel.setProperty("/shareSendEmailMessage",
                    oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        },

        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
        onNavBack : function() {
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("worklist", {}, true);
            }
        },

        onGravar:function(){
              
            var oModel = this.getView().getModel();

            var dados = {
                Codigo:     parseInt(this.byId("inpCodigo").getValue()),
                Descricao:  this.byId("inpDescricao").getValue(),
                Kwmeng:     this.byId("inpKwmeng").getValue(),
                Meins:      this.byId("inpMeins").getValue(),
                Netpr:      this.byId("inpNetpr").getValue(),
                Waerk:      this.byId("inpWaerk").getValue()
            };

            //Criação com  método oData
            oModel.update("/Z270CADPRODUTOSSet(" + dados.Codigo + ")", dados, null, { 
                success: function(dados, resposta){                        
                    sap.m.MessageToast.show('Produto modificado com sucesso !');
                    // var mensagem = JSON.parse(resposta.headers["sap-message"]);
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("worklist", {}, true);
                    // this.getRouter().navTo("object", {
                    //     objectId: dados.ClienteID
                    // });
                    this.onNavBack();

                }.bind(this),
                error: function(e){
                    // console.error(e);
                    sap.m.MessageToast.show('Erro ao Modificar !');
                }.bind(this)
            });

        },

        onModificar:function(oEvent){
              
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext();
            var sPath = oContext.getPath();
            var obj = oContext.getObject();
            this.getOwnerComponent().getRouter().navTo("update",{
                objectId : parseInt(obj.Codigo)
            });
        },

	onCancelar: function (oEvent) {

		var m = this.getView().getModel();

		if (!m.hasPendingChanges()){
			MessageToast.show("Sem mudanças para cancelar.");
			return;
		}

		m.resetChanges();
	}

    });

});
