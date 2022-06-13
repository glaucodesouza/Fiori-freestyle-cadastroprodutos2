sap.ui.define([
    "./BaseController",
        "sap/ui/model/json/JSONModel",
        "../model/formatter",
        "sap/ui/core/routing/History",
        "sap/m/MessageToast",
        "sap/ui/core/UIComponent"
    ], function (BaseController, JSONModel, formatter, History, MessageToast, UIComponent) {
        "use strict";
        return BaseController.extend("fiorinet.cadastroprodutos3.controller.Update", {
         formatter: formatter,
            // onInit: function(){
            //     console.log("UPDATE: onInit()");
            // },

            onInit: function(){

                // INSTANCIA OBJETOS DE MENSAGEM
                var oMessageManager = sap.ui.getCore().getMessageManager();
                var oView = this.getView();
                oView.setModel(oMessageManager.getMessageModel(), "messagez" )

                var oRouter = this.getOwnerComponent().getRouter();
                //toda vez que o patern dor detailPage, executar a função this._onObjectMatched
                oRouter.getRoute("update").attachPatternMatched(this._onObjectMatched,this);
                
                // // MENSAGENS
                // //Inicializar Controle de mensagens no controller da View atual
                // var oView = this.getView();
                // //registrar a view no message manager
                // sap.ui.getCore().getMessageManager().registerObject(oView,true);              
            },
    
            _onObjectMatched:function(oEvent){
                //arguments recebe as propriedades passadas pelo hsash da URL
                var oArgs = oEvent.getParameter("arguments");
                
                //recebe o parâmetro objectId (que foi declarado no routing do manifest)
                var sPath = parseInt(oArgs.objectId);
                var spath2 = "/Z270CADPRODUTOSSet(" + sPath + ")";
                var oView =  this.getView();
                
                oView.bindElement({
                        path: spath2,
                        expand: 'update'
                });    
            },

            onNavBack: function () {

                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("worklist", {}, true);
                
                // var oHistory = History.getInstance();
                // var sPreviousHash = oHistory.getPreviousHash();
    
                // if (sPreviousHash !== undefined) {
                //     window.history.go(-1);
                // } else {
                //     var oRouter = UIComponent.getRouterFor(this);
                //     oRouter.navTo("worklist", {}, true);
                // }
    
            },

            onGravar:function(){
              
                //Limpar mensagens antigas
                sap.ui.getCore().getMessageManager().removeAllMessages();

                var oModel = this.getView().getModel();
    
                var dados = {
                    Codigo:     parseInt(this.byId("inpCodigo").getText()),
                    Descricao:  this.byId("inpDescricao").getValue(),
                    Kwmeng:     this.byId("inpKwmeng").getValue(),
                    Meins:      this.byId("inpMeins").getValue(),
                    Netpr:      this.byId("inpNetpr").getValue(),
                    Waerk:      this.byId("inpWaerk").getValue()
                };
                debugger;
                //Criação com  método oData
                oModel.update("/Z270CADPRODUTOSSet(" + dados.Codigo + ")", dados, { 
                    success: function(oDados, response){                        
                        debugger;
                        var lv_message = JSON.parse(response.headers["sap-message"]);
                        sap.m.MessageToast.show('Produto ' + dados.Codigo + ' modificado com sucesso !');
                        this.onNavBack();
    
                    }.bind(this),
                    error: function(e){
                        debugger;
                        // console.error(e);
                        sap.m.MessageToast.show('Erro ao Modificar !'); 
                    }.bind(this)
                });
    
            },
        });
    });  
    