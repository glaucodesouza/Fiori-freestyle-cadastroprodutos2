sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (UI5Object, MessageBox, Filter, FilterOperator) {
    "use strict";

    return UI5Object.extend("fiorinet.cadastroprodutos3.controller.ErrorHandler", {

        /**
         * Handles application errors by automatically attaching to the model events and displaying errors when needed.
         * @class
         * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
         * @public
         * @alias fiorinet.cadastroprodutos3.controller.ErrorHandler
         */
         constructor : function (oComponent) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");

			this._oModel.attachMetadataFailed(function (oEvent) {
				var oParams = oEvent.getParameters();
				this._showServiceError(oParams.response);
			}, this);

			this._oModel.attachRequestFailed(function (oEvent) {
				var oParams = oEvent.getParameters();

				///CODIGO PARA ADICIONAR MENSAGENS DO BACKEND NO MESSAGEMODEL
				var oMessageManager = sap.ui.getCore().getMessageManager();
                    try {

                        let messages = JSON.parse(oParams.response.responseText);
                        let mainMessage = messages.error.message;
                        let detailMessages = messages.error.innererror.errordetails;

                        //Se mensagem atual tem detalhes da SE91, então, ler os detalhes da mensagem
                        if (detailMessages.length == 0)
                            oMessageManager.addMessages(
                                new sap.ui.core.message.Message({
                                    message: mainMessage.value,
                                    type: sap.ui.core.MessageType.Error,
                                    code: messages.error.code,
                                    processor: this._oModel,
                                })
                            )

                        //SE A MENSAGEM ATUAL NÃO TEM DETALHES da SE91, então, sem detalhes.
                        else
                            detailMessages.forEach( message =>
                                oMessageManager.addMessages(
                                    new sap.ui.core.message.Message({
                                        code: message.code,
                                        message: message.message,
                                        type: this.getTypeFromSeverity(message.severity),
                                        target: `${message.propertyref}${message.target}`,
                                        processor: this._oModel,
                                    })
                                )
                            );

                    } catch (e) {
                        console.error(e);
                    }
                    return;




				// An entity that was not found in the service is also throwing a 404 error in oData.
				// We already cover this case with a notFound target so we skip it here.
				// A request that cannot be sent to the server is a technical error that we have to handle though
				if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf("Cannot POST") === 0)) {
					this._showServiceError(oParams.response);
				}
			}, this);
		},

		getTypeFromSeverity: function(sSeverity) {
			switch(sSeverity){
				case "error":
					return sap.ui.core.MessageType.Error;
					break;
				case "info":
					return sap.ui.core.MessageType.Information;
					break;
				case "warning":
					return sap.ui.core.MessageType.Warning;
					break;
			}
			return sap.ui.core.MessageType.Error;
		},

        /**
         * Shows a {@link sap.m.MessageBox} when a service call has failed.
         * Only the first error message will be displayed.
         * @param {string} sErrorTitle A title for the error message
         * @param {string} sDetails A technical error to be displayed on request
         * @private
         */
         _showServiceError : function (sDetails) {
			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;
			MessageBox.error(
				this._sErrorText,
				{
					id : "serviceErrorMessageBox",
					details: sDetails,
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.CLOSE],
					onClose: function () {
						this._bMessageOpen = false;
					}.bind(this)
				}
			);
		}
    });
});