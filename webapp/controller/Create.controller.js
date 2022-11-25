sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    History,
    MessageToast,
    UIComponent
  ) {
    "use strict";
    return BaseController.extend(
      "fiorinet.cadastroprodutos3.controller.Create",
      {
        formatter: formatter,

        onInit: function () {
          // INSTANCIA OBJETOS DE MENSAGEM
          // var oMessageManager = sap.ui.getCore().getMessageManager();
          // var oView = this.getView();
          // oView.setModel(oMessageManager.getMessageModel(), "messagez" );

          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("create")
            .attachPatternMatched(this._onCreateMatched, this);

          //MODEL p/ iniciar valors
          var oViewModel = new JSONModel({
            Codigo: 0,
            Descricao: "",
            Kwmeng: "0.000",
            Meins: "KG",
            Netpr: "0.00",
            Waerk: "BRL",
          });
          this.getView().setModel(oViewModel, "view");

          // // MENSAGENS
          // //Inicializar Controle de mensagens no controller da View atual
          // var oView = this.getView();
          // //registrar a view no message manager
          // sap.ui.getCore().getMessageManager().registerObject(oView,true);
        },

        _onCreateMatched: function (oEvent) {
          var m = this.getView().getModel();
          m.metadataLoaded().then(
            function () {
              var oContext = m.createEntry("/Z270CADPRODUTOSSet", {
                properties: {
                  Descricao: "",
                  Kwmeng: "0.00",
                  Meins: "",
                  Netpr: "0.00",
                  Waerk: "",
                },
              });
              this.getView().bindElement({
                path: oContext.getPath(),
                expand: "view",
                //model: "view",
              });
            }.bind(this)
          );
        },

        onNavBack: function () {
          // Teste 2
          //  onNavBack: function (route, data) {
          // var history = sap.ui.core.routing.History.getInstance();
          // var url = this.getURL(route, data);
          // var direction = history.getDirection(url);
          // if ("Backwards" === direction) {
          //     window.history.go(-1);
          // } else {
          //     var replace = true; // otherwise we go backwards with a forward history
          //     this.navTo(route, data, replace);
          // }

          // teste 1
          var oHistory = History.getInstance();
          var sPreviousHash = oHistory.getPreviousHash();

          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("worklist", {}, true);
          }
        },

        parseFloatExternoBrasileiro(string) {},

        onGravar: function () {
          //Limpar mensagens antigas
          sap.ui.getCore().getMessageManager().removeAllMessages();

          var oModel = this.getView().getModel();

          var dados = {
            // Codigo:     this.byId("inpCodigo").getValue(),
            Descricao: this.byId("inpDescricao").getValue(),
            Kwmeng: this.byId("inpKwmeng").getValue(),
            Meins: this.byId("inpMeins").getValue(),
            Netpr: this.byId("inpNetpr").getValue(),
            Waerk: this.byId("inpWaerk").getValue(),
          };

          //FORMA 1 de Criaçãocom  método oData
          oModel.create("/Z270CADPRODUTOSSet", dados, {
            success: function (oDados, response) {
              //var lv_message = JSON.parse(response.headers["sap-message"]);
              //this.getView().setBusy(false);
              var lv_message = JSON.parse(response.headers["sap-message"]);
              sap.m.MessageToast.show(
                "Produto " + oDados.Codigo + " criado com sucesso !"
              );
              //var mensagem = JSON.parse(resposta.headers["sap-message"]);
              // teste 2
              // this.getRouter().navTo("object", {
              //     objectId: dados.Codigo,
              // });

              //teste 1
              this.onNavBack();

              // teste 3
              //this.onNavBack("object", parseInt(dados.Codigo) );
            }.bind(this),
            error: function (Error) {
              var lv_mensagem = JSON.parse(Error.responseText).error.message
                .value;
              MessageToast.show(lv_mensagem + dados.Descricao);
              this.onNavBack();
              // MessageToast.show("Aconteceu um erro.");
              // console.error(oData);
              //this.getView().setBusy(false);
              // this.onNavBack();
            }.bind(this),
          });
        },

        onCancelar: function (oEvent) {
          this.onNavBack();
        },
      }
    );
  }
);
